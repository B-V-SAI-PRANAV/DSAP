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

async function testProblems() {
  const session = driver.session();
  
  try {
    console.log('🔍 Testing problems in database...');
    
    // Check total count
    const countResult = await session.run(`
      MATCH (p:Problem)
      RETURN count(p) as count
    `);
    
    const totalProblems = countResult.records[0].get('count').toNumber();
    console.log(`📊 Total problems in database: ${totalProblems}`);
    
    if (totalProblems === 0) {
      console.log('⚠️  No problems found in database');
      return;
    }
    
    // Get sample problems
    const sampleResult = await session.run(`
      MATCH (p:Problem)
      OPTIONAL MATCH (t:Topic)-[:HAS_PROBLEM]->(p)
      RETURN p.title as title, p.id as id, t.name as topic
      LIMIT 10
    `);
    
    console.log('\n📋 Sample problems:');
    sampleResult.records.forEach((record, index) => {
      const title = record.get('title');
      const id = record.get('id');
      const topic = record.get('topic');
      console.log(`${index + 1}. ${title} (ID: ${id}, Topic: ${topic || 'None'})`);
    });
    
    // Check by category
    const categoryResult = await session.run(`
      MATCH (p:Problem)
      RETURN p.category as category, count(p) as count
      ORDER BY count DESC
    `);
    
    console.log('\n📊 Problems by category:');
    categoryResult.records.forEach(record => {
      const category = record.get('category');
      const count = record.get('count').toNumber();
      console.log(`- ${category}: ${count} problems`);
    });
    
  } catch (error) {
    console.error('❌ Error testing problems:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the test
testProblems().catch(console.error); 