import neo4j from 'neo4j-driver';
import { config } from 'dotenv';
import bcrypt from 'bcrypt';

config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

const testUsers = [
  {
    username: 'john_doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    username: 'jane_smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    username: 'bob_wilson',
    email: 'bob@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    username: 'alice_brown',
    email: 'alice@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    username: 'charlie_davis',
    email: 'charlie@example.com',
    password: 'password123',
    role: 'user'
  }
];

async function createTestUsers() {
  const session = driver.session();
  
  try {
    console.log('🚀 Creating test users...');
    
    for (const userData of testUsers) {
      try {
        // Check if user already exists
        const existingUser = await session.run(`
          MATCH (u:User {username: $username})
          RETURN u
        `, { username: userData.username });
        
        if (existingUser.records.length > 0) {
          console.log(`⏭️  User ${userData.username} already exists, skipping...`);
          continue;
        }
        
        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(userData.password, saltRounds);
        
        // Create user
        await session.run(`
          CREATE (u:User {
            id: $userId,
            username: $username,
            email: $email,
            password: $password,
            role: $role,
            active: true,
            createdAt: datetime(),
            updatedAt: datetime(),
            lastActive: datetime(),
            topicsCompleted: $topicsCompleted
          })
          RETURN u
        `, {
          userId: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
          role: userData.role,
          topicsCompleted: Math.floor(Math.random() * 5)
        });
        
        console.log(`✅ Created user: ${userData.username}`);
        
      } catch (error: any) {
        console.error(`❌ Error creating user ${userData.username}:`, error.message);
      }
    }
    
    // Check total users in database
    const countResult = await session.run(`MATCH (u:User) RETURN count(u) as total`);
    const totalUsers = countResult.records[0].get('total').toNumber();
    
    console.log(`\n📊 Total users in database: ${totalUsers}`);
    
    // List all users
    const usersResult = await session.run(`
      MATCH (u:User)
      RETURN u.username as username, u.email as email, u.role as role
      ORDER BY u.createdAt DESC
    `);
    
    console.log('\n👥 All users in database:');
    usersResult.records.forEach((record, index) => {
      console.log(`${index + 1}. ${record.get('username')} (${record.get('email')}) - ${record.get('role')}`);
    });
    
  } catch (error) {
    console.error('❌ Error during user creation:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the script
createTestUsers().catch(console.error); 