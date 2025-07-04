import neo4j from 'neo4j-driver';
import dotenv from 'dotenv';
dotenv.config();

const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const user = process.env.NEO4J_USER || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

async function linkQuizQuestions() {
  const session = driver.session();
  try {
    // This assumes each QuizQuestion has a topicId property
    const result = await session.run(`
      MATCH (qq:QuizQuestion)
      WHERE qq.topicId IS NOT NULL
      MATCH (t:Topic {id: qq.topicId})
      MERGE (t)-[:HAS_QUIZ_QUESTION]->(qq)
      RETURN count(qq) as linked
    `);
    const linked = result.records[0].get('linked').toNumber();
    console.log(`Linked ${linked} QuizQuestion nodes to their topics.`);
  } catch (error) {
    console.error('Error linking quiz questions:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

async function checkQuizQuestionsFields() {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (qq:QuizQuestion)
      WHERE qq.id IS NULL OR qq.question IS NULL OR qq.options IS NULL OR qq.correctAnswer IS NULL OR qq.topicId IS NULL
      RETURN qq
    `);
    if (result.records.length === 0) {
      console.log('All QuizQuestion nodes have required fields.');
    } else {
      console.log('QuizQuestion nodes missing required fields:');
      result.records.forEach(r => {
        const qq = r.get('qq').properties || r.get('qq');
        console.log(qq);
      });
    }
  } catch (error) {
    console.error('Error checking quiz question fields:', error);
  } finally {
    await session.close();
  }
}

linkQuizQuestions().then(checkQuizQuestionsFields); 