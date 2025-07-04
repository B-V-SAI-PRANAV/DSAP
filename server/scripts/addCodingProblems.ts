import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USERNAME || 'neo4j',
    process.env.NEO4J_PASSWORD || 'password'
  )
);

const problems = [
  // Arrays
  { topic: 'Arrays', subtopic: '1D Array', title: 'Two Sum', link: 'https://leetcode.com/problems/two-sum' },
  { topic: 'Arrays', subtopic: '2D Array', title: 'Rotate Image', link: 'https://leetcode.com/problems/rotate-image' },
  { topic: 'Arrays', subtopic: 'Dynamic Arrays', title: 'Array Partition I', link: 'https://leetcode.com/problems/array-partition-i' },
  { topic: 'Arrays', subtopic: 'Prefix Sum', title: 'Range Sum Query - Immutable', link: 'https://leetcode.com/problems/range-sum-query-immutable' },
  { topic: 'Arrays', subtopic: 'Two Pointer & Sliding Window', title: 'Sliding Window Maximum', link: 'https://leetcode.com/problems/sliding-window-maximum' },
  { topic: 'Arrays', subtopic: "Kadane's Algorithm", title: 'Maximum Subarray', link: 'https://leetcode.com/problems/maximum-subarray' },
  { topic: 'Arrays', subtopic: 'Array Rotation', title: 'Rotate Array', link: 'https://leetcode.com/problems/rotate-array' },
  { topic: 'Arrays', subtopic: 'Searching: Linear Search', title: 'Find Smallest Letter Greater Than Target', link: 'https://leetcode.com/problems/find-smallest-letter-greater-than-target' },
  { topic: 'Arrays', subtopic: 'Searching: Binary Search', title: 'Binary Search', link: 'https://leetcode.com/problems/binary-search' },
  { topic: 'Arrays', subtopic: 'Searching: Binary Search in 2D Arrays', title: 'Search a 2D Matrix', link: 'https://leetcode.com/problems/search-a-2d-matrix' },
  { topic: 'Arrays', subtopic: 'Sorting: Bubble Sort', title: 'Bubble Sort', link: 'https://www.geeksforgeeks.org/bubble-sort/' },
  { topic: 'Arrays', subtopic: 'Sorting: Selection Sort', title: 'Selection Sort', link: 'https://www.geeksforgeeks.org/selection-sort/' },
  { topic: 'Arrays', subtopic: 'Sorting: Insertion Sort', title: 'Insertion Sort', link: 'https://www.geeksforgeeks.org/insertion-sort/' },
  { topic: 'Arrays', subtopic: 'Sorting: Cycle Sort', title: 'Cycle Sort', link: 'https://www.geeksforgeeks.org/cycle-sort/' },

  // Linked Lists
  { topic: 'Linked Lists', subtopic: "Floyd's Cycle Detection", title: "Linked List Cycle II", link: 'https://leetcode.com/problems/linked-list-cycle-ii' },
  { topic: 'Linked Lists', subtopic: 'Merge Sort on Linked List', title: 'Sort List', link: 'https://leetcode.com/problems/sort-list' },
  { topic: 'Linked Lists', subtopic: 'LRU Cache Implementation', title: 'LRU Cache', link: 'https://leetcode.com/problems/lru-cache' },
  { topic: 'Linked Lists', subtopic: 'Skip Lists (advanced)', title: 'Skip List', link: 'https://www.geeksforgeeks.org/skip-list/' },

  // Stacks
  { topic: 'Stacks', subtopic: 'Valid Parentheses', title: 'Valid Parentheses', link: 'https://leetcode.com/problems/valid-parentheses' },
  { topic: 'Stacks', subtopic: 'Infix to Postfix', title: 'Infix to Postfix', link: 'https://www.geeksforgeeks.org/stack-set-2-infix-to-postfix/' },
  { topic: 'Stacks', subtopic: 'Postfix Evaluation', title: 'Postfix Evaluation', link: 'https://www.geeksforgeeks.org/stack-set-4-evaluation-postfix-expression/' },
  { topic: 'Stacks', subtopic: 'Monotonic Stack', title: 'Next Greater Element I', link: 'https://leetcode.com/problems/next-greater-element-i' },
  { topic: 'Stacks', subtopic: 'Next Greater Element', title: 'Next Greater Element I', link: 'https://leetcode.com/problems/next-greater-element-i' },

  // Queues
  { topic: 'Queues', subtopic: 'Circular Queue', title: 'Circular Queue', link: 'https://www.geeksforgeeks.org/circular-queue-set-1-introduction-and-array-implementation/' },
  { topic: 'Queues', subtopic: 'Priority Queue', title: 'Find Median from Data Stream', link: 'https://leetcode.com/problems/find-median-from-data-stream' },
  { topic: 'Queues', subtopic: 'Deque (Double-ended Queue)', title: 'Deque', link: 'https://www.geeksforgeeks.org/deque-set-1-introduction-applications/' },

  // Trees
  { topic: 'Trees', subtopic: 'Binary Tree', title: 'Invert Binary Tree', link: 'https://leetcode.com/problems/invert-binary-tree' },
  { topic: 'Trees', subtopic: 'Binary Search Tree (BST)', title: 'Validate Binary Search Tree', link: 'https://leetcode.com/problems/validate-binary-search-tree' },
  { topic: 'Trees', subtopic: 'AVL Tree', title: 'AVL Tree Insertion', link: 'https://www.geeksforgeeks.org/avl-tree-set-1-insertion/' },
  { topic: 'Trees', subtopic: 'Tree Traversals (Inorder, Preorder, Postorder)', title: 'Binary Tree Inorder Traversal', link: 'https://leetcode.com/problems/binary-tree-inorder-traversal' },
  { topic: 'Trees', subtopic: 'Lowest Common Ancestor (LCA)', title: 'Lowest Common Ancestor of a Binary Tree', link: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree' },
  { topic: 'Trees', subtopic: 'Tree Diameter', title: 'Diameter of Binary Tree', link: 'https://leetcode.com/problems/diameter-of-binary-tree' },
  { topic: 'Trees', subtopic: 'Serialize/Deserialize Tree', title: 'Serialize and Deserialize Binary Tree', link: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree' },

  // Heaps
  { topic: 'Heaps', subtopic: 'Min Heap', title: 'Min Heap in Java', link: 'https://www.geeksforgeeks.org/min-heap-in-java/' },
  { topic: 'Heaps', subtopic: 'Max Heap', title: 'Max Heap in Java', link: 'https://www.geeksforgeeks.org/max-heap-in-java/' },
  { topic: 'Heaps', subtopic: 'Heap Sort', title: 'Heap Sort', link: 'https://www.geeksforgeeks.org/heap-sort/' },
  { topic: 'Heaps', subtopic: 'Priority Queue Implementation', title: 'Find Median from Data Stream', link: 'https://leetcode.com/problems/find-median-from-data-stream' },
  { topic: 'Heaps', subtopic: 'Top K Elements', title: 'Top K Frequent Elements', link: 'https://leetcode.com/problems/top-k-frequent-elements' },
  { topic: 'Heaps', subtopic: 'Merge K Sorted Lists', title: 'Merge K Sorted Lists', link: 'https://leetcode.com/problems/merge-k-sorted-lists' },
  { topic: 'Heaps', subtopic: 'Median in Data Stream', title: 'Find Median from Data Stream', link: 'https://leetcode.com/problems/find-median-from-data-stream' },

  // Graphs
  { topic: 'Graphs', subtopic: 'Graph Representation (Adjacency Matrix/List)', title: 'Graph and its Representations', link: 'https://www.geeksforgeeks.org/graph-and-its-representations/' },
  { topic: 'Graphs', subtopic: 'Depth-First Search (DFS)', title: 'Number of Islands', link: 'https://leetcode.com/problems/number-of-islands' },
  { topic: 'Graphs', subtopic: 'Breadth-First Search (BFS)', title: 'Rotting Oranges', link: 'https://leetcode.com/problems/rotting-oranges' },
  { topic: 'Graphs', subtopic: 'Topological Sort', title: 'Course Schedule II', link: 'https://leetcode.com/problems/course-schedule-ii' },
  { topic: 'Graphs', subtopic: 'Shortest Path: Dijkstra', title: 'Network Delay Time', link: 'https://leetcode.com/problems/network-delay-time' },
  { topic: 'Graphs', subtopic: 'Shortest Path: Bellman-Ford', title: 'Cheapest Flights Within K Stops', link: 'https://leetcode.com/problems/cheapest-flights-within-k-stops' },
  { topic: 'Graphs', subtopic: 'Minimum Spanning Tree: Kruskal', title: "Kruskal's Minimum Spanning Tree", link: 'https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/' },
  { topic: 'Graphs', subtopic: 'Minimum Spanning Tree: Prim', title: "Prim's Minimum Spanning Tree", link: 'https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/' },
  { topic: 'Graphs', subtopic: 'Strongly Connected Components', title: 'Strongly Connected Components', link: 'https://www.geeksforgeeks.org/strongly-connected-components/' },
  { topic: 'Graphs', subtopic: 'Cycle Detection: BFS', title: 'Detect Cycle in an Undirected Graph using BFS', link: 'https://www.geeksforgeeks.org/detect-cycle-in-an-undirected-graph-using-bfs/' },
  { topic: 'Graphs', subtopic: 'Cycle Detection: DFS', title: 'Detect Cycle in a Directed Graph', link: 'https://www.geeksforgeeks.org/detect-cycle-in-a-directed-graph/' },

  // Hashing
  { topic: 'Hashing', subtopic: 'Collision Resolution', title: 'Hashing: Separate Chaining', link: 'https://www.geeksforgeeks.org/hashing-set-2-separate-chaining/' },
  { topic: 'Hashing', subtopic: 'Two Sum Problem', title: 'Two Sum', link: 'https://leetcode.com/problems/two-sum' },
  { topic: 'Hashing', subtopic: 'Subarray Sum', title: 'Subarray Sum Equals K', link: 'https://leetcode.com/problems/subarray-sum-equals-k' },
  { topic: 'Hashing', subtopic: 'Longest Substring Without Repeating Characters', title: 'Longest Substring Without Repeating Characters', link: 'https://leetcode.com/problems/longest-substring-without-repeating-characters' },

  // Dynamic Programming
  { topic: 'Dynamic Programming', subtopic: 'Fibonacci Sequence', title: 'Fibonacci Number', link: 'https://leetcode.com/problems/fibonacci-number' },
  { topic: 'Dynamic Programming', subtopic: 'Longest Common Subsequence (LCS)', title: 'Longest Common Subsequence', link: 'https://leetcode.com/problems/longest-common-subsequence' },
  { topic: 'Dynamic Programming', subtopic: 'Longest Increasing Subsequence (LIS)', title: 'Longest Increasing Subsequence', link: 'https://leetcode.com/problems/longest-increasing-subsequence' },
  { topic: 'Dynamic Programming', subtopic: '0/1 Knapsack Problem', title: 'Partition Equal Subset Sum', link: 'https://leetcode.com/problems/partition-equal-subset-sum' },
  { topic: 'Dynamic Programming', subtopic: 'Coin Change', title: 'Coin Change', link: 'https://leetcode.com/problems/coin-change' },
  { topic: 'Dynamic Programming', subtopic: 'Edit Distance', title: 'Edit Distance', link: 'https://leetcode.com/problems/edit-distance' },
  { topic: 'Dynamic Programming', subtopic: 'Matrix Chain Multiplication', title: 'Matrix Chain Multiplication', link: 'https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/' },

  // Greedy Algorithms
  { topic: 'Greedy Algorithms', subtopic: 'Activity Selection', title: 'Activity Selection Problem', link: 'https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/' },
  { topic: 'Greedy Algorithms', subtopic: 'Fractional Knapsack', title: 'Fractional Knapsack Problem', link: 'https://www.geeksforgeeks.org/fractional-knapsack-problem/' },
  { topic: 'Greedy Algorithms', subtopic: 'Huffman Coding', title: 'Huffman Coding', link: 'https://www.geeksforgeeks.org/huffman-coding-greedy-algo-3/' },
  { topic: 'Greedy Algorithms', subtopic: "Dijkstra's Algorithm", title: 'Network Delay Time', link: 'https://leetcode.com/problems/network-delay-time' },
  { topic: 'Greedy Algorithms', subtopic: "Kruskal's Algorithm", title: "Kruskal's Minimum Spanning Tree", link: 'https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm-greedy-algo-2/' },
  { topic: 'Greedy Algorithms', subtopic: "Prim's Algorithm", title: "Prim's Minimum Spanning Tree", link: 'https://www.geeksforgeeks.org/prims-minimum-spanning-tree-mst-greedy-algo-5/' },
  { topic: 'Greedy Algorithms', subtopic: 'Job Scheduling', title: 'Job Sequencing Problem', link: 'https://www.geeksforgeeks.org/job-sequencing-problem/' },

  // Divide and Conquer
  { topic: 'Divide and Conquer', subtopic: 'Merge Sort', title: 'Merge Sort', link: 'https://www.geeksforgeeks.org/merge-sort/' },
  { topic: 'Divide and Conquer', subtopic: 'Quick Sort', title: 'Quick Sort', link: 'https://www.geeksforgeeks.org/quick-sort/' },
  { topic: 'Divide and Conquer', subtopic: 'Binary Search', title: 'Binary Search', link: 'https://leetcode.com/problems/binary-search' },
  { topic: 'Divide and Conquer', subtopic: "Strassen's Matrix Multiplication", title: "Strassen's Matrix Multiplication", link: 'https://www.geeksforgeeks.org/strassens-matrix-multiplication/' },
  { topic: 'Divide and Conquer', subtopic: 'Closest Pair of Points', title: 'Closest Pair of Points', link: 'https://www.geeksforgeeks.org/closest-pair-of-points-using-divide-and-conquer-algorithm/' },
  { topic: 'Divide and Conquer', subtopic: 'Convex Hull', title: 'Convex Hull', link: 'https://www.geeksforgeeks.org/convex-hull-set-1-jarviss-algorithm-or-wrapping/' },

  // Backtracking
  { topic: 'Backtracking', subtopic: 'N-Queens Problem', title: 'N-Queens', link: 'https://leetcode.com/problems/n-queens' },
  { topic: 'Backtracking', subtopic: 'Sudoku Solver', title: 'Sudoku Solver', link: 'https://leetcode.com/problems/sudoku-solver' },
  { topic: 'Backtracking', subtopic: 'Permutations', title: 'Permutations', link: 'https://leetcode.com/problems/permutations' },
  { topic: 'Backtracking', subtopic: 'Combinations', title: 'Combinations', link: 'https://leetcode.com/problems/combinations' },
  { topic: 'Backtracking', subtopic: 'Subset Sum', title: 'Partition Equal Subset Sum', link: 'https://leetcode.com/problems/partition-equal-subset-sum' },
  { topic: 'Backtracking', subtopic: 'Graph Coloring', title: 'Graph Coloring', link: 'https://www.geeksforgeeks.org/graph-coloring-set-2-greedy-algorithm/' },
  { topic: 'Backtracking', subtopic: 'Hamiltonian Cycle', title: 'Hamiltonian Cycle', link: 'https://www.geeksforgeeks.org/hamiltonian-cycle-backtracking-6/' },

  // Bit Manipulation
  { topic: 'Bit Manipulation', subtopic: 'Power of Two', title: 'Power of Two', link: 'https://leetcode.com/problems/power-of-two' },
  { topic: 'Bit Manipulation', subtopic: 'Single Number', title: 'Single Number', link: 'https://leetcode.com/problems/single-number' },
  { topic: 'Bit Manipulation', subtopic: 'Bit Manipulation Tricks', title: 'Bit Hacks', link: 'https://www.geeksforgeeks.org/bit-hacks-part-1-2/' },
  { topic: 'Bit Manipulation', subtopic: 'Bit Masks', title: 'Bitmasking and Dynamic Programming', link: 'https://www.geeksforgeeks.org/bitmasking-and-dynamic-programming-set-1-count-ways-to-assign-unique-cap/' },
  { topic: 'Bit Manipulation', subtopic: 'Bit Manipulation in DP', title: 'Travelling Salesman Problem', link: 'https://www.geeksforgeeks.org/travelling-salesman-problem-set-1/' },

  // String Algorithms
  { topic: 'String Algorithms', subtopic: 'String Matching', title: 'Implement strStr()', link: 'https://leetcode.com/problems/implement-strstr/' },
  { topic: 'String Algorithms', subtopic: 'KMP Algorithm', title: 'KMP Algorithm', link: 'https://www.geeksforgeeks.org/kmp-algorithm-for-pattern-searching/' },
  { topic: 'String Algorithms', subtopic: 'Rabin-Karp Algorithm', title: 'Rabin-Karp Algorithm', link: 'https://www.geeksforgeeks.org/rabin-karp-algorithm-for-pattern-searching/' },
  { topic: 'String Algorithms', subtopic: 'Longest Palindromic Substring', title: 'Longest Palindromic Substring', link: 'https://leetcode.com/problems/longest-palindromic-substring' },
  { topic: 'String Algorithms', subtopic: 'Anagram Problems', title: 'Valid Anagram', link: 'https://leetcode.com/problems/valid-anagram' },
  { topic: 'String Algorithms', subtopic: 'String Compression', title: 'String Compression', link: 'https://leetcode.com/problems/string-compression' },
  { topic: 'String Algorithms', subtopic: 'Regular Expressions', title: 'Regular Expression Matching', link: 'https://leetcode.com/problems/regular-expression-matching' },

  // Advanced Data Structures
  { topic: 'Advanced Data Structures', subtopic: 'Trie (Prefix Tree)', title: 'Implement Trie (Prefix Tree)', link: 'https://leetcode.com/problems/implement-trie-prefix-tree' },
  { topic: 'Advanced Data Structures', subtopic: 'Segment Tree', title: 'Segment Tree', link: 'https://www.geeksforgeeks.org/segment-tree-set-1-sum-of-given-range/' },
  { topic: 'Advanced Data Structures', subtopic: 'Binary Indexed Tree (Fenwick Tree)', title: 'Binary Indexed Tree', link: 'https://www.geeksforgeeks.org/binary-indexed-tree-or-fenwick-tree-2/' },
  { topic: 'Advanced Data Structures', subtopic: 'Disjoint Set (Union-Find)', title: 'Number of Provinces', link: 'https://leetcode.com/problems/number-of-provinces' },
  { topic: 'Advanced Data Structures', subtopic: 'Sparse Table', title: 'Sparse Table', link: 'https://www.geeksforgeeks.org/sparse-table/' },
  { topic: 'Advanced Data Structures', subtopic: 'Suffix Array', title: 'Suffix Array', link: 'https://www.geeksforgeeks.org/suffix-array-set-1-introduction/' },
  { topic: 'Advanced Data Structures', subtopic: 'B-Tree', title: 'Introduction of B-Tree', link: 'https://www.geeksforgeeks.org/introduction-of-b-tree-2/' },
];

async function addProblems() {
  const session = driver.session();
  try {
    for (const p of problems) {
      // Find topic node
      const topicRes = await session.run(
        'MATCH (t:Topic) WHERE toLower(t.name) = toLower($topic) RETURN t',
        { topic: p.topic }
      );
      if (topicRes.records.length === 0) {
        console.warn(`Topic not found: ${p.topic}`);
        continue;
      }
      // Optionally, find subtopic node
      let subtopicId = null;
      if (p.subtopic) {
        const subtopicRes = await session.run(
          'MATCH (t:Topic)-[:HAS_SUBTOPIC]->(s:Subtopic) WHERE toLower(t.name) = toLower($topic) AND toLower(s.name) = toLower($subtopic) RETURN s',
          { topic: p.topic, subtopic: p.subtopic }
        );
        if (subtopicRes.records.length > 0) {
          subtopicId = subtopicRes.records[0].get('s').properties.id;
        }
      }
      // Check if problem already exists
      const existsRes = await session.run(
        'MATCH (pr:Problem) WHERE pr.title = $title AND pr.link = $link RETURN pr',
        { title: p.title, link: p.link }
      );
      if (existsRes.records.length > 0) {
        console.log(`Problem already exists: ${p.title}`);
        continue;
      }
      // Create problem node
      const createRes = await session.run(
        'CREATE (pr:Problem {id: apoc.create.uuid(), title: $title, link: $link, subtopic: $subtopic}) RETURN pr',
        { title: p.title, link: p.link, subtopic: p.subtopic || null }
      );
      const problemId = createRes.records[0].get('pr').properties.id;
      // Connect to topic
      await session.run(
        'MATCH (t:Topic), (pr:Problem) WHERE toLower(t.name) = toLower($topic) AND pr.id = $problemId MERGE (t)-[:HAS_PROBLEM]->(pr)',
        { topic: p.topic, problemId }
      );
      // Connect to subtopic if found
      if (subtopicId) {
        await session.run(
          'MATCH (s:Subtopic), (pr:Problem) WHERE s.id = $subtopicId AND pr.id = $problemId MERGE (s)-[:HAS_PROBLEM]->(pr)',
          { subtopicId, problemId }
        );
      }
      console.log(`Added problem: ${p.title} [${p.link}]`);
    }
  } finally {
    await session.close();
    await driver.close();
  }
}

addProblems().catch(console.error); 