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

async function cleanupOldUsers() {
  const session = driver.session();
  try {
    console.log('🔍 Finding old/broken user nodes...');
    const result = await session.run(`
      MATCH (u:User)
      WHERE u.email IS NULL OR u.role IS NULL OR u.active IS NULL
      RETURN u.username AS username, u.id AS id
    `);
    if (result.records.length === 0) {
      console.log('✅ No old/broken user nodes found.');
      return;
    }
    console.log(`⚠️  Found ${result.records.length} old/broken user nodes. Deleting...`);
    await session.run(`
      MATCH (u:User)
      WHERE u.email IS NULL OR u.role IS NULL OR u.active IS NULL
      DETACH DELETE u
    `);
    console.log('🗑️  Old/broken user nodes deleted successfully.');
  } catch (error) {
    console.error('❌ Error cleaning up old users:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

cleanupOldUsers().catch(console.error); 