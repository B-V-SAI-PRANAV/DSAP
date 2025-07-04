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

// Replace mockResources with the new mapping
const resourcesMapping = {
  Arrays: {
    topic: {
      cheatsheet: '/1_Arrays_Cheatsheet.pdf',
      pdf: '/arrays.pdf',
      video: 'https://youtu.be/n60Dn0UsbEk?si=YGIL_RgJEe_Py-7d'
    },
    subtopics: [
      { name: '1D Array', video: 'https://youtu.be/239ubH043lI?si=n03b6AT_ehJ_SCoF' },
      { name: '2D Array', video: 'https://youtu.be/v4J2bEQF6jk?si=IzY1wOb_001fvq--' },
      { name: 'Dynamic Arrays', video: 'https://youtu.be/jzJlq35dQII?si=8fDOEjbcXif8fzij' },
      { name: 'Prefix Sum', video: 'https://youtu.be/5_DFKL4zYLc?si=FQv3AkwEjvURDu_T' },
      { name: 'Two Pointer & Sliding Window', video: 'https://youtube.com/playlist?list=PLgUwDviBIf0q7vrFA_HEWcqRqMpCXzYAL&si=ZxAciTMzEwI2agt-' },
      { name: "Kadane's Algorithm", video: 'https://youtu.be/AHZpyENo7k4?si=FhvwBYmgA0cpZdPx' },
      { name: 'Array Rotation', video: 'https://youtu.be/wvcQg43_V8U?si=bKh5iw1f8NkK6bFS' },
      { name: 'Searching: Linear Search', video: 'https://youtu.be/_HRA37X8N_Q?si=DJUJkQTSU-Maw69K' },
      { name: 'Searching: Binary Search', video: 'https://youtu.be/f6UU7V3szVw?si=3Y-b63X9w1ELctqy' },
      { name: 'Searching: Binary Search in 2D Arrays', video: 'https://youtu.be/enI_KyGLYPo?si=eNQpJtagOQ5Mk_Eg' },
      { name: 'Sorting: Bubble Sort', video: 'https://youtu.be/F5MZyqRp_IM?si=K7z4InlWMbl4ll5C' },
      { name: 'Sorting: Selection Sort', video: 'https://youtu.be/Nd4SCCIHFWk?si=yxDCZYUvxfWIybyq' },
      { name: 'Sorting: Insertion Sort', video: 'https://youtu.be/By_5-RRqVeE?si=vJ_AHo3p0gU5rVuo' },
      { name: 'Sorting: Cycle Sort', video: 'https://youtu.be/JfinxytTYFQ?si=EuvBQl7Nx0hVOINg' }
    ]
  },
  'Linked Lists': {
    topic: {
      cheatsheet: '/4_LinkedList_Cheatsheet.pdf',
      pdf: '/linked.pdf',
      video1: 'https://youtu.be/58YbpRDc4yw?si=1H8gN2O3t2NiSngB',
      video2: 'https://youtu.be/70tx7KcMROc?si=OE0wvuFa4_lTWF4e'
    },
    subtopics: [
      { name: "Floyd's Cycle Detection", video: 'https://youtu.be/wiOo4DC5GGA?si=pCztMI1_4hVBrWOQ' },
      { name: 'Merge Sort on Linked List', video: 'https://youtu.be/8ocB7a_c-Cc?si=AVB9ePzqrqJcrsuP' },
      { name: 'LRU Cache Implementation', video: 'https://youtu.be/GsY6y0iPaHw?si=i3XEa1UtHDDyDu7R' },
      { name: 'Skip Lists (advanced)', video: 'https://youtu.be/FMYKVdWywcg?si=d0GC7kJH9vHSYs5A' }
    ]
  },
  Stacks: {
    topic: {
      cheatsheet: '/5_Stacks_Cheatsheet.pdf',
      pdf: '/stacks.pdf',
      video: 'https://youtu.be/cHT6sG_hUZI?si=_JSpDnbmo40YFNoy'
    },
    subtopics: [
      { name: 'Valid Parentheses', video: 'https://youtu.be/cHT6sG_hUZI?si=_JSpDnbmo40YFNoy' },
      { name: 'Infix to Postfix', video: 'https://youtu.be/4pIc9UBHJtk?si=hSVVC2aEQsjvntDW' },
      { name: 'Postfix Evaluation', video: 'https://youtu.be/u3paQa8KXu0?si=ylg5VqMGcit9rMKS' },
      { name: 'Monotonic Stack', video: 'https://youtu.be/vTG32RrjJaQ?si=g1W_xhJsE9MtE5lx' },
      { name: 'Next Greater Element', video: 'https://youtu.be/e7XQLtOQM3I?si=o08yj0IgsCaaAz03' }
    ]
  },
  Queues: {
    topic: {
      cheatsheet: '/6_Queues_Cheatsheet.pdf',
      pdf: '/queues.pdf',
      video: 'https://youtu.be/4mKKolshFD0?si=uUmc5paLo2AaESW6'
    },
    subtopics: [
      { name: 'Circular Queue', video: 'https://youtu.be/4mKKolshFD0?si=uUmc5paLo2AaESW6' },
      { name: 'Priority Queue', video: 'https://youtu.be/EOkC1eQM-DE?si=apz3z_hf3P60pCK6' },
      { name: 'Deque (Double-ended Queue)', video: 'https://youtu.be/pqg0SOPRlJ4?si=yVXXGju7cdFSDRr4' }
    ]
  },
  Trees: {
    topic: {
      cheatsheet: '/7_Trees_Cheatsheet.pdf',
      pdf: '/trees.pdf',
      video: 'https://youtu.be/4s1Tcvm00pA?si=aW_PltBGY8wS82Xt'
    },
    subtopics: [
      { name: 'Binary Tree', video: 'https://youtu.be/4s1Tcvm00pA?si=aW_PltBGY8wS82Xt' },
      { name: 'Binary Search Tree (BST)', video: 'https://youtu.be/p7-9UvDQZ3w?si=NVHf3lH0B9TTH-ZE' },
      { name: 'AVL Tree', video: 'https://youtu.be/CVA85JuJEn0?si=fvsLEi8DP_MpKzJ1' },
      { name: 'Tree Traversals (Inorder, Preorder, Postorder)', video: 'https://youtu.be/-b2lciNd2L4?si=TpJ5NX9ozqBoG4zg' },
      { name: 'Lowest Common Ancestor (LCA)', video: 'https://youtu.be/_-QHfMDde90?si=iFQlO2tHinAs3VE4' },
      { name: 'Tree Diameter', video: 'https://youtu.be/Rezetez59Nk?si=STVsCA9ldFoao2bS' },
      { name: 'Serialize/Deserialize Tree', video: 'https://youtu.be/-YbXySKJsX8?si=gO_IF7axSMcDQ84E' }
    ]
  },
  Heaps: {
    topic: {
      cheatsheet: '/8_Heaps_Cheatsheet.pdf',
      pdf: '/heaps.pdf',
      video: 'https://youtu.be/Qf-TDPr0nYw?si=C8HzkgeGn885btyR'
    },
    subtopics: [
      { name: 'Min Heap and Max Heap', video: 'https://youtu.be/NEtwJASLU8Q?si=pOn8oJgmI-Jj7TBh' },
      { name: 'Heap Sort', video: 'https://youtu.be/Q_eia3jC9Ts?si=M_mInvHjT-7zeFEz' },
      { name: 'Priority Queue Implementation', video: 'https://youtu.be/YDo65gKDRPo?si=a03fQ_CZLWArnpdJ' },
      { name: 'Top K Elements', video: 'https://youtu.be/EBNPu0GgM64?si=aS0EQ7SpvZ4yTaj2' },
      { name: 'Merge K Sorted Lists', video: 'https://youtu.be/1zktEppsdig?si=fKjbZ6p2ZXHXmc9E' },
      { name: 'Median in Data Stream', video: 'https://youtu.be/itmhHWaHupI?si=IZ45CqhzhxV708NQ' }
    ]
  },
  Graphs: {
    topic: {
      cheatsheet: '/9_Graphs_Cheatsheet.pdf',
      pdf: '/Graph Algorithms.pdf',
      video: 'https://youtu.be/OsNklbh9gYI?si=YgR5qXHRpHv2txDl'
    },
    subtopics: [
      { name: 'Graph Representation (Adjacency Matrix/List)', video: 'https://youtu.be/OsNklbh9gYI?si=YgR5qXHRpHv2txDl' },
      { name: 'Depth-First Search (DFS)', video: 'https://youtu.be/Qzf1a--rhp8?si=80QeSpZk0s9Ix6XS' },
      { name: 'Breadth-First Search (BFS)', video: 'https://youtu.be/-tgVpUgsQ5k?si=iEM-4dYt0h_EMphl' },
      { name: 'Topological Sort', video: 'https://youtu.be/5lZ0iJMrUMk?si=fgMG3ao-W3WeRCbP' },
      { name: 'Dijkstra', video: 'https://youtu.be/V6H1qAeB-l4?si=1WUutznyxoUv_L-J' },
      { name: 'Bellman Ford', video: 'https://youtu.be/0vVofAhAYjc?si=fPdfGA5vnbEAG907' },
      { name: 'Kruskals', video: 'https://youtu.be/DMnDM_sxVig?si=hgPn5g-ESW4jz_uI' },
      { name: 'Prims', video: 'https://youtu.be/mJcZjjKzeqk?si=Zk_un4EPWnZUxPzO' },
      { name: 'Strongly Connected Components', video: 'https://youtu.be/R6uoSjZ2imo?si=gekceqCHxjWr5S-z' },
      { name: 'Cycle Detection BFS', video: 'https://youtu.be/BPlrALf1LDU?si=9-8WOF9hu9oo9jxf' },
      { name: 'Cycle Detection DFS', video: 'https://youtu.be/9twcmtQj4DU?si=PQvses7Rw7zLI6d1' }
    ]
  },
  Hashing: {
    topic: {
      cheatsheet: '/3_Hashing_Cheatsheet.pdf',
      pdf: '/hashing.pdf',
      video: 'https://youtu.be/KEs5UyBJ39g?si=jVEZVOQZ-gj9LqyV'
    },
    subtopics: [
      { name: 'Collision Resolution', video: 'https://youtu.be/zeMa9sg-VJM?si=6fI1eIBp7U6HcaIz' },
      { name: 'Load Factor', video: 'https://youtu.be/FJ8By0iqiS4?si=lAwrTwoEOnRYk7kS' },
      { name: 'Two Sum Problem', video: 'https://youtu.be/UXDSeD9mN-k?si=gvzvWD3TmsTvqecx' },
      { name: 'Subarray Sum', video: 'https://youtu.be/xvNwoz-ufXA?si=r6-rrkGLEZzMOFQk' },
      { name: 'Longest Substring Without Repeating Characters', video: 'https://youtu.be/-zSxTJkcdAo?si=k6lZesvWoOfpPhip' }
    ]
  },
  'Dynamic Programming': {
    topic: {
      cheatsheet: '/10_DynamicProgramming_Cheatsheet.pdf',
      pdf: '/Dynamic Programming.pdf',
      video: 'https://youtu.be/tyB0ztf0DNY?si=TZzblgkm4QQ5S-aB'
    },
    subtopics: [
      { name: 'Fibonacci Sequence', video: 'https://youtu.be/AU9N3Knpl3M?si=YOD8EZ3uzazKXYYQ' },
      { name: 'Longest Common Subsequence (LCS)', video: 'https://youtu.be/sSno9rV8Rhg?si=gGlUmM9bdcM17qKv' },
      { name: 'Longest Increasing Subsequence (LIS)', video: 'https://youtu.be/ekcwMsSIzVc?si=7_d33jeoNDKyh70L' },
      { name: '0/1 Knapsack Problem', video: 'https://youtu.be/GqOmJHQZivw?si=no5cDaX2FsS9_JEL' },
      { name: 'Coin Change', video: 'https://youtu.be/H9bfqozjoqs?si=ZIVDaiUZyxMsHAMB' },
      { name: 'Edit Distance', video: 'https://youtu.be/XYi2-LPrwm4?si=lVqZembMyFW5KrGh' },
      { name: 'Matrix Chain Multiplication', video: 'https://youtu.be/prx1psByp7U?si=2lwXo1SSoBFPaxJ8' }
    ]
  },
  'Greedy Algorithms': {
    topic: {
      cheatsheet: '/11_GreedyAlgorithms_Cheatsheet.pdf',
      pdf: '/Greedy Algorithms.pdf',
      video: 'https://youtu.be/ARvQcqJ_-NY?si=WPy6Gj0SlDUkPOzN'
    },
    subtopics: [
      { name: 'Activity Selection', video: 'https://youtu.be/U4UoR9vq238?si=PHORoHZomy5uQsx2' },
      { name: 'Fractional Knapsack', video: 'https://youtu.be/1ibsQrnuEEg?si=f6CEsBSowNAG6lBf' },
      { name: 'Huffman Coding', video: 'https://youtu.be/XLfgeaYHinM?si=z6gJ-XUZRjwuB3s0' },
      { name: "Dijkstra's Algorithm", video: 'https://youtu.be/smHnz2RHJBY?si=sp29wntJfLDs9Y5E' },
      { name: "Kruskal's Algorithm", video: 'https://youtu.be/EjVHtpWkIho?si=Pz6hotMb-0LfZVXi' },
      { name: "Prim's Algorithm", video: 'https://youtu.be/kuNfKbyOnDs?si=JqaYCVQhVlEOiCxc' },
      { name: 'Job Scheduling', video: 'https://youtu.be/QbwltemZbRg?si=JCpFLUjK0honSK6e' }
    ]
  },
  'Divide and Conquer': {
    topic: {
      cheatsheet: '/divide-and-conquer.pdf',
      pdf: '/divide-and-conquer.pdf',
      video: 'https://youtu.be/2Rr2tW9zvRg?si=l29Pgbf8zrTcOpgR'
    },
    subtopics: [
      { name: 'Merge Sort', video: 'https://youtu.be/iKGAgWdgoRk?si=LNuZE6RmweYjotvV' },
      { name: 'Quick Sort', video: 'https://youtu.be/Z8svOqamag8?si=GrsGx8biFjERifv8' },
      { name: 'Binary Search', video: 'https://youtu.be/f6UU7V3szVw?si=bvWu96rZLwSl58eg' },
      { name: "Strassen's Matrix Multiplication", video: 'https://youtu.be/0oJyNmEbS4w?si=VaXKUWCHfk1pfBsp' },
      { name: 'Karatsuba Algorithm', video: 'https://youtu.be/yWI2K4jOjFQ?si=5j2BisTnA61GtKsY' },
      { name: 'Closest Pair of Points', video: 'https://youtu.be/kCLGVat2SHk?si=Zwm_KIN-ViXhdRT0' },
      { name: 'Convex Hull', video: 'https://youtu.be/EzeYI7p9MjU?si=gS6IYvrBVot-dghW' }
    ]
  },
  Backtracking: {
    topic: {
      cheatsheet: '/12_Backtracking_Cheatsheet.pdf',
      pdf: '/Backtracking.pdf',
      video: 'https://youtu.be/zg5v2rlV1tM?si=UdUbltWi8l5pgwvK'
    },
    subtopics: [
      { name: 'N-Queens Problem', video: 'https://youtu.be/i05Ju7AftcM?si=txZmCuvbid50T_Qq' },
      { name: 'Sudoku Solver', video: 'https://youtu.be/FWAIf_EVUKE?si=k2nRqik_4U0u-vBb' },
      { name: 'Permutations', video: 'https://youtu.be/H232aocj7bQ?si=VO5Vbi9JMNIBruml' },
      { name: 'Combinations', video: 'https://youtu.be/GBKI9VSKdGg?si=dKtlKOSHqymV_4UU' },
      { name: 'Subset Sum', video: 'https://youtu.be/rYkfBRtMJr8?si=s2QUusWza0gd2zhP' },
      { name: 'Graph Coloring', video: 'https://youtu.be/wuVwUK25Rfc?si=oSgkONxt8Stt3C-3' },
      { name: 'Hamiltonian Cycle', video: 'https://youtu.be/dQr4wZCiJJ4?si=nW490d8PGcxK-eqn' }
    ]
  },
  'Bit Manipulation': {
    topic: {
      cheatsheet: '/bit-manipulation.pdf',
      pdf: '/bit-manipulation.pdf',
      video: 'https://youtu.be/fzip9Aml6og?si=ngn5TKMjJXFnRts_'
    },
    subtopics: [
      { name: 'Power of Two', video: 'https://youtu.be/BSAPR_5m1_k?si=ldywDtT3nziQfp6X' },
      { name: 'Single Number', video: 'https://youtu.be/sFBCAl8yBfE?si=ilsjZKMmB3RR4OdD' },
      { name: 'Bit Manipulation Tricks', video: 'https://youtu.be/nttpF8kwgd4?si=ExESxg1CMlr4p01d' },
      { name: 'Bit Masks', video: 'https://youtu.be/xFWgZ5DTjFo?si=cyGIjRzihoW4W1tW' },
      { name: 'Bit Manipulation in DP', video: 'https://youtu.be/f9vCuICgRpU?si=hJdZOun_SPkmJ1-k' }
    ]
  },
  'String Algorithms': {
    topic: {
      cheatsheet: '/2_Strings_Cheatsheet.pdf',
      pdf: '/strings.pdf',
      video: 'https://youtu.be/zL1DPZ0Ovlo?si=9zILEcVmT11C_X1J'
    },
    subtopics: [
      { name: 'String Matching', video: 'https://youtu.be/yMJLpdKV0BQ?si=afUUqtIfg3cgP-wf' },
      { name: 'KMP Algorithm', video: 'https://youtu.be/V5-7GzOfADQ?si=wFzqETSo0ZtkThSG' },
      { name: 'Rabin-Karp Algorithm', video: 'https://youtu.be/swciWFPq3NE?si=GHShrSQRC1MlZQO-' },
      { name: 'Longest Palindromic Substring', video: 'https://youtu.be/uX0-xyPkR2w?si=6fG4MFgAWmhqm8PF' },
      { name: 'Anagram Problems', video: 'https://youtu.be/G8xtZy0fDKg?si=24K1ZrGhIit2supw' },
      { name: 'String Compression', video: 'https://youtu.be/cAB15h6-sWA?si=SgTJrYJV1U8wO9Z2' },
      { name: 'Regular Expressions', video: 'https://youtu.be/s5Ts6Hbq_00?si=e4L0j27gAb7lsUol' }
    ]
  },
  'Advanced Data Structures': {
    topic: {
      cheatsheet: '/13_AdvancedTopics_Cheatsheet.pdf',
      pdf: '/Advanced Algorithms.pdf',
      video: 'https://youtu.be/dBGUmUQhjaM?si=pPO81i6GBih7caQi'
    },
    subtopics: [
      { name: 'Trie (Prefix Tree)', video: 'https://youtu.be/dBGUmUQhjaM?si=pPO81i6GBih7caQi' },
      { name: 'Segment Tree', video: 'https://youtu.be/ciHThtTVNto?si=W3hZvDTaJYBqYMJk' },
      { name: 'Binary Indexed Tree (Fenwick Tree)', video: 'https://youtu.be/CWDQJGaN1gY?si=9Zf0s5LcHtvwpcli' },
      { name: 'Disjoint Set (Union-Find)', video: 'https://youtu.be/aBxjDBC4M1U?si=BnC1nSvKAduYYR48' },
      { name: 'Sparse Table', video: 'https://youtu.be/c5O7E_PDO4U?si=66czp9e2RC12Lwtc' },
      { name: 'Suffix Array', video: 'https://youtu.be/Yt0t_Diqp1o?si=BQL1bag2oMsmSeVV' },
      { name: 'B-Tree', video: 'https://youtu.be/aZjYr87r1b8?si=Lx3PfzSR6BEBkF0U' }
    ]
  }
};

