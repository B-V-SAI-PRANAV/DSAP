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

async function fixLinkedListsSubtopics() {
  const session = driver.session();
  
  try {
    console.log('🔧 Fixing Linked Lists subtopics...');
    
    // Add the missing subtopics
    const missingSubtopics = [
      {
        id: 'sub_linked_lists_1',
        name: 'Floyd\'s Cycle Detection',
        description: 'Detecting cycles in linked lists using Floyd\'s algorithm',
        difficultyScore: 4,
        estimatedTimeMins: 50,
        priority: 2
      },
      {
        id: 'sub_linked_lists_2',
        name: 'Merge Sort on Linked List',
        description: 'Implementing merge sort algorithm on linked lists',
        difficultyScore: 4,
        estimatedTimeMins: 60,
        priority: 3
      },
      {
        id: 'sub_linked_lists_3',
        name: 'LRU Cache Implementation',
        description: 'Least Recently Used cache using linked lists and hash maps',
        difficultyScore: 5,
        estimatedTimeMins: 70,
        priority: 4
      }
    ];
    
    for (const subtopic of missingSubtopics) {
      const existing = await session.run(`
        MATCH (st:Subtopic {name: $name})
        RETURN st
      `, { name: subtopic.name });
      
      if (existing.records.length === 0) {
        await session.run(`
          MATCH (t:Topic {name: 'Linked Lists'})
          CREATE (st:Subtopic {
            id: $id,
            name: $name,
            description: $description,
            difficultyScore: $difficultyScore,
            estimatedTimeMins: $estimatedTimeMins,
            priority: $priority
          })
          CREATE (t)-[:HAS_SUBTOPIC]->(st)
        `, subtopic);
        console.log(`✅ Created subtopic: ${subtopic.name}`);
      } else {
        console.log(`⚠️ Subtopic already exists: ${subtopic.name}`);
      }
    }
    
    // Verify the final structure
    const verification = await session.run(`
      MATCH (t:Topic {name: 'Linked Lists'})-[:HAS_SUBTOPIC]->(st:Subtopic)
      RETURN st.name as name, st.id as id, st.difficultyScore as difficulty
      ORDER BY st.priority
    `);
    
    console.log('\n📊 Final Linked Lists structure:');
    verification.records.forEach(record => {
      console.log(`  - ${record.get('name')} (${record.get('id')}) - Difficulty: ${record.get('difficulty')}`);
    });
    
    console.log(`\n✅ Total subtopics: ${verification.records.length}`);
    
  } catch (error) {
    console.error('❌ Error fixing Linked Lists subtopics:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

fixLinkedListsSubtopics(); 