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

async function deleteAdminUser() {
  const session = driver.session();
  try {
    console.log('🗑️ Deleting admin user...');
    await session.run(`
      MATCH (u:User {username: 'admin'})
      DETACH DELETE u
    `);
    console.log('✅ Admin user deleted!');
  } catch (error) {
    console.error('❌ Error deleting admin user:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

deleteAdminUser().catch(console.error); 