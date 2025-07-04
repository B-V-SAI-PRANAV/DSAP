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

async function createAdminUser() {
  const session = driver.session();
  
  try {
    console.log('🔧 Creating admin user...');
    
    // Admin credentials
    const adminCredentials = {
      username: 'admin',
      email: 'admin@dsalearning.com',
      password: 'admin123', // You should change this to a secure password
      role: 'admin'
    };
    
    // Check if admin user already exists
    const existingUser = await session.run(`
      MATCH (u:User {username: $username})
      RETURN u
    `, { username: adminCredentials.username });
    
    if (existingUser.records.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log('Username:', adminCredentials.username);
      console.log('Email:', adminCredentials.email);
      console.log('Role: admin');
      console.log('\n💡 If you need to reset the password, you can:');
      console.log('1. Delete the existing admin user from Neo4j');
      console.log('2. Run this script again');
      console.log('3. Or manually update the password in Neo4j');
      return;
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(adminCredentials.password, saltRounds);
    
    // Create admin user
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
        lastActive: datetime()
      })
      RETURN u
    `, {
      userId: `user_${Date.now()}`,
      username: adminCredentials.username,
      email: adminCredentials.email,
      password: hashedPassword,
      role: adminCredentials.role
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('\n📋 Admin Credentials:');
    console.log('Username:', adminCredentials.username);
    console.log('Email:', adminCredentials.email);
    console.log('Password:', adminCredentials.password);
    console.log('Role:', adminCredentials.role);
    
    console.log('\n🔐 Security Notes:');
    console.log('1. Change the default password immediately after first login');
    console.log('2. Use a strong password in production');
    console.log('3. Consider enabling two-factor authentication');
    console.log('4. Regularly update admin credentials');
    
    console.log('\n🌐 Access the admin dashboard at:');
    console.log('http://localhost:3000/admin-dashboard');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the script
createAdminUser().catch(console.error); 