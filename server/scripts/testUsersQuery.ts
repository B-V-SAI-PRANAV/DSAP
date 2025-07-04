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

async function testUsersQuery() {
  const session = driver.session();
  
  try {
    console.log('🔍 Testing users query...');
    
    // Test 1: Simple count
    console.log('\n📊 Test 1: Count all users');
    const countResult = await session.run(`MATCH (u:User) RETURN count(u) as total`);
    const totalUsers = countResult.records[0].get('total').toNumber();
    console.log(`Total users in database: ${totalUsers}`);
    
    // Test 2: Get all users without ordering
    console.log('\n📊 Test 2: Get all users (no ordering)');
    const allUsersResult = await session.run(`
      MATCH (u:User)
      RETURN u
      LIMIT 5
    `);
    console.log(`Found ${allUsersResult.records.length} users in basic query`);
    
    allUsersResult.records.forEach((record, index) => {
      const user = record.get('u').properties;
      console.log(`${index + 1}. ${user.username} (${user.id})`);
    });
    
    // Test 3: Try the actual query with ordering
    console.log('\n📊 Test 3: Get users with ordering by id');
    const orderedResult = await session.run(`
      MATCH (u:User)
      RETURN u
      ORDER BY u.id DESC
      SKIP 0
      LIMIT 10
    `);
    console.log(`Found ${orderedResult.records.length} users in ordered query`);
    
    orderedResult.records.forEach((record, index) => {
      const user = record.get('u').properties;
      console.log(`${index + 1}. ${user.username} (${user.id})`);
    });
    
    // Test 4: Check user properties
    console.log('\n📊 Test 4: Check user properties');
    if (orderedResult.records.length > 0) {
      const firstUser = orderedResult.records[0].get('u').properties;
      console.log('First user properties:');
      Object.keys(firstUser).forEach(key => {
        console.log(`  ${key}: ${typeof firstUser[key]} = ${firstUser[key]}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the test
testUsersQuery().catch(console.error); 