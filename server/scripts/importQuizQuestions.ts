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

const quizQuestions = [
  {
    id: 'quiz-arrays-1',
    question: 'What is the time complexity of accessing an element in an array by index?',
    options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'],
    correctAnswer: 'O(1)',
    difficulty: 'Easy',
    category: 'Arrays',
    topicId: 'arrays',
    explanation: 'Array access by index is a constant time operation O(1) because the memory address can be calculated directly.'
  },
  {
    id: 'quiz-arrays-2',
    question: 'Which of the following is NOT a common array operation?',
    options: ['Insertion', 'Deletion', 'Search', 'Binary Tree Traversal'],
    correctAnswer: 'Binary Tree Traversal',
    difficulty: 'Easy',
    category: 'Arrays',
    topicId: 'arrays',
    explanation: 'Binary tree traversal is not an array operation. Arrays support insertion, deletion, and search operations.'
  },
  {
    id: 'quiz-linked-lists-1',
    question: 'What is the main advantage of a linked list over an array?',
    options: ['Faster access time', 'Dynamic size', 'Better cache locality', 'Lower memory usage'],
    correctAnswer: 'Dynamic size',
    difficulty: 'Medium',
    category: 'Linked Lists',
    topicId: 'linked-lists',
    explanation: 'Linked lists can grow and shrink dynamically without needing to pre-allocate memory or copy elements.'
  },
  {
    id: 'quiz-stacks-1',
    question: 'Which data structure follows the LIFO principle?',
    options: ['Queue', 'Stack', 'Tree', 'Graph'],
    correctAnswer: 'Stack',
    difficulty: 'Easy',
    category: 'Stacks',
    topicId: 'stacks',
    explanation: 'Stack follows Last In First Out (LIFO) principle where the last element added is the first one to be removed.'
  },
  {
    id: 'quiz-trees-1',
    question: 'What is the maximum number of children a node can have in a binary tree?',
    options: ['1', '2', '3', 'Unlimited'],
    correctAnswer: '2',
    difficulty: 'Easy',
    category: 'Trees',
    topicId: 'trees',
    explanation: 'In a binary tree, each node can have at most 2 children (left and right child).'
  },
  {
    id: 'quiz-dp-1',
    question: 'What is the time complexity of the naive recursive Fibonacci implementation?',
    options: ['O(n)', 'O(log n)', 'O(2^n)', 'O(n²)'],
    correctAnswer: 'O(2^n)',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    topicId: 'dynamic-programming',
    explanation: 'The naive recursive Fibonacci has exponential time complexity O(2^n) due to repeated calculations.'
  },
  {
    id: 'quiz-graphs-1',
    question: 'Which algorithm is used to find the shortest path in an unweighted graph?',
    options: ['Dijkstra\'s', 'BFS', 'DFS', 'Floyd-Warshall'],
    correctAnswer: 'BFS',
    difficulty: 'Medium',
    category: 'Graphs',
    topicId: 'graphs',
    explanation: 'Breadth-First Search (BFS) finds the shortest path in an unweighted graph by exploring all nodes at the current distance before moving to nodes at the next distance level.'
  },
  {
    id: 'quiz-hashing-1',
    question: 'What is the average time complexity of search in a hash table?',
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 'O(1)',
    difficulty: 'Medium',
    category: 'Hashing',
    topicId: 'hashing',
    explanation: 'Hash tables provide average O(1) time complexity for search operations, though worst case can be O(n) due to collisions.'
  },
  {
    id: 'quiz-strings-1',
    question: 'What is the time complexity of the KMP string matching algorithm?',
    options: ['O(m+n)', 'O(m*n)', 'O(n²)', 'O(log n)'],
    correctAnswer: 'O(m+n)',
    difficulty: 'Hard',
    category: 'Strings',
    topicId: 'strings',
    explanation: 'KMP algorithm has linear time complexity O(m+n) where m is the length of the pattern and n is the length of the text.'
  },
  {
    id: 'quiz-backtracking-1',
    question: 'Which problem is commonly solved using backtracking?',
    options: ['Binary Search', 'N-Queens', 'Bubble Sort', 'Quick Sort'],
    correctAnswer: 'N-Queens',
    difficulty: 'Hard',
    category: 'Backtracking',
    topicId: 'backtracking',
    explanation: 'The N-Queens problem is a classic backtracking problem where we try different positions for queens and backtrack when a solution is not possible.'
  }
];

async function importQuizQuestions() {
  const session = driver.session();
  
  try {
    console.log('🚀 Starting quiz questions import...');
    console.log(`📊 Total quiz questions to import: ${quizQuestions.length}`);
    
    let imported = 0;
    let skipped = 0;
    
    for (const question of quizQuestions) {
      try {
        // Check if question already exists
        const existing = await session.run(`
          MATCH (qq:QuizQuestion {id: $id})
          RETURN qq
        `, { id: question.id });
        
        if (existing.records.length > 0) {
          console.log(`⏭️  Skipping ${question.question.substring(0, 50)}... (already exists)`);
          skipped++;
          continue;
        }
        
        // Create the quiz question
        await session.run(`
          CREATE (qq:QuizQuestion {
            id: $id,
            question: $question,
            options: $options,
            correctAnswer: $correctAnswer,
            difficulty: $difficulty,
            category: $category,
            topicId: $topicId,
            explanation: $explanation,
            createdAt: datetime()
          })
        `, {
          id: question.id,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer,
          difficulty: question.difficulty,
          category: question.category,
          topicId: question.topicId,
          explanation: question.explanation
        });
        
        // Link to topic if it exists
        await session.run(`
          MATCH (t:Topic {id: $topicId})
          MATCH (qq:QuizQuestion {id: $questionId})
          MERGE (t)-[:HAS_QUIZ_QUESTION]->(qq)
        `, {
          topicId: question.topicId,
          questionId: question.id
        });
        
        console.log(`✅ Imported: ${question.question.substring(0, 50)}...`);
        imported++;
        
      } catch (error: any) {
        console.error(`❌ Error importing quiz question:`, error.message);
      }
    }
    
    console.log('\n📈 Import Summary:');
    console.log(`✅ Successfully imported: ${imported} quiz questions`);
    console.log(`⏭️  Skipped (already exists): ${skipped} quiz questions`);
    console.log(`📊 Total processed: ${imported + skipped} quiz questions`);
    
  } catch (error) {
    console.error('❌ Error during import:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the import
importQuizQuestions().catch(console.error); 