const seedResources = async () => {
  const session = driver.session();

  try {
    // Cleanup: Delete all Resource nodes and their relationships
    console.log('Cleaning up existing resources...');
    await session.run(`
      MATCH (r:Resource)
      DETACH DELETE r
    `);
    console.log('Existing resources deleted.');

    console.log('Starting resource import...');

    for (const [topicName, resources] of Object.entries(resourcesMapping)) {
      const topicId = `topic_${topicName.toLowerCase().replace(/\s+/g, '_')}`;
      console.log(`Importing resources for topic: ${topicName}`);

      // Create and link topic cheatsheet (PDF)
      if (resources.topic.cheatsheet) {
        const cheatsheetId = `res_${topicId}_cheatsheet`;
        await session.run(`
          CREATE (r:Resource {
            id: $resourceId,
            title: 'Cheat Sheet for ' + $topicName,
            type: 'cheatsheet',
            url: $url,
            qualityScore: 9.0
          })
        `, {
          resourceId: cheatsheetId,
          topicName,
          url: resources.topic.cheatsheet
        });
        await session.run(`
          MATCH (t:Topic {id: $topicId})
          MATCH (r:Resource {id: $resourceId})
          CREATE (t)-[:HAS_RESOURCE]->(r)
        `, {
          topicId,
          resourceId: cheatsheetId
        });
      }
      // Create and link topic normal PDF
      if (resources.topic.pdf) {
        const pdfId = `res_${topicId}_pdf`;
        await session.run(`
          CREATE (r:Resource {
            id: $resourceId,
            title: 'PDF Resource for ' + $topicName,
            type: 'pdf',
            url: $url,
            qualityScore: 8.5
          })
        `, {
          resourceId: pdfId,
          topicName,
          url: resources.topic.pdf
        });
        await session.run(`
          MATCH (t:Topic {id: $topicId})
          MATCH (r:Resource {id: $resourceId})
          CREATE (t)-[:HAS_RESOURCE]->(r)
        `, {
          topicId,
          resourceId: pdfId
        });
      }

      // Create and link topic video(s)
      if ('video' in resources.topic && resources.topic.video) {
        const videoId = `res_${topicId}_video`;
        await session.run(`
          CREATE (r:Resource {
            id: $resourceId,
            title: 'Video Resource for ' + $topicName,
            type: 'video',
            url: $url,
            qualityScore: 9.0
          })
        `, {
          resourceId: videoId,
          topicName,
          url: resources.topic.video
        });
        await session.run(`
          MATCH (t:Topic {id: $topicId})
          MATCH (r:Resource {id: $resourceId})
          CREATE (t)-[:HAS_RESOURCE]->(r)
        `, {
          topicId,
          resourceId: videoId
        });
      }
      if ('video1' in resources.topic && resources.topic.video1) {
        const videoId1 = `res_${topicId}_video1`;
        await session.run(`
          CREATE (r:Resource {
            id: $resourceId,
            title: 'Video Resource 1 for ' + $topicName,
            type: 'video',
            url: $url,
            qualityScore: 9.0
          })
        `, {
          resourceId: videoId1,
          topicName,
          url: resources.topic.video1
        });
        await session.run(`
          MATCH (t:Topic {id: $topicId})
          MATCH (r:Resource {id: $resourceId})
          CREATE (t)-[:HAS_RESOURCE]->(r)
        `, {
          topicId,
          resourceId: videoId1
        });
      }
      if ('video2' in resources.topic && resources.topic.video2) {
        const videoId2 = `res_${topicId}_video2`;
        await session.run(`
          CREATE (r:Resource {
            id: $resourceId,
            title: 'Video Resource 2 for ' + $topicName,
            type: 'video',
            url: $url,
            qualityScore: 9.0
          })
        `, {
          resourceId: videoId2,
          topicName,
          url: resources.topic.video2
        });
        await session.run(`
          MATCH (t:Topic {id: $topicId})
          MATCH (r:Resource {id: $resourceId})
          CREATE (t)-[:HAS_RESOURCE]->(r)
        `, {
          topicId,
          resourceId: videoId2
        });
      }

      // Create and link subtopic video and cheatsheet resources
      if (resources.subtopics && Array.isArray(resources.subtopics)) {
        for (const sub of resources.subtopics) {
          const subtopicId = `sub_${topicName.toLowerCase().replace(/\s+/g, '_')}_${sub.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}`;
          // Video resource for subtopic
          if (sub.video) {
            const subResId = `res_${subtopicId}_video`;
            await session.run(`
              CREATE (r:Resource {
                id: $resourceId,
                title: 'Video Resource for ' + $subName,
                type: 'video',
                url: $url,
                qualityScore: 9.0
              })
            `, {
              resourceId: subResId,
              subName: sub.name,
              url: sub.video
            });
            await session.run(`
              MATCH (s:Subtopic {id: $subtopicId})
              MATCH (r:Resource {id: $resourceId})
              CREATE (s)-[:HAS_RESOURCE]->(r)
            `, {
              subtopicId,
              resourceId: subResId
            });
          }
          // Cheatsheet resource for subtopic (if exists)
          if ('cheatsheet' in sub && sub.cheatsheet) {
            const subCheatId = `res_${subtopicId}_cheatsheet`;
            await session.run(`
              CREATE (r:Resource {
                id: $resourceId,
                title: 'Cheat Sheet for ' + $subName,
                type: 'cheatsheet',
                url: $url,
                qualityScore: 9.0
              })
            `, {
              resourceId: subCheatId,
              subName: sub.name,
              url: sub.cheatsheet
            });
            await session.run(`
              MATCH (s:Subtopic {id: $subtopicId})
              MATCH (r:Resource {id: $resourceId})
              CREATE (s)-[:HAS_RESOURCE]->(r)
            `, {
              subtopicId,
              resourceId: subCheatId
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error importing resources:', error);
  } finally {
    await session.close();
  }
};

seedResources();