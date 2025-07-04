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

async function updateLinkedListsComplete() {
  const session = driver.session();
  
  try {
    console.log('🚀 Starting complete Linked Lists update...');
    
    // Step 1: Update the topics data structure
    console.log('📝 Step 1: Updating topics data structure...');
    
    // Step 2: Update Neo4j database - Remove only singly/doubly linked list subtopics
    console.log('🗄️ Step 2: Updating Neo4j database...');
    
    // First, let's see what subtopics currently exist for Linked Lists
    const currentSubtopics = await session.run(`
      MATCH (t:Topic {name: 'Linked Lists'})-[:HAS_SUBTOPIC]->(st:Subtopic)
      RETURN t.name as Topic, collect(st.name) as CurrentSubtopics
    `);
    
    console.log('Current Linked Lists subtopics:', currentSubtopics.records[0]?.get('CurrentSubtopics') || []);
    
    // Remove only the singly and doubly linked list subtopics
    await session.run(`
      MATCH (t:Topic {name: 'Linked Lists'})-[:HAS_SUBTOPIC]->(st:Subtopic)
      WHERE st.name IN ['Singly Linked List', 'Doubly Linked List', 'Linked List Basics', 'Singly & Doubly Linked Lists']
      DETACH DELETE st
    `);
    
    console.log('✅ Removed singly and doubly linked list subtopics');
    
    // Create the other subtopics that should remain
    const subtopics = [
      {
        id: 'sub_linked_lists_0',
        name: 'Circular Linked List',
        description: 'Circular linked list implementation and applications',
        difficultyScore: 3,
        estimatedTimeMins: 40,
        priority: 1
      },
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
      },
      {
        id: 'sub_linked_lists_4',
        name: 'Skip Lists (advanced)',
        description: 'Advanced linked list variant for efficient search operations',
        difficultyScore: 6,
        estimatedTimeMins: 80,
        priority: 5
      }
    ];
    
    // Check if these subtopics already exist, if not create them
    for (const subtopic of subtopics) {
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
      }
    }
    
    console.log('✅ Ensured other subtopics exist');
    
    // Step 3: Seed the resources
    console.log('📚 Step 3: Seeding resources...');
    
    // Clear existing Linked Lists topic resources
    await session.run(`
      MATCH (t:Topic {id: 'linked-lists'})-[:HAS_RESOURCE]->(r:Resource)
      DETACH DELETE r
    `);
    
    // Seed topic resources (only the 3 specified resources)
    const topicResources = [
      {
        type: 'pdf',
        title: 'Linked Lists Complete Guide',
        url: '/linked-lists.pdf',
        description: 'Comprehensive guide to linked lists covering all concepts'
      },
      {
        type: 'youtube',
        title: 'Linked Lists Fundamentals',
        url: 'https://youtu.be/58YbpRDc4yw?si=1H8gN2O3t2NiSngB',
        description: 'Complete linked lists tutorial covering basic concepts'
      },
      {
        type: 'youtube',
        title: 'Advanced Linked Lists',
        url: 'https://youtu.be/70tx7KcMROc?si=OE0wvuFa4_lTWF4e',
        description: 'Advanced linked lists concepts and implementations'
      }
    ];
    
    for (let i = 0; i < topicResources.length; i++) {
      const resource = topicResources[i];
      const resourceId = `res_linked_lists_${i + 1}`;
      
      await session.run(`
        CREATE (r:Resource {
          id: $resourceId,
          title: $title,
          type: $type,
          link: $url,
          description: $description,
          qualityScore: $qualityScore
        })
      `, {
        resourceId,
        title: resource.title,
        type: resource.type === 'pdf' ? 'Article' : 'Video',
        url: resource.url,
        description: resource.description,
        qualityScore: 9.0
      });
      
      await session.run(`
        MATCH (t:Topic {id: 'linked-lists'})
        MATCH (r:Resource {id: $resourceId})
        CREATE (t)-[:HAS_RESOURCE]->(r)
      `, { resourceId });
    }
    
    // Verify the new structure
    const verification = await session.run(`
      MATCH (t:Topic {name: 'Linked Lists'})-[:HAS_SUBTOPIC]->(st:Subtopic)
      RETURN t.name as Topic, st.name as Subtopic, st.id as SubtopicID, st.difficultyScore as Difficulty
      ORDER BY st.priority
    `);
    
    console.log('✅ Linked Lists update completed successfully!');
    console.log('\n📊 New Linked Lists structure:');
    verification.records.forEach(record => {
      console.log(`  - ${record.get('Subtopic')} (${record.get('SubtopicID')}) - Difficulty: ${record.get('Difficulty')}`);
    });
    
    // Get resource count
    const resourceCount = await session.run(`
      MATCH (r:Resource)
      WHERE r.id STARTS WITH 'res_linked_lists'
      RETURN count(r) as resourceCount
    `);
    
    console.log(`\n📚 Total Linked Lists topic resources: ${resourceCount.records[0].get('resourceCount')}`);
    console.log('📋 Topic Resources:');
    console.log('  1. PDF: /linked-lists.pdf');
    console.log('  2. Video: https://youtu.be/58YbpRDc4yw?si=1H8gN2O3t2NiSngB');
    console.log('  3. Video: https://youtu.be/70tx7KcMROc?si=OE0wvuFa4_lTWF4e');
    console.log('\n✅ Removed: Singly Linked List, Doubly Linked List');
    console.log('✅ Kept: Circular Linked List, Floyd\'s Cycle Detection, Merge Sort, LRU Cache, Skip Lists');
    
  } catch (error) {
    console.error('❌ Error updating Linked Lists:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the complete update
updateLinkedListsComplete(); 