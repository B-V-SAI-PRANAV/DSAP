// Cypher script to import resources into Neo4j graph
// Run this script in Neo4j Browser or via Cypher shell

// Clear existing resources (optional - for clean import)
MATCH (r:Resource) DETACH DELETE r;
MATCH (q:Question) DETACH DELETE q;

// Import Resources for Topics
// Arrays Resources
CREATE (r1:Resource {id: 'res_arrays_1', title: 'Arrays Cheatsheet', type: 'Article', link: '/pdfs/arrays-cheatsheet.pdf', qualityScore: 9.0})
CREATE (r2:Resource {id: 'res_arrays_2', title: 'Array Techniques', type: 'Article', link: '/pdfs/array-techniques.pdf', qualityScore: 8.5})
CREATE (r3:Resource {id: 'res_arrays_3', title: 'Array Basics Tutorial', type: 'Video', link: 'https://youtube.com/watch?v=QJ1qKxwUj3I', qualityScore: 9.0})
CREATE (r4:Resource {id: 'res_arrays_4', title: 'Advanced Array Techniques', type: 'Video', link: 'https://youtube.com/watch?v=1pkznPl7hUQ', qualityScore: 8.8})

// Link Arrays Resources to Arrays Topic
MATCH (t:Topic {id: 'arrays'})
CREATE (t)-[:HAS_RESOURCE]->(r1)
CREATE (t)-[:HAS_RESOURCE]->(r2)
CREATE (t)-[:HAS_RESOURCE]->(r3)
CREATE (t)-[:HAS_RESOURCE]->(r4)

// Linked Lists Resources
CREATE (r5:Resource {id: 'res_ll_1', title: 'Linked Lists Cheatsheet', type: 'Article', link: '/pdfs/linked-lists-cheatsheet.pdf', qualityScore: 9.0})
CREATE (r6:Resource {id: 'res_ll_2', title: 'LL Patterns', type: 'Article', link: '/pdfs/ll-patterns.pdf', qualityScore: 8.7})
CREATE (r7:Resource {id: 'res_ll_3', title: 'Linked List Basics', type: 'Video', link: 'https://youtube.com/watch?v=R9PTBwOzceo', qualityScore: 9.2})
CREATE (r8:Resource {id: 'res_ll_4', title: 'Advanced LL Operations', type: 'Video', link: 'https://youtube.com/watch?v=WwfhLC16bis', qualityScore: 8.9})

// Link Linked Lists Resources
MATCH (t:Topic {id: 'linked-lists'})
CREATE (t)-[:HAS_RESOURCE]->(r5)
CREATE (t)-[:HAS_RESOURCE]->(r6)
CREATE (t)-[:HAS_RESOURCE]->(r7)
CREATE (t)-[:HAS_RESOURCE]->(r8)

// Stacks Resources
CREATE (r9:Resource {id: 'res_stacks_1', title: 'Stacks Cheatsheet', type: 'Article', link: '/pdfs/stacks-cheatsheet.pdf', qualityScore: 8.8})
CREATE (r10:Resource {id: 'res_stacks_2', title: 'Monotonic Stack', type: 'Article', link: '/pdfs/monotonic-stack.pdf', qualityScore: 9.1})
CREATE (r11:Resource {id: 'res_stacks_3', title: 'Stack Implementation', type: 'Video', link: 'https://youtube.com/watch?v=0kX6hO8hw3Q', qualityScore: 8.9})
CREATE (r12:Resource {id: 'res_stacks_4', title: 'Monotonic Stack Patterns', type: 'Video', link: 'https://youtube.com/watch?v=zx5Sw9130L4', qualityScore: 9.0})

// Link Stacks Resources
MATCH (t:Topic {id: 'stacks'})
CREATE (t)-[:HAS_RESOURCE]->(r9)
CREATE (t)-[:HAS_RESOURCE]->(r10)
CREATE (t)-[:HAS_RESOURCE]->(r11)
CREATE (t)-[:HAS_RESOURCE]->(r12)

// Queues Resources
CREATE (r13:Resource {id: 'res_queues_1', title: 'Queues Cheatsheet', type: 'Article', link: '/pdfs/queues-cheatsheet.pdf', qualityScore: 8.7})
CREATE (r14:Resource {id: 'res_queues_2', title: 'Priority Queue', type: 'Article', link: '/pdfs/priority-queue.pdf', qualityScore: 9.0})
CREATE (r15:Resource {id: 'res_queues_3', title: 'Queue Implementation', type: 'Video', link: 'https://youtube.com/watch?v=3Et9MrMc02A', qualityScore: 8.8})
CREATE (r16:Resource {id: 'res_queues_4', title: 'Priority Queue Guide', type: 'Video', link: 'https://youtube.com/watch?v=wptevk0flhY', qualityScore: 9.1})

