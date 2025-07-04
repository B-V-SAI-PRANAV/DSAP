const neo4j = require('neo4j-driver');

const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'password')
);

async function checkAdminUser() {
  const session = driver.session();
  
  try {
    console.log('🔍 Checking admin user...');
    
    const result = await session.run(`
      MATCH (u:User {username: 'admin'})
      RETURN u
    `);
    
    if (result.records.length > 0) {
      const user = result.records[0].get('u').properties;
      console.log('✅ Admin user found!');
      console.log('Username:', user.username);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Active:', user.active);
      console.log('Created:', user.createdAt);
    } else {
      console.log('❌ Admin user not found!');
    }
  } catch (error) {
    console.error('❌ Error checking admin user:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

checkAdminUser().catch(console.error); 