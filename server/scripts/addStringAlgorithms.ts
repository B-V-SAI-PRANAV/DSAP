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

async function addStringAlgorithms() {
  const session = driver.session();
  
  try {
    console.log('🚀 Adding String Algorithms topic...');
    
    // Check if topic already exists
    const existing = await session.run(`
      MATCH (t:Topic {name: 'String Algorithms'})
      RETURN t
    `);
    
    if (existing.records.length > 0) {
      console.log('✅ String Algorithms topic already exists');
      return;
    }
    
    // Create the topic
    await session.run(`
      CREATE (t:Topic {
        id: 'string-algorithms',
        name: 'String Algorithms',
        description: 'Algorithms for processing and analyzing strings',
        difficultyScore: 0.6,
        isCore: true,
        estimatedTimeMins: 150,
        weight: 0.85,
        priority: 11,
        tags: ['text-processing', 'pattern-matching'],
        category: 'Algorithmic Techniques'
      })
    `);
    
    console.log('✅ Created String Algorithms topic');
    
    // Create subtopics
    const subtopics = [
      {
        id: 'sub_string_algorithms_0',
        name: 'String Matching',
        description: 'Basic string matching algorithms',
        difficultyScore: 0.4,
        estimatedTimeMins: 30,
        priority: 1
      },
      {
        id: 'sub_string_algorithms_1',
        name: 'KMP Algorithm',
        description: 'Knuth-Morris-Pratt string matching algorithm',
        difficultyScore: 0.6,
        estimatedTimeMins: 45,
        priority: 2
      },
      {
        id: 'sub_string_algorithms_2',
        name: 'Rabin-Karp Algorithm',
        description: 'Rabin-Karp string matching using hashing',
        difficultyScore: 0.5,
        estimatedTimeMins: 40,
        priority: 3
      },
      {
        id: 'sub_string_algorithms_3',
        name: 'Longest Palindromic Substring',
        description: 'Finding the longest palindromic substring',
        difficultyScore: 0.7,
        estimatedTimeMins: 50,
        priority: 4
      },
      {
        id: 'sub_string_algorithms_4',
        name: 'Anagram Problems',
        description: 'Solving anagram-related problems',
        difficultyScore: 0.5,
        estimatedTimeMins: 35,
        priority: 5
      },
      {
        id: 'sub_string_algorithms_5',
        name: 'String Compression',
        description: 'String compression algorithms',
        difficultyScore: 0.4,
        estimatedTimeMins: 30,
        priority: 6
      },
      {
        id: 'sub_string_algorithms_6',
        name: 'Regular Expressions',
        description: 'Pattern matching with regular expressions',
        difficultyScore: 0.6,
        estimatedTimeMins: 45,
        priority: 7
      }
    ];
    
    for (const subtopic of subtopics) {
      await session.run(`
        CREATE (st:Subtopic {
          id: $id,
          name: $name,
          description: $description,
          difficultyScore: $difficultyScore,
          estimatedTimeMins: $estimatedTimeMins,
          priority: $priority
        })
      `, subtopic);
      
      await session.run(`
        MATCH (t:Topic {name: 'String Algorithms'})
        MATCH (st:Subtopic {id: $id})
        CREATE (t)-[:HAS_SUBTOPIC]->(st)
      `, { id: subtopic.id });
    }
    
    console.log('✅ Created all subtopics for String Algorithms');
    
    // Verify
    const verification = await session.run(`
      MATCH (t:Topic {name: 'String Algorithms'})-[:HAS_SUBTOPIC]->(st:Subtopic)
      RETURN t.name as topic, st.name as subtopic, st.priority as priority
      ORDER BY st.priority
    `);
    
    console.log('\n📊 String Algorithms structure:');
    verification.records.forEach(record => {
      console.log(`  ${record.get('priority')}. ${record.get('subtopic')}`);
    });
    
    console.log('\n✅ String Algorithms topic added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding String Algorithms:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

addStringAlgorithms(); 