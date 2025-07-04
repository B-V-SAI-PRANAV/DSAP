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

async function addArraysSubtopicResources() {
  const session = driver.session();
  
  try {
    console.log('🚀 Adding resources to Arrays subtopics...');
    
    // Define resources for each subtopic
    const subtopicResources = [
      {
        subtopicName: '1D Arrays',
        videoUrl: 'https://youtu.be/n60Dn0UsbEk?si=YGIL_RgJEe_Py-7d',
        title: '1D Arrays Tutorial'
      },
      {
        subtopicName: '2D Arrays',
        videoUrl: 'https://youtu.be/239ubH043lI?si=n03b6AT_ehJ_SCoF',
        title: '2D Arrays Tutorial'
      },
      {
        subtopicName: 'Dynamic Arrays',
        videoUrl: 'https://youtu.be/v4J2bEQF6jk?si=IzY1wOb_001fvq--',
        title: 'Dynamic Arrays Tutorial'
      },
      {
        subtopicName: 'Prefix Sum',
        videoUrl: 'https://youtu.be/jzJlq35dQII?si=8fDOEjbcXif8fzij',
        title: 'Prefix Sum Tutorial'
      },
      {
        subtopicName: 'Two Pointer & Sliding Window',
        videoUrl: 'https://youtu.be/5_DFKL4zYLc?si=FQv3AkwEjvURDu_T',
        title: 'Two Pointer & Sliding Window Tutorial'
      },
      {
        subtopicName: 'Kadane\'s Algorithm',
        videoUrl: 'https://youtube.com/playlist?list=PLgUwDviBIf0q7vrFA_HEWcqRqMpCXzYAL&si=ZxAciTMzEwI2agt-',
        title: 'Kadane\'s Algorithm Tutorial'
      },
      {
        subtopicName: 'Array Rotation',
        videoUrl: 'https://youtu.be/AHZpyENo7k4?si=FhvwBYmgA0cpZdPx',
        title: 'Array Rotation Tutorial'
      },
      {
        subtopicName: 'Searching (Linear/Binary)',
        videoUrl: 'https://youtu.be/wvcQg43_V8U?si=bKh5iw1f8NkK6bFS',
        title: 'Searching Algorithms Tutorial'
      },
      {
        subtopicName: 'Sorting Basics (Bubble, Insertion, Selection, Cycle)',
        videoUrl: 'https://youtu.be/_HRA37X8N_Q?si=DJUJkQTSU-Maw69K',
        title: 'Sorting Basics Tutorial'
      }
    ];
    
    for (const resource of subtopicResources) {
      // Check if video resource already exists
      const existing = await session.run(`
        MATCH (r:Resource)
        WHERE r.link = $videoUrl
        RETURN r
      `, { videoUrl: resource.videoUrl });
      
      if (existing.records.length === 0) {
        // Create new video resource
        const resourceId = `res_${resource.subtopicName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_video`;
        
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
          videoUrl: resource.videoUrl,
          title: resource.title,
          description: `Comprehensive tutorial on ${resource.subtopicName}`
        });
        
        // Link to subtopic
        await session.run(`
          MATCH (st:Subtopic {name: $subtopicName})
          MATCH (r:Resource {id: $resourceId})
          CREATE (st)-[:HAS_RESOURCE]->(r)
        `, { subtopicName: resource.subtopicName, resourceId });
        
        console.log(`✅ Added video to ${resource.subtopicName}`);
      } else {
        console.log(`⚠️ Video already exists for ${resource.subtopicName}`);
      }
    }
    
    // Also add the main topic resources (PDF and main video)
    const topicResources = [
      {
        title: 'Arrays Complete Guide',
        type: 'Article',
        link: '/arrays.pdf',
        description: 'Comprehensive guide to arrays covering all concepts'
      },
      {
        title: 'Arrays Fundamentals',
        type: 'Video',
        link: 'https://youtu.be/n60Dn0UsbEk?si=YGIL_RgJEe_Py-7d',
        description: 'Complete arrays tutorial covering basic concepts'
      }
    ];
    
    for (let i = 0; i < topicResources.length; i++) {
      const resource = topicResources[i];
      const resourceId = `res_arrays_topic_${i + 1}`;
      
      // Check if already exists
      const existing = await session.run(`
        MATCH (r:Resource {id: $resourceId})
        RETURN r
      `, { resourceId });
      
      if (existing.records.length === 0) {
        await session.run(`
          CREATE (r:Resource {
            id: $resourceId,
            title: $title,
            type: $type,
            link: $link,
            description: $description,
            qualityScore: 9.0
          })
        `, {
          resourceId,
          title: resource.title,
          type: resource.type,
          link: resource.link,
          description: resource.description
        });
        
        await session.run(`
          MATCH (t:Topic {name: 'Arrays'})
          MATCH (r:Resource {id: $resourceId})
          CREATE (t)-[:HAS_RESOURCE]->(r)
        `, { resourceId });
        
        console.log(`✅ Added topic resource: ${resource.title}`);
      }
    }
    
    // Verify the final structure
    console.log('\n🔍 Verifying Arrays structure...');
    
    const verification = await session.run(`
      MATCH (t:Topic {name: 'Arrays'})-[:HAS_SUBTOPIC]->(st:Subtopic)
      RETURN st.name as name, st.priority as priority
      ORDER BY st.priority
    `);
    
    console.log('\n📊 Arrays subtopics:');
    verification.records.forEach(record => {
      console.log(`  - ${record.get('name')} (Priority: ${record.get('priority') || 'null'})`);
    });
    
    // Check resources for each subtopic
    for (const resource of subtopicResources) {
      const resources = await session.run(`
        MATCH (st:Subtopic {name: $name})-[:HAS_RESOURCE]->(r:Resource)
        RETURN r.title as title, r.link as link
      `, { name: resource.subtopicName });
      
      console.log(`\n📺 ${resource.subtopicName} resources:`);
      resources.records.forEach(record => {
        console.log(`  - ${record.get('title')}: ${record.get('link')}`);
      });
    }
    
    console.log('\n✅ Arrays resources added successfully!');
    console.log('🎯 Now clicking on Arrays subtopics will open their respective videos');
    
  } catch (error) {
    console.error('❌ Error adding Arrays resources:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

addArraysSubtopicResources(); 