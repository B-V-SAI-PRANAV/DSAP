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

async function checkStringAlgorithms() {
  const session = driver.session();
  
  try {
    console.log('🔍 Checking String Algorithms topic...');
    
    // Check if String Algorithms topic exists
    const topic = await session.run(`
      MATCH (t:Topic {name: 'String Algorithms'})
      RETURN t.name as name, t.id as id, t.description as description, t.priority as priority
    `);
    
    if (topic.records.length === 0) {
      console.log('❌ String Algorithms topic not found in database');
      console.log('💡 You may need to seed the topics first');
      return;
    }
    
    console.log('✅ String Algorithms topic found:');
    console.log(`  - Name: ${topic.records[0].get('name')}`);
    console.log(`  - ID: ${topic.records[0].get('id')}`);
    console.log(`  - Description: ${topic.records[0].get('description')}`);
    console.log(`  - Priority: ${topic.records[0].get('priority')}`);
    
    // Check subtopics
    const subtopics = await session.run(`
      MATCH (t:Topic {name: 'String Algorithms'})-[:HAS_SUBTOPIC]->(st:Subtopic)
      RETURN st.name as name, st.id as id, st.priority as priority
      ORDER BY st.priority
    `);
    
    console.log('\n📚 Subtopics:');
    if (subtopics.records.length === 0) {
      console.log('  - No subtopics found');
    } else {
      subtopics.records.forEach(record => {
        console.log(`  - ${record.get('name')} (${record.get('id')}) - Priority: ${record.get('priority')}`);
      });
    }
    
    // Check all topics for learning path generation
    const allTopics = await session.run(`
      MATCH (t:Topic)
      RETURN t.name as name, t.id as id, t.priority as priority
      ORDER BY t.priority
    `);
    
    console.log('\n📋 All Topics (for learning path generation):');
    allTopics.records.forEach(record => {
      console.log(`  ${record.get('priority')}. ${record.get('name')} (${record.get('id')})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking String Algorithms:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

checkStringAlgorithms(); 