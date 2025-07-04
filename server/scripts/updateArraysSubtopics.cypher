// Update Arrays subtopics in Neo4j database
// This script updates the existing Arrays topic with new subtopics

// First, let's see what subtopics currently exist for Arrays
MATCH (t:Topic {name: 'Arrays'})-[:HAS_SUBTOPIC]->(st:Subtopic)
RETURN t.name as Topic, collect(st.name) as CurrentSubtopics;

// Remove existing subtopics for Arrays
MATCH (t:Topic {name: 'Arrays'})-[:HAS_SUBTOPIC]->(st:Subtopic)
DETACH DELETE st;

// Create new subtopics for Arrays
MATCH (t:Topic {name: 'Arrays'})

// Create 1D Arrays subtopic
CREATE (st1:Subtopic {
  id: 'sub_arrays_0',
  name: '1D Arrays',
  description: 'Basic operations and concepts of one-dimensional arrays',
  difficultyScore: 1,
  estimatedTimeMins: 30,
  priority: 1
})
CREATE (t)-[:HAS_SUBTOPIC]->(st1)

// Create 2D Arrays subtopic
CREATE (st2:Subtopic {
  id: 'sub_arrays_1',
  name: '2D Arrays',
  description: 'Two-dimensional arrays and matrix operations',
  difficultyScore: 2,
  estimatedTimeMins: 45,
  priority: 2
})
CREATE (t)-[:HAS_SUBTOPIC]->(st2)

// Create Dynamic Arrays subtopic
CREATE (st3:Subtopic {
  id: 'sub_arrays_2',
  name: 'Dynamic Arrays',
  description: 'Dynamic array implementation and resizing strategies',
  difficultyScore: 2,
  estimatedTimeMins: 40,
  priority: 3
})
CREATE (t)-[:HAS_SUBTOPIC]->(st3)

// Create Prefix Sum subtopic
CREATE (st4:Subtopic {
  id: 'sub_arrays_3',
  name: 'Prefix Sum',
  description: 'Prefix sum technique for range queries',
  difficultyScore: 3,
  estimatedTimeMins: 50,
  priority: 4
})
CREATE (t)-[:HAS_SUBTOPIC]->(st4)

// Create Two Pointer & Sliding Window subtopic (combined)
CREATE (st5:Subtopic {
  id: 'sub_arrays_4',
  name: 'Two Pointer & Sliding Window',
  description: 'Two pointer technique and sliding window algorithms',
  difficultyScore: 4,
  estimatedTimeMins: 60,
  priority: 5
})
CREATE (t)-[:HAS_SUBTOPIC]->(st5)

// Create Kadane's Algorithm subtopic
CREATE (st6:Subtopic {
  id: 'sub_arrays_5',
  name: 'Kadane\'s Algorithm',
  description: 'Maximum subarray sum algorithm',
  difficultyScore: 4,
  estimatedTimeMins: 45,
  priority: 6
})
CREATE (t)-[:HAS_SUBTOPIC]->(st6)

// Create Array Rotation subtopic
CREATE (st7:Subtopic {
  id: 'sub_arrays_6',
  name: 'Array Rotation',
  description: 'Array rotation techniques and algorithms',
  difficultyScore: 3,
  estimatedTimeMins: 40,
  priority: 7
})
CREATE (t)-[:HAS_SUBTOPIC]->(st7)

// Create Searching subtopic
CREATE (st8:Subtopic {
  id: 'sub_arrays_7',
  name: 'Searching (Linear/Binary)',
  description: 'Linear search and binary search algorithms',
  difficultyScore: 2,
  estimatedTimeMins: 50,
  priority: 8
})
CREATE (t)-[:HAS_SUBTOPIC]->(st8)

// Create Sorting Basics subtopic
CREATE (st9:Subtopic {
  id: 'sub_arrays_8',
  name: 'Sorting Basics (Bubble, Insertion, Selection, Cycle)',
  description: 'Basic sorting algorithms including bubble, insertion, selection, and cycle sort',
  difficultyScore: 3,
  estimatedTimeMins: 70,
  priority: 9
})
CREATE (t)-[:HAS_SUBTOPIC]->(st9)

// Create relationships between subtopics (prerequisites)
CREATE (st1)-[:NEXT_TOPIC]->(st2)
CREATE (st2)-[:NEXT_TOPIC]->(st3)
CREATE (st3)-[:NEXT_TOPIC]->(st4)
CREATE (st4)-[:NEXT_TOPIC]->(st5)
CREATE (st5)-[:NEXT_TOPIC]->(st6)
CREATE (st6)-[:NEXT_TOPIC]->(st7)
CREATE (st7)-[:NEXT_TOPIC]->(st8)
CREATE (st8)-[:NEXT_TOPIC]->(st9)

// Verify the new structure
MATCH (t:Topic {name: 'Arrays'})-[:HAS_SUBTOPIC]->(st:Subtopic)
RETURN t.name as Topic, st.name as Subtopic, st.id as SubtopicID, st.difficultyScore as Difficulty
ORDER BY st.priority; 