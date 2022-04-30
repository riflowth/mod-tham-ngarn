import request from 'supertest';
import http from 'http';
import { Server } from '@/Server';

describe('Test the AuthController response', () => {
  let httpServer: http.Server;
  let appServer: Server;

  beforeAll(async () => {
    appServer = new Server(4000);
    httpServer = await appServer.listen();
  });

  afterAll(() => {
    httpServer.close();
  });

  it('should response with 400 when request body is empty', () => {
    return request(httpServer)
      .post('/auth/login')
      .expect(400);
  });

  it('should set sid cookie and response with 200', async () => {
    const response = await request(httpServer)
      .post('/auth/login')
      .send({
        username: '123456789',
        password: 'this_is_valid_password',
      });

    expect(response.header['set-cookie']).toBeDefined();
    expect(response.status).toBe(200);
  });
});
