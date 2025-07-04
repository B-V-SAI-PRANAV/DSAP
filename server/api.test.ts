import request from 'supertest';
import app from './src/app';

let authToken = '';

beforeAll(async () => {
  // Register a new user (ignore errors if already exists)
  const username = 'apitestuser';
  const password = 'apitestpass';
  try {
    await request(app).post('/api/auth/register').send({ username, password });
  } catch (e) {}
  // Login to get token
  const loginRes = await request(app).post('/api/auth/login').send({ username, password });
  authToken = loginRes.body.token;
});

describe('API Health and Basic Endpoints', () => {
  it('should return health status', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('should return 404 for unknown route', async () => {
    const res = await request(app).get('/api/unknown');
    expect(res.statusCode).toBe(404);
  });
});

describe('Topics and Resources Endpoints', () => {
  it('should get all topics', async () => {
    const res = await request(app).get('/api/topics');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get topic details for a valid topic', async () => {
    const topicsRes = await request(app).get('/api/topics');
    expect(topicsRes.statusCode).toBe(200);
    expect(Array.isArray(topicsRes.body)).toBe(true);
    const topicId = topicsRes.body[0]?.id;
    if (topicId) {
      const res = await request(app).get(`/api/topics/${topicId}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('topic');
      expect(res.body).toHaveProperty('subtopics');
      expect(res.body).toHaveProperty('resources');
    }
  });

  it('should get resources for a valid topic', async () => {
    const topicsRes = await request(app).get('/api/topics');
    expect(topicsRes.statusCode).toBe(200);
    expect(Array.isArray(topicsRes.body)).toBe(true);
    const topicId = topicsRes.body[0]?.id;
    if (topicId) {
      const res = await request(app).get(`/api/resources/topic/${topicId}`);
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    }
  });

  it('should get mastery path', async () => {
    const res = await request(app).get('/api/path/mastery');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get full learning path', async () => {
    const res = await request(app).get('/api/path/full');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});

describe('User-Protected Endpoints', () => {
  it('should get user progress', async () => {
    const res = await request(app)
      .get('/api/user/progress')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get user progress summary', async () => {
    const res = await request(app)
      .get('/api/user/progress/summary')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('completed');
    expect(res.body).toHaveProperty('total');
  });

  it('should get user detailed progress', async () => {
    const res = await request(app)
      .get('/api/user/progress/detailed')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get user settings', async () => {
    const res = await request(app)
      .get('/api/user/settings')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('notifications');
    expect(res.body).toHaveProperty('theme');
  });

  it('should update user settings', async () => {
    const res = await request(app)
      .put('/api/user/settings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ theme: 'dark', notifications: false });
    expect(res.statusCode).toBe(204);
  });

  it('should get user dashboard stats', async () => {
    const res = await request(app)
      .get('/api/user/dashboard-stats')
      .set('Authorization', `Bearer ${authToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('solvedProblems');
  });
});

describe('Authentication and Edge Cases', () => {
  it('should not register with an existing username', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ username: 'apitestuser', password: 'apitestpass' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it('should not login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ username: 'apitestuser', password: 'wrongpass' });
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });

  it('should not access protected route without token', async () => {
    const res = await request(app).get('/api/user/progress');
    expect(res.statusCode).toBe(401);
  });

  it('should return 404 for non-existent topic', async () => {
    const res = await request(app).get('/api/topics/nonexistentid123');
    expect(res.statusCode).toBe(404);
  });

  it('should return 404 for non-existent resource', async () => {
    const res = await request(app).get('/api/resources/topic/nonexistentid123');
    expect(res.statusCode).toBe(404);
  });

  it('should ignore invalid settings keys', async () => {
    const res = await request(app)
      .put('/api/user/settings')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ invalidKey: 'value' });
    expect([200, 204]).toContain(res.statusCode);
  });
});

describe('Problem Submission', () => {
  it('should fail to submit problem without auth', async () => {
    const res = await request(app)
      .post('/api/problems/submit')
      .send({ problemId: 'someid', solution: 'code' });
    expect(res.statusCode).toBe(401);
  });

  it('should fail to submit problem with missing data', async () => {
    const res = await request(app)
      .post('/api/problems/submit')
      .set('Authorization', `Bearer ${authToken}`)
      .send({});
    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
}); 