// Link Queues Resources
MATCH (t:Topic {id: 'queues'})
CREATE (t)-[:HAS_RESOURCE]->(r13)
CREATE (t)-[:HAS_RESOURCE]->(r14)
CREATE (t)-[:HAS_RESOURCE]->(r15)
CREATE (t)-[:HAS_RESOURCE]->(r16)

// Trees Resources
CREATE (r17:Resource {id: 'res_trees_1', title: 'Trees Cheatsheet', type: 'Article', link: '/pdfs/trees-cheatsheet.pdf', qualityScore: 9.2})
CREATE (r18:Resource {id: 'res_trees_2', title: 'BST Operations', type: 'Article', link: '/pdfs/bst-operations.pdf', qualityScore: 9.0})
CREATE (r19:Resource {id: 'res_trees_3', title: 'Binary Tree Basics', type: 'Video', link: 'https://youtube.com/watch?v=oSWTXwtMVOE', qualityScore: 9.3})
CREATE (r20:Resource {id: 'res_trees_4', title: 'BST Operations Guide', type: 'Video', link: 'https://youtube.com/watch?v=QN9hnmAgmOc', qualityScore: 9.1})

// Link Trees Resources
MATCH (t:Topic {id: 'trees'})
CREATE (t)-[:HAS_RESOURCE]->(r17)
CREATE (t)-[:HAS_RESOURCE]->(r18)
CREATE (t)-[:HAS_RESOURCE]->(r19)
CREATE (t)-[:HAS_RESOURCE]->(r20)

// Graphs Resources
CREATE (r21:Resource {id: 'res_graphs_1', title: 'Graphs Cheatsheet', type: 'Article', link: '/pdfs/graphs-cheatsheet.pdf', qualityScore: 9.1})
CREATE (r22:Resource {id: 'res_graphs_2', title: 'Graph Algorithms', type: 'Article', link: '/pdfs/graph-algorithms.pdf', qualityScore: 9.3})
CREATE (r23:Resource {id: 'res_graphs_3', title: 'Graph Representation', type: 'Video', link: 'https://youtube.com/watch?v=pcKY4hjDrxk', qualityScore: 9.0})
CREATE (r24:Resource {id: 'res_graphs_4', title: 'Graph Traversal', type: 'Video', link: 'https://youtube.com/watch?v=7fujbpJ0LB4', qualityScore: 9.2})

// Link Graphs Resources
MATCH (t:Topic {id: 'graphs'})
CREATE (t)-[:HAS_RESOURCE]->(r21)
CREATE (t)-[:HAS_RESOURCE]->(r22)
CREATE (t)-[:HAS_RESOURCE]->(r23)
CREATE (t)-[:HAS_RESOURCE]->(r24)

// Hashing Resources
CREATE (r25:Resource {id: 'res_hashing_1', title: 'Hashing Cheatsheet', type: 'Article', link: '/pdfs/hashing-cheatsheet.pdf', qualityScore: 8.9})
CREATE (r26:Resource {id: 'res_hashing_2', title: 'Hash Table Design', type: 'Article', link: '/pdfs/hash-table-design.pdf', qualityScore: 9.1})
CREATE (r27:Resource {id: 'res_hashing_3', title: 'Hash Functions', type: 'Video', link: 'https://youtube.com/watch?v=shs0KM3wKv8', qualityScore: 8.8})
CREATE (r28:Resource {id: 'res_hashing_4', title: 'Hash Table Design', type: 'Video', link: 'https://youtube.com/watch?v=UF9u6SX6FB8', qualityScore: 9.0})

// Link Hashing Resources
MATCH (t:Topic {id: 'hashing'})
CREATE (t)-[:HAS_RESOURCE]->(r25)
CREATE (t)-[:HAS_RESOURCE]->(r26)
CREATE (t)-[:HAS_RESOURCE]->(r27)
CREATE (t)-[:HAS_RESOURCE]->(r28)

