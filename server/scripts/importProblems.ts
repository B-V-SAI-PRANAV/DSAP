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

const problems = [
  // Arrays
  { id: 'arrays-1', title: 'Two Sum', leetcodeLink: 'https://leetcode.com/problems/two-sum', category: 'Arrays', difficulty: 'Easy', topicId: 'arrays' },
  { id: 'arrays-2', title: 'Rotate Image', leetcodeLink: 'https://leetcode.com/problems/rotate-image', category: 'Arrays', difficulty: 'Medium', topicId: 'arrays' },
  { id: 'arrays-3', title: 'Array Partition I', leetcodeLink: 'https://leetcode.com/problems/array-partition-i', category: 'Arrays', difficulty: 'Easy', topicId: 'arrays' },
  { id: 'arrays-4', title: 'Range Sum Query - Immutable', leetcodeLink: 'https://leetcode.com/problems/range-sum-query-immutable', category: 'Arrays', difficulty: 'Easy', topicId: 'arrays' },
  { id: 'arrays-5', title: 'Sliding Window Maximum', leetcodeLink: 'https://leetcode.com/problems/sliding-window-maximum', category: 'Arrays', difficulty: 'Hard', topicId: 'arrays' },
  { id: 'arrays-6', title: 'Maximum Subarray', leetcodeLink: 'https://leetcode.com/problems/maximum-subarray', category: 'Arrays', difficulty: 'Medium', topicId: 'arrays' },
  { id: 'arrays-7', title: 'Rotate Array', leetcodeLink: 'https://leetcode.com/problems/rotate-array', category: 'Arrays', difficulty: 'Medium', topicId: 'arrays' },
  { id: 'arrays-8', title: 'Find Smallest Letter Greater Than Target', leetcodeLink: 'https://leetcode.com/problems/find-smallest-letter-greater-than-target', category: 'Arrays', difficulty: 'Easy', topicId: 'arrays' },
  { id: 'arrays-9', title: 'Binary Search', leetcodeLink: 'https://leetcode.com/problems/binary-search', category: 'Arrays', difficulty: 'Easy', topicId: 'arrays' },
  { id: 'arrays-10', title: 'Search a 2D Matrix', leetcodeLink: 'https://leetcode.com/problems/search-a-2d-matrix', category: 'Arrays', difficulty: 'Medium', topicId: 'arrays' },
  { id: 'arrays-11', title: 'Bubble Sort', leetcodeLink: 'https://www.geeksforgeeks.org/bubble-sort/', category: 'Arrays', difficulty: 'Easy', topicId: 'arrays' },
  { id: 'arrays-12', title: 'Selection Sort', leetcodeLink: 'https://www.geeksforgeeks.org/selection-sort/', category: 'Arrays', difficulty: 'Easy', topicId: 'arrays' },
  { id: 'arrays-13', title: 'Insertion Sort', leetcodeLink: 'https://www.geeksforgeeks.org/insertion-sort/', category: 'Arrays', difficulty: 'Easy', topicId: 'arrays' },
  { id: 'arrays-14', title: 'Cycle Sort', leetcodeLink: 'https://www.geeksforgeeks.org/cycle-sort/', category: 'Arrays', difficulty: 'Medium', topicId: 'arrays' },

  // Linked Lists
  { id: 'll-1', title: 'Linked List Cycle II', leetcodeLink: 'https://leetcode.com/problems/linked-list-cycle-ii', category: 'Linked Lists', difficulty: 'Medium', topicId: 'linked-lists' },
  { id: 'll-2', title: 'Sort List', leetcodeLink: 'https://leetcode.com/problems/sort-list', category: 'Linked Lists', difficulty: 'Medium', topicId: 'linked-lists' },
  { id: 'll-3', title: 'LRU Cache', leetcodeLink: 'https://leetcode.com/problems/lru-cache', category: 'Linked Lists', difficulty: 'Medium', topicId: 'linked-lists' },
  { id: 'll-4', title: 'Skip List', leetcodeLink: 'https://www.geeksforgeeks.org/skip-list/', category: 'Linked Lists', difficulty: 'Hard', topicId: 'linked-lists' },

  // Stacks
  { id: 'stacks-1', title: 'Valid Parentheses', leetcodeLink: 'https://leetcode.com/problems/valid-parentheses', category: 'Stacks', difficulty: 'Easy', topicId: 'stacks' },
  { id: 'stacks-2', title: 'Infix to Postfix', leetcodeLink: 'https://www.geeksforgeeks.org/stack-set-2-infix-to-postfix/', category: 'Stacks', difficulty: 'Medium', topicId: 'stacks' },
  { id: 'stacks-3', title: 'Postfix Evaluation', leetcodeLink: 'https://www.geeksforgeeks.org/stack-set-4-evaluation-postfix-expression/', category: 'Stacks', difficulty: 'Medium', topicId: 'stacks' },
  { id: 'stacks-4', title: 'Next Greater Element I', leetcodeLink: 'https://leetcode.com/problems/next-greater-element-i', category: 'Stacks', difficulty: 'Easy', topicId: 'stacks' },

  // Queues
  { id: 'queues-1', title: 'Circular Queue', leetcodeLink: 'https://www.geeksforgeeks.org/circular-queue-set-1-introduction-and-array-implementation/', category: 'Queues', difficulty: 'Medium', topicId: 'queues' },
  { id: 'queues-2', title: 'Find Median from Data Stream', leetcodeLink: 'https://leetcode.com/problems/find-median-from-data-stream', category: 'Queues', difficulty: 'Hard', topicId: 'queues' },
  { id: 'queues-3', title: 'Deque', leetcodeLink: 'https://www.geeksforgeeks.org/deque-set-1-introduction-applications/', category: 'Queues', difficulty: 'Medium', topicId: 'queues' },

  // Trees
  { id: 'trees-1', title: 'Invert Binary Tree', leetcodeLink: 'https://leetcode.com/problems/invert-binary-tree', category: 'Trees', difficulty: 'Easy', topicId: 'trees' },
  { id: 'trees-2', title: 'Validate Binary Search Tree', leetcodeLink: 'https://leetcode.com/problems/validate-binary-search-tree', category: 'Trees', difficulty: 'Medium', topicId: 'trees' },
  { id: 'trees-3', title: 'AVL Tree Insertion', leetcodeLink: 'https://www.geeksforgeeks.org/avl-tree-set-1-insertion/', category: 'Trees', difficulty: 'Hard', topicId: 'trees' },
  { id: 'trees-4', title: 'Binary Tree Inorder Traversal', leetcodeLink: 'https://leetcode.com/problems/binary-tree-inorder-traversal', category: 'Trees', difficulty: 'Medium', topicId: 'trees' },
  { id: 'trees-5', title: 'Lowest Common Ancestor of a Binary Tree', leetcodeLink: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree', category: 'Trees', difficulty: 'Medium', topicId: 'trees' },
  { id: 'trees-6', title: 'Diameter of Binary Tree', leetcodeLink: 'https://leetcode.com/problems/diameter-of-binary-tree', category: 'Trees', difficulty: 'Easy', topicId: 'trees' },
  { id: 'trees-7', title: 'Serialize and Deserialize Binary Tree', leetcodeLink: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree', category: 'Trees', difficulty: 'Hard', topicId: 'trees' },

  // Heaps
  { id: 'heaps-1', title: 'Min Heap in Java', leetcodeLink: 'https://www.geeksforgeeks.org/min-heap-in-java/', category: 'Heaps', difficulty: 'Medium', topicId: 'heaps' },
  { id: 'heaps-2', title: 'Max Heap in Java', leetcodeLink: 'https://www.geeksforgeeks.org/max-heap-in-java/', category: 'Heaps', difficulty: 'Medium', topicId: 'heaps' },
  { id: 'heaps-3', title: 'Heap Sort', leetcodeLink: 'https://www.geeksforgeeks.org/heap-sort/', category: 'Heaps', difficulty: 'Medium', topicId: 'heaps' },
  { id: 'heaps-4', title: 'Find Median from Data Stream', leetcodeLink: 'https://leetcode.com/problems/find-median-from-data-stream', category: 'Heaps', difficulty: 'Hard', topicId: 'heaps' },
  { id: 'heaps-5', title: 'Top K Frequent Elements', leetcodeLink: 'https://leetcode.com/problems/top-k-frequent-elements', category: 'Heaps', difficulty: 'Medium', topicId: 'heaps' },
  { id: 'heaps-6', title: 'Merge K Sorted Lists', leetcodeLink: 'https://leetcode.com/problems/merge-k-sorted-lists', category: 'Heaps', difficulty: 'Hard', topicId: 'heaps' },
  { id: 'heaps-7', title: 'Median in Data Stream', leetcodeLink: 'https://leetcode.com/problems/find-median-from-data-stream', category: 'Heaps', difficulty: 'Hard', topicId: 'heaps' },

  // Graphs
  { id: 'graphs-1', title: 'Graph and its Representations', leetcodeLink: 'https://www.geeksforgeeks.org/graph-and-its-representations/', category: 'Graphs', difficulty: 'Easy', topicId: 'graphs' },
  { id: 'graphs-2', title: 'Number of Islands', leetcodeLink: 'https://leetcode.com/problems/number-of-islands', category: 'Graphs', difficulty: 'Medium', topicId: 'graphs' },
  { id: 'graphs-3', title: 'Rotting Oranges', leetcodeLink: 'https://leetcode.com/problems/rotting-oranges', category: 'Graphs', difficulty: 'Medium', topicId: 'graphs' },
  { id: 'graphs-4', title: 'Course Schedule II', leetcodeLink: 'https://leetcode.com/problems/course-schedule-ii', category: 'Graphs', difficulty: 'Medium', topicId: 'graphs' },
  { id: 'graphs-5', title: 'Network Delay Time', leetcodeLink: 'https://leetcode.com/problems/network-delay-time', category: 'Graphs', difficulty: 'Medium', topicId: 'graphs' },
  { id: 'graphs-6', title: 'Cheapest Flights Within K Stops', leetcodeLink: 'https://leetcode.com/problems/cheapest-flights-within-k-stops', category: 'Graphs', difficulty: 'Medium', topicId: 'graphs' },
  { id: 'graphs-7', title: 'Kruskal\'s Minimum Spanning Tree', leetcodeLink: 'https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/', category: 'Graphs', difficulty: 'Hard', topicId: 'graphs' },
  { id: 'graphs-8', title: 'Prim\'s Minimum Spanning Tree', leetcodeLink: 'https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/', category: 'Graphs', difficulty: 'Hard', topicId: 'graphs' },
  { id: 'graphs-9', title: 'Strongly Connected Components', leetcodeLink: 'https://www.geeksforgeeks.org/strongly-connected-components/', category: 'Graphs', difficulty: 'Hard', topicId: 'graphs' },
  { id: 'graphs-10', title: 'Detect Cycle in an Undirected Graph using BFS', leetcodeLink: 'https://www.geeksforgeeks.org/detect-cycle-in-an-undirected-graph-using-bfs/', category: 'Graphs', difficulty: 'Medium', topicId: 'graphs' },
  { id: 'graphs-11', title: 'Detect Cycle in a Directed Graph', leetcodeLink: 'https://www.geeksforgeeks.org/detect-cycle-in-a-directed-graph/', category: 'Graphs', difficulty: 'Medium', topicId: 'graphs' },

  // Hashing
  { id: 'hashing-1', title: 'Hashing: Separate Chaining', leetcodeLink: 'https://www.geeksforgeeks.org/hashing-set-2-separate-chaining/', category: 'Hashing', difficulty: 'Medium', topicId: 'hashing' },
  { id: 'hashing-2', title: 'Load Factor in HashMap', leetcodeLink: 'https://www.geeksforgeeks.org/load-factor-in-hashmap/', category: 'Hashing', difficulty: 'Easy', topicId: 'hashing' },
  { id: 'hashing-3', title: 'Two Sum', leetcodeLink: 'https://leetcode.com/problems/two-sum', category: 'Hashing', difficulty: 'Easy', topicId: 'hashing' },
  { id: 'hashing-4', title: 'Subarray Sum Equals K', leetcodeLink: 'https://leetcode.com/problems/subarray-sum-equals-k', category: 'Hashing', difficulty: 'Medium', topicId: 'hashing' },
  { id: 'hashing-5', title: 'Longest Substring Without Repeating Characters', leetcodeLink: 'https://leetcode.com/problems/longest-substring-without-repeating-characters', category: 'Hashing', difficulty: 'Medium', topicId: 'hashing' },

  // Dynamic Programming
  { id: 'dp-1', title: 'Fibonacci Number', leetcodeLink: 'https://leetcode.com/problems/fibonacci-number', category: 'Dynamic Programming', difficulty: 'Easy', topicId: 'dynamic-programming' },
  { id: 'dp-2', title: 'Longest Common Subsequence', leetcodeLink: 'https://leetcode.com/problems/longest-common-subsequence', category: 'Dynamic Programming', difficulty: 'Medium', topicId: 'dynamic-programming' },
  { id: 'dp-3', title: 'Longest Increasing Subsequence', leetcodeLink: 'https://leetcode.com/problems/longest-increasing-subsequence', category: 'Dynamic Programming', difficulty: 'Medium', topicId: 'dynamic-programming' },
  { id: 'dp-4', title: 'Partition Equal Subset Sum', leetcodeLink: 'https://leetcode.com/problems/partition-equal-subset-sum', category: 'Dynamic Programming', difficulty: 'Medium', topicId: 'dynamic-programming' },
  { id: 'dp-5', title: 'Coin Change', leetcodeLink: 'https://leetcode.com/problems/coin-change', category: 'Dynamic Programming', difficulty: 'Medium', topicId: 'dynamic-programming' },
  { id: 'dp-6', title: 'Edit Distance', leetcodeLink: 'https://leetcode.com/problems/edit-distance', category: 'Dynamic Programming', difficulty: 'Hard', topicId: 'dynamic-programming' },
  { id: 'dp-7', title: 'Matrix Chain Multiplication', leetcodeLink: 'https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/', category: 'Dynamic Programming', difficulty: 'Hard', topicId: 'dynamic-programming' },

  // Greedy Algorithms
  { id: 'greedy-1', title: 'Activity Selection Problem', leetcodeLink: 'https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/', category: 'Greedy Algorithms', difficulty: 'Medium', topicId: 'greedy-algorithms' },
  { id: 'greedy-2', title: 'Fractional Knapsack Problem', leetcodeLink: 'https://www.geeksforgeeks.org/fractional-knapsack-problem/', category: 'Greedy Algorithms', difficulty: 'Medium', topicId: 'greedy-algorithms' },
  { id: 'greedy-3', title: 'Huffman Coding', leetcodeLink: 'https://www.geeksforgeeks.org/huffman-coding-greedy-algo-3/', category: 'Greedy Algorithms', difficulty: 'Hard', topicId: 'greedy-algorithms' },
  { id: 'greedy-4', title: 'Network Delay Time', leetcodeLink: 'https://leetcode.com/problems/network-delay-time', category: 'Greedy Algorithms', difficulty: 'Medium', topicId: 'greedy-algorithms' },
  { id: 'greedy-5', title: 'Kruskal\'s Minimum Spanning Tree', leetcodeLink: 'https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/', category: 'Greedy Algorithms', difficulty: 'Hard', topicId: 'greedy-algorithms' },
  { id: 'greedy-6', title: 'Prim\'s Minimum Spanning Tree', leetcodeLink: 'https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/', category: 'Greedy Algorithms', difficulty: 'Hard', topicId: 'greedy-algorithms' },
  { id: 'greedy-7', title: 'Job Sequencing Problem', leetcodeLink: 'https://www.geeksforgeeks.org/job-sequencing-problem/', category: 'Greedy Algorithms', difficulty: 'Medium', topicId: 'greedy-algorithms' },

  // Divide and Conquer
  { id: 'dc-1', title: 'Merge Sort', leetcodeLink: 'https://www.geeksforgeeks.org/merge-sort/', category: 'Divide and Conquer', difficulty: 'Medium', topicId: 'divide-and-conquer' },
  { id: 'dc-2', title: 'Quick Sort', leetcodeLink: 'https://www.geeksforgeeks.org/quick-sort/', category: 'Divide and Conquer', difficulty: 'Medium', topicId: 'divide-and-conquer' },
  { id: 'dc-3', title: 'Binary Search', leetcodeLink: 'https://leetcode.com/problems/binary-search', category: 'Divide and Conquer', difficulty: 'Easy', topicId: 'divide-and-conquer' },
  { id: 'dc-4', title: 'Strassen\'s Matrix Multiplication', leetcodeLink: 'https://www.geeksforgeeks.org/strassens-matrix-multiplication/', category: 'Divide and Conquer', difficulty: 'Hard', topicId: 'divide-and-conquer' },
  { id: 'dc-5', title: 'Karatsuba Algorithm', leetcodeLink: 'https://www.geeksforgeeks.org/karatsuba-algorithm-for-fast-multiplication/', category: 'Divide and Conquer', difficulty: 'Hard', topicId: 'divide-and-conquer' },
  { id: 'dc-6', title: 'Closest Pair of Points', leetcodeLink: 'https://www.geeksforgeeks.org/closest-pair-of-points-using-divide-and-conquer-algorithm/', category: 'Divide and Conquer', difficulty: 'Hard', topicId: 'divide-and-conquer' },
  { id: 'dc-7', title: 'Convex Hull', leetcodeLink: 'https://www.geeksforgeeks.org/convex-hull-set-1-jarviss-algorithm-or-wrapping/', category: 'Divide and Conquer', difficulty: 'Hard', topicId: 'divide-and-conquer' },

  // Backtracking
  { id: 'backtrack-1', title: 'N-Queens', leetcodeLink: 'https://leetcode.com/problems/n-queens', category: 'Backtracking', difficulty: 'Hard', topicId: 'backtracking' },
  { id: 'backtrack-2', title: 'Sudoku Solver', leetcodeLink: 'https://leetcode.com/problems/sudoku-solver', category: 'Backtracking', difficulty: 'Hard', topicId: 'backtracking' },
  { id: 'backtrack-3', title: 'Permutations', leetcodeLink: 'https://leetcode.com/problems/permutations', category: 'Backtracking', difficulty: 'Medium', topicId: 'backtracking' },
  { id: 'backtrack-4', title: 'Combinations', leetcodeLink: 'https://leetcode.com/problems/combinations', category: 'Backtracking', difficulty: 'Medium', topicId: 'backtracking' },
  { id: 'backtrack-5', title: 'Partition Equal Subset Sum', leetcodeLink: 'https://leetcode.com/problems/partition-equal-subset-sum', category: 'Backtracking', difficulty: 'Medium', topicId: 'backtracking' },
  { id: 'backtrack-6', title: 'Graph Coloring', leetcodeLink: 'https://www.geeksforgeeks.org/graph-coloring-set-2-greedy-algorithm/', category: 'Backtracking', difficulty: 'Medium', topicId: 'backtracking' },
  { id: 'backtrack-7', title: 'Hamiltonian Cycle', leetcodeLink: 'https://www.geeksforgeeks.org/hamiltonian-cycle-backtracking-6/', category: 'Backtracking', difficulty: 'Hard', topicId: 'backtracking' },

  // Bit Manipulation
  { id: 'bit-1', title: 'Power of Two', leetcodeLink: 'https://leetcode.com/problems/power-of-two', category: 'Bit Manipulation', difficulty: 'Easy', topicId: 'bit-manipulation' },
  { id: 'bit-2', title: 'Single Number', leetcodeLink: 'https://leetcode.com/problems/single-number', category: 'Bit Manipulation', difficulty: 'Easy', topicId: 'bit-manipulation' },
  { id: 'bit-3', title: 'Bit Hacks', leetcodeLink: 'https://www.geeksforgeeks.org/bit-hacks-part-1-2/', category: 'Bit Manipulation', difficulty: 'Medium', topicId: 'bit-manipulation' },
  { id: 'bit-4', title: 'Bitmasking and Dynamic Programming', leetcodeLink: 'https://www.geeksforgeeks.org/bitmasking-and-dynamic-programming-set-1-count-ways-to-assign-unique-cap/', category: 'Bit Manipulation', difficulty: 'Hard', topicId: 'bit-manipulation' },
  { id: 'bit-5', title: 'Travelling Salesman Problem', leetcodeLink: 'https://www.geeksforgeeks.org/travelling-salesman-problem-set-1/', category: 'Bit Manipulation', difficulty: 'Hard', topicId: 'bit-manipulation' },

  // Strings
  { id: 'string-1', title: 'Implement strStr()', leetcodeLink: 'https://leetcode.com/problems/implement-strstr/', category: 'Strings', difficulty: 'Easy', topicId: 'strings' },
  { id: 'string-2', title: 'KMP Algorithm', leetcodeLink: 'https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/', category: 'Strings', difficulty: 'Hard', topicId: 'strings' },
  { id: 'string-3', title: 'Rabin-Karp Algorithm', leetcodeLink: 'https://www.geeksforgeeks.org/rabin-karp-algorithm-for-pattern-searching/', category: 'Strings', difficulty: 'Medium', topicId: 'strings' },
  { id: 'string-4', title: 'Longest Palindromic Substring', leetcodeLink: 'https://leetcode.com/problems/longest-palindromic-substring', category: 'Strings', difficulty: 'Medium', topicId: 'strings' },
  { id: 'string-5', title: 'Valid Anagram', leetcodeLink: 'https://leetcode.com/problems/valid-anagram', category: 'Strings', difficulty: 'Easy', topicId: 'strings' },
  { id: 'string-6', title: 'String Compression', leetcodeLink: 'https://leetcode.com/problems/string-compression', category: 'Strings', difficulty: 'Easy', topicId: 'strings' },
  { id: 'string-7', title: 'Regular Expression Matching', leetcodeLink: 'https://leetcode.com/problems/regular-expression-matching', category: 'Strings', difficulty: 'Hard', topicId: 'strings' },

  // Advanced Data Structures
  { id: 'ads-1', title: 'Implement Trie (Prefix Tree)', leetcodeLink: 'https://leetcode.com/problems/implement-trie-prefix-tree', category: 'Advanced Data Structures', difficulty: 'Medium', topicId: 'advanced-data-structures' },
  { id: 'ads-2', title: 'Segment Tree', leetcodeLink: 'https://www.geeksforgeeks.org/segment-tree-set-1-sum-of-given-range/', category: 'Advanced Data Structures', difficulty: 'Hard', topicId: 'advanced-data-structures' },
  { id: 'ads-3', title: 'Binary Indexed Tree', leetcodeLink: 'https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/', category: 'Advanced Data Structures', difficulty: 'Hard', topicId: 'advanced-data-structures' },
  { id: 'ads-4', title: 'Number of Provinces', leetcodeLink: 'https://leetcode.com/problems/number-of-provinces', category: 'Advanced Data Structures', difficulty: 'Medium', topicId: 'advanced-data-structures' },
  { id: 'ads-5', title: 'Sparse Table', leetcodeLink: 'https://www.geeksforgeeks.org/sparse-table/', category: 'Advanced Data Structures', difficulty: 'Hard', topicId: 'advanced-data-structures' },
  { id: 'ads-6', title: 'Suffix Array', leetcodeLink: 'https://www.geeksforgeeks.org/suffix-array-set-1-introduction/', category: 'Advanced Data Structures', difficulty: 'Hard', topicId: 'advanced-data-structures' },
  { id: 'ads-7', title: 'Introduction of B-Tree', leetcodeLink: 'https://www.geeksforgeeks.org/introduction-of-b-tree-2/', category: 'Advanced Data Structures', difficulty: 'Hard', topicId: 'advanced-data-structures' }
];

async function importProblems() {
  const session = driver.session();
  
  try {
    console.log('🚀 Starting problem import...');
    console.log(`📊 Total problems to import: ${problems.length}`);
    
    let imported = 0;
    let skipped = 0;
    
    for (const problem of problems) {
      try {
        // Check if problem already exists
        const existing = await session.run(`
          MATCH (p:Problem {id: $id})
          RETURN p
        `, { id: problem.id });
        
        if (existing.records.length > 0) {
          console.log(`⏭️  Skipping ${problem.title} (already exists)`);
          skipped++;
          continue;
        }
        
        // Create the problem
        await session.run(`
          CREATE (p:Problem {
            id: $id,
            title: $title,
            leetcodeLink: $leetcodeLink,
            category: $category,
            difficulty: $difficulty,
            topicId: $topicId,
            description: $description,
            timeComplexity: $timeComplexity,
            spaceComplexity: $spaceComplexity,
            createdAt: datetime()
          })
        `, {
          id: problem.id,
          title: problem.title,
          leetcodeLink: problem.leetcodeLink,
          category: problem.category,
          difficulty: problem.difficulty,
          topicId: problem.topicId,
          description: `Practice problem for ${problem.category}: ${problem.title}`,
          timeComplexity: 'O(n)',
          spaceComplexity: 'O(1)'
        });
        
        // Link to topic if it exists
        await session.run(`
          MATCH (t:Topic {id: $topicId})
          MATCH (p:Problem {id: $problemId})
          MERGE (t)-[:HAS_PROBLEM]->(p)
        `, {
          topicId: problem.topicId,
          problemId: problem.id
        });
        
        console.log(`✅ Imported: ${problem.title}`);
        imported++;
        
      } catch (error: any) {
        console.error(`❌ Error importing ${problem.title}:`, error.message);
      }
    }
    
    console.log('\n📈 Import Summary:');
    console.log(`✅ Successfully imported: ${imported} problems`);
    console.log(`⏭️  Skipped (already exists): ${skipped} problems`);
    console.log(`📊 Total processed: ${imported + skipped} problems`);
    
  } catch (error) {
    console.error('❌ Error during import:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the import
importProblems().catch(console.error); 