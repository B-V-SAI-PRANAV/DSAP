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

const arraysResources = {
  topic: {
    id: 'arrays',
    name: 'Arrays',
    resources: [
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
    ]
  },
  subtopics: [
    {
      id: 'sub_arrays_0',
      name: '1D Arrays',
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
      id: 'sub_arrays_1',
      name: '2D Arrays',
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
      id: 'sub_arrays_2',
      name: 'Dynamic Arrays',
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
      id: 'sub_arrays_3',
      name: 'Prefix Sum',
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
      id: 'sub_arrays_4',
      name: 'Two Pointer & Sliding Window',
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
      id: 'sub_arrays_5',
      name: 'Kadane\'s Algorithm',
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
      id: 'sub_arrays_6',
      name: 'Array Rotation',
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
      id: 'sub_arrays_7',
      name: 'Searching (Linear/Binary)',
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
      id: 'sub_arrays_8',
      name: 'Sorting Basics (Bubble, Insertion, Selection, Cycle)',
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
  ]
};

async function seedArraysResources() {
  const session = driver.session();
  
  try {
    console.log('Seeding Arrays resources...');
    
    // Clear existing Arrays resources
    await session.run(`
      MATCH (t:Topic {id: 'arrays'})-[:HAS_RESOURCE]->(r:Resource)
      DETACH DELETE r
    `);
    
    // Clear existing Arrays subtopic resources
    await session.run(`
      MATCH (st:Subtopic)-[:HAS_RESOURCE]->(r:Resource)
      WHERE st.id STARTS WITH 'sub_arrays_'
      DETACH DELETE r
    `);
    
    // Seed topic resources
    for (let i = 0; i < arraysResources.topic.resources.length; i++) {
      const resource = arraysResources.topic.resources[i];
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
      
      // Link to topic
      await session.run(`
        MATCH (t:Topic {id: 'arrays'})
        MATCH (r:Resource {id: $resourceId})
        CREATE (t)-[:HAS_RESOURCE]->(r)
      `, { resourceId });
    }
    
    // Seed subtopic resources
    for (const subtopic of arraysResources.subtopics) {
      for (let i = 0; i < subtopic.resources.length; i++) {
        const resource = subtopic.resources[i];
        const resourceId = `res_${subtopic.id}_${i + 1}`;
        
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
        
        // Link to subtopic
        await session.run(`
          MATCH (st:Subtopic {id: $subtopicId})
          MATCH (r:Resource {id: $resourceId})
          CREATE (st)-[:HAS_RESOURCE]->(r)
        `, { 
          subtopicId: subtopic.id,
          resourceId 
        });
      }
    }
    
    console.log('Arrays resources seeded successfully!');
    
    // Get summary
    const result = await session.run(`
      MATCH (r:Resource)
      WHERE r.id STARTS WITH 'res_arrays'
      RETURN count(r) as resourceCount
    `);
    
    console.log(`Created ${result.records[0].get('resourceCount')} Arrays resources`);
    
  } catch (error) {
    console.error('Error seeding Arrays resources:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the seeding function
seedArraysResources(); 