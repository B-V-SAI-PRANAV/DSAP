import neo4j from 'neo4j-driver';
import { config } from 'dotenv';

config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

async function checkAllTopics() {
  const session = driver.session();
  
  try {
    console.log('🔍 Checking all topics in database...');
    
    // Get all topics from database
    const dbTopics = await session.run(`
      MATCH (t:Topic)
      RETURN t.name as name, t.id as id, t.priority as priority
      ORDER BY t.priority, t.name
    `);
    
    console.log('\n📋 Topics in Database:');
    if (dbTopics.records.length === 0) {
      console.log('  - No topics found in database');
    } else {
      dbTopics.records.forEach(record => {
        console.log(`  ${record.get('priority') || 'null'}. ${record.get('name')} (${record.get('id')})`);
      });
    }
    
    console.log(`\n📊 Total topics in database: ${dbTopics.records.length}`);
    
    // Expected topics from topicsData.ts
    const expectedTopics = [
      'Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Heaps', 'Graphs', 
      'Hashing', 'Dynamic Programming', 'Greedy Algorithms', 'Divide and Conquer', 
      'Backtracking', 'String Algorithms', 'Advanced Data Structures'
    ];
    
    const dbTopicNames = dbTopics.records.map(record => record.get('name'));
    const missingTopics = expectedTopics.filter(topic => !dbTopicNames.includes(topic));
    
    console.log('\n❌ Missing Topics:');
    if (missingTopics.length === 0) {
      console.log('  - All expected topics are present');
    } else {
      missingTopics.forEach(topic => {
        console.log(`  - ${topic}`);
      });
    }
    
    console.log(`\n📈 Coverage: ${((expectedTopics.length - missingTopics.length) / expectedTopics.length * 100).toFixed(1)}%`);
    
  } catch (error) {
    console.error('❌ Error checking topics:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

checkAllTopics(); 