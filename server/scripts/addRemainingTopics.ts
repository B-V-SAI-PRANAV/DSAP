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

async function addRemainingTopics() {
  const session = driver.session();
  
  try {
    console.log('🚀 Adding remaining missing topics...');
    
    // Define the missing topics with their subtopics
    const missingTopics = [
      {
        name: 'Hashing',
        description: 'Technique to map data to fixed-size values',
        subtopics: [
          'Hash Functions',
          'Hash Tables',
          'Collision Resolution',
          'Two Sum Problem',
          'Subarray Sum',
          'Longest Substring Without Repeating Characters'
        ]
      },
      {
        name: 'Dynamic Programming',
        description: 'Method for solving complex problems by breaking them down into simpler subproblems',
        subtopics: [
          'Memoization',
          'Tabulation',
          'Fibonacci Sequence',
          'Longest Common Subsequence (LCS)',
          'Longest Increasing Subsequence (LIS)',
          '0/1 Knapsack Problem',
          'Coin Change',
          'Edit Distance',
          'Matrix Chain Multiplication'
        ]
      },
      {
        name: 'Greedy Algorithms',
        description: 'Algorithm paradigm that builds up a solution piece by piece',
        subtopics: [
          'Activity Selection',
          'Fractional Knapsack',
          'Huffman Coding',
          'Dijkstra\'s Algorithm',
          'Kruskal\'s Algorithm',
          'Prim\'s Algorithm',
          'Job Scheduling'
        ]
      },
      {
        name: 'Divide and Conquer',
        description: 'Algorithm design paradigm based on multi-branched recursion',
        subtopics: [
          'Merge Sort',
          'Quick Sort',
          'Binary Search',
          'Strassen\'s Matrix Multiplication',
          'Closest Pair of Points',
          'Convex Hull'
        ]
      },
      {
        name: 'Backtracking',
        description: 'Algorithmic technique for finding all solutions to computational problems',
        subtopics: [
          'N-Queens Problem',
          'Sudoku Solver',
          'Permutations',
          'Combinations',
          'Subset Sum',
          'Graph Coloring',
          'Hamiltonian Cycle'
        ]
      },
      {
        name: 'Bit Manipulation',
        description: 'Techniques for manipulating individual bits in data',
        subtopics: [
          'Bitwise Operators',
          'Bit Counting',
          'Power of Two',
          'Single Number',
          'Bit Manipulation Tricks',
          'Bit Masks',
          'Bit Manipulation in DP'
        ]
      },
      {
        name: 'Advanced Data Structures',
        description: 'Complex data structures for specialized use cases',
        subtopics: [
          'Trie (Prefix Tree)',
          'Segment Tree',
          'Binary Indexed Tree (Fenwick Tree)',
          'Disjoint Set (Union-Find)',
          'Sparse Table',
          'Suffix Array',
          'B-Tree'
        ]
      }
    ];
    
    let addedCount = 0;
    
    for (const topicData of missingTopics) {
      console.log(`\n📝 Adding topic: ${topicData.name}`);
      
      const topicId = topicData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      // Create topic
      await session.run(`
        CREATE (t:Topic {
          id: $topicId,
          name: $name,
          description: $description,
          difficultyScore: 0.6,
          isCore: true,
          estimatedTimeMins: 150,
          weight: 0.85,
          priority: $priority,
          tags: ['advanced'],
          category: 'Algorithmic Techniques'
        })
      `, {
        topicId,
        name: topicData.name,
        description: topicData.description,
        priority: 8 + addedCount // Start from priority 8
      });
      
      // Create subtopics
      for (let i = 0; i < topicData.subtopics.length; i++) {
        const subtopic = topicData.subtopics[i];
        const subtopicId = `sub_${topicId}_${i}`;
        
        await session.run(`
          CREATE (st:Subtopic {
            id: $subtopicId,
            name: $name,
            description: $description,
            difficultyScore: $difficultyScore,
            estimatedTimeMins: $estimatedTimeMins,
            priority: $priority
          })
        `, {
          subtopicId,
          name: subtopic,
          description: `Learn about ${subtopic}`,
          difficultyScore: 0.5 + (i * 0.1),
          estimatedTimeMins: 40 + (i * 10),
          priority: i + 1
        });
        
        await session.run(`
          MATCH (t:Topic {id: $topicId})
          MATCH (st:Subtopic {id: $subtopicId})
          CREATE (t)-[:HAS_SUBTOPIC]->(st)
        `, { topicId, subtopicId });
      }
      
      addedCount++;
      console.log(`✅ Added ${topicData.name} with ${topicData.subtopics.length} subtopics`);
    }
    
    // Final verification
    const allTopics = await session.run(`
      MATCH (t:Topic)
      RETURN t.name as name, t.priority as priority
      ORDER BY t.priority, t.name
    `);
    
    console.log(`\n📊 Summary:`);
    console.log(`  - Added ${addedCount} new topics`);
    console.log(`  - Total topics now: ${allTopics.records.length}`);
    
    console.log('\n📋 All Topics:');
    allTopics.records.forEach(record => {
      console.log(`  ${record.get('priority') || 'null'}. ${record.get('name')}`);
    });
    
    console.log('\n✅ All remaining topics added successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

addRemainingTopics(); 