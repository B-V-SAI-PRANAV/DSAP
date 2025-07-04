// FileName: MultipleFiles/neo4j.service.ts
import neo4j, { Driver, Record } from 'neo4j-driver';
import { config } from 'dotenv';

config();

// Mock data for development - updated to match your graph schema
const mockTopics: any[] = [
  {
    id: 'arrays',
    name: 'Arrays',
    description: 'Collection of elements identified by index or key',
    difficultyScore: 0.3,
    isCore: true,
    estimatedTimeMins: 120,
    weight: 0.9,
    priority: 1,
    tags: ['basic', 'linear'],
    category: 'Data Structures',
    quizThreshold: 70, // 70%
    quizQuestions: [
      { id: 'qz_arrays_1', question: 'What is the time complexity of accessing an element in an array by index?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_arrays_2', question: 'Which of the following is a fixed-size data structure?', options: ['Array', 'Linked List', 'Stack', 'Queue'], correctAnswer: 'Array' },
      { id: 'qz_arrays_3', question: 'What is the time complexity of inserting an element at the beginning of an array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_arrays_4', question: 'What is the time complexity of searching for an element in an unsorted array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_arrays_5', question: 'What is the time complexity of searching for an element in a sorted array using binary search?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(log n)' },
      { id: 'qz_arrays_6', question: 'What is the space complexity of an array with n elements?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_arrays_7', question: 'Which array operation has the highest time complexity?', options: ['Access by index', 'Insert at end', 'Delete from beginning', 'Search element'], correctAnswer: 'Delete from beginning' },
      { id: 'qz_arrays_8', question: 'What is a 2D array?', options: ['Array of arrays', 'Array with 2 elements', 'Array with 2 dimensions', 'All of the above'], correctAnswer: 'Array of arrays' },
      { id: 'qz_arrays_9', question: 'What is the time complexity of traversing all elements in an array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_arrays_10', question: 'Which data structure is most similar to an array?', options: ['Linked List', 'Stack', 'Queue', 'Tree'], correctAnswer: 'Linked List' },
      { id: 'qz_arrays_11', question: 'What is the main advantage of arrays over linked lists?', options: ['Dynamic size', 'Random access', 'Memory efficiency', 'Easy insertion'], correctAnswer: 'Random access' },
      { id: 'qz_arrays_12', question: 'What is the main disadvantage of arrays?', options: ['Fixed size', 'Complex implementation', 'High memory usage', 'Slow access'], correctAnswer: 'Fixed size' },
      { id: 'qz_arrays_13', question: 'What is the time complexity of copying an array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_arrays_14', question: 'Which sorting algorithm works best on arrays?', options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'All of the above'], correctAnswer: 'All of the above' },
      { id: 'qz_arrays_15', question: 'What is the time complexity of reversing an array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_arrays_16', question: 'What is a dynamic array?', options: ['Array that grows automatically', 'Array with variable elements', 'Array that shrinks automatically', 'Array with dynamic types'], correctAnswer: 'Array that grows automatically' },
      { id: 'qz_arrays_17', question: 'What is the amortized time complexity of inserting at the end of a dynamic array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_arrays_18', question: 'What is the worst-case time complexity of inserting at the end of a dynamic array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_arrays_19', question: 'Which of the following is NOT a valid array operation?', options: ['Access by index', 'Insert at position', 'Delete from position', 'Access by key'], correctAnswer: 'Access by key' },
      { id: 'qz_arrays_20', question: 'What is the time complexity of finding the maximum element in an unsorted array?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' }
    ],
    problems: [
      { id: '1', title: 'Two Sum', difficulty: 'Easy', leetcodeId: 1, leetcodeLink: 'https://leetcode.com/problems/two-sum/' },
      { id: '2', title: 'Maximum Subarray', difficulty: 'Medium', leetcodeId: 53, leetcodeLink: 'https://leetcode.com/problems/maximum-subarray/' }
    ],
    prerequisites: []
  },
  {
    id: 'linked-lists',
    name: 'Linked Lists',
    description: 'Linear collection of data elements',
    difficultyScore: 0.4,
    isCore: true,
    estimatedTimeMins: 150,
    weight: 0.85,
    priority: 2,
    tags: ['linear', 'dynamic'],
    category: 'Data Structures',
    quizThreshold: 70, // 70%
    quizQuestions: [
      { id: 'qz_linkedlists_1', question: 'What is the main advantage of a linked list over an array?', options: ['Dynamic size', 'Faster access', 'Less memory', 'None'], correctAnswer: 'Dynamic size' },
      { id: 'qz_linkedlists_2', question: 'Which linked list allows traversal in both directions?', options: ['Singly', 'Doubly', 'Circular', 'None'], correctAnswer: 'Doubly' },
      { id: 'qz_linkedlists_3', question: 'What is the time complexity of accessing an element in a linked list?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_linkedlists_4', question: 'What is the time complexity of inserting at the beginning of a linked list?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_linkedlists_5', question: 'What is the time complexity of inserting at the end of a linked list?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_linkedlists_6', question: 'What is the time complexity of deleting from the beginning of a linked list?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_linkedlists_7', question: 'What is the time complexity of searching in a linked list?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_linkedlists_8', question: 'What is a circular linked list?', options: ['Last node points to first', 'First node points to last', 'All nodes point to each other', 'None'], correctAnswer: 'Last node points to first' },
      { id: 'qz_linkedlists_9', question: 'What is the space complexity of a linked list with n nodes?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_linkedlists_10', question: 'What is the main disadvantage of linked lists?', options: ['No random access', 'Extra memory for pointers', 'Complex implementation', 'All of the above'], correctAnswer: 'All of the above' },
      { id: 'qz_linkedlists_11', question: 'What is the time complexity of reversing a linked list?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_linkedlists_12', question: 'What is the time complexity of finding the middle node in a linked list?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_linkedlists_13', question: 'What is the time complexity of detecting a cycle in a linked list?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_linkedlists_14', question: 'What is the time complexity of merging two sorted linked lists?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_linkedlists_15', question: 'What is the time complexity of removing duplicates from a linked list?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_linkedlists_16', question: 'What is the time complexity of finding the nth node from the end?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_linkedlists_17', question: 'What is the time complexity of checking if a linked list is palindrome?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_linkedlists_18', question: 'What is the time complexity of sorting a linked list?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_linkedlists_19', question: 'What is the time complexity of copying a linked list?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_linkedlists_20', question: 'What is the time complexity of finding the intersection of two linked lists?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n)' }
    ],
    problems: [
      { id: '3', title: 'Reverse Linked List', difficulty: 'Easy', leetcodeId: 206, leetcodeLink: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: '4', title: 'Detect Cycle', difficulty: 'Medium', leetcodeId: 141, leetcodeLink: 'https://leetcode.com/problems/linked-list-cycle/' }
    ],
    prerequisites: ['arrays']
  },
  {
    id: 'stacks',
    name: 'Stacks',
    description: 'LIFO (Last In First Out) data structure',
    difficultyScore: 0.4,
    isCore: true,
    estimatedTimeMins: 90,
    weight: 0.8,
    priority: 3,
    tags: ['lifo', 'linear'],
    category: 'Data Structures',
    quizThreshold: 70,
    quizQuestions: [
      { id: 'qz_stacks_1', question: 'What does LIFO stand for in stack?', options: ['Last In First Out', 'Last In Last Out', 'First In First Out', 'First In Last Out'], correctAnswer: 'Last In First Out' },
      { id: 'qz_stacks_2', question: 'What is the time complexity of push operation in a stack?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_stacks_3', question: 'What is the time complexity of pop operation in a stack?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_stacks_4', question: 'What is the time complexity of peek operation in a stack?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_stacks_5', question: 'What is the time complexity of checking if stack is empty?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_stacks_6', question: 'What is the space complexity of a stack with n elements?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_stacks_7', question: 'Which operation is NOT allowed in a stack?', options: ['Push', 'Pop', 'Peek', 'Access middle element'], correctAnswer: 'Access middle element' },
      { id: 'qz_stacks_8', question: 'What is stack overflow?', options: ['Stack is full', 'Stack is empty', 'Stack has too many elements', 'Stack is corrupted'], correctAnswer: 'Stack is full' },
      { id: 'qz_stacks_9', question: 'What is stack underflow?', options: ['Stack is full', 'Stack is empty', 'Stack has too many elements', 'Stack is corrupted'], correctAnswer: 'Stack is empty' },
      { id: 'qz_stacks_10', question: 'Which data structure is most similar to a stack?', options: ['Queue', 'Array', 'Linked List', 'Tree'], correctAnswer: 'Array' },
      { id: 'qz_stacks_11', question: 'What is the main application of stacks?', options: ['Function calls', 'Data storage', 'Sorting', 'Searching'], correctAnswer: 'Function calls' },
      { id: 'qz_stacks_12', question: 'What is the time complexity of reversing a string using stack?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_stacks_13', question: 'What is the time complexity of checking balanced parentheses using stack?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_stacks_14', question: 'What is the time complexity of converting infix to postfix using stack?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_stacks_15', question: 'What is the time complexity of evaluating postfix expression using stack?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_stacks_16', question: 'What is the time complexity of implementing undo functionality using stack?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_stacks_17', question: 'What is the time complexity of implementing browser back button using stack?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_stacks_18', question: 'What is the time complexity of implementing depth-first search using stack?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_stacks_19', question: 'What is the time complexity of implementing recursive functions using stack?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_stacks_20', question: 'What is the time complexity of implementing tower of hanoi using stack?', options: ['O(1)', 'O(n)', 'O(2^n)', 'O(n^2)'], correctAnswer: 'O(2^n)' }
    ],
    problems: [
      { id: '5', title: 'Valid Parentheses', difficulty: 'Easy', leetcodeId: 20, leetcodeLink: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: '6', title: 'Min Stack', difficulty: 'Medium', leetcodeId: 155, leetcodeLink: 'https://leetcode.com/problems/min-stack/' }
    ],
    prerequisites: ['arrays']
  },
  {
    id: 'queues',
    name: 'Queues',
    description: 'FIFO (First In First Out) data structure',
    difficultyScore: 0.4,
    isCore: true,
    estimatedTimeMins: 90,
    weight: 0.8,
    priority: 4,
    tags: ['fifo', 'linear'],
    category: 'Data Structures',
    quizThreshold: 70,
    quizQuestions: [
      { id: 'qz_queues_1', question: 'What does FIFO stand for in queue?', options: ['First In First Out', 'First In Last Out', 'Last In First Out', 'Last In Last Out'], correctAnswer: 'First In First Out' },
      { id: 'qz_queues_2', question: 'What is the time complexity of enqueue operation in a queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_queues_3', question: 'What is the time complexity of dequeue operation in a queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_queues_4', question: 'What is the time complexity of front operation in a queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_queues_5', question: 'What is the time complexity of checking if queue is empty?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_queues_6', question: 'What is the space complexity of a queue with n elements?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_queues_7', question: 'Which operation is NOT allowed in a queue?', options: ['Enqueue', 'Dequeue', 'Front', 'Access middle element'], correctAnswer: 'Access middle element' },
      { id: 'qz_queues_8', question: 'What is queue overflow?', options: ['Queue is full', 'Queue is empty', 'Queue has too many elements', 'Queue is corrupted'], correctAnswer: 'Queue is full' },
      { id: 'qz_queues_9', question: 'What is queue underflow?', options: ['Queue is full', 'Queue is empty', 'Queue has too many elements', 'Queue is corrupted'], correctAnswer: 'Queue is empty' },
      { id: 'qz_queues_10', question: 'Which data structure is most similar to a queue?', options: ['Stack', 'Array', 'Linked List', 'Tree'], correctAnswer: 'Linked List' },
      { id: 'qz_queues_11', question: 'What is the main application of queues?', options: ['Task scheduling', 'Data storage', 'Sorting', 'Searching'], correctAnswer: 'Task scheduling' },
      { id: 'qz_queues_12', question: 'What is the time complexity of implementing breadth-first search using queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_queues_13', question: 'What is the time complexity of implementing level-order traversal using queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_queues_14', question: 'What is the time complexity of implementing round-robin scheduling using queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_queues_15', question: 'What is the time complexity of implementing printer spooling using queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_queues_16', question: 'What is the time complexity of implementing message queuing using queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_queues_17', question: 'What is the time complexity of implementing event handling using queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_queues_18', question: 'What is the time complexity of implementing buffer management using queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_queues_19', question: 'What is the time complexity of implementing cache replacement using queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_queues_20', question: 'What is the time complexity of implementing job scheduling using queue?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' }
    ],
    problems: [
      { id: '7', title: 'Implement Queue using Stacks', difficulty: 'Medium', leetcodeId: 232, leetcodeLink: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
      { id: '8', title: 'Circular Queue', difficulty: 'Medium', leetcodeId: 622, leetcodeLink: 'https://leetcode.com/problems/design-circular-queue/' }
    ],
    prerequisites: ['arrays']
  },
  {
    id: 'trees',
    name: 'Trees',
    description: 'Hierarchical data structure with nodes and edges',
    difficultyScore: 0.6,
    isCore: true,
    estimatedTimeMins: 180,
    weight: 0.9,
    priority: 5,
    tags: ['hierarchical', 'non-linear'],
    category: 'Data Structures',
    quizThreshold: 70,
    quizQuestions: [
      { id: 'qz_trees_1', question: 'What is a tree data structure?', options: ['Hierarchical structure', 'Linear structure', 'Circular structure', 'Random structure'], correctAnswer: 'Hierarchical structure' },
      { id: 'qz_trees_2', question: 'What is the root node in a tree?', options: ['Topmost node', 'Bottommost node', 'Middle node', 'Any node'], correctAnswer: 'Topmost node' },
      { id: 'qz_trees_3', question: 'What is a leaf node in a tree?', options: ['Node with no children', 'Node with children', 'Root node', 'Any node'], correctAnswer: 'Node with no children' },
      { id: 'qz_trees_4', question: 'What is the height of a tree?', options: ['Number of nodes', 'Number of edges', 'Longest path from root to leaf', 'Shortest path from root to leaf'], correctAnswer: 'Longest path from root to leaf' },
      { id: 'qz_trees_5', question: 'What is the depth of a node in a tree?', options: ['Number of children', 'Number of ancestors', 'Distance from root', 'Distance from leaves'], correctAnswer: 'Distance from root' },
      { id: 'qz_trees_6', question: 'What is the time complexity of searching in a binary search tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(log n)' },
      { id: 'qz_trees_7', question: 'What is the time complexity of inserting in a binary search tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(log n)' },
      { id: 'qz_trees_8', question: 'What is the time complexity of deleting from a binary search tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(log n)' },
      { id: 'qz_trees_9', question: 'What is the space complexity of a tree with n nodes?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_trees_10', question: 'What is the time complexity of traversing all nodes in a tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_trees_11', question: 'What is the time complexity of finding the height of a tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_trees_12', question: 'What is the time complexity of finding the size of a tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_trees_13', question: 'What is the time complexity of checking if a tree is balanced?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_trees_14', question: 'What is the time complexity of checking if a tree is complete?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_trees_15', question: 'What is the time complexity of checking if a tree is full?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_trees_16', question: 'What is the time complexity of checking if a tree is perfect?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_trees_17', question: 'What is the time complexity of finding the lowest common ancestor?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_trees_18', question: 'What is the time complexity of finding the diameter of a tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_trees_19', question: 'What is the time complexity of serializing a tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_trees_20', question: 'What is the time complexity of deserializing a tree?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' }
    ],
    problems: [
      { id: '9', title: 'Maximum Depth of Binary Tree', difficulty: 'Easy', leetcodeId: 104, leetcodeLink: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
      { id: '10', title: 'Validate Binary Search Tree', difficulty: 'Medium', leetcodeId: 98, leetcodeLink: 'https://leetcode.com/problems/validate-binary-search-tree/' }
    ],
    prerequisites: ['linked-lists']
  },
  {
    id: 'graphs',
    name: 'Graphs',
    description: 'Collection of nodes connected by edges',
    difficultyScore: 0.7,
    isCore: true,
    estimatedTimeMins: 240,
    weight: 0.85,
    priority: 6,
    tags: ['non-linear', 'connectivity'],
    category: 'Data Structures',
    quizThreshold: 70,
    quizQuestions: [
      { id: 'qz_graphs_1', question: 'What is a graph data structure?', options: ['Collection of nodes and edges', 'Linear structure', 'Hierarchical structure', 'Circular structure'], correctAnswer: 'Collection of nodes and edges' },
      { id: 'qz_graphs_2', question: 'What is a vertex in a graph?', options: ['Node', 'Edge', 'Path', 'Cycle'], correctAnswer: 'Node' },
      { id: 'qz_graphs_3', question: 'What is an edge in a graph?', options: ['Connection between vertices', 'Vertex', 'Path', 'Cycle'], correctAnswer: 'Connection between vertices' },
      { id: 'qz_graphs_4', question: 'What is a directed graph?', options: ['Edges have direction', 'Edges have no direction', 'Graph with cycles', 'Graph without cycles'], correctAnswer: 'Edges have direction' },
      { id: 'qz_graphs_5', question: 'What is an undirected graph?', options: ['Edges have direction', 'Edges have no direction', 'Graph with cycles', 'Graph without cycles'], correctAnswer: 'Edges have no direction' },
      { id: 'qz_graphs_6', question: 'What is the time complexity of depth-first search?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_graphs_7', question: 'What is the time complexity of breadth-first search?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_graphs_8', question: 'What is the time complexity of Dijkstra\'s algorithm?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_graphs_9', question: 'What is the time complexity of Bellman-Ford algorithm?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n^2)' },
      { id: 'qz_graphs_10', question: 'What is the time complexity of Floyd-Warshall algorithm?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^3)'], correctAnswer: 'O(n^3)' },
      { id: 'qz_graphs_11', question: 'What is the time complexity of topological sort?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_graphs_12', question: 'What is the time complexity of finding strongly connected components?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_graphs_13', question: 'What is the time complexity of finding minimum spanning tree?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_graphs_14', question: 'What is the time complexity of finding shortest path?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_graphs_15', question: 'What is the time complexity of detecting cycles in a graph?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_graphs_16', question: 'What is the time complexity of finding articulation points?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_graphs_17', question: 'What is the time complexity of finding bridges?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_graphs_18', question: 'What is the time complexity of finding Eulerian path?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_graphs_19', question: 'What is the time complexity of finding Hamiltonian path?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n!)'], correctAnswer: 'O(n!)' },
      { id: 'qz_graphs_20', question: 'What is the time complexity of graph coloring?', options: ['O(1)', 'O(n)', 'O(n log n)', 'O(n^2)'], correctAnswer: 'O(n^2)' }
    ],
    problems: [
      { id: '11', title: 'Number of Islands', difficulty: 'Medium', leetcodeId: 200, leetcodeLink: 'https://leetcode.com/problems/number-of-islands/' },
      { id: '12', title: 'Course Schedule', difficulty: 'Medium', leetcodeId: 207, leetcodeLink: 'https://leetcode.com/problems/course-schedule/' }
    ],
    prerequisites: ['trees']
  },
  {
    id: 'hashing',
    name: 'Hashing',
    description: 'Technique to map data to fixed-size values',
    difficultyScore: 0.5,
    isCore: true,
    estimatedTimeMins: 120,
    weight: 0.8,
    priority: 7,
    tags: ['mapping', 'search'],
    category: 'Algorithmic Techniques',
    quizThreshold: 70,
    quizQuestions: [
      { id: 'qz_hashing_1', question: 'What is a hash function?', options: ['Function that maps data to fixed-size values', 'Function that sorts data', 'Function that searches data', 'Function that encrypts data'], correctAnswer: 'Function that maps data to fixed-size values' },
      { id: 'qz_hashing_2', question: 'What is the main purpose of hashing?', options: ['Fast data retrieval', 'Data compression', 'Data encryption', 'Data sorting'], correctAnswer: 'Fast data retrieval' },
      { id: 'qz_hashing_3', question: 'What is the time complexity of searching in a hash table?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_hashing_4', question: 'What is the time complexity of inserting in a hash table?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_hashing_5', question: 'What is the time complexity of deleting from a hash table?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_hashing_6', question: 'What is a hash collision?', options: ['Two keys map to same hash value', 'Hash function fails', 'Hash table is full', 'Hash table is empty'], correctAnswer: 'Two keys map to same hash value' },
      { id: 'qz_hashing_7', question: 'What is chaining in hash tables?', options: ['Using linked lists for collisions', 'Using arrays for collisions', 'Using trees for collisions', 'Using stacks for collisions'], correctAnswer: 'Using linked lists for collisions' },
      { id: 'qz_hashing_8', question: 'What is open addressing in hash tables?', options: ['Finding next available slot', 'Using linked lists', 'Using trees', 'Using arrays'], correctAnswer: 'Finding next available slot' },
      { id: 'qz_hashing_9', question: 'What is linear probing?', options: ['Check next slot sequentially', 'Check random slot', 'Check previous slot', 'Check diagonal slot'], correctAnswer: 'Check next slot sequentially' },
      { id: 'qz_hashing_10', question: 'What is quadratic probing?', options: ['Check slots with quadratic increments', 'Check next slot', 'Check random slot', 'Check previous slot'], correctAnswer: 'Check slots with quadratic increments' },
      { id: 'qz_hashing_11', question: 'What is double hashing?', options: ['Use second hash function for probing', 'Use two hash tables', 'Use two keys', 'Use two values'], correctAnswer: 'Use second hash function for probing' },
      { id: 'qz_hashing_12', question: 'What is the load factor of a hash table?', options: ['Number of elements / size of table', 'Size of table / number of elements', 'Number of collisions', 'Number of empty slots'], correctAnswer: 'Number of elements / size of table' },
      { id: 'qz_hashing_13', question: 'What happens when load factor is too high?', options: ['Performance degrades', 'Performance improves', 'No effect', 'Hash table resets'], correctAnswer: 'Performance degrades' },
      { id: 'qz_hashing_14', question: 'What is rehashing?', options: ['Resizing hash table and rehashing all elements', 'Changing hash function', 'Clearing hash table', 'Sorting hash table'], correctAnswer: 'Resizing hash table and rehashing all elements' },
      { id: 'qz_hashing_15', question: 'What is a perfect hash function?', options: ['No collisions', 'Many collisions', 'Random collisions', 'Fixed collisions'], correctAnswer: 'No collisions' },
      { id: 'qz_hashing_16', question: 'What is the time complexity of rehashing?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_hashing_17', question: 'What is the space complexity of a hash table?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_hashing_18', question: 'What is the worst-case time complexity of hash table operations?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_hashing_19', question: 'What is the average-case time complexity of hash table operations?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_hashing_20', question: 'What is the main advantage of hash tables?', options: ['Fast average-case operations', 'Memory efficient', 'Easy to implement', 'Sorted data'], correctAnswer: 'Fast average-case operations' }
    ],
    problems: [
      { id: '13', title: 'Two Sum', difficulty: 'Easy', leetcodeId: 1, leetcodeLink: 'https://leetcode.com/problems/two-sum/' },
      { id: '14', title: 'Valid Anagram', difficulty: 'Easy', leetcodeId: 242, leetcodeLink: 'https://leetcode.com/problems/valid-anagram/' }
    ],
    prerequisites: ['arrays']
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    description: 'Method for solving complex problems',
    difficultyScore: 0.8,
    isCore: true,
    estimatedTimeMins: 300,
    weight: 0.95,
    priority: 8,
    tags: ['optimization', 'memoization'],
    category: 'Algorithmic Techniques',
    quizThreshold: 70,
    quizQuestions: [
      { id: 'qz_dp_1', question: 'What is dynamic programming?', options: ['Method for solving complex problems by breaking them into subproblems', 'Method for sorting data', 'Method for searching data', 'Method for encrypting data'], correctAnswer: 'Method for solving complex problems by breaking them into subproblems' },
      { id: 'qz_dp_2', question: 'What are the two main approaches in dynamic programming?', options: ['Top-down and bottom-up', 'Left-right and right-left', 'Forward and backward', 'Up and down'], correctAnswer: 'Top-down and bottom-up' },
      { id: 'qz_dp_3', question: 'What is memoization?', options: ['Storing results of subproblems', 'Sorting results', 'Searching results', 'Deleting results'], correctAnswer: 'Storing results of subproblems' },
      { id: 'qz_dp_4', question: 'What is tabulation?', options: ['Building solution from bottom up', 'Building solution from top down', 'Building solution randomly', 'Building solution backwards'], correctAnswer: 'Building solution from bottom up' },
      { id: 'qz_dp_5', question: 'What is the time complexity of Fibonacci with memoization?', options: ['O(n)', 'O(2^n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n)' },
      { id: 'qz_dp_6', question: 'What is the time complexity of Fibonacci without memoization?', options: ['O(2^n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(2^n)' },
      { id: 'qz_dp_7', question: 'What is the space complexity of Fibonacci with memoization?', options: ['O(n)', 'O(1)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n)' },
      { id: 'qz_dp_8', question: 'What is the optimal substructure property?', options: ['Optimal solution contains optimal solutions to subproblems', 'Optimal solution is unique', 'Optimal solution is minimal', 'Optimal solution is maximal'], correctAnswer: 'Optimal solution contains optimal solutions to subproblems' },
      { id: 'qz_dp_9', question: 'What is the overlapping subproblems property?', options: ['Same subproblems are solved multiple times', 'Subproblems are unique', 'Subproblems are independent', 'Subproblems are sequential'], correctAnswer: 'Same subproblems are solved multiple times' },
      { id: 'qz_dp_10', question: 'What is the time complexity of longest common subsequence?', options: ['O(mn)', 'O(m+n)', 'O(m^2+n^2)', 'O(mn^2)'], correctAnswer: 'O(mn)' },
      { id: 'qz_dp_11', question: 'What is the space complexity of longest common subsequence?', options: ['O(mn)', 'O(m+n)', 'O(m^2+n^2)', 'O(mn^2)'], correctAnswer: 'O(mn)' },
      { id: 'qz_dp_12', question: 'What is the time complexity of longest increasing subsequence?', options: ['O(n^2)', 'O(n)', 'O(n log n)', 'O(n^3)'], correctAnswer: 'O(n^2)' },
      { id: 'qz_dp_13', question: 'What is the time complexity of edit distance?', options: ['O(mn)', 'O(m+n)', 'O(m^2+n^2)', 'O(mn^2)'], correctAnswer: 'O(mn)' },
      { id: 'qz_dp_14', question: 'What is the time complexity of knapsack problem?', options: ['O(nW)', 'O(n)', 'O(W)', 'O(n^2)'], correctAnswer: 'O(nW)' },
      { id: 'qz_dp_15', question: 'What is the time complexity of matrix chain multiplication?', options: ['O(n^3)', 'O(n^2)', 'O(n)', 'O(n^4)'], correctAnswer: 'O(n^3)' },
      { id: 'qz_dp_16', question: 'What is the time complexity of coin change problem?', options: ['O(nW)', 'O(n)', 'O(W)', 'O(n^2)'], correctAnswer: 'O(nW)' },
      { id: 'qz_dp_17', question: 'What is the time complexity of subset sum problem?', options: ['O(nW)', 'O(n)', 'O(W)', 'O(n^2)'], correctAnswer: 'O(nW)' },
      { id: 'qz_dp_18', question: 'What is the time complexity of longest palindromic subsequence?', options: ['O(n^2)', 'O(n)', 'O(n log n)', 'O(n^3)'], correctAnswer: 'O(n^2)' },
      { id: 'qz_dp_19', question: 'What is the time complexity of word break problem?', options: ['O(n^2)', 'O(n)', 'O(n log n)', 'O(n^3)'], correctAnswer: 'O(n^2)' },
      { id: 'qz_dp_20', question: 'What is the time complexity of climbing stairs problem?', options: ['O(n)', 'O(2^n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n)' }
    ],
    problems: [
      { id: '15', title: 'Climbing Stairs', difficulty: 'Easy', leetcodeId: 70, leetcodeLink: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: '16', title: 'Longest Common Subsequence', difficulty: 'Medium', leetcodeId: 1143, leetcodeLink: 'https://leetcode.com/problems/longest-common-subsequence/' }
    ],
    prerequisites: ['arrays', 'recursion']
  },
  {
    id: 'greedy-algorithms',
    name: 'Greedy Algorithms',
    description: 'Algorithm paradigm that builds up a solution',
    difficultyScore: 0.6,
    isCore: true,
    estimatedTimeMins: 150,
    weight: 0.8,
    priority: 9,
    tags: ['optimization', 'heuristic'],
    category: 'Algorithmic Techniques',
    quizThreshold: 70,
    quizQuestions: [
      { id: 'qz_greedy_1', question: 'What is a greedy algorithm?', options: ['Algorithm that makes locally optimal choice at each step', 'Algorithm that makes random choices', 'Algorithm that makes worst choices', 'Algorithm that makes no choices'], correctAnswer: 'Algorithm that makes locally optimal choice at each step' },
      { id: 'qz_greedy_2', question: 'What is the main characteristic of greedy algorithms?', options: ['Makes best choice at each step', 'Makes worst choice at each step', 'Makes random choice at each step', 'Makes no choice at each step'], correctAnswer: 'Makes best choice at each step' },
      { id: 'qz_greedy_3', question: 'What is the greedy choice property?', options: ['Locally optimal choice leads to globally optimal solution', 'Locally optimal choice is always wrong', 'Locally optimal choice is random', 'Locally optimal choice is irrelevant'], correctAnswer: 'Locally optimal choice leads to globally optimal solution' },
      { id: 'qz_greedy_4', question: 'What is the optimal substructure property in greedy algorithms?', options: ['Optimal solution contains optimal solutions to subproblems', 'Optimal solution is unique', 'Optimal solution is minimal', 'Optimal solution is maximal'], correctAnswer: 'Optimal solution contains optimal solutions to subproblems' },
      { id: 'qz_greedy_5', question: 'What is the time complexity of activity selection problem?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_greedy_6', question: 'What is the time complexity of fractional knapsack?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_greedy_7', question: 'What is the time complexity of Huffman coding?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_greedy_8', question: 'What is the time complexity of Dijkstra\'s algorithm?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_greedy_9', question: 'What is the time complexity of Prim\'s algorithm?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_greedy_10', question: 'What is the time complexity of Kruskal\'s algorithm?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_greedy_11', question: 'What is the main advantage of greedy algorithms?', options: ['Simple and efficient', 'Always optimal', 'Always correct', 'Always fast'], correctAnswer: 'Simple and efficient' },
      { id: 'qz_greedy_12', question: 'What is the main disadvantage of greedy algorithms?', options: ['May not give optimal solution', 'Always slow', 'Always complex', 'Always wrong'], correctAnswer: 'May not give optimal solution' },
      { id: 'qz_greedy_13', question: 'What is the time complexity of coin change greedy?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n)' },
      { id: 'qz_greedy_14', question: 'What is the time complexity of job scheduling greedy?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_greedy_15', question: 'What is the time complexity of interval scheduling?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_greedy_16', question: 'What is the time complexity of task scheduling?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_greedy_17', question: 'What is the time complexity of minimum spanning tree?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_greedy_18', question: 'What is the time complexity of shortest path?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_greedy_19', question: 'What is the time complexity of data compression?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_greedy_20', question: 'What is the time complexity of resource allocation?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' }
    ],
    problems: [
      { id: '17', title: 'Jump Game', difficulty: 'Medium', leetcodeId: 55, leetcodeLink: 'https://leetcode.com/problems/jump-game/' },
      { id: '18', title: 'Gas Station', difficulty: 'Medium', leetcodeId: 134, leetcodeLink: 'https://leetcode.com/problems/gas-station/' }
    ],
    prerequisites: ['arrays', 'sorting']
  },
  {
    id: 'divide-and-conquer',
    name: 'Divide and Conquer',
    description: 'Algorithm design paradigm based on recursion',
    difficultyScore: 0.6,
    isCore: true,
    estimatedTimeMins: 180,
    weight: 0.85,
    priority: 10,
    tags: ['recursion', 'decomposition'],
    category: 'Algorithmic Techniques',
    quizThreshold: 70,
    quizQuestions: [
      { id: 'qz_dc_1', question: 'What is divide and conquer?', options: ['Algorithm design paradigm that breaks problem into subproblems', 'Algorithm that sorts data', 'Algorithm that searches data', 'Algorithm that encrypts data'], correctAnswer: 'Algorithm design paradigm that breaks problem into subproblems' },
      { id: 'qz_dc_2', question: 'What are the three steps of divide and conquer?', options: ['Divide, Conquer, Combine', 'Sort, Search, Merge', 'Split, Solve, Join', 'Break, Fix, Join'], correctAnswer: 'Divide, Conquer, Combine' },
      { id: 'qz_dc_3', question: 'What is the time complexity of merge sort?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_dc_4', question: 'What is the space complexity of merge sort?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_dc_5', question: 'What is the time complexity of quick sort?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_dc_6', question: 'What is the space complexity of quick sort?', options: ['O(log n)', 'O(n)', 'O(1)', 'O(n^2)'], correctAnswer: 'O(log n)' },
      { id: 'qz_dc_7', question: 'What is the time complexity of binary search?', options: ['O(log n)', 'O(n)', 'O(n^2)', 'O(1)'], correctAnswer: 'O(log n)' },
      { id: 'qz_dc_8', question: 'What is the space complexity of binary search?', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(1)' },
      { id: 'qz_dc_9', question: 'What is the time complexity of Strassen\'s matrix multiplication?', options: ['O(n^2.807)', 'O(n^3)', 'O(n^2)', 'O(n log n)'], correctAnswer: 'O(n^2.807)' },
      { id: 'qz_dc_10', question: 'What is the time complexity of Karatsuba multiplication?', options: ['O(n^1.585)', 'O(n^2)', 'O(n log n)', 'O(n)'], correctAnswer: 'O(n^1.585)' },
      { id: 'qz_dc_11', question: 'What is the time complexity of closest pair problem?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_dc_12', question: 'What is the time complexity of convex hull problem?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_dc_13', question: 'What is the time complexity of FFT (Fast Fourier Transform)?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_dc_14', question: 'What is the time complexity of finding maximum subarray?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_dc_15', question: 'What is the time complexity of finding median of two sorted arrays?', options: ['O(log n)', 'O(n)', 'O(n^2)', 'O(n log n)'], correctAnswer: 'O(log n)' },
      { id: 'qz_dc_16', question: 'What is the main advantage of divide and conquer?', options: ['Efficient for large problems', 'Simple to implement', 'Always optimal', 'Always fast'], correctAnswer: 'Efficient for large problems' },
      { id: 'qz_dc_17', question: 'What is the main disadvantage of divide and conquer?', options: ['Overhead of recursion', 'Always slow', 'Always complex', 'Always wrong'], correctAnswer: 'Overhead of recursion' },
      { id: 'qz_dc_18', question: 'What is the time complexity of finding kth largest element?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n)' },
      { id: 'qz_dc_19', question: 'What is the time complexity of finding majority element?', options: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n)' },
      { id: 'qz_dc_20', question: 'What is the time complexity of finding peak element?', options: ['O(log n)', 'O(n)', 'O(n^2)', 'O(n log n)'], correctAnswer: 'O(log n)' }
    ],
    problems: [
      { id: '19', title: 'Merge Sort', difficulty: 'Medium', leetcodeId: 912, leetcodeLink: 'https://leetcode.com/problems/sort-an-array/' },
      { id: '20', title: 'Find Peak Element', difficulty: 'Medium', leetcodeId: 162, leetcodeLink: 'https://leetcode.com/problems/find-peak-element/' }
    ],
    prerequisites: ['arrays', 'recursion']
  },
  {
    id: 'backtracking',
    name: 'Backtracking',
    description: 'Algorithmic technique for finding all solutions',
    difficultyScore: 0.75,
    isCore: true,
    estimatedTimeMins: 120,
    weight: 0.85,
    priority: 12,
    tags: ['pruning', 'state-space', 'constraint-satisfaction'],
    category: 'Algorithmic Techniques',
    quizThreshold: 70,
    quizQuestions: [
      { id: 'qz_backtrack_1', question: 'What is backtracking?', options: ['Algorithmic technique for finding all solutions', 'Algorithm for sorting', 'Algorithm for searching', 'Algorithm for encryption'], correctAnswer: 'Algorithmic technique for finding all solutions' },
      { id: 'qz_backtrack_2', question: 'What is the main characteristic of backtracking?', options: ['Systematic search with pruning', 'Random search', 'Linear search', 'Binary search'], correctAnswer: 'Systematic search with pruning' },
      { id: 'qz_backtrack_3', question: 'What is state space tree in backtracking?', options: ['Tree representing all possible solutions', 'Binary tree', 'Search tree', 'Decision tree'], correctAnswer: 'Tree representing all possible solutions' },
      { id: 'qz_backtrack_4', question: 'What is pruning in backtracking?', options: ['Eliminating invalid branches', 'Cutting trees', 'Removing nodes', 'Deleting data'], correctAnswer: 'Eliminating invalid branches' },
      { id: 'qz_backtrack_5', question: 'What is the time complexity of N-Queens problem?', options: ['O(n!)', 'O(n^2)', 'O(n)', 'O(log n)'], correctAnswer: 'O(n!)' },
      { id: 'qz_backtrack_6', question: 'What is the time complexity of Sudoku solver?', options: ['O(9^(n^2))', 'O(n^2)', 'O(n)', 'O(log n)'], correctAnswer: 'O(9^(n^2))' },
      { id: 'qz_backtrack_7', question: 'What is the time complexity of permutation generation?', options: ['O(n!)', 'O(n^2)', 'O(n)', 'O(log n)'], correctAnswer: 'O(n!)' },
      { id: 'qz_backtrack_8', question: 'What is the time complexity of combination generation?', options: ['O(2^n)', 'O(n^2)', 'O(n)', 'O(log n)'], correctAnswer: 'O(2^n)' },
      { id: 'qz_backtrack_9', question: 'What is the time complexity of subset sum?', options: ['O(2^n)', 'O(n^2)', 'O(n)', 'O(log n)'], correctAnswer: 'O(2^n)' },
      { id: 'qz_backtrack_10', question: 'What is the time complexity of graph coloring?', options: ['O(m^n)', 'O(n^2)', 'O(n)', 'O(log n)'], correctAnswer: 'O(m^n)' },
      { id: 'qz_backtrack_11', question: 'What is the time complexity of Hamiltonian cycle?', options: ['O(n!)', 'O(n^2)', 'O(n)', 'O(log n)'], correctAnswer: 'O(n!)' },
      { id: 'qz_backtrack_12', question: 'What is the time complexity of traveling salesman?', options: ['O(n!)', 'O(n^2)', 'O(n)', 'O(log n)'], correctAnswer: 'O(n!)' },
      { id: 'qz_backtrack_13', question: 'What is the time complexity of word search?', options: ['O(4^(m*n))', 'O(m*n)', 'O(m+n)', 'O(log(m*n))'], correctAnswer: 'O(4^(m*n))' },
      { id: 'qz_backtrack_14', question: 'What is the time complexity of rat in maze?', options: ['O(4^(m*n))', 'O(m*n)', 'O(m+n)', 'O(log(m*n))'], correctAnswer: 'O(4^(m*n))' },
      { id: 'qz_backtrack_15', question: 'What is the time complexity of knight tour?', options: ['O(8^(n^2))', 'O(n^2)', 'O(n)', 'O(log n)'], correctAnswer: 'O(8^(n^2))' },
      { id: 'qz_backtrack_16', question: 'What is the main advantage of backtracking?', options: ['Finds all solutions', 'Always fast', 'Always optimal', 'Always simple'], correctAnswer: 'Finds all solutions' },
      { id: 'qz_backtrack_17', question: 'What is the main disadvantage of backtracking?', options: ['Exponential time complexity', 'Always slow', 'Always complex', 'Always wrong'], correctAnswer: 'Exponential time complexity' },
      { id: 'qz_backtrack_18', question: 'What is the space complexity of backtracking?', options: ['O(n)', 'O(1)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n)' },
      { id: 'qz_backtrack_19', question: 'What is constraint satisfaction in backtracking?', options: ['Ensuring solutions meet all constraints', 'Satisfying users', 'Meeting deadlines', 'Fulfilling requirements'], correctAnswer: 'Ensuring solutions meet all constraints' },
      { id: 'qz_backtrack_20', question: 'What is the time complexity of generating all subsets?', options: ['O(2^n)', 'O(n^2)', 'O(n)', 'O(log n)'], correctAnswer: 'O(2^n)' }
    ],
    problems: [
      { id: '21', title: 'N-Queens', difficulty: 'Hard', leetcodeId: 51, leetcodeLink: 'https://leetcode.com/problems/n-queens/' },
      { id: '22', title: 'Sudoku Solver', difficulty: 'Hard', leetcodeId: 37, leetcodeLink: 'https://leetcode.com/problems/sudoku-solver/' }
    ],
    prerequisites: ['recursion', 'arrays']
  },
  {
    id: 'string-algorithms',
    name: 'String Algorithms',
    description: 'Algorithms for processing and analyzing strings',
    difficultyScore: 0.6,
    isCore: true,
    estimatedTimeMins: 150,
    weight: 0.85,
    priority: 11,
    tags: ['text-processing', 'pattern-matching'],
    category: 'Algorithmic Techniques',
    quizThreshold: 70,
    quizQuestions: [
      { id: 'qz_string_1', question: 'What is the time complexity of string concatenation?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_string_2', question: 'What is the time complexity of string comparison?', options: ['O(n)', 'O(1)', 'O(log n)', 'O(n^2)'], correctAnswer: 'O(n)' },
      { id: 'qz_string_3', question: 'What is the time complexity of naive string matching?', options: ['O(mn)', 'O(m+n)', 'O(m^2+n^2)', 'O(mn^2)'], correctAnswer: 'O(mn)' },
      { id: 'qz_string_4', question: 'What is the time complexity of KMP algorithm?', options: ['O(m+n)', 'O(mn)', 'O(m^2+n^2)', 'O(mn^2)'], correctAnswer: 'O(m+n)' },
      { id: 'qz_string_5', question: 'What is the time complexity of Boyer-Moore algorithm?', options: ['O(mn)', 'O(m+n)', 'O(m^2+n^2)', 'O(mn^2)'], correctAnswer: 'O(mn)' },
      { id: 'qz_string_6', question: 'What is the time complexity of Rabin-Karp algorithm?', options: ['O(mn)', 'O(m+n)', 'O(m^2+n^2)', 'O(mn^2)'], correctAnswer: 'O(mn)' },
      { id: 'qz_string_7', question: 'What is the time complexity of longest common subsequence?', options: ['O(mn)', 'O(m+n)', 'O(m^2+n^2)', 'O(mn^2)'], correctAnswer: 'O(mn)' },
      { id: 'qz_string_8', question: 'What is the time complexity of longest common substring?', options: ['O(mn)', 'O(m+n)', 'O(m^2+n^2)', 'O(mn^2)'], correctAnswer: 'O(mn)' },
      { id: 'qz_string_9', question: 'What is the time complexity of edit distance?', options: ['O(mn)', 'O(m+n)', 'O(m^2+n^2)', 'O(mn^2)'], correctAnswer: 'O(mn)' },
      { id: 'qz_string_10', question: 'What is the time complexity of palindrome check?', options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], correctAnswer: 'O(n)' },
      { id: 'qz_string_11', question: 'What is the time complexity of anagram check?', options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], correctAnswer: 'O(n)' },
      { id: 'qz_string_12', question: 'What is the time complexity of string reversal?', options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], correctAnswer: 'O(n)' },
      { id: 'qz_string_13', question: 'What is the time complexity of string rotation?', options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], correctAnswer: 'O(n)' },
      { id: 'qz_string_14', question: 'What is the time complexity of substring search?', options: ['O(mn)', 'O(m+n)', 'O(m^2+n^2)', 'O(mn^2)'], correctAnswer: 'O(mn)' },
      { id: 'qz_string_15', question: 'What is the time complexity of string sorting?', options: ['O(n log n)', 'O(n)', 'O(n^2)', 'O(log n)'], correctAnswer: 'O(n log n)' },
      { id: 'qz_string_16', question: 'What is the time complexity of string hashing?', options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], correctAnswer: 'O(n)' },
      { id: 'qz_string_17', question: 'What is the time complexity of string compression?', options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], correctAnswer: 'O(n)' },
      { id: 'qz_string_18', question: 'What is the time complexity of string decompression?', options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], correctAnswer: 'O(n)' },
      { id: 'qz_string_19', question: 'What is the time complexity of string validation?', options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], correctAnswer: 'O(n)' },
      { id: 'qz_string_20', question: 'What is the time complexity of string parsing?', options: ['O(n)', 'O(n^2)', 'O(log n)', 'O(1)'], correctAnswer: 'O(n)' }
    ],
    problems: [
      { id: '23', title: 'Valid Anagram', difficulty: 'Easy', leetcodeId: 242, leetcodeLink: 'https://leetcode.com/problems/valid-anagram/' },
      { id: '24', title: 'Longest Palindromic Substring', difficulty: 'Medium', leetcodeId: 5, leetcodeLink: 'https://leetcode.com/problems/longest-palindromic-substring/' }
    ],
    prerequisites: ['arrays', 'hashing']
  },
  {
    id: 'advanced-topics',
    name: 'Advanced Topics',
    description: 'Advanced algorithmic concepts and techniques',
    difficultyScore: 0.97,
    isCore: false,
    estimatedTimeMins: 300,
    weight: 0.8,
    priority: 13,
    tags: ['competitive-programming', 'quantum', 'approximation', 'parallel'],
    category: 'Specialized Algorithms',
    quizThreshold: 70,
    quizQuestions: [
      { id: 'qz_advanced_1', question: 'What is competitive programming?', options: ['Programming contests and competitions', 'Professional programming', 'Academic programming', 'Commercial programming'], correctAnswer: 'Programming contests and competitions' },
      { id: 'qz_advanced_2', question: 'What is time complexity analysis?', options: ['Analyzing algorithm efficiency', 'Analyzing code quality', 'Analyzing memory usage', 'Analyzing syntax'], correctAnswer: 'Analyzing algorithm efficiency' },
      { id: 'qz_advanced_3', question: 'What is space complexity analysis?', options: ['Analyzing memory usage', 'Analyzing time usage', 'Analyzing code quality', 'Analyzing syntax'], correctAnswer: 'Analyzing memory usage' },
      { id: 'qz_advanced_4', question: 'What is Big O notation?', options: ['Upper bound of algorithm complexity', 'Lower bound of algorithm complexity', 'Exact complexity', 'Average complexity'], correctAnswer: 'Upper bound of algorithm complexity' },
      { id: 'qz_advanced_5', question: 'What is Big Omega notation?', options: ['Lower bound of algorithm complexity', 'Upper bound of algorithm complexity', 'Exact complexity', 'Average complexity'], correctAnswer: 'Lower bound of algorithm complexity' },
      { id: 'qz_advanced_6', question: 'What is Big Theta notation?', options: ['Tight bound of algorithm complexity', 'Upper bound of algorithm complexity', 'Lower bound of algorithm complexity', 'Average complexity'], correctAnswer: 'Tight bound of algorithm complexity' },
      { id: 'qz_advanced_7', question: 'What is amortized analysis?', options: ['Average cost over sequence of operations', 'Worst case cost', 'Best case cost', 'Exact cost'], correctAnswer: 'Average cost over sequence of operations' },
      { id: 'qz_advanced_8', question: 'What is probabilistic analysis?', options: ['Analysis using probability', 'Analysis using statistics', 'Analysis using calculus', 'Analysis using algebra'], correctAnswer: 'Analysis using probability' },
      { id: 'qz_advanced_9', question: 'What is approximation algorithm?', options: ['Algorithm that gives near-optimal solution', 'Algorithm that gives exact solution', 'Algorithm that gives random solution', 'Algorithm that gives no solution'], correctAnswer: 'Algorithm that gives near-optimal solution' },
      { id: 'qz_advanced_10', question: 'What is parallel algorithm?', options: ['Algorithm that uses multiple processors', 'Algorithm that uses single processor', 'Algorithm that uses no processor', 'Algorithm that uses virtual processor'], correctAnswer: 'Algorithm that uses multiple processors' },
      { id: 'qz_advanced_11', question: 'What is quantum algorithm?', options: ['Algorithm that uses quantum computing', 'Algorithm that uses classical computing', 'Algorithm that uses analog computing', 'Algorithm that uses digital computing'], correctAnswer: 'Algorithm that uses quantum computing' },
      { id: 'qz_advanced_12', question: 'What is randomized algorithm?', options: ['Algorithm that uses randomness', 'Algorithm that is deterministic', 'Algorithm that is sequential', 'Algorithm that is parallel'], correctAnswer: 'Algorithm that uses randomness' },
      { id: 'qz_advanced_13', question: 'What is online algorithm?', options: ['Algorithm that processes input as it arrives', 'Algorithm that processes all input at once', 'Algorithm that processes input backwards', 'Algorithm that processes input randomly'], correctAnswer: 'Algorithm that processes input as it arrives' },
      { id: 'qz_advanced_14', question: 'What is offline algorithm?', options: ['Algorithm that processes all input at once', 'Algorithm that processes input as it arrives', 'Algorithm that processes input backwards', 'Algorithm that processes input randomly'], correctAnswer: 'Algorithm that processes all input at once' },
      { id: 'qz_advanced_15', question: 'What is streaming algorithm?', options: ['Algorithm that processes data stream', 'Algorithm that processes static data', 'Algorithm that processes random data', 'Algorithm that processes no data'], correctAnswer: 'Algorithm that processes data stream' },
      { id: 'qz_advanced_16', question: 'What is cache-oblivious algorithm?', options: ['Algorithm that works well regardless of cache size', 'Algorithm that requires specific cache size', 'Algorithm that ignores cache', 'Algorithm that optimizes cache'], correctAnswer: 'Algorithm that works well regardless of cache size' },
      { id: 'qz_advanced_17', question: 'What is external memory algorithm?', options: ['Algorithm designed for large datasets', 'Algorithm designed for small datasets', 'Algorithm designed for no datasets', 'Algorithm designed for random datasets'], correctAnswer: 'Algorithm designed for large datasets' },
      { id: 'qz_advanced_18', question: 'What is geometric algorithm?', options: ['Algorithm for geometric problems', 'Algorithm for algebraic problems', 'Algorithm for arithmetic problems', 'Algorithm for logical problems'], correctAnswer: 'Algorithm for geometric problems' },
      { id: 'qz_advanced_19', question: 'What is computational geometry?', options: ['Study of geometric algorithms', 'Study of algebraic algorithms', 'Study of arithmetic algorithms', 'Study of logical algorithms'], correctAnswer: 'Study of geometric algorithms' },
      { id: 'qz_advanced_20', question: 'What is algorithm engineering?', options: ['Design and implementation of algorithms', 'Design of hardware', 'Design of software', 'Design of systems'], correctAnswer: 'Design and implementation of algorithms' }
    ],
    problems: [
      { id: '25', title: 'Sliding Window Maximum', difficulty: 'Hard', leetcodeId: 239, leetcodeLink: 'https://leetcode.com/problems/sliding-window-maximum/' },
      { id: '26', title: 'Median of Two Sorted Arrays', difficulty: 'Hard', leetcodeId: 4, leetcodeLink: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' }
    ],
    prerequisites: ['dynamic-programming', 'divide-and-conquer']
  }
];

