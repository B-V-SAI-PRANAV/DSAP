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

async function addMissingTopics() {
  const session = driver.session();
  
  try {
    console.log('🚀 Adding missing topics to database...');
    
    // Get existing topics
    const existingTopics = await session.run(`
      MATCH (t:Topic)
      RETURN t.name as name
    `);
    
    const existingTopicNames = existingTopics.records.map(record => record.get('name'));
    
    // Define topic priorities (matching the order in topicsData)
    const topicPriorities = {
      'Arrays': 1,
      'Linked Lists': 2,
      'Stacks': 3,
      'Queues': 4,
      'Trees': 5,
      'Heaps': 6,
      'Graphs': 7,
      'Hashing': 8,
      'Dynamic Programming': 9,
      'Greedy Algorithms': 10,
      'String Algorithms': 11,
      'Divide and Conquer': 12,
      'Backtracking': 13,
      'Advanced Data Structures': 14
    };
    
    let addedCount = 0;
    
    for (const topicData of topicsData) {
      if (!existingTopicNames.includes(topicData.name)) {
        console.log(`📝 Adding topic: ${topicData.name}`);
        
        // Create topic
        const topicId = topicData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        
        await session.run(`
          CREATE (t:Topic {
            id: $topicId,
            name: $name,
            description: $description,
            difficultyScore: $difficultyScore,
            isCore: true,
            estimatedTimeMins: $estimatedTimeMins,
            weight: 0.85,
            priority: $priority,
            tags: $tags,
            category: $category
          })
        `, {
          topicId,
          name: topicData.name,
          description: topicData.description,
          difficultyScore: 0.5, // Default difficulty
          estimatedTimeMins: 120, // Default time
          priority: (topicPriorities as any)[topicData.name] || 99,
          tags: ['basic'],
          category: 'Data Structures'
        });
        
        // Create subtopics
        for (let i = 0; i < topicData.subtopics.length; i++) {
          const subtopic = topicData.subtopics[i];
          const subtopicId = `sub_${topicId}_${i}`;
          
          await session.run(`
            CREATE (st:Subtopic {
              id: $subtopicId,
              name: $name,
              description: $description,
              difficultyScore: $difficultyScore,
              estimatedTimeMins: $estimatedTimeMins,
              priority: $priority
            })
          `, {
            subtopicId,
            name: subtopic,
            description: `Learn about ${subtopic}`,
            difficultyScore: 0.4 + (i * 0.1), // Progressive difficulty
            estimatedTimeMins: 30 + (i * 10), // Progressive time
            priority: i + 1
          });
          
          // Link subtopic to topic
          await session.run(`
            MATCH (t:Topic {id: $topicId})
            MATCH (st:Subtopic {id: $subtopicId})
            CREATE (t)-[:HAS_SUBTOPIC]->(st)
          `, { topicId, subtopicId });
        }
        
        addedCount++;
        console.log(`✅ Added ${topicData.name} with ${topicData.subtopics.length} subtopics`);
      } else {
        console.log(`⚠️ Topic already exists: ${topicData.name}`);
      }
    }
    
    // Verify final count
    const finalCount = await session.run(`
      MATCH (t:Topic)
      RETURN count(t) as count
    `);
    
    console.log(`\n📊 Summary:`);
    console.log(`  - Added ${addedCount} new topics`);
    console.log(`  - Total topics in database: ${finalCount.records[0].get('count')}`);
    
    // Show all topics
    const allTopics = await session.run(`
      MATCH (t:Topic)
      RETURN t.name as name, t.priority as priority
      ORDER BY t.priority, t.name
    `);
    
    console.log(`\n📋 All Topics (${allTopics.records.length}):`);
    allTopics.records.forEach(record => {
      console.log(`  ${record.get('priority') || 'null'}. ${record.get('name')}`);
    });
    
    console.log('\n✅ All missing topics added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding missing topics:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

addMissingTopics(); 