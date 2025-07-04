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

async function updateLinkedListsWithVideos() {
  const session = driver.session();
  
  try {
    console.log('🚀 Starting Linked Lists update with videos...');
    
    // Step 1: Remove Circular Linked List subtopic
    console.log('🗑️ Step 1: Removing Circular Linked List subtopic...');
    await session.run(`
      MATCH (t:Topic {name: 'Linked Lists'})-[:HAS_SUBTOPIC]->(st:Subtopic {name: 'Circular Linked List'})
      DETACH DELETE st
    `);
    console.log('✅ Removed Circular Linked List subtopic');
    
    // Step 2: Update subtopic priorities to move Skip Lists to bottom
    console.log('📝 Step 2: Updating subtopic priorities...');
    
    const subtopicUpdates = [
      {
        name: 'Floyd\'s Cycle Detection',
        priority: 1,
        videoUrl: 'https://youtu.be/wiOo4DC5GGA?si=pCztMI1_4hVBrWOQ'
      },
      {
        name: 'Merge Sort on Linked List',
        priority: 2,
        videoUrl: 'https://youtu.be/8ocB7a_c-Cc?si=AVB9ePzqrqJcrsuP'
      },
      {
        name: 'LRU Cache Implementation',
        priority: 3,
        videoUrl: 'https://youtu.be/GsY6y0iPaHw?si=i3XEa1UtHDDyDu7R'
      },
      {
        name: 'Skip Lists (advanced)',
        priority: 4,
        videoUrl: 'https://youtu.be/FMYKVdWywcg?si=d0GC7kJH9vHSYs5A'
      }
    ];
    
    for (const update of subtopicUpdates) {
      await session.run(`
        MATCH (st:Subtopic {name: $name})
        SET st.priority = $priority
      `, { name: update.name, priority: update.priority });
    }
    
    console.log('✅ Updated subtopic priorities');
    
    // Step 3: Add YouTube videos to each subtopic
    console.log('📺 Step 3: Adding YouTube videos to subtopics...');
    
    for (const update of subtopicUpdates) {
      // Check if video resource already exists
      const existing = await session.run(`
        MATCH (r:Resource)
        WHERE r.link = $videoUrl
        RETURN r
      `, { videoUrl: update.videoUrl });
      
      if (existing.records.length === 0) {
        // Create new video resource
        const resourceId = `res_${update.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_video`;
        
        await session.run(`
          CREATE (r:Resource {
            id: $resourceId,
            title: $title,
            type: 'Video',
            link: $videoUrl,
            description: $description,
            qualityScore: 9.0
          })
        `, { 
          resourceId, 
          videoUrl: update.videoUrl,
          title: `${update.name} Tutorial`,
          description: `Comprehensive tutorial on ${update.name}`
        });
        
        // Link to subtopic
        await session.run(`
          MATCH (st:Subtopic {name: $subtopicName})
          MATCH (r:Resource {id: $resourceId})
          CREATE (st)-[:HAS_RESOURCE]->(r)
        `, { subtopicName: update.name, resourceId });
        
        console.log(`✅ Added video to ${update.name}`);
      } else {
        console.log(`⚠️ Video already exists for ${update.name}`);
      }
    }
    
    // Step 4: Verify the final structure
    console.log('🔍 Step 4: Verifying final structure...');
    
    const verification = await session.run(`
      MATCH (t:Topic {name: 'Linked Lists'})-[:HAS_SUBTOPIC]->(st:Subtopic)
      RETURN st.name as name, st.priority as priority
      ORDER BY st.priority
    `);
    
    console.log('\n📊 Final Linked Lists structure:');
    verification.records.forEach(record => {
      console.log(`  ${record.get('priority')}. ${record.get('name')}`);
    });
    
    // Check resources for each subtopic
    for (const update of subtopicUpdates) {
      const resources = await session.run(`
        MATCH (st:Subtopic {name: $name})-[:HAS_RESOURCE]->(r:Resource)
        RETURN r.title as title, r.link as link
      `, { name: update.name });
      
      console.log(`\n📺 ${update.name} resources:`);
      resources.records.forEach(record => {
        console.log(`  - ${record.get('title')}: ${record.get('link')}`);
      });
    }
    
    console.log('\n✅ Linked Lists update completed successfully!');
    console.log('🎯 Changes made:');
    console.log('  - Removed: Circular Linked List');
    console.log('  - Moved: Skip Lists to bottom (priority 4)');
    console.log('  - Added: YouTube videos to each subtopic');
    console.log('  - Videos will redirect properly with url property mapping');
    
  } catch (error) {
    console.error('❌ Error updating Linked Lists:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

updateLinkedListsWithVideos(); 