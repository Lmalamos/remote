//import { test, expect } from '@playwright/test';

// test('GET request example', async ({ request }) => {
//   const response = await request.get('https://jsonplaceholder.typicode.com/posts/1');

//   expect(response.ok()).toBeTruthy();             // status is 200–299
//   const body = await response.json();

//   expect(body.id).toBe(1);                         // validating response data
// });



// test('POST request example', async ({ request }) => {
//   const response = await request.post(
//     'https://jsonplaceholder.typicode.com/posts',
//     {
//       data: {
//         title: 'Hello World',
//         body: 'My first API test!',
//         userId: 123,
//       },
//     }
//   );

//   expect(response.status()).toBe(201); // Created

//   const body = await response.json();

//   expect(body.title).toBe('Hello World');
//   expect(body.userId).toBe(123);
// });

// ============================================
// 2. API TESTING
// ============================================

// FILE: tests/api/apiTests.spec.ts
import { test, expect } from '@playwright/test';

test.describe('API Tests', () => {
  
  // Example using JSONPlaceholder - a free fake API for testing
  const BASE_URL = 'https://jsonplaceholder.typicode.com';

  test.skip('GET - Fetch all users', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users`);
    
    // Check status code
    expect(response.status()).toBe(200);
    
    // Parse JSON response
    const users = await response.json();
    
    // Verify response structure
    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThan(0);
    
    // Verify first user has expected properties
    expect(users[0]).toHaveProperty('id');
    expect(users[0]).toHaveProperty('name');
    expect(users[0]).toHaveProperty('email');
    
    console.log(`✓ Fetched ${users.length} users`);
  });

  test.skip('GET - Fetch single user by ID', async ({ request }) => {
    const userId = 1;
    const response = await request.get(`${BASE_URL}/users/${userId}`);
    
    expect(response.status()).toBe(200);
    
    const user = await response.json();
    expect(user.id).toBe(userId);
    expect(user.name).toBeDefined();
    expect(user.email).toContain('@');
    
    console.log(`✓ User: ${user.name} (${user.email})`);
  });

  test.skip('GET - 404 for non-existent user', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users/99999`);
    
    expect(response.status()).toBe(404);
  });

  test.skip('POST - Create new user', async ({ request }) => {
    const newUser = {
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com'
    };
    
    const response = await request.post(`${BASE_URL}/users`, {
      data: newUser
    });
    
    expect(response.status()).toBe(201);
    
    const createdUser = await response.json();
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);
    expect(createdUser.id).toBeDefined();
    
    console.log(`✓ Created user with ID: ${createdUser.id}`);
  });

  test.skip('PUT - Update user', async ({ request }) => {
    const userId = 1;
    const updatedData = {
      name: 'Updated Name',
      email: 'updated@example.com'
    };
    
    const response = await request.put(`${BASE_URL}/users/${userId}`, {
      data: updatedData
    });
    
    expect(response.status()).toBe(200);
    
    const updatedUser = await response.json();
    expect(updatedUser.name).toBe(updatedData.name);
    expect(updatedUser.email).toBe(updatedData.email);
  });

  test.skip('PATCH - Partially update user', async ({ request }) => {
    const userId = 1;
    const response = await request.patch(`${BASE_URL}/users/${userId}`, {
      data: { name: 'Patched Name' }
    });
    
    expect(response.status()).toBe(200);
    
    const user = await response.json();
    expect(user.name).toBe('Patched Name');
  });

  test.skip('DELETE - Remove user', async ({ request }) => {
    const userId = 1;
    const response = await request.delete(`${BASE_URL}/users/${userId}`);
    
    expect(response.status()).toBe(200);
  });

  test.skip('API with headers and authentication', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users/1`, {
      headers: {
        'Authorization': 'Bearer fake-token-12345',
        'Content-Type': 'application/json'
      }
    });
    
    expect(response.status()).toBe(200);
  });

  test.skip('API response time check', async ({ request }) => {
    const startTime = Date.now();
    
    await request.get(`${BASE_URL}/users`);
    
    const responseTime = Date.now() - startTime;
    expect(responseTime).toBeLessThan(2000); // Should respond within 2 seconds
    
    console.log(`✓ API responded in ${responseTime}ms`);
  });

  test.skip('Verify response schema', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/users/1`);
    const user = await response.json();
    
    // Check all expected fields exist
    const expectedFields = ['id', 'name', 'username', 'email', 'address', 'phone', 'website', 'company'];
    expectedFields.forEach(field => {
      expect(user).toHaveProperty(field);
    });
    
    // Verify nested object structure
    expect(user.address).toHaveProperty('street');
    expect(user.address).toHaveProperty('city');
    expect(user.address).toHaveProperty('zipcode');
  });

  test.skip('Test API with query parameters', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/posts`, {
      params: {
        userId: 1,
        _limit: 5
      }
    });
    
    expect(response.status()).toBe(200);
    
    const posts = await response.json();
    expect(posts.length).toBeLessThanOrEqual(5);
    expect(posts[0].userId).toBe(1);
  });
});

/*
HOW TO RUN API TESTS:
---------------------

npx playwright test api

REAL-WORLD API TEST EXAMPLE (Your Own API):
-------------------------------------------

test('Login API test', async ({ request }) => {
  const response = await request.post('https://your-app.com/api/login', {
    data: {
      username: 'testuser',
      password: 'password123'
    }
  });
  
  expect(response.status()).toBe(200);
  
  const data = await response.json();
  expect(data.token).toBeDefined();
  
  // Save token for subsequent requests
  const token = data.token;
  
  // Use token in next request
  const profileResponse = await request.get('https://your-app.com/api/profile', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  expect(profileResponse.status()).toBe(200);
});
*/