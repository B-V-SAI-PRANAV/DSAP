import neo4j from 'neo4j-driver';
import { config } from 'dotenv';

config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j'
  )
);

const initSchema = async () => {
  const session = driver.session();

  try {
    // Constraints for uniqueness
    await session.run(`
      CREATE CONSTRAINT IF NOT EXISTS FOR (t:Topic) REQUIRE t.id IS UNIQUE;
      CREATE CONSTRAINT IF NOT EXISTS FOR (s:Subtopic) REQUIRE s.id IS UNIQUE;
      CREATE CONSTRAINT IF NOT EXISTS FOR (c:Concept) REQUIRE c.id IS UNIQUE;
      CREATE CONSTRAINT IF NOT EXISTS FOR (q:Question) REQUIRE q.id IS UNIQUE;
      CREATE CONSTRAINT IF NOT EXISTS FOR (r:Resource) REQUIRE r.id IS UNIQUE;
      CREATE CONSTRAINT IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE;
    `);

    // Indexes for faster lookups
    await session.run(`
      CREATE INDEX IF NOT EXISTS FOR (t:Topic) ON (t.name);
      CREATE INDEX IF NOT EXISTS FOR (s:Subtopic) ON (s.name);
    `);

    console.log('Database schema initialized successfully');
  } catch (error) {
    console.error('Error initializing schema:', error);
  } finally {
    await session.close();
    await driver.close();
  }
};

initSchema();