const mockMasteryTopics: MasteryTopic[] = [
  {
    id: 'mastery_arrays',
    name: 'Arrays Mastery',
    description: 'Essential array problems and techniques',
    difficultyScore: 0.4,
    estimatedTimeMins: 180,
    essentialProblems: [
      { id: '1', title: 'Two Sum', difficulty: 'Easy' as const, leetcodeId: 1, leetcodeLink: 'https://leetcode.com/problems/two-sum/' },
      { id: '2', title: 'Maximum Subarray', difficulty: 'Medium' as const, leetcodeId: 53, leetcodeLink: 'https://leetcode.com/problems/maximum-subarray/' }
    ],
    cheatSheets: [
      { id: '1', title: 'Array Techniques', type: 'Article' as const, link: '/pdfs/arrays.pdf' }
    ],
    videoTutorials: [
      { id: '1', title: 'Array Basics', type: 'Video' as const, link: 'https://youtube.com/watch?v=example' }
    ]
  },
  {
    id: 'mastery_linked_lists',
    name: 'Linked Lists Mastery',
    description: 'Master linked list operations and problems',
    difficultyScore: 0.5,
    estimatedTimeMins: 200,
    essentialProblems: [
      { id: '3', title: 'Reverse Linked List', difficulty: 'Easy' as const, leetcodeId: 206, leetcodeLink: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: '4', title: 'Detect Cycle', difficulty: 'Medium' as const, leetcodeId: 141, leetcodeLink: 'https://leetcode.com/problems/linked-list-cycle/' }
    ],
    cheatSheets: [
      { id: '2', title: 'Linked List Patterns', type: 'Article' as const, link: '/pdfs/linked-lists.pdf' }
    ],
    videoTutorials: [
      { id: '2', title: 'Linked List Operations', type: 'Video' as const, link: 'https://youtube.com/watch?v=example2' }
    ]
  }
];