// Dynamic Programming Resources
CREATE (r29:Resource {id: 'res_dp_1', title: 'DP Cheatsheet', type: 'Article', link: '/pdfs/dp-cheatsheet.pdf', qualityScore: 9.5})
CREATE (r30:Resource {id: 'res_dp_2', title: 'DP Patterns', type: 'Article', link: '/pdfs/dp-patterns.pdf', qualityScore: 9.3})
CREATE (r31:Resource {id: 'res_dp_3', title: 'DP Memoization', type: 'Video', link: 'https://youtube.com/watch?v=oBt53YbR9Kk', qualityScore: 9.4})
CREATE (r32:Resource {id: 'res_dp_4', title: 'DP Tabulation', type: 'Video', link: 'https://youtube.com/watch?v=Hdr64lKQ3e4', qualityScore: 9.2})

// Link DP Resources
MATCH (t:Topic {id: 'dynamic-programming'})
CREATE (t)-[:HAS_RESOURCE]->(r29)
CREATE (t)-[:HAS_RESOURCE]->(r30)
CREATE (t)-[:HAS_RESOURCE]->(r31)
CREATE (t)-[:HAS_RESOURCE]->(r32)

// Greedy Algorithms Resources
CREATE (r33:Resource {id: 'res_greedy_1', title: 'Greedy Cheatsheet', type: 'Article', link: '/pdfs/greedy-cheatsheet.pdf', qualityScore: 8.8})
CREATE (r34:Resource {id: 'res_greedy_2', title: 'Greedy Patterns', type: 'Article', link: '/pdfs/greedy-patterns.pdf', qualityScore: 9.0})
CREATE (r35:Resource {id: 'res_greedy_3', title: 'Greedy Patterns', type: 'Video', link: 'https://youtube.com/watch?v=ARvQcqJ_-NY', qualityScore: 8.9})
CREATE (r36:Resource {id: 'res_greedy_4', title: 'Greedy Scheduling', type: 'Video', link: 'https://youtube.com/watch?v=2Uq7p7HE0TI', qualityScore: 9.1})

// Link Greedy Resources
MATCH (t:Topic {id: 'greedy-algorithms'})
CREATE (t)-[:HAS_RESOURCE]->(r33)
CREATE (t)-[:HAS_RESOURCE]->(r34)
CREATE (t)-[:HAS_RESOURCE]->(r35)
CREATE (t)-[:HAS_RESOURCE]->(r36)

// Divide and Conquer Resources
CREATE (r37:Resource {id: 'res_divide_1', title: 'Divide & Conquer Cheatsheet', type: 'Article', link: '/pdfs/divide-conquer-cheatsheet.pdf', qualityScore: 8.9})
CREATE (r38:Resource {id: 'res_divide_2', title: 'Recursion Patterns', type: 'Article', link: '/pdfs/recursion-patterns.pdf', qualityScore: 9.1})
CREATE (r39:Resource {id: 'res_divide_3', title: 'Recursion Basics', type: 'Video', link: 'https://youtube.com/watch?v=P6RZZMu_maU', qualityScore: 9.0})
CREATE (r40:Resource {id: 'res_divide_4', title: 'Binary Search Guide', type: 'Video', link: 'https://youtube.com/watch?v=7h1s2SojIRw', qualityScore: 9.2})

// Link Divide and Conquer Resources
MATCH (t:Topic {id: 'divide-and-conquer'})
CREATE (t)-[:HAS_RESOURCE]->(r37)
CREATE (t)-[:HAS_RESOURCE]->(r38)
CREATE (t)-[:HAS_RESOURCE]->(r39)
CREATE (t)-[:HAS_RESOURCE]->(r40)

// Backtracking Resources
CREATE (r41:Resource {id: 'res_backtrack_1', title: 'Backtracking Cheatsheet', type: 'Article', link: '/pdfs/backtracking-cheatsheet.pdf', qualityScore: 9.0})
CREATE (r42:Resource {id: 'res_backtrack_2', title: 'State Space Search', type: 'Article', link: '/pdfs/state-space-search.pdf', qualityScore: 9.2})
CREATE (r43:Resource {id: 'res_backtrack_3', title: 'Backtracking Patterns', type: 'Video', link: 'https://youtube.com/watch?v=s9fokUqJ76A', qualityScore: 9.1})
CREATE (r44:Resource {id: 'res_backtrack_4', title: 'Permutation Combination', type: 'Video', link: 'https://youtube.com/watch?v=0DeznFqrgAI', qualityScore: 9.0})

