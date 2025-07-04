import neo4j from 'neo4j-driver';
import { config } from 'dotenv';
import { topicsData } from '../src/scripts/topicsData';

config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

async function seedAllTopicsRobust() {
  const session = driver.session();
  
  try {
    console.log('🚀 Seeding all topics and subtopics robustly...');
    
    let topicsAdded = 0;
    let subtopicsAdded = 0;
    
    for (const topicData of topicsData) {
      console.log(`\n📝 Processing topic: ${topicData.name}`);
      
      const topicId = topicData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // MERGE topic
      await session.run(`
        MERGE (t:Topic {id: $topicId})
        ON CREATE SET 
          t.name = $name,
          t.description = $description,
          t.difficultyScore = 0.5,
          t.isCore = true,
          t.estimatedTimeMins = 120,
          t.weight = 0.85,
          t.priority = $priority,
          t.tags = ['basic'],
          t.category = 'Data Structures'
      `, {
        topicId,
        name: topicData.name,
        description: topicData.description,
        priority: topicsAdded + 1
      });
      
      topicsAdded++;
      
      // Process subtopics
      for (let i = 0; i < topicData.subtopics.length; i++) {
        const subtopic = topicData.subtopics[i];
        const subtopicId = `sub_${topicId}_${i}`;
        
        await session.run(`
          MERGE (st:Subtopic {id: $subtopicId})
          ON CREATE SET 
            st.name = $name,
            st.description = $description,
            st.difficultyScore = $difficultyScore,
            st.estimatedTimeMins = $estimatedTimeMins,
            st.priority = $priority
        `, {
          subtopicId,
          name: subtopic,
          description: `Learn about ${subtopic}`,
          difficultyScore: 0.4 + (i * 0.1),
          estimatedTimeMins: 30 + (i * 10),
          priority: i + 1
        });
        
        await session.run(`
          MATCH (t:Topic {id: $topicId})
          MATCH (st:Subtopic {id: $subtopicId})
          MERGE (t)-[:HAS_SUBTOPIC]->(st)
        `, { topicId, subtopicId });
        
        subtopicsAdded++;
      }
      
      console.log(`✅ Added ${topicData.subtopics.length} subtopics`);
    }
    
    const allTopics = await session.run(`
      MATCH (t:Topic)
      RETURN t.name as name, t.priority as priority
      ORDER BY t.priority, t.name
    `);
    
    console.log('\n📋 All Topics:');
    allTopics.records.forEach(record => {
      console.log(`  ${record.get('priority')}. ${record.get('name')}`);
    });
    
    console.log(`\n✅ Total: ${topicsAdded} topics, ${subtopicsAdded} subtopics`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

seedAllTopicsRobust(); 