// Add this helper at the top of the file (after imports):
const validDifficulties = ['easy', 'medium', 'hard'];

class Neo4jService {
  private driver: Driver | null = null;

  // In-memory fallback for demo
  private userResourceCompletion: { [userId: string]: { [resourceId: string]: boolean } } = {};
  private userSubtopicCompletion: { [userId: string]: { [subtopicId: string]: boolean } } = {};

  constructor() {
    // Try to connect to Neo4j with the correct password
    try {
      this.driver = neo4j.driver(
        process.env.NEO4J_URI || 'bolt://localhost:7687',
        neo4j.auth.basic(
          process.env.NEO4J_USERNAME || 'neo4j',
          process.env.NEO4J_PASSWORD || 'password'
        )
      );
      console.log('Attempting to connect to Neo4j...');
    } catch (error) {
      console.log('Neo4j not available, using mock data');
      this.driver = null;
    }
  }

  async getHealth(): Promise<boolean> {
    if (!this.driver) {
      return true; // Mock health check passes
    }
    
    const session = this.driver.session();
    try {
      await session.run('RETURN 1');
      return true;
    } catch (error) {
      console.error('Neo4j connection error:', error);
      return false;
    } finally {
      await session.close();
    }
  }

  async getAllTopics(): Promise<Topic[]> {
    if (!this.driver) {
      // Patch mockTopics to include required fields for frontend
      return mockTopics.map(topic => ({
        id: topic.id,
        name: topic.name,
        description: topic.description || '',
        difficulty: 'beginner', // Default
        prerequisites: [],
        subtopics: [],
      }));
    }
    
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (t:Topic) 
        RETURN t 
        ORDER BY t.priority ASC, t.name
      `);
      return result.records.map((record: Record) => {
        const topic = record.get('t').properties;
        return {
          id: topic.id,
          name: topic.name,
          description: topic.description || '',
          difficulty: 'beginner', // Default
          prerequisites: [],
          subtopics: [],
        };
      });
    } catch (error) {
      console.error('Error fetching topics:', error);
      // Patch mockTopics fallback as well
      return mockTopics.map(topic => ({
        id: topic.id,
        name: topic.name,
        description: topic.description || '',
        difficulty: 'beginner',
        prerequisites: [],
        subtopics: [],
      }));
    } finally {
      await session.close();
    }
  }

  /**
   * Fetches all subtopics for a topic, including each subtopic's prerequisites and resources.
   */
  async getSubtopicByTopic(topicId: string): Promise<any[]> {
    if (!this.driver) {
      // Return mock subtopics
      const mockSubtopics: { [key: string]: any[] } = {
        'arrays': [
          { id: 'sub_arrays_0', name: '1D Arrays', prerequisites: [], resources: [], quizQuestions: [
            { id: 'sqz1', question: 'What is a 1D array?', options: ['A single row of elements', 'A matrix', 'A tree', 'A graph'], correctAnswer: 'A single row of elements' }
          ], problems: [
            { id: '5', title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', leetcodeId: 153, leetcodeLink: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/' }
          ] },
          { id: 'sub_arrays_1', name: '2D Arrays', prerequisites: ['sub_arrays_0'], resources: [], quizQuestions: [
            { id: 'sqz2', question: 'What is a 2D array?', options: ['Array of arrays', 'Linked list', 'Stack', 'Queue'], correctAnswer: 'Array of arrays' }
          ], problems: [
            { id: '6', title: 'Spiral Matrix', difficulty: 'Medium', leetcodeId: 54, leetcodeLink: 'https://leetcode.com/problems/spiral-matrix/' }
          ] },
          { id: 'sub_arrays_2', name: 'Dynamic Arrays', prerequisites: ['sub_arrays_1'], resources: [], quizQuestions: [
            { id: 'sqz3', question: 'Which data structure is used for dynamic arrays in JavaScript?', options: ['Array', 'Object', 'Set', 'Map'], correctAnswer: 'Array' }
          ], problems: [
            { id: '7', title: 'Dynamic Array', difficulty: 'Easy', leetcodeId: 282, leetcodeLink: 'https://leetcode.com/problems/dynamic-array/' }
          ] }
        ],
        'linked-lists': [
          { id: 'sub_linked_lists_0', name: 'Singly Linked List', prerequisites: [], resources: [], quizQuestions: [
            { id: 'sqz4', question: 'What is a singly linked list?', options: ['Nodes with one pointer', 'Nodes with two pointers', 'Array', 'Stack'], correctAnswer: 'Nodes with one pointer' }
          ], problems: [
            { id: '8', title: 'Remove Nth Node From End of List', difficulty: 'Medium', leetcodeId: 19, leetcodeLink: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' }
          ] },
          { id: 'sub_linked_lists_1', name: 'Doubly Linked List', prerequisites: ['sub_linked_lists_0'], resources: [], quizQuestions: [
            { id: 'sqz5', question: 'What is a doubly linked list?', options: ['Nodes with two pointers', 'Nodes with one pointer', 'Array', 'Stack'], correctAnswer: 'Nodes with two pointers' }
          ], problems: [
            { id: '9', title: 'Flatten a Multilevel Doubly Linked List', difficulty: 'Medium', leetcodeId: 430, leetcodeLink: 'https://leetcode.com/problems/flatten-a-multilevel-doubly-linked-list/' }
          ] }
        ]
      };
      return mockSubtopics[topicId] || [];
    }
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (t:Topic {id: $topicId})-[:HAS_SUBTOPIC]->(s:Subtopic)
        OPTIONAL MATCH (s)-[:REQUIRES|NEXT_TOPIC]->(prereq:Subtopic)
        OPTIONAL MATCH (s)-[:HAS_RESOURCE]->(r:Resource)
        RETURN s, collect(DISTINCT prereq) as prerequisites, collect(DISTINCT r) as resources
        ORDER BY s.priority ASC, s.name
      `, { topicId });
      return result.records.map((record: Record) => {
        const subtopic = record.get('s').properties;
        const prerequisites = (record.get('prerequisites') || []).filter(Boolean).map((p: any) => p.properties);
        const resources = (record.get('resources') || []).filter(Boolean).map((r: any) => {
          const p = r.properties;
          return {
            id: p.id,
            title: p.title,
            type: p.type,
            url: p.url,
            description: p.description,
            duration: p.duration,
            meta: p.meta
          };
        });
        return {
          ...subtopic,
          prerequisites,
          resources
        };
      });
    } catch (error) {
      console.error('Error fetching subtopics:', error);
      return [];
    } finally {
      await session.close();
    }
  }

  async createLearningPath(knownTopics: string[]): Promise<LearningPathNode[]> {
    if (!this.driver) {
      console.log('createLearningPath called with knownTopics:', knownTopics);
      const normalizedKnownTopics = knownTopics.map(id => id.trim().toLowerCase());
      console.log('Normalized knownTopics:', normalizedKnownTopics);
      console.log('All mockTopics IDs:', mockTopics.map(t => t.id));
      // Only show topics that are not known and whose prerequisites are all known
      const availableTopics = mockTopics
        .filter(topic => !normalizedKnownTopics.includes((topic.id || '').trim().toLowerCase()))
      console.log('Filtered topic IDs (should not include known):', availableTopics.map(t => t.id));
      const mappedTopics = availableTopics
        .map(topic => {
          const prerequisites = topic.prerequisites || [];
          const isAvailable = prerequisites.every((prereq: string) => normalizedKnownTopics.includes((prereq || '').trim().toLowerCase()));
          return {
        id: topic.id,
        name: topic.name,
        type: 'topic' as const,
            status: isAvailable ? 'available' as const : 'locked' as const,
        difficultyScore: topic.difficultyScore,
        estimatedTimeMins: topic.estimatedTimeMins,
            prerequisites,
            nextTopics: [] as string[],
            priority: topic.priority || 0
          };
        })
        .sort((a, b) => (a.priority || 0) - (b.priority || 0));
      console.log('createLearningPath returning availableTopics:', mappedTopics.map(({id, status}) => ({id, status})));
      // Remove priority from returned objects
      return mappedTopics.map(({ priority, ...rest }) => rest);
    }
    
    const session = this.driver.session();
    try {
      // Query to find topics that are not in known topics and their dependencies
      const result = await session.run(`
        MATCH (t:Topic)
        WHERE NOT (t.id IN $knownTopics)
        OPTIONAL MATCH (t)-[:REQUIRES]->(prereq:Topic)
        WITH t, collect(DISTINCT prereq.id) as prerequisites
        WHERE ALL(prereqId IN prerequisites WHERE prereqId IN $knownTopics)
        RETURN t
        OPTIONAL MATCH (t)-[:NEXT_TOPIC]->(next:Topic)
        WITH t, 
             collect(DISTINCT prereq.id) as prerequisites,
             collect(DISTINCT next.id) as nextTopics
        WHERE size([prereq IN prerequisites WHERE prereq IN $knownTopics]) = size(prerequisites)
        RETURN t, prerequisites, nextTopics
        ORDER BY t.priority ASC, t.difficultyScore ASC
      `, { knownTopics });
      
      return result.records.map((record: Record) => {
        const topic = record.get('t').properties;
        return {
          id: topic.id,
          name: topic.name,
          type: 'topic' as const,
          status: 'available' as const,
          difficultyScore: topic.difficultyScore,
          estimatedTimeMins: topic.estimatedTimeMins,
          prerequisites: record.get('prerequisites'),
          nextTopics: record.get('nextTopics')
        };
      });
    } catch (error) {
      console.error('Error creating learning path:', error);
      // Fallback to mock data
      const availableTopics = mockTopics.filter(topic => !knownTopics.includes(topic.id));
      return availableTopics.map(topic => ({
        id: topic.id,
        name: topic.name,
        type: 'topic' as const,
        status: 'available' as const,
        difficultyScore: topic.difficultyScore,
        estimatedTimeMins: topic.estimatedTimeMins,
        prerequisites: [],
        nextTopics: []
      }));
    } finally {
      await session.close();
    }
  }

  async getMasteryPath(): Promise<MasteryTopic[]> {
    if (!this.driver) {
      return mockMasteryTopics; // Return mock mastery topics
    }
    
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (t:Topic)
        WHERE t.isCore = true
        WITH t, size([(t)-[:HAS_SUBTOPIC]->(s:Subtopic) | s]) as subtopicCount
        WHERE subtopicCount >= 3
        RETURN t
        ORDER BY t.difficultyScore DESC
        LIMIT 5
      `);
      
      return result.records.map((record: Record) => {
        const topic = record.get('t').properties;
        return {
          id: `mastery_${topic.id}`,
          name: `${topic.name} Mastery`,
          description: `Master ${topic.name} concepts and problems`,
          difficultyScore: topic.difficultyScore,
          estimatedTimeMins: topic.estimatedTimeMins,
          essentialProblems: [],
          cheatSheets: [],
          videoTutorials: []
        };
      });
    } catch (error) {
      console.error('Error fetching mastery path:', error);
      return mockMasteryTopics;
    } finally {
      await session.close();
    }
  }

  async getFullLearningPath(): Promise<LearningPathNode[]> {
    if (!this.driver) {
      return mockTopics.map(topic => ({
        id: topic.id,
        name: topic.name,
        type: 'topic' as const,
        status: 'available' as const,
        difficultyScore: topic.difficultyScore,
        estimatedTimeMins: topic.estimatedTimeMins,
        prerequisites: [],
        nextTopics: []
      }));
    }
    
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (t:Topic)
        OPTIONAL MATCH (t)-[:REQUIRES]->(prereq:Topic)
        OPTIONAL MATCH (t)-[:NEXT_TOPIC]->(next:Topic)
        RETURN t, 
               collect(DISTINCT prereq.id) as prerequisites,
               collect(DISTINCT next.id) as nextTopics
        ORDER BY t.priority ASC, t.difficultyScore ASC
      `);
      
      return result.records.map((record: Record) => {
        const topic = record.get('t').properties;
        return {
          id: topic.id,
          name: topic.name,
          type: 'topic' as const,
          status: 'available' as const,
          difficultyScore: topic.difficultyScore,
          estimatedTimeMins: topic.estimatedTimeMins,
          prerequisites: record.get('prerequisites'),
          nextTopics: record.get('nextTopics')
        };
      });
    } catch (error) {
      console.error('Error fetching full learning path:', error);
      return mockTopics.map(topic => ({
        id: topic.id,
        name: topic.name,
        type: 'topic' as const,
        status: 'available' as const,
        difficultyScore: topic.difficultyScore,
        estimatedTimeMins: topic.estimatedTimeMins,
        prerequisites: [],
        nextTopics: []
      }));
    } finally {
      await session.close();
    }
  }

  async getMasteryTopicDetails(topicId: string): Promise<MasteryTopic | null> {
    if (!this.driver) {
      const mastery = mockMasteryTopics.find(topic => topic.id === topicId);
      if (!mastery) return null;
      // Add quizQuestions and problems from the corresponding topic if available
      const topicIdRaw = topicId.replace('mastery_', '');
      const topic = mockTopics.find(t => t.id === topicIdRaw);
      return {
        ...mastery,
        quizQuestions: topic?.quizQuestions || [],
        problems: topic?.problems || [],
        essentialProblems: topic?.problems || []
      };
    }
    
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (t:Topic {id: $topicId})
        OPTIONAL MATCH (t)-[:HAS_QUESTION]->(q:Question)
        OPTIONAL MATCH (t)-[:HAS_RESOURCE]->(r:Resource)
        RETURN t, 
               collect(DISTINCT q) as questions,
               collect(DISTINCT r) as resources
      `, { topicId: topicId.replace('mastery_', '') });
      
      if (result.records.length === 0) return null;
      
      const topic = result.records[0].get('t').properties;
      const questions = result.records[0].get('questions');
      const resources = result.records[0].get('resources');
      
      // Include all Question nodes as essentialProblems, ensuring required fields
      const essentialProblems = (questions || []).map((q: any) => {
        const p = q.properties || q;
        return {
          id: p.id,
          title: p.title || 'Untitled Problem',
          description: p.description || '',
          difficulty: p.difficulty || 'easy',
          hints: p.hints || [],
          leetcodeLink: p.leetcodeLink || '',
          link: p.link || '',
          hackerrankLink: p.hackerrankLink || '',
          codeforcesLink: p.codeforcesLink || '',
          geeksforgeeksLink: p.geeksforgeeksLink || '',
        };
      });
      console.log('[getMasteryTopicDetails] essentialProblems:', essentialProblems);
      
      // Quiz questions: fetch from QuizQuestion nodes if needed (not from Question nodes)
      // For now, leave quizQuestions as [] unless you want to fetch them separately
      const quizQuestions: any[] = [];
      console.log('[getMasteryTopicDetails] quizQuestions:', quizQuestions);
      
      return {
        id: `mastery_${topic.id}`,
        name: `${topic.name} Mastery`,
        description: `Master ${topic.name} concepts and problems`,
        difficultyScore: topic.difficultyScore,
        estimatedTimeMins: topic.estimatedTimeMins,
        essentialProblems,
        cheatSheets: resources.filter((r: any) => r.properties.type === 'cheatsheet').map((r: any) => ({
          id: r.properties.id,
          title: r.properties.title,
          type: 'cheatsheet',
          url: r.properties.url
        })),
        videoTutorials: resources.filter((r: any) => r.properties.type === 'video').map((r: any) => ({
          id: r.properties.id,
          title: r.properties.title,
          type: 'video',
          url: r.properties.url
        })),
        quizQuestions,
        problems: essentialProblems
      };
    } catch (error) {
      console.error('Error fetching mastery topic details:', error);
      return mockMasteryTopics.find(topic => topic.id === topicId) || null;
    } finally {
      await session.close();
    }
  }

  async getTopicProblems(topicId: string): Promise<Question[]> {
    if (!this.driver) {
      // Return mock problems
      const mockProblems: { [key: string]: Question[] } = {
        'arrays': [
          { id: '1', title: 'Two Sum', difficulty: 'Easy' as const, leetcodeId: 1, leetcodeLink: 'https://leetcode.com/problems/two-sum/' },
          { id: '2', title: 'Maximum Subarray', difficulty: 'Medium' as const, leetcodeId: 53, leetcodeLink: 'https://leetcode.com/problems/maximum-subarray/' }
        ],
        'linked-lists': [
          { id: '3', title: 'Reverse Linked List', difficulty: 'Easy' as const, leetcodeId: 206, leetcodeLink: 'https://leetcode.com/problems/reverse-linked-list/' },
          { id: '4', title: 'Detect Cycle', difficulty: 'Medium' as const, leetcodeId: 141, leetcodeLink: 'https://leetcode.com/problems/linked-list-cycle/' }
        ]
      };
      return mockProblems[topicId] || [];
    }
    
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (t:Topic {id: $topicId})-[:HAS_QUESTION]->(q:Question)
        RETURN q
        ORDER BY q.difficulty, q.title
      `, { topicId });
      
      return result.records.map((record: Record) => {
        const question = record.get('q').properties;
        return {
          ...question,
          difficulty: validDifficulties.includes((question.difficulty || '').toLowerCase()) ? question.difficulty.toLowerCase() : 'easy',
        };
      });
    } catch (error) {
      console.error('Error fetching topic problems:', error);
      return [];
    } finally {
      await session.close();
    }
  }

  async getTopicResources(topicId: string, type: string = 'pdf'): Promise<Resource[]> {
    if (!this.driver) {
      // Return mock resources
      const mockResources: { [key: string]: Resource[] } = {
        'arrays': [
          { id: '1', title: 'Array Basics', type: 'Article', link: 'https://youtube.com/watch?v=example' },
          { id: '2', title: 'Array Techniques', type: 'Article', link: '/pdfs/arrays.pdf' }
        ],
        'linked-lists': [
          { id: '3', title: 'Linked List Operations', type: 'Article', link: 'https://youtube.com/watch?v=example2' },
          { id: '4', title: 'Linked List Patterns', type: 'Article', link: '/pdfs/linked-lists.pdf' }
        ]
      };
      return (mockResources[topicId] || []).filter(r => r.type === type);
    }
    
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (t:Topic {id: $topicId})-[:HAS_RESOURCE]->(r:Resource)
        WHERE r.type = $type
        RETURN r
        ORDER BY r.qualityScore DESC, r.title
      `, { topicId, type });
      
      return result.records.map((record: Record) => {
        const resource = record.get('r').properties;
        return {
          id: resource.id,
          title: resource.title,
          type: resource.type,
          url: resource.url,
          author: resource.author,
          qualityScore: resource.qualityScore,
          durationMins: resource.durationMins,
          lastVerified: resource.lastVerified
        };
      });
    } catch (error) {
      console.error('Error fetching topic resources:', error);
      return [];
    } finally {
      await session.close();
    }
  }

  async close(): Promise<void> {
    if (this.driver) {
      await this.driver.close();
    }
  }

  // User management methods
  async getUserByUsername(username: string): Promise<User | null> {
    if (!this.driver) {
      // Return mock user
      return {
        id: '1',
        username: username,
        email: `${username}@example.com`,
        password: 'hashedpassword',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'user'
      };
    }
    
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (u:User {username: $username})
        RETURN u
      `, { username });
      
      if (result.records.length === 0) return null;
      
      const user = result.records[0].get('u').properties;
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role || 'user'
      };
    } catch (error) {
      console.error('Error fetching user by username:', error);
      return null;
    } finally {
      await session.close();
    }
  }

  async createUser(username: string, password: string, email: string): Promise<User | null> {
    if (!this.driver) {
      // Return mock user
      return {
        id: Date.now().toString(),
        username: username,
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'user',
        active: true
      };
    }
    
    const session = this.driver.session();
    try {
      const result = await session.run(`
        CREATE (u:User {
          id: $id,
          username: $username,
          email: $email,
          password: $password,
          createdAt: $createdAt,
          updatedAt: $updatedAt,
          active: true,
          role: 'user'
        })
        RETURN u
      `, {
        id: Date.now().toString(),
        username,
        email,
        password,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      const user = result.records[0].get('u').properties;
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role || 'user',
        active: user.active !== false
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    } finally {
      await session.close();
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    if (!this.driver) {
      // Return mock user
      return {
        id: userId,
        username: 'mockuser',
        email: 'mockuser@example.com',
        password: 'hashedpassword',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        role: 'user'
      };
    }
    
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (u:User {id: $userId})
        RETURN u
      `, { userId });
      
      if (result.records.length === 0) return null;
      
      const user = result.records[0].get('u').properties;
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        role: user.role || 'user'
      };
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    } finally {
      await session.close();
    }
  }

  async getUserProgressByUserId(userId: string): Promise<UserProgress[]> {
    if (!this.driver) {
      // Return mock progress
      return [
        {
          userId: userId,
          topicId: 'arrays',
          status: 'completed',
          lastAccessed: new Date().toISOString()
        },
        {
          userId: userId,
          topicId: 'linked-lists',
          status: 'in_progress',
          lastAccessed: new Date().toISOString()
        }
      ];
    }
    
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (u:User {id: $userId})-[:HAS_PROGRESS]->(p:UserProgress)
        RETURN p
        ORDER BY p.lastAccessed DESC
      `, { userId });
      
      return result.records.map((record: Record) => {
        const progress = record.get('p').properties;
        return {
          userId: userId,
          topicId: progress.topicId,
          subtopicId: progress.subtopicId,
          status: progress.status,
          lastAccessed: new Date(progress.lastAccessed).toISOString()
        };
      });
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return [];
    } finally {
      await session.close();
    }
  }

  async updateUserProgress(userId: string, progressData: UserProgress): Promise<void> {
    if (!this.driver) {
      // Enforce quiz threshold logic for mock data
      const topic = mockTopics.find(t => t.id === progressData.topicId);
      if (progressData.status === 'completed' && topic && topic.quizThreshold) {
        if (typeof progressData.quizScore === 'number' && progressData.quizScore >= topic.quizThreshold) {
          console.log(`Mock: User ${userId} completed topic ${progressData.topicId} with score ${progressData.quizScore} (threshold: ${topic.quizThreshold}) - Marking as COMPLETED and unlocking next topic.`);
        } else {
          console.log(`Mock: User ${userId} did NOT meet quiz threshold for topic ${progressData.topicId} (score: ${progressData.quizScore}, threshold: ${topic.quizThreshold}). Keeping as IN_PROGRESS.`);
          // In a real implementation, you might throw or return a status here
          return;
        }
      }
      console.log('Mock: Updating user progress', { userId, progressData });
      return;
    }
    
    const session = this.driver.session();
    try {
      let quizThreshold: number | undefined = undefined;
      if (progressData.status === 'completed') {
        // Fetch the topic's quizThreshold from Neo4j
        const thresholdResult = await session.run(
          'MATCH (t:Topic {id: $topicId}) RETURN t.quizThreshold AS quizThreshold',
          { topicId: progressData.topicId }
        );
        if (thresholdResult.records.length > 0) {
          quizThreshold = thresholdResult.records[0].get('quizThreshold');
        }
        if (
          typeof quizThreshold === 'number' &&
          typeof progressData.quizScore === 'number' &&
          progressData.quizScore < quizThreshold
        ) {
          // User did not meet threshold, keep as IN_PROGRESS
          console.log(`User ${userId} did NOT meet quiz threshold for topic ${progressData.topicId} (score: ${progressData.quizScore}, threshold: ${quizThreshold}). Keeping as IN_PROGRESS.`);
          // Optionally, you can throw an error or return a status here
          return;
        }
      }
      await session.run(
        `
        MATCH (u:User {id: $userId})
        MERGE (p:UserProgress {
          topicId: $topicId,
          subtopicId: $subtopicId
        })
        SET p.status = $status,
            p.lastAccessed = $lastAccessed
        MERGE (u)-[:HAS_PROGRESS]->(p)
      `, {
        userId,
        topicId: progressData.topicId,
        subtopicId: progressData.subtopicId,
        status: progressData.status,
        lastAccessed: progressData.lastAccessed
      });
    } catch (error) {
      console.error('Error updating user progress:', error);
    } finally {
      await session.close();
    }
  }

  /**
   * Fetches all details for a topic, including subtopics (with prerequisites/resources), concepts, resources, questions, quiz template, prerequisites, and next topics.
   */
  async getTopicDetails(topicId: string): Promise<any | null> {
    if (!this.driver) {
      // Return mock topic details
      const mockTopic = mockTopics.find(t => t.id === topicId);
      if (!mockTopic) return null;
      const quizQuestions = mockTopic.quizQuestions || [];
      return {
        topic: mockTopic,
        subtopics: mockTopic.subtopics || [],
        resources: mockTopic.resources || [],
        questions: mockTopic.problems || [],
        quizTemplate: { threshold: mockTopic.quizThreshold || 70, questions: quizQuestions },
        prerequisites: mockTopic.prerequisites || [],
        nextTopics: [],
        quizQuestions
      };
    }

    const session = this.driver.session();
    try {
      // Main topic details query (without quiz questions)
      const result = await session.run(`
        MATCH (t:Topic)
        WHERE t.id = $topicId
        OPTIONAL MATCH (t)-[:HAS_SUBTOPIC]->(s:Subtopic)
        OPTIONAL MATCH (s)-[:REQUIRES|NEXT_TOPIC]->(sprereq:Subtopic)
        OPTIONAL MATCH (s)-[:HAS_RESOURCE]->(sres:Resource)
        WITH t, s, collect(DISTINCT sprereq) as prereqs, collect(DISTINCT sres) as sresources
        OPTIONAL MATCH (t)-[:HAS_RESOURCE]->(r:Resource)
        OPTIONAL MATCH (t)-[:HAS_QUESTION]->(q:Question)
        OPTIONAL MATCH (t)-[:HAS_QUIZ_TEMPLATE]->(qt:QuizTemplate)
        OPTIONAL MATCH (t)-[:REQUIRES]->(prereq:Topic)
        OPTIONAL MATCH (t)-[:NEXT_TOPIC]->(next:Topic)
        RETURN t,
               collect(DISTINCT {subtopic: s, prerequisites: prereqs, resources: sresources}) as subtopicDetails,
               collect(DISTINCT r) as resources,
               collect(DISTINCT q) as questions,
               qt,
               collect(DISTINCT prereq) as prerequisites,
               collect(DISTINCT next) as nextTopics
      `, { topicId });
      if (result.records.length === 0) {
        console.warn(`[getTopicDetails] No topic found in DB for id: ${topicId}`);
        return null;
      }
      const record = result.records[0];
      const t = record.get('t').properties;
      // Subtopics with prerequisites and resources
      const subtopicDetails = (record.get('subtopicDetails') || []).filter((d: any) => d.subtopic).map((d: any) => {
        const s = d.subtopic?.properties || d.subtopic; // handle both Node and plain object
        if (!s) return null;
        const prereqs = (d.prerequisites || []).filter(Boolean).map((p: any) => p.properties || p);
        const resources = (d.resources || []).filter(Boolean).map((r: any) => {
          const p = r.properties || r;
          return {
            id: p.id,
            title: p.title,
            type: p.type,
            url: p.url,
            description: p.description,
            duration: p.duration,
            meta: p.meta
          };
        });
        return {
          ...s,
          prerequisites: prereqs,
          resources
        };
      }).filter(Boolean);
      // Always return all resource types for the topic
      const resources = (record.get('resources') || []).filter((r: any) => r && r.properties && r.properties.type).map((r: any) => {
        const p = r.properties || r;
        return {
          id: p.id,
          title: p.title,
          type: p.type,
          url: p.url,
          description: p.description,
          duration: p.duration,
          meta: p.meta
        };
      });
      const questions = (record.get('questions') || []).filter((q: any) => q && q.properties).map((q: any) => {
        const p = q.properties || q;
        return {
          ...p,
          difficulty: validDifficulties.includes((p.difficulty || '').toLowerCase()) ? p.difficulty.toLowerCase() : 'easy',
        };
      });
      const quizTemplate = record.get('qt') ? { ...record.get('qt').properties } : {};
      const prerequisites = (record.get('prerequisites') || []).filter((p: any) => p && p.properties).map((p: any) => p.properties || p);
      const nextTopics = (record.get('nextTopics') || []).filter((n: any) => n && n.properties).map((n: any) => n.properties || n);

      // Fetch quiz questions in a separate query to avoid fan-out
      const quizResult = await session.run(
        'MATCH (t:Topic {id: $topicId})-[:HAS_QUIZ_QUESTION]->(qq:QuizQuestion) RETURN qq',
        { topicId }
      );
      const quizQuestions = quizResult.records.map((r: any) => {
        const p = r.get('qq').properties || r.get('qq');
        return {
          id: p.id,
          question: p.question,
          options: p.options,
          correctAnswer: p.correctAnswer
        };
      });
      if (!quizQuestions.length) {
        console.warn(`[getTopicDetails] No quiz questions found for topic ${topicId}. Trying to fetch all QuizQuestion nodes for debugging.`);
        const allQuizQ = await session.run('MATCH (qq:QuizQuestion) RETURN qq');
        console.log(`[getTopicDetails] All QuizQuestion nodes:`, allQuizQ.records.map((r: any) => r.get('qq').properties || r.get('qq')));
      }
      console.log(`[getTopicDetails] quizQuestions for topic ${topicId}:`, quizQuestions);
      quizTemplate.questions = Array.isArray(quizQuestions) ? quizQuestions : [];

      return {
        topic: t,
        subtopics: subtopicDetails,
        resources,
        questions,
        quizTemplate,
        prerequisites,
        nextTopics,
        quizQuestions,
        problems: resources.filter((r: any) => r && r.properties && r.properties.type === 'problem').map((r: any) => ({
          id: r.properties.id,
          title: r.properties.title,
          difficulty: r.properties.difficulty,
          leetcodeId: r.properties.leetcodeId,
          leetcodeLink: r.properties.leetcodeLink
        }))
      };
    } catch (error) {
      console.error('Error fetching topic details:', error);
      return null;
    } finally {
      await session.close();
    }
  }

  // Admin Methods
  async getAdminStatistics(): Promise<any> {
    if (!this.driver) {
      // Return mock admin statistics
      return {
        totalUsers: 150,
        activeUsers: 89,
        newUsersThisWeek: 12,
        topicsCompletedThisWeek: 45,
        popularTopics: [
          { name: 'Arrays', count: 89 },
          { name: 'Linked Lists', count: 67 },
          { name: 'Stacks', count: 45 },
          { name: 'Queues', count: 34 },
          { name: 'Trees', count: 23 }
        ]
      };
    }

    const session = this.driver.session();
    try {
      console.log('🔍 Fetching admin statistics...');
      
      // Get total users
      const totalUsersResult = await session.run(`MATCH (u:User) RETURN count(u) as totalUsers`);
      const totalUsers = totalUsersResult.records[0].get('totalUsers').toNumber();
      
      // Get active users (users active in last 30 days)
      const activeUsersResult = await session.run(`
        MATCH (u:User)
        WHERE u.lastActive > datetime() - duration({days: 30})
        RETURN count(u) as activeUsers
      `);
      const activeUsers = activeUsersResult.records[0].get('activeUsers').toNumber();
      
      // Get new users this week
      const newUsersResult = await session.run(`
        MATCH (u:User)
        WHERE u.createdAt > datetime() - duration({days: 7})
        RETURN count(u) as newUsersThisWeek
      `);
      const newUsersThisWeek = newUsersResult.records[0].get('newUsersThisWeek').toNumber();
      
      // Get topics completed this week (placeholder for now)
      const topicsCompletedThisWeek = 0;
      
      // Get popular topics (placeholder for now)
      const popularTopics = [
        { name: 'Arrays', count: 89 },
        { name: 'Linked Lists', count: 67 },
        { name: 'Stacks', count: 45 },
        { name: 'Queues', count: 34 },
        { name: 'Trees', count: 23 }
      ];
      
      console.log(`📊 Statistics: Total=${totalUsers}, Active=${activeUsers}, New=${newUsersThisWeek}`);
      
      return {
        totalUsers,
        activeUsers,
        newUsersThisWeek,
        topicsCompletedThisWeek,
        popularTopics
      };
    } catch (error) {
      console.error('Error fetching admin statistics:', error);
      return {
        totalUsers: 0,
        activeUsers: 0,
        newUsersThisWeek: 0,
        topicsCompletedThisWeek: 0,
        popularTopics: []
      };
    } finally {
      await session.close();
    }
  }

  async getUsersList(page: number = 1, limit: number = 10): Promise<any> {
    if (!this.driver) {
      // Return mock users list
      const mockUsers = Array.from({ length: 20 }, (_, i) => ({
        id: `user_${i + 1}`,
        username: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        joinedDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastActive: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        topicsCompleted: Math.floor(Math.random() * 10),
        active: Math.random() > 0.2
      }));
      
      const start = (page - 1) * limit;
      const end = start + limit;
      
      return {
        users: mockUsers.slice(start, end),
        totalPages: Math.ceil(mockUsers.length / limit),
        totalUsers: mockUsers.length
      };
    }

    const session = this.driver.session();
    try {
      const skip = Math.floor((page - 1) * limit);
      const limitInt = Math.floor(limit);
      
      console.log(`🔍 Fetching users with skip: ${skip}, limit: ${limitInt}`);
      
      const result = await session.run(`
        MATCH (u:User)
        RETURN u
        ORDER BY u.id DESC
        SKIP toInteger($skip)
        LIMIT toInteger($limit)
      `, { skip: skip, limit: limitInt });
      
      console.log(`📊 Found ${result.records.length} users in query result`);
      
          const users = result.records.map(record => {
      const user = record.get('u').properties;
      console.log(`📝 Processing user: ${user.username} (${user.id})`);
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        joinedDate: user.createdAt,
        lastActive: user.lastActive,
        topicsCompleted: user.topicsCompleted || 0,
        active: user.active !== false
      };
    });
      
      // Get total count
      const countResult = await session.run(`MATCH (u:User) RETURN count(u) as total`);
      const totalUsers = countResult.records[0].get('total').toNumber();
      
      return {
        users,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers
      };
    } catch (error) {
      console.error('Error fetching users list:', error);
      return { users: [], totalPages: 0, totalUsers: 0 };
    } finally {
      await session.close();
    }
  }

  async updateUserStatus(userId: string, active: boolean): Promise<void> {
    if (!this.driver) {
      console.log(`Mock: Updating user ${userId} status to ${active}`);
      return;
    }

    const session = this.driver.session();
    try {
      await session.run(`
        MATCH (u:User {id: $userId})
        SET u.active = $active
      `, { userId, active });
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async createTopic(topicData: any): Promise<any> {
    if (!this.driver) {
      console.log('Mock: Creating topic', topicData);
      return { id: `topic_${Date.now()}`, ...topicData };
    }

    const session = this.driver.session();
    try {
      const topicId = `topic_${topicData.name.toLowerCase().replace(/\s+/g, '_')}`;
      
      const result = await session.run(`
        CREATE (t:Topic {
          id: $topicId,
          name: $name,
          description: $description,
          difficultyScore: $difficultyScore,
          isCore: $isCore,
          estimatedTimeMins: $estimatedTimeMins,
          priority: $priority,
          createdAt: datetime()
        })
        RETURN t
      `, {
        topicId,
        name: topicData.name,
        description: topicData.description,
        difficultyScore: topicData.difficultyScore,
        isCore: topicData.isCore,
        estimatedTimeMins: topicData.estimatedTimeMins,
        priority: topicData.priority
      });
      
      return result.records[0].get('t').properties;
    } catch (error) {
      console.error('Error creating topic:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async updateTopic(topicId: string, topicData: any): Promise<any> {
    if (!this.driver) {
      console.log('Mock: Updating topic', topicId, topicData);
      return { id: topicId, ...topicData };
    }

    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (t:Topic {id: $topicId})
        SET t.name = $name,
            t.description = $description,
            t.difficultyScore = $difficultyScore,
            t.isCore = $isCore,
            t.estimatedTimeMins = $estimatedTimeMins,
            t.priority = $priority,
            t.updatedAt = datetime()
        RETURN t
      `, {
        topicId,
        name: topicData.name,
        description: topicData.description,
        difficultyScore: topicData.difficultyScore,
        isCore: topicData.isCore,
        estimatedTimeMins: topicData.estimatedTimeMins,
        priority: topicData.priority
      });
      
      return result.records[0].get('t').properties;
    } catch (error) {
      console.error('Error updating topic:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async deleteTopic(topicId: string): Promise<void> {
    if (!this.driver) {
      console.log('Mock: Deleting topic', topicId);
      return;
    }

    const session = this.driver.session();
    try {
      await session.run(`
        MATCH (t:Topic {id: $topicId})
        OPTIONAL MATCH (t)-[:HAS_SUBTOPIC]->(s:Subtopic)
        OPTIONAL MATCH (t)-[:HAS_RESOURCE]->(r:Resource)
        OPTIONAL MATCH (t)-[:HAS_QUESTION]->(q:Question)
        OPTIONAL MATCH (t)-[:HAS_QUIZ_QUESTION]->(qq:QuizQuestion)
        DETACH DELETE t, s, r, q, qq
      `, { topicId });
    } catch (error) {
      console.error('Error deleting topic:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async addSubtopic(topicId: string, subtopicData: any): Promise<any> {
    if (!this.driver) {
      console.log('Mock: Adding subtopic', topicId, subtopicData);
      return { id: `sub_${Date.now()}`, ...subtopicData };
    }

    const session = this.driver.session();
    try {
      const subtopicId = `sub_${topicId}_${subtopicData.name.toLowerCase().replace(/\s+/g, '_')}`;
      
      const result = await session.run(`
        MATCH (t:Topic {id: $topicId})
        CREATE (s:Subtopic {
          id: $subtopicId,
          name: $name,
          description: $description,
          difficultyScore: $difficultyScore,
          estimatedTimeMins: $estimatedTimeMins,
          priority: $priority,
          createdAt: datetime()
        })
        CREATE (t)-[:HAS_SUBTOPIC]->(s)
        RETURN s
      `, {
        topicId,
        subtopicId,
        name: subtopicData.name,
        description: subtopicData.description,
        difficultyScore: subtopicData.difficultyScore,
        estimatedTimeMins: subtopicData.estimatedTimeMins,
        priority: subtopicData.priority
      });
      
      return result.records[0].get('s').properties;
    } catch (error) {
      console.error('Error adding subtopic:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async updateSubtopic(topicId: string, subtopicId: string, subtopicData: any): Promise<any> {
    if (!this.driver) {
      console.log('Mock: Updating subtopic', subtopicId, subtopicData);
      return { id: subtopicId, ...subtopicData };
    }

    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (t:Topic {id: $topicId})-[:HAS_SUBTOPIC]->(s:Subtopic {id: $subtopicId})
        SET s.name = $name,
            s.description = $description,
            s.difficultyScore = $difficultyScore,
            s.estimatedTimeMins = $estimatedTimeMins,
            s.priority = $priority,
            s.updatedAt = datetime()
        RETURN s
      `, {
        topicId,
        subtopicId,
        name: subtopicData.name,
        description: subtopicData.description,
        difficultyScore: subtopicData.difficultyScore,
        estimatedTimeMins: subtopicData.estimatedTimeMins,
        priority: subtopicData.priority
      });
      
      return result.records[0].get('s').properties;
    } catch (error) {
      console.error('Error updating subtopic:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async deleteSubtopic(topicId: string, subtopicId: string): Promise<void> {
    if (!this.driver) {
      console.log('Mock: Deleting subtopic', subtopicId);
      return;
    }

    const session = this.driver.session();
    try {
      await session.run(`
        MATCH (t:Topic {id: $topicId})-[:HAS_SUBTOPIC]->(s:Subtopic {id: $subtopicId})
        OPTIONAL MATCH (s)-[:HAS_RESOURCE]->(r:Resource)
        DETACH DELETE s, r
      `, { topicId, subtopicId });
    } catch (error) {
      console.error('Error deleting subtopic:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  // Additional admin methods for resources, analytics, etc.
  async getAllResources(): Promise<any[]> {
    if (!this.driver) {
      return [
        {
          id: 'res_1',
          title: 'Arrays Tutorial',
          type: 'Article',
          url: '/articles/arrays',
          description: 'Complete guide to arrays',
          qualityScore: 8.5,
          topicId: 'arrays'
        }
      ];
    }

    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (r:Resource)
        RETURN r
        ORDER BY r.createdAt DESC
      `);
      
      return result.records.map(record => record.get('r').properties);
    } catch (error) {
      console.error('Error fetching resources:', error);
      return [];
    } finally {
      await session.close();
    }
  }

  async createResource(resourceData: any): Promise<any> {
    if (!this.driver) {
      console.log('Mock: Creating resource', resourceData);
      return { id: `res_${Date.now()}`, ...resourceData };
    }

    const session = this.driver.session();
    try {
      const resourceId = `res_${Date.now()}`;
      
      const result = await session.run(`
        MATCH (t:Topic {id: $topicId})
        CREATE (r:Resource {
          id: $resourceId,
          title: $title,
          type: $type,
          url: $url,
          description: $description,
          qualityScore: $qualityScore,
          createdAt: datetime()
        })
        CREATE (t)-[:HAS_RESOURCE]->(r)
        RETURN r
      `, {
        topicId: resourceData.topicId,
        resourceId,
        title: resourceData.title,
        type: resourceData.type,
        url: resourceData.url,
        description: resourceData.description,
        qualityScore: resourceData.qualityScore
      });
      
      return result.records[0].get('r').properties;
    } catch (error) {
      console.error('Error creating resource:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async updateResource(resourceId: string, resourceData: any): Promise<any> {
    if (!this.driver) {
      console.log('Mock: Updating resource', resourceId, resourceData);
      return { id: resourceId, ...resourceData };
    }

    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (r:Resource {id: $resourceId})
        SET r.title = $title,
            r.type = $type,
            r.url = $url,
            r.description = $description,
            r.qualityScore = $qualityScore,
            r.updatedAt = datetime()
        RETURN r
      `, {
        resourceId,
        title: resourceData.title,
        type: resourceData.type,
        url: resourceData.url,
        description: resourceData.description,
        qualityScore: resourceData.qualityScore
      });
      
      return result.records[0].get('r').properties;
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async deleteResource(resourceId: string): Promise<void> {
    if (!this.driver) {
      console.log('Mock: Deleting resource', resourceId);
      return;
    }

    const session = this.driver.session();
    try {
      await session.run(`
        MATCH (r:Resource {id: $resourceId})
        DETACH DELETE r
      `, { resourceId });
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async getAdminAnalytics(_timeRange: string = 'month'): Promise<any> {
    if (!this.driver) {
      // fallback to mock if no driver
      return {
        userEngagement: {
          totalUsers: 150,
          activeUsers: 89,
          newUsersThisWeek: 12,
          newUsersThisMonth: 45,
          retentionRate: 75.5
        },
        learningProgress: {
          totalTopicsCompleted: 234,
          averageCompletionRate: 68.2,
          mostPopularTopics: [
            { name: 'Arrays', count: 89 },
            { name: 'Linked Lists', count: 67 }
          ],
          leastPopularTopics: [
            { name: 'Advanced Topics', count: 5 },
            { name: 'Bit Manipulation', count: 8 }
          ]
        },
        performance: {
          averageQuizScore: 72.5,
          averageTimePerTopic: 45,
          topPerformingUsers: [
            { username: 'user1', score: 95, topicsCompleted: 12 },
            { username: 'user2', score: 88, topicsCompleted: 10 }
          ]
        },
        systemMetrics: {
          totalResources: 156,
          totalProblems: 89,
          totalQuizzes: 234,
          systemUptime: 99.8
        }
      };
    }
    const session = this.driver.session();
    try {
      // User Engagement
      const userStats = await session.run(`
        MATCH (u:User)
        WITH count(u) AS totalUsers
        MATCH (u:User) WHERE u.lastActive > datetime() - duration({days: 30})
        WITH totalUsers, count(u) AS activeUsers
        MATCH (u:User) WHERE u.createdAt > datetime() - duration({days: 7})
        WITH totalUsers, activeUsers, count(u) AS newUsersThisWeek
        MATCH (u:User) WHERE u.createdAt > datetime() - duration({months: 1})
        RETURN totalUsers, activeUsers, newUsersThisWeek, count(u) AS newUsersThisMonth
      `);
      const userRow = userStats.records[0];
      const totalUsers = userRow.get('totalUsers').toNumber();
      const activeUsers = userRow.get('activeUsers').toNumber();
      const newUsersThisWeek = userRow.get('newUsersThisWeek').toNumber();
      const newUsersThisMonth = userRow.get('newUsersThisMonth').toNumber();
      const retentionRate = totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0;

      // Learning Progress
      const topicsCompletedResult = await session.run(`
        MATCH (up:UserProgress {status: 'completed'}) RETURN count(up) AS totalTopicsCompleted
      `);
      const totalTopicsCompleted = topicsCompletedResult.records[0].get('totalTopicsCompleted').toNumber();

      // Average completion rate per user
      const avgCompletionResult = await session.run(`
        MATCH (u:User)
        OPTIONAL MATCH (u)-[:HAS_PROGRESS]->(up:UserProgress {status: 'completed'})
        WITH u, count(up) AS completed
        RETURN avg(completed) AS averageCompletionRate
      `);
      const averageCompletionRate = avgCompletionResult.records[0].get('averageCompletionRate');

      // Most/Least Popular Topics
      const mostPopularResult = await session.run(`
        MATCH (t:Topic)<-[:ON_TOPIC]-(up:UserProgress {status: 'completed'})
        RETURN t.name AS name, count(up) AS count
        ORDER BY count DESC
        LIMIT 5
      `);
      const mostPopularTopics = mostPopularResult.records.map(r => ({ name: r.get('name'), count: r.get('count').toNumber() }));
      const leastPopularResult = await session.run(`
        MATCH (t:Topic)<-[:ON_TOPIC]-(up:UserProgress {status: 'completed'})
        RETURN t.name AS name, count(up) AS count
        ORDER BY count ASC
        LIMIT 5
      `);
      const leastPopularTopics = leastPopularResult.records.map(r => ({ name: r.get('name'), count: r.get('count').toNumber() }));

      // Performance
      const avgQuizScoreResult = await session.run(`
        MATCH (up:UserProgress) WHERE up.quizScore IS NOT NULL
        RETURN avg(up.quizScore) AS averageQuizScore
      `);
      const averageQuizScore = avgQuizScoreResult.records[0].get('averageQuizScore') || 0;
      // Average time per topic (mocked, unless you track time)
      const averageTimePerTopic = 45;
      // Top performing users (by completed topics)
      const topUsersResult = await session.run(`
        MATCH (u:User)-[:HAS_PROGRESS]->(up:UserProgress {status: 'completed'})
        RETURN u.username AS username, count(up) AS topicsCompleted
        ORDER BY topicsCompleted DESC
        LIMIT 5
      `);
      const topPerformingUsers = topUsersResult.records.map(r => ({ username: r.get('username'), score: 0, topicsCompleted: r.get('topicsCompleted').toNumber() }));

      // System Metrics
      const totalResourcesResult = await session.run(`MATCH (r:Resource) RETURN count(r) AS totalResources`);
      const totalProblemsResult = await session.run(`MATCH (p:Problem) RETURN count(p) AS totalProblems`);
      const totalQuizzesResult = await session.run(`MATCH (q:QuizQuestion) RETURN count(q) AS totalQuizzes`);
      const totalResources = totalResourcesResult.records[0].get('totalResources').toNumber();
      const totalProblems = totalProblemsResult.records[0].get('totalProblems').toNumber();
      const totalQuizzes = totalQuizzesResult.records[0].get('totalQuizzes').toNumber();
      const systemUptime = 99.8; // Mocked

      return {
        userEngagement: {
          totalUsers,
          activeUsers,
          newUsersThisWeek,
          newUsersThisMonth,
          retentionRate
        },
        learningProgress: {
          totalTopicsCompleted,
          averageCompletionRate: averageCompletionRate ? averageCompletionRate.toFixed(1) : 0,
          mostPopularTopics,
          leastPopularTopics
        },
        performance: {
          averageQuizScore: averageQuizScore ? averageQuizScore.toFixed(1) : 0,
          averageTimePerTopic,
          topPerformingUsers
        },
        systemMetrics: {
          totalResources,
          totalProblems,
          totalQuizzes,
          systemUptime
        }
      };
    } catch (error) {
      console.error('Error fetching admin analytics:', error);
      // fallback to mock if error
      return {
        userEngagement: {
          totalUsers: 0,
          activeUsers: 0,
          newUsersThisWeek: 0,
          newUsersThisMonth: 0,
          retentionRate: 0
        },
        learningProgress: {
          totalTopicsCompleted: 0,
          averageCompletionRate: 0,
          mostPopularTopics: [],
          leastPopularTopics: []
        },
        performance: {
          averageQuizScore: 0,
          averageTimePerTopic: 0,
          topPerformingUsers: []
        },
        systemMetrics: {
          totalResources: 0,
          totalProblems: 0,
          totalQuizzes: 0,
          systemUptime: 0
        }
      };
    } finally {
      await session.close();
    }
  }

  async getSystemSettings(): Promise<any> {
    return {
      appName: 'DSA Learning Platform',
      appVersion: '1.0.0',
      maintenanceMode: false,
      registrationEnabled: true,
      emailNotifications: true,
      quizThreshold: 70,
      maxLoginAttempts: 5,
      sessionTimeout: 30,
      defaultUserRole: 'user',
      autoBackup: true,
      backupFrequency: 'daily',
      analyticsEnabled: true,
      debugMode: false
    };
  }

  async updateSystemSettings(settings: any): Promise<any> {
    console.log('Updating system settings:', settings);
    return settings;
  }

  async getSystemHealth(): Promise<any> {
    return {
      database: {
        status: 'healthy',
        connections: 5,
        responseTime: 12
      },
      server: {
        status: 'healthy',
        uptime: 86400,
        memoryUsage: 45.2,
        cpuUsage: 23.1
      },
      storage: {
        status: 'healthy',
        usedSpace: 1024 * 1024 * 1024 * 5, // 5GB
        totalSpace: 1024 * 1024 * 1024 * 20, // 20GB
        freeSpace: 1024 * 1024 * 1024 * 15 // 15GB
      }
    };
  }

  async backupDatabase(): Promise<void> {
    console.log('Database backup initiated');
  }

  async clearCache(): Promise<void> {
    console.log('Cache cleared');
  }

  // Additional methods for quiz questions, problems, etc.
  async getAllQuizQuestions(): Promise<any[]> {
    if (!this.driver) {
      // Return mock quiz questions from topics
      const mockQuizQuestions: any[] = [];
      mockTopics.forEach(topic => {
        if (topic.quizQuestions) {
          topic.quizQuestions.forEach((q: any) => {
            mockQuizQuestions.push({
              id: q.id,
              question: q.question,
              options: q.options,
              correctAnswer: q.correctAnswer,
              difficulty: 'Medium',
              category: topic.name,
              topicId: topic.id,
              explanation: `This question tests understanding of ${topic.name} concepts.`
            });
          });
        }
      });
      return mockQuizQuestions;
    }

    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (qq:QuizQuestion)
        OPTIONAL MATCH (t:Topic)-[:HAS_QUIZ_QUESTION]->(qq)
        RETURN qq, t
        ORDER BY qq.createdAt DESC
      `);
      
      return result.records.map(record => {
        const qq = record.get('qq').properties;
        const topic = record.get('t')?.properties;
        return {
          id: qq.id,
          question: qq.question,
          options: qq.options,
          correctAnswer: qq.correctAnswer,
          difficulty: qq.difficulty || 'Medium',
          category: topic?.name || 'General',
          topicId: topic?.id,
          explanation: qq.explanation,
          createdAt: qq.createdAt
        };
      });
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      return [];
    } finally {
      await session.close();
    }
  }

  async createQuizQuestion(questionData: any): Promise<any> {
    if (!questionData.topicId) {
      throw new Error('topicId is required to create a quiz question');
    }
    if (!this.driver) {
    return { id: `quiz_${Date.now()}`, ...questionData };
    }
    const session = this.driver.session();
    try {
      const quizQuestionId = `quiz_${Date.now()}`;
      const result = await session.run(`
        MATCH (t:Topic {id: $topicId})
        CREATE (qq:QuizQuestion {
          id: $quizQuestionId,
          question: $question,
          options: $options,
          correctAnswer: $correctAnswer,
          createdAt: datetime()
        })
        CREATE (t)-[:HAS_QUIZ_QUESTION]->(qq)
        RETURN qq
      `, {
        topicId: questionData.topicId,
        quizQuestionId,
        question: questionData.question,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer
      });
      return result.records[0].get('qq').properties;
    } catch (error) {
      console.error('Error creating quiz question:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async updateQuizQuestion(questionId: string, questionData: any): Promise<any> {
    if (!this.driver) {
      console.log('Mock: Updating quiz question', questionId, questionData);
      return { id: questionId, ...questionData };
    }

    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (qq:QuizQuestion {id: $questionId})
        SET qq.question = $question,
            qq.options = $options,
            qq.correctAnswer = $correctAnswer,
            qq.explanation = $explanation,
            qq.difficulty = $difficulty,
            qq.category = $category,
            qq.updatedAt = datetime()
        RETURN qq
      `, {
        questionId,
        question: questionData.question,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
        explanation: questionData.explanation,
        difficulty: questionData.difficulty,
        category: questionData.category
      });
      
      return result.records[0].get('qq').properties;
    } catch (error) {
      console.error('Error updating quiz question:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async deleteQuizQuestion(questionId: string): Promise<void> {
    if (!this.driver) {
      console.log('Mock: Deleting quiz question', questionId);
      return;
    }

    const session = this.driver.session();
    try {
      await session.run(`
        MATCH (qq:QuizQuestion {id: $questionId})
        OPTIONAL MATCH (t:Topic)-[:HAS_QUIZ_QUESTION]->(qq)
        DELETE qq
      `, { questionId });
    } catch (error) {
      console.error('Error deleting quiz question:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async getAllProblems(): Promise<any[]> {
    console.log('🔍 getAllProblems called');
    
    if (!this.driver) {
      console.log('⚠️  No Neo4j driver, returning mock problems');
      // Return mock problems from topics
      const mockProblems: any[] = [];
      mockTopics.forEach(topic => {
        if (topic.problems) {
          topic.problems.forEach((p: any) => {
            mockProblems.push({
              id: p.id,
              title: p.title,
              description: `Practice problem for ${topic.name}: ${p.title}`,
              difficulty: p.difficulty,
              category: topic.name,
              topicId: topic.id,
              leetcodeId: p.leetcodeId,
              leetcodeLink: p.leetcodeLink,
              timeComplexity: 'O(n)',
              spaceComplexity: 'O(1)',
              createdAt: new Date().toISOString()
            });
          });
        }
      });
      console.log(`📊 Returning ${mockProblems.length} mock problems`);
      return mockProblems;
    }

    console.log('🔗 Neo4j driver available, querying database...');
    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (p:Problem)
        OPTIONAL MATCH (t:Topic)-[:HAS_PROBLEM]->(p)
        RETURN p, t
        ORDER BY p.createdAt DESC
      `);
      
      console.log(`📊 Found ${result.records.length} problems in database`);
      
      const problems = result.records.map(record => {
        const p = record.get('p').properties;
        const topic = record.get('t')?.properties;
        return {
          id: p.id,
          title: p.title,
          description: p.description,
          difficulty: p.difficulty,
          category: topic?.name || 'General',
          topicId: topic?.id,
          subtopicId: p.subtopicId,
          leetcodeId: p.leetcodeId,
          leetcodeLink: p.leetcodeLink,
          solution: p.solution,
          testCases: p.testCases,
          timeComplexity: p.timeComplexity,
          spaceComplexity: p.spaceComplexity,
          createdAt: p.createdAt
        };
      });
      
      console.log('✅ Successfully processed problems from database');
      return problems;
    } catch (error) {
      console.error('❌ Error fetching problems:', error);
      return [];
    } finally {
      await session.close();
    }
  }

  async createProblem(problemData: any): Promise<any> {
    if (!this.driver) {
      console.log('Mock: Creating problem', problemData);
      return { id: `prob_${Date.now()}`, ...problemData };
    }

    const session = this.driver.session();
    try {
      const problemId = `prob_${Date.now()}`;
      const result = await session.run(`
        CREATE (p:Problem {
          id: $problemId,
          title: $title,
          description: $description,
          difficulty: $difficulty,
          category: $category,
          leetcodeId: $leetcodeId,
          leetcodeLink: $leetcodeLink,
          solution: $solution,
          testCases: $testCases,
          timeComplexity: $timeComplexity,
          spaceComplexity: $spaceComplexity,
          createdAt: datetime()
        })
        RETURN p
      `, {
        problemId,
        title: problemData.title,
        description: problemData.description,
        difficulty: problemData.difficulty,
        category: problemData.category,
        leetcodeId: problemData.leetcodeId,
        leetcodeLink: problemData.leetcodeLink,
        solution: problemData.solution,
        testCases: problemData.testCases,
        timeComplexity: problemData.timeComplexity,
        spaceComplexity: problemData.spaceComplexity
      });
      
      return result.records[0].get('p').properties;
    } catch (error) {
      console.error('Error creating problem:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async updateProblem(problemId: string, problemData: any): Promise<any> {
    if (!this.driver) {
      console.log('Mock: Updating problem', problemId, problemData);
      return { id: problemId, ...problemData };
    }

    const session = this.driver.session();
    try {
      const result = await session.run(`
        MATCH (p:Problem {id: $problemId})
        SET p.title = $title,
            p.description = $description,
            p.difficulty = $difficulty,
            p.category = $category,
            p.leetcodeId = $leetcodeId,
            p.leetcodeLink = $leetcodeLink,
            p.solution = $solution,
            p.testCases = $testCases,
            p.timeComplexity = $timeComplexity,
            p.spaceComplexity = $spaceComplexity,
            p.updatedAt = datetime()
        RETURN p
      `, {
        problemId,
        title: problemData.title,
        description: problemData.description,
        difficulty: problemData.difficulty,
        category: problemData.category,
        leetcodeId: problemData.leetcodeId,
        leetcodeLink: problemData.leetcodeLink,
        solution: problemData.solution,
        testCases: problemData.testCases,
        timeComplexity: problemData.timeComplexity,
        spaceComplexity: problemData.spaceComplexity
      });
      
      return result.records[0].get('p').properties;
    } catch (error) {
      console.error('Error updating problem:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async deleteProblem(problemId: string): Promise<void> {
    if (!this.driver) {
      console.log('Mock: Deleting problem', problemId);
      return;
    }

    const session = this.driver.session();
    try {
      await session.run(`
        MATCH (p:Problem {id: $problemId})
        OPTIONAL MATCH (t:Topic)-[:HAS_PROBLEM]->(p)
        DELETE p
      `, { problemId });
    } catch (error) {
      console.error('Error deleting problem:', error);
      throw error;
    } finally {
      await session.close();
    }
  }

  async getUserAnalytics(userId: string): Promise<any> {
    return {
      userId,
      topicsCompleted: 5,
      averageScore: 78.5,
      timeSpent: 1200,
      lastActive: new Date().toISOString()
    };
  }

  async getLearningPathAnalytics(): Promise<any> {
    return {
      totalPaths: 15,
      averageCompletionTime: 45,
      successRate: 85.2
    };
  }

  async uploadResource(file: any, resourceData: any): Promise<any> {
    console.log('Uploading resource:', file.name, resourceData);
    return { id: `upload_${Date.now()}`, ...resourceData };
  }

  async bulkImportTopics(topicsData: any[]): Promise<any> {
    console.log('Bulk importing topics:', topicsData.length);
    return { imported: topicsData.length, success: true };
  }

  async bulkImportResources(resourcesData: any[]): Promise<any> {
    console.log('Bulk importing resources:', resourcesData.length);
    return { imported: resourcesData.length, success: true };
  }

  async getResourceCompletionStatus(userId: string, resourceId: string): Promise<{ resourceId: string; isCompleted: boolean }> {
    if (!this.driver) {
      const isCompleted = !!(this.userResourceCompletion[userId]?.[resourceId]);
      return { resourceId, isCompleted };
    }
    // Cypher query to fetch resource completion status
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[r:COMPLETED_RESOURCE]->(res:Resource {id: $resourceId}) RETURN r`,
        { userId, resourceId }
      );
      return { resourceId, isCompleted: result.records.length > 0 };
    } finally {
      await session.close();
    }
  }

  async updateResourceCompletion(userId: string, resourceId: string, isCompleted: boolean): Promise<void> {
    if (!this.driver) {
      if (!this.userResourceCompletion[userId]) this.userResourceCompletion[userId] = {};
      this.userResourceCompletion[userId][resourceId] = isCompleted;
      return;
    }
    const session = this.driver.session();
    try {
      if (isCompleted) {
        await session.run(
          `MATCH (u:User {id: $userId}), (res:Resource {id: $resourceId})
           MERGE (u)-[:COMPLETED_RESOURCE]->(res)`,
          { userId, resourceId }
        );
      } else {
        await session.run(
          `MATCH (u:User {id: $userId})-[r:COMPLETED_RESOURCE]->(res:Resource {id: $resourceId})
           DELETE r`,
          { userId, resourceId }
        );
      }
    } finally {
      await session.close();
    }
  }

  async getSubtopicCompletionStatus(userId: string, subtopicId: string): Promise<{ subtopicId: string; isCompleted: boolean }> {
    if (!this.driver) {
      const isCompleted = !!(this.userSubtopicCompletion[userId]?.[subtopicId]);
      return { subtopicId, isCompleted };
    }
    const session = this.driver.session();
    try {
      const result = await session.run(
        `MATCH (u:User {id: $userId})-[r:COMPLETED_SUBTOPIC]->(s:Subtopic {id: $subtopicId}) RETURN r`,
        { userId, subtopicId }
      );
      return { subtopicId, isCompleted: result.records.length > 0 };
    } finally {
      await session.close();
    }
  }

  async updateSubtopicCompletion(userId: string, subtopicId: string, isCompleted: boolean): Promise<void> {
    if (!this.driver) {
      if (!this.userSubtopicCompletion[userId]) this.userSubtopicCompletion[userId] = {};
      this.userSubtopicCompletion[userId][subtopicId] = isCompleted;
      return;
    }
    const session = this.driver.session();
    try {
      if (isCompleted) {
        await session.run(
          `MATCH (u:User {id: $userId}), (s:Subtopic {id: $subtopicId})
           MERGE (u)-[:COMPLETED_SUBTOPIC]->(s)`,
          { userId, subtopicId }
        );
      } else {
        await session.run(
          `MATCH (u:User {id: $userId})-[r:COMPLETED_SUBTOPIC]->(s:Subtopic {id: $subtopicId})
           DELETE r`,
          { userId, subtopicId }
        );
      }
    } finally {
      await session.close();
    }
  }


}

export default new Neo4jService();