// Link Backtracking Resources
MATCH (t:Topic {id: 'backtracking'})
CREATE (t)-[:HAS_RESOURCE]->(r41)
CREATE (t)-[:HAS_RESOURCE]->(r42)
CREATE (t)-[:HAS_RESOURCE]->(r43)
CREATE (t)-[:HAS_RESOURCE]->(r44)

// Advanced Topics Resources
CREATE (r45:Resource {id: 'res_advanced_1', title: 'Advanced Algorithms', type: 'Article', link: '/pdfs/advanced-algorithms.pdf', qualityScore: 9.4})
CREATE (r46:Resource {id: 'res_advanced_2', title: 'Competitive Programming', type: 'Article', link: '/pdfs/competitive-programming.pdf', qualityScore: 9.5})
CREATE (r47:Resource {id: 'res_advanced_3', title: 'Advanced Topics', type: 'Video', link: 'https://youtube.com/watch?v=8hHWpuAPBQo', qualityScore: 9.3})
CREATE (r48:Resource {id: 'res_advanced_4', title: 'Competitive Programming', type: 'Video', link: 'https://youtube.com/watch?v=WwfhLC16bis', qualityScore: 9.4})

// Link Advanced Topics Resources
MATCH (t:Topic {id: 'advanced-topics'})
CREATE (t)-[:HAS_RESOURCE]->(r45)
CREATE (t)-[:HAS_RESOURCE]->(r46)
CREATE (t)-[:HAS_RESOURCE]->(r47)
CREATE (t)-[:HAS_RESOURCE]->(r48)

// Import Questions for Topics
// Arrays Questions
CREATE (q1:Question {id: 'q_arrays_1', title: 'Two Sum', difficulty: 'Easy', leetcodeId: 1, leetcodeLink: 'https://leetcode.com/problems/two-sum/', timeComplexity: 'O(n)', spaceComplexity: 'O(n)'})
CREATE (q2:Question {id: 'q_arrays_2', title: 'Maximum Subarray', difficulty: 'Medium', leetcodeId: 53, leetcodeLink: 'https://leetcode.com/problems/maximum-subarray/', timeComplexity: 'O(n)', spaceComplexity: 'O(1)'})
CREATE (q3:Question {id: 'q_arrays_3', title: 'Container With Most Water', difficulty: 'Medium', leetcodeId: 11, leetcodeLink: 'https://leetcode.com/problems/container-with-most-water/', timeComplexity: 'O(n)', spaceComplexity: 'O(1)'})
CREATE (q4:Question {id: 'q_arrays_4', title: 'Trapping Rain Water', difficulty: 'Hard', leetcodeId: 42, leetcodeLink: 'https://leetcode.com/problems/trapping-rain-water/', timeComplexity: 'O(n)', spaceComplexity: 'O(1)'})

// Link Arrays Questions
MATCH (t:Topic {id: 'arrays'})
CREATE (t)-[:HAS_QUESTION]->(q1)
CREATE (t)-[:HAS_QUESTION]->(q2)
CREATE (t)-[:HAS_QUESTION]->(q3)
CREATE (t)-[:HAS_QUESTION]->(q4)

