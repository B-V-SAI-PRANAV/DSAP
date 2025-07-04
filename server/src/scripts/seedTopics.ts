import neo4j from 'neo4j-driver';
import { config } from 'dotenv';
import { topicsData } from './topicsData';

config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j'
  )
);

const seedTopics = async () => {
  const session = driver.session();

  try {
    // Clear existing data (for development only)
    await session.run('MATCH (n) DETACH DELETE n');

    // Create topics and their relationships
    for (const topic of topicsData) {
      await session.run(`
        MERGE (t:Topic {id: $topicId, name: $topicName, description: $topicDesc})
        WITH t
        UNWIND $subtopics AS subtopic
        MERGE (s:Subtopic {id: subtopic.id, name: subtopic.name, description: subtopic.description})
        MERGE (t)-[:HAS_SUBTOPIC]->(s)
      `, {
        topicId: `topic_${topic.name.toLowerCase().replace(/\s+/g, '_')}`,
        topicName: topic.name,
        topicDesc: topic.description || '',
        subtopics: topic.subtopics.map((sub, i) => ({
          id: `sub_${topic.name.toLowerCase().replace(/\s+/g, '_')}_${i}`,
          name: sub,
          description: ''
        }))
      });
    }

    // Add dependencies between topics
    await session.run(`
      MATCH (t1:Topic {name: 'Arrays'}), (t2:Topic {name: 'Hashing'})
      MERGE (t1)-[:PRECEDES]->(t2)
      
      MATCH (t1:Topic {name: 'Arrays'}), (t2:Topic {name: 'Linked Lists'})
      MERGE (t1)-[:PRECEDES]->(t2)
      
      MATCH (t1:Topic {name: 'Trees'}), (t2:Topic {name: 'Graphs'})
      MERGE (t1)-[:PRECEDES]->(t2)
    `);

    console.log('Database seeded successfully with DSA topics');
  } catch (error) {
    console.error('Error seeding topics:', error);
  } finally {
    await session.close();
    await driver.close();
  }
};

seedTopics();
