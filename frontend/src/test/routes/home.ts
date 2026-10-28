import { app } from '../../main/app';

import request from 'supertest';

// TODO: replace this sample test with proper route tests for your application
/* eslint-disable jest/expect-expect */
describe('Home page', () => {
  describe('on GET', () => {
    test('should return sample home page', async () => {
      await request(app).get('/').expect(200);
    });
  });

  describe('task page', () => {
    test('should respond to the task redirect destination', async () => {
      await request(app).get('/task').expect(200);
    });
  });
});