// Linked Lists Questions
CREATE (q5:Question {id: 'q_ll_1', title: 'Reverse Linked List', difficulty: 'Easy', leetcodeId: 206, leetcodeLink: 'https://leetcode.com/problems/reverse-linked-list/', timeComplexity: 'O(n)', spaceComplexity: 'O(1)'})
CREATE (q6:Question {id: 'q_ll_2', title: 'Linked List Cycle', difficulty: 'Easy', leetcodeId: 141, leetcodeLink: 'https://leetcode.com/problems/linked-list-cycle/', timeComplexity: 'O(n)', spaceComplexity: 'O(1)'})
CREATE (q7:Question {id: 'q_ll_3', title: 'Merge Two Sorted Lists', difficulty: 'Easy', leetcodeId: 21, leetcodeLink: 'https://leetcode.com/problems/merge-two-sorted-lists/', timeComplexity: 'O(n+m)', spaceComplexity: 'O(1)'})
CREATE (q8:Question {id: 'q_ll_4', title: 'Remove Nth Node From End of List', difficulty: 'Medium', leetcodeId: 19, leetcodeLink: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', timeComplexity: 'O(n)', spaceComplexity: 'O(1)'})

// Link Linked Lists Questions
MATCH (t:Topic {id: 'linked-lists'})
CREATE (t)-[:HAS_QUESTION]->(q5)
CREATE (t)-[:HAS_QUESTION]->(q6)
CREATE (t)-[:HAS_QUESTION]->(q7)
CREATE (t)-[:HAS_QUESTION]->(q8)

// Stacks Questions
CREATE (q9:Question {id: 'q_stacks_1', title: 'Valid Parentheses', difficulty: 'Easy', leetcodeId: 20, leetcodeLink: 'https://leetcode.com/problems/valid-parentheses/', timeComplexity: 'O(n)', spaceComplexity: 'O(n)'})
CREATE (q10:Question {id: 'q_stacks_2', title: 'Min Stack', difficulty: 'Medium', leetcodeId: 155, leetcodeLink: 'https://leetcode.com/problems/min-stack/', timeComplexity: 'O(1)', spaceComplexity: 'O(n)'})
CREATE (q11:Question {id: 'q_stacks_3', title: 'Evaluate Reverse Polish Notation', difficulty: 'Medium', leetcodeId: 150, leetcodeLink: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', timeComplexity: 'O(n)', spaceComplexity: 'O(n)'})
CREATE (q12:Question {id: 'q_stacks_4', title: 'Daily Temperatures', difficulty: 'Medium', leetcodeId: 739, leetcodeLink: 'https://leetcode.com/problems/daily-temperatures/', timeComplexity: 'O(n)', spaceComplexity: 'O(n)'})

// Link Stacks Questions
MATCH (t:Topic {id: 'stacks'})
CREATE (t)-[:HAS_QUESTION]->(q9)
CREATE (t)-[:HAS_QUESTION]->(q10)
CREATE (t)-[:HAS_QUESTION]->(q11)
CREATE (t)-[:HAS_QUESTION]->(q12)

// Continue with more questions for other topics...
// (Adding a few more key questions for brevity)

// Trees Questions
CREATE (q13:Question {id: 'q_trees_1', title: 'Binary Tree Inorder Traversal', difficulty: 'Easy', leetcodeId: 94, leetcodeLink: 'https://leetcode.com/problems/binary-tree-inorder-traversal/', timeComplexity: 'O(n)', spaceComplexity: 'O(n)'})
CREATE (q14:Question {id: 'q_trees_2', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', leetcodeId: 104, leetcodeLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', timeComplexity: 'O(n)', spaceComplexity: 'O(h)'})

// Link Trees Questions
MATCH (t:Topic {id: 'trees'})
CREATE (t)-[:HAS_QUESTION]->(q13)
CREATE (t)-[:HAS_QUESTION]->(q14)

// Dynamic Programming Questions
CREATE (q15:Question {id: 'q_dp_1', title: 'Climbing Stairs', difficulty: 'Easy', leetcodeId: 70, leetcodeLink: 'https://leetcode.com/problems/climbing-stairs/', timeComplexity: 'O(n)', spaceComplexity: 'O(1)'})
CREATE (q16:Question {id: 'q_dp_2', title: 'Coin Change', difficulty: 'Medium', leetcodeId: 322, leetcodeLink: 'https://leetcode.com/problems/coin-change/', timeComplexity: 'O(amount * coins)', spaceComplexity: 'O(amount)'})

// Link DP Questions
MATCH (t:Topic {id: 'dynamic-programming'})
CREATE (t)-[:HAS_QUESTION]->(q15)
CREATE (t)-[:HAS_QUESTION]->(q16)

// Create Subtopics and link them to topics
CREATE (s1:Subtopic {id: 'sub_arrays_0', name: '1D Arrays', difficultyScore: 0.2, estimatedTimeMins: 30})
CREATE (s2:Subtopic {id: 'sub_arrays_1', name: '2D Arrays', difficultyScore: 0.3, estimatedTimeMins: 45})
CREATE (s3:Subtopic {id: 'sub_arrays_2', name: 'Dynamic Arrays', difficultyScore: 0.4, estimatedTimeMins: 45})
CREATE (s4:Subtopic {id: 'sub_linked_lists_0', name: 'Singly Linked List', difficultyScore: 0.3, estimatedTimeMins: 60})
CREATE (s5:Subtopic {id: 'sub_linked_lists_1', name: 'Doubly Linked List', difficultyScore: 0.4, estimatedTimeMins: 90})

// Link Subtopics to Topics
MATCH (t:Topic {id: 'arrays'})
CREATE (t)-[:HAS_SUBTOPIC]->(s1)
CREATE (t)-[:HAS_SUBTOPIC]->(s2)
CREATE (t)-[:HAS_SUBTOPIC]->(s3)

MATCH (t:Topic {id: 'linked-lists'})
CREATE (t)-[:HAS_SUBTOPIC]->(s4)
CREATE (t)-[:HAS_SUBTOPIC]->(s5)

// Add prerequisite relationships (REQUIRES)
MATCH (t1:Topic {id: 'arrays'}), (t2:Topic {id: 'hashing'})
CREATE (t2)-[:REQUIRES]->(t1)

MATCH (t1:Topic {id: 'arrays'}), (t2:Topic {id: 'linked-lists'})
CREATE (t2)-[:REQUIRES]->(t1)

MATCH (t1:Topic {id: 'trees'}), (t2:Topic {id: 'graphs'})
CREATE (t2)-[:REQUIRES]->(t1)

MATCH (t1:Topic {id: 'arrays'}), (t2:Topic {id: 'stacks'})
CREATE (t2)-[:REQUIRES]->(t1)

MATCH (t1:Topic {id: 'arrays'}), (t2:Topic {id: 'queues'})
CREATE (t2)-[:REQUIRES]->(t1)

MATCH (t1:Topic {id: 'stacks'}), (t2:Topic {id: 'queues'})
CREATE (t2)-[:REQUIRES]->(t1)

MATCH (t1:Topic {id: 'linked-lists'}), (t2:Topic {id: 'trees'})
CREATE (t2)-[:REQUIRES]->(t1)

MATCH (t1:Topic {id: 'hashing'}), (t2:Topic {id: 'dynamic-programming'})
CREATE (t2)-[:REQUIRES]->(t1)

MATCH (t1:Topic {id: 'divide-and-conquer'}), (t2:Topic {id: 'dynamic-programming'})
CREATE (t2)-[:REQUIRES]->(t1)

MATCH (t1:Topic {id: 'greedy-algorithms'}), (t2:Topic {id: 'backtracking'})
CREATE (t2)-[:REQUIRES]->(t1)

MATCH (t1:Topic {id: 'backtracking'}), (t2:Topic {id: 'advanced-topics'})
CREATE (t2)-[:REQUIRES]->(t1)

// Add NEXT_TOPIC relationships for learning flow
MATCH (t1:Topic {id: 'arrays'}), (t2:Topic {id: 'linked-lists'})
CREATE (t1)-[:NEXT_TOPIC]->(t2)

MATCH (t1:Topic {id: 'linked-lists'}), (t2:Topic {id: 'stacks'})
CREATE (t1)-[:NEXT_TOPIC]->(t2)

MATCH (t1:Topic {id: 'stacks'}), (t2:Topic {id: 'queues'})
CREATE (t1)-[:NEXT_TOPIC]->(t2)

MATCH (t1:Topic {id: 'queues'}), (t2:Topic {id: 'trees'})
CREATE (t1)-[:NEXT_TOPIC]->(t2)

MATCH (t1:Topic {id: 'trees'}), (t2:Topic {id: 'graphs'})
CREATE (t1)-[:NEXT_TOPIC]->(t2)

MATCH (t1:Topic {id: 'graphs'}), (t2:Topic {id: 'hashing'})
CREATE (t1)-[:NEXT_TOPIC]->(t2)

MATCH (t1:Topic {id: 'hashing'}), (t2:Topic {id: 'divide-and-conquer'})
CREATE (t1)-[:NEXT_TOPIC]->(t2)

MATCH (t1:Topic {id: 'divide-and-conquer'}), (t2:Topic {id: 'dynamic-programming'})
CREATE (t1)-[:NEXT_TOPIC]->(t2)

MATCH (t1:Topic {id: 'dynamic-programming'}), (t2:Topic {id: 'greedy-algorithms'})
CREATE (t1)-[:NEXT_TOPIC]->(t2)

MATCH (t1:Topic {id: 'greedy-algorithms'}), (t2:Topic {id: 'backtracking'})
CREATE (t1)-[:NEXT_TOPIC]->(t2)

MATCH (t1:Topic {id: 'backtracking'}), (t2:Topic {id: 'advanced-topics'})
CREATE (t1)-[:NEXT_TOPIC]->(t2)

// Return summary
RETURN 'Resources and Questions imported successfully!' as message,
       count(DISTINCT r) as resources_created,
       count(DISTINCT q) as questions_created,
       count(DISTINCT s) as subtopics_created; 