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

async function updateArraysComplete() {
  const session = driver.session();
  
  try {
    console.log('🚀 Starting complete Arrays update...');
    
    // Step 1: Update the topics data structure
    console.log('📝 Step 1: Updating topics data structure...');
    
    // Step 2: Update Neo4j database with new subtopics
    console.log('🗄️ Step 2: Updating Neo4j database...');
    
    // First, let's see what subtopics currently exist for Arrays
    const currentSubtopics = await session.run(`
      MATCH (t:Topic {name: 'Arrays'})-[:HAS_SUBTOPIC]->(st:Subtopic)
      RETURN t.name as Topic, collect(st.name) as CurrentSubtopics
    `);
    
    console.log('Current Arrays subtopics:', currentSubtopics.records[0]?.get('CurrentSubtopics') || []);
    
    // Remove existing subtopics for Arrays
    await session.run(`
      MATCH (t:Topic {name: 'Arrays'})-[:HAS_SUBTOPIC]->(st:Subtopic)
      DETACH DELETE st
    `);
    
    console.log('✅ Removed existing Arrays subtopics');
    
    // Create new subtopics for Arrays
    const subtopics = [
      {
        id: 'sub_arrays_0',
        name: '1D Arrays',
        description: 'Basic operations and concepts of one-dimensional arrays',
        difficultyScore: 1,
        estimatedTimeMins: 30,
        priority: 1
      },
      {
        id: 'sub_arrays_1',
        name: '2D Arrays',
        description: 'Two-dimensional arrays and matrix operations',
        difficultyScore: 2,
        estimatedTimeMins: 45,
        priority: 2
      },
      {
        id: 'sub_arrays_2',
        name: 'Dynamic Arrays',
        description: 'Dynamic array implementation and resizing strategies',
        difficultyScore: 2,
        estimatedTimeMins: 40,
        priority: 3
      },
      {
        id: 'sub_arrays_3',
        name: 'Prefix Sum',
        description: 'Prefix sum technique for range queries',
        difficultyScore: 3,
        estimatedTimeMins: 50,
        priority: 4
      },
      {
        id: 'sub_arrays_4',
        name: 'Two Pointer & Sliding Window',
        description: 'Two pointer technique and sliding window algorithms',
        difficultyScore: 4,
        estimatedTimeMins: 60,
        priority: 5
      },
      {
        id: 'sub_arrays_5',
        name: 'Kadane\'s Algorithm',
        description: 'Maximum subarray sum algorithm',
        difficultyScore: 4,
        estimatedTimeMins: 45,
        priority: 6
      },
      {
        id: 'sub_arrays_6',
        name: 'Array Rotation',
        description: 'Array rotation techniques and algorithms',
        difficultyScore: 3,
        estimatedTimeMins: 40,
        priority: 7
      },
      {
        id: 'sub_arrays_7',
        name: 'Searching (Linear/Binary)',
        description: 'Linear search and binary search algorithms',
        difficultyScore: 2,
        estimatedTimeMins: 50,
        priority: 8
      },
      {
        id: 'sub_arrays_8',
        name: 'Sorting Basics (Bubble, Insertion, Selection, Cycle)',
        description: 'Basic sorting algorithms including bubble, insertion, selection, and cycle sort',
        difficultyScore: 3,
        estimatedTimeMins: 70,
        priority: 9
      }
    ];
    
    for (const subtopic of subtopics) {
      await session.run(`
        MATCH (t:Topic {name: 'Arrays'})
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
    
    console.log('✅ Created new Arrays subtopics');
    
    // Create relationships between subtopics (prerequisites)
    for (let i = 0; i < subtopics.length - 1; i++) {
      await session.run(`
        MATCH (st1:Subtopic {id: $id1})
        MATCH (st2:Subtopic {id: $id2})
        CREATE (st1)-[:NEXT_TOPIC]->(st2)
      `, {
        id1: subtopics[i].id,
        id2: subtopics[i + 1].id
      });
    }
    
    console.log('✅ Created subtopic relationships');
    
    // Step 3: Seed the resources
    console.log('📚 Step 3: Seeding resources...');
    
    // Clear existing Arrays resources
    await session.run(`
      MATCH (t:Topic {id: 'arrays'})-[:HAS_RESOURCE]->(r:Resource)
      DETACH DELETE r
    `);
    
    await session.run(`
      MATCH (st:Subtopic)-[:HAS_RESOURCE]->(r:Resource)
      WHERE st.id STARTS WITH 'sub_arrays_'
      DETACH DELETE r
    `);
    
    // Seed topic resources
    const topicResources = [
      {
        type: 'pdf',
        title: 'Arrays Complete Guide',
        url: '/arrays.pdf',
        description: 'Comprehensive guide to arrays and their applications'
      },
      {
        type: 'youtube',
        title: 'Arrays Fundamentals',
        url: 'https://youtu.be/n60Dn0UsbEk?si=YGIL_RgJEe_Py-7d',
        description: 'Complete arrays tutorial covering all concepts'
      }
    ];
    
    for (let i = 0; i < topicResources.length; i++) {
      const resource = topicResources[i];
      const resourceId = `res_arrays_${i + 1}`;
      
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
        MATCH (t:Topic {id: 'arrays'})
        MATCH (r:Resource {id: $resourceId})
        CREATE (t)-[:HAS_RESOURCE]->(r)
      `, { resourceId });
    }
    
    // Seed subtopic resources
    const subtopicResources = [
      {
        subtopicId: 'sub_arrays_0',
        resources: [
          {
            type: 'youtube',
            title: '1D Arrays Tutorial',
            url: 'https://youtu.be/239ubH043lI?si=n03b6AT_ehJ_SCoF',
            description: 'Introduction to one-dimensional arrays'
          }
        ]
      },
      {
        subtopicId: 'sub_arrays_1',
        resources: [
          {
            type: 'youtube',
            title: '2D Arrays Tutorial',
            url: 'https://youtu.be/v4J2bEQF6jk?si=IzY1wOb_001fvq--',
            description: 'Two-dimensional arrays and matrix operations'
          }
        ]
      },
      {
        subtopicId: 'sub_arrays_2',
        resources: [
          {
            type: 'youtube',
            title: 'Dynamic Arrays Explained',
            url: 'https://youtu.be/jzJlq35dQII?si=8fDOEjbcXif8fzij',
            description: 'Dynamic array implementation and resizing'
          }
        ]
      },
      {
        subtopicId: 'sub_arrays_3',
        resources: [
          {
            type: 'youtube',
            title: 'Prefix Sum Technique',
            url: 'https://youtu.be/5_DFKL4zYLc?si=FQv3AkwEjvURDu_T',
            description: 'Prefix sum for efficient range queries'
          }
        ]
      },
      {
        subtopicId: 'sub_arrays_4',
        resources: [
          {
            type: 'youtube',
            title: 'Two Pointer & Sliding Window Playlist',
            url: 'https://youtube.com/playlist?list=PLgUwDviBIf0q7vrFA_HEWcqRqMpCXzYAL&si=ZxAciTMzEwI2agt-',
            description: 'Complete playlist on two pointer and sliding window techniques'
          }
        ]
      },
      {
        subtopicId: 'sub_arrays_5',
        resources: [
          {
            type: 'youtube',
            title: 'Kadane\'s Algorithm Tutorial',
            url: 'https://youtu.be/AHZpyENo7k4?si=FhvwBYmgA0cpZdPx',
            description: 'Maximum subarray sum using Kadane\'s algorithm'
          }
        ]
      },
      {
        subtopicId: 'sub_arrays_6',
        resources: [
          {
            type: 'youtube',
            title: 'Array Rotation Techniques',
            url: 'https://youtu.be/wvcQg43_V8U?si=bKh5iw1f8NkK6bFS',
            description: 'Different methods for array rotation'
          }
        ]
      },
      {
        subtopicId: 'sub_arrays_7',
        resources: [
          {
            type: 'youtube',
            title: 'Linear Search',
            url: 'https://youtu.be/_HRA37X8N_Q?si=DJUJkQTSU-Maw69K',
            description: 'Linear search algorithm implementation'
          },
          {
            type: 'youtube',
            title: 'Binary Search',
            url: 'https://youtu.be/f6UU7V3szVw?si=3Y-b63X9w1ELctqy',
            description: 'Binary search algorithm tutorial'
          },
          {
            type: 'youtube',
            title: 'Binary Search in 2D Arrays',
            url: 'https://youtu.be/enI_KyGLYPo?si=eNQpJtagOQ5Mk_Eg',
            description: 'Binary search applied to 2D arrays'
          }
        ]
      },
      {
        subtopicId: 'sub_arrays_8',
        resources: [
          {
            type: 'youtube',
            title: 'Bubble Sort',
            url: 'https://youtu.be/F5MZyqRp_IM?si=K7z4InlWMbl4ll5C',
            description: 'Bubble sort algorithm implementation'
          },
          {
            type: 'youtube',
            title: 'Selection Sort',
            url: 'https://youtu.be/Nd4SCCIHFWk?si=yxDCZYUvxfWIybyq',
            description: 'Selection sort algorithm tutorial'
          },
          {
            type: 'youtube',
            title: 'Insertion Sort',
            url: 'https://youtu.be/By_5-RRqVeE?si=vJ_AHo3p0gU5rVuo',
            description: 'Insertion sort algorithm explained'
          },
          {
            type: 'youtube',
            title: 'Cycle Sort',
            url: 'https://youtu.be/JfinxytTYFQ?si=EuvBQl7Nx0hVOINg',
            description: 'Cycle sort algorithm tutorial'
          }
        ]
      }
    ];
    
    for (const subtopic of subtopicResources) {
      for (let i = 0; i < subtopic.resources.length; i++) {
        const resource = subtopic.resources[i];
        const resourceId = `res_${subtopic.subtopicId}_${i + 1}`;
        
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
          qualityScore: 8.5 + Math.random() * 1.5
        });
        
        await session.run(`
          MATCH (st:Subtopic {id: $subtopicId})
          MATCH (r:Resource {id: $resourceId})
          CREATE (st)-[:HAS_RESOURCE]->(r)
        `, { 
          subtopicId: subtopic.subtopicId,
          resourceId 
        });
      }
    }
    
    // Verify the new structure
    const verification = await session.run(`
      MATCH (t:Topic {name: 'Arrays'})-[:HAS_SUBTOPIC]->(st:Subtopic)
      RETURN t.name as Topic, st.name as Subtopic, st.id as SubtopicID, st.difficultyScore as Difficulty
      ORDER BY st.priority
    `);
    
    console.log('✅ Arrays update completed successfully!');
    console.log('\n📊 New Arrays structure:');
    verification.records.forEach(record => {
      console.log(`  - ${record.get('Subtopic')} (${record.get('SubtopicID')}) - Difficulty: ${record.get('Difficulty')}`);
    });
    
    // Get resource count
    const resourceCount = await session.run(`
      MATCH (r:Resource)
      WHERE r.id STARTS WITH 'res_arrays'
      RETURN count(r) as resourceCount
    `);
    
    console.log(`\n📚 Total Arrays resources: ${resourceCount.records[0].get('resourceCount')}`);
    
  } catch (error) {
    console.error('❌ Error updating Arrays:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the complete update
updateArraysComplete(); 