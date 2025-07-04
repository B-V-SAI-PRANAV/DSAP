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

async function checkArraysSubtopics() {
  const session = driver.session();
  
  try {
    console.log('🔍 Checking Arrays subtopics and resources...');
    
    // Check Arrays topic
    const topic = await session.run(`
      MATCH (t:Topic {name: 'Arrays'})
      RETURN t.name as name, t.id as id
    `);
    
    console.log('📋 Topic:', topic.records[0]?.get('name') || 'Not found');
    
    // Check subtopics
    const subtopics = await session.run(`
      MATCH (t:Topic {name: 'Arrays'})-[:HAS_SUBTOPIC]->(st:Subtopic)
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
    
    // Check topic resources
    const topicResources = await session.run(`
      MATCH (t:Topic {name: 'Arrays'})-[:HAS_RESOURCE]->(r:Resource)
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
      WHERE st.id STARTS WITH 'sub_arrays_'
      RETURN st.name as subtopic, r.title as title, r.type as type, r.link as link
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
    console.error('❌ Error checking Arrays subtopics:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

checkArraysSubtopics(); 