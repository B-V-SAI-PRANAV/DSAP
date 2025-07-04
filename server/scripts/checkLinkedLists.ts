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

async function checkLinkedLists() {
  const session = driver.session();
  
  try {
    console.log('🔍 Checking Linked Lists current state...');
    
    // Check topic
    const topic = await session.run(`
      MATCH (t:Topic {name: 'Linked Lists'})
      RETURN t.name as name, t.id as id, t.description as description
    `);
    
    console.log('📋 Topic:', topic.records[0]?.get('name') || 'Not found');
    
    // Check subtopics
    const subtopics = await session.run(`
      MATCH (t:Topic {name: 'Linked Lists'})-[:HAS_SUBTOPIC]->(st:Subtopic)
      RETURN st.name as name, st.id as id, st.description as description, st.difficultyScore as difficulty
      ORDER BY st.priority
    `);
    
    console.log('\n📚 Subtopics:');
    if (subtopics.records.length === 0) {
      console.log('  - No subtopics found');
    } else {
      subtopics.records.forEach(record => {
        console.log(`  - ${record.get('name')} (${record.get('id')}) - Difficulty: ${record.get('difficulty')}`);
      });
    }
    
    // Check topic resources
    const topicResources = await session.run(`
      MATCH (t:Topic {name: 'Linked Lists'})-[:HAS_RESOURCE]->(r:Resource)
      RETURN r.title as title, r.type as type, r.link as link
      ORDER BY r.title
    `);
    
    console.log('\n📖 Topic Resources:');
    if (topicResources.records.length === 0) {
      console.log('  - No topic resources found');
    } else {
      topicResources.records.forEach(record => {
        console.log(`  - ${record.get('title')} (${record.get('type')})`);
      });
    }
    
    // Check subtopic resources
    const subtopicResources = await session.run(`
      MATCH (st:Subtopic)-[:HAS_RESOURCE]->(r:Resource)
      WHERE st.id STARTS WITH 'sub_linked_lists_'
      RETURN st.name as subtopic, r.title as title, r.type as type
      ORDER BY st.name, r.title
    `);
    
    console.log('\n📖 Subtopic Resources:');
    if (subtopicResources.records.length === 0) {
      console.log('  - No subtopic resources found');
    } else {
      subtopicResources.records.forEach(record => {
        console.log(`  - ${record.get('subtopic')}: ${record.get('title')} (${record.get('type')})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking Linked Lists:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

checkLinkedLists(); 