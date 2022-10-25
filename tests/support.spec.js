const request = require('supertest');
const { connectWithUs } = require('./types/support');
const { login } = require('./types/user');

const req = request('http://localhost:4000');

describe('supportResolver', function () {
  let token;

  test('login', async () => {
    let testEmail = 'test@gmail.com';
    let testPassword = 'test';
    const response = await req
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ query: login(`"${testEmail}"`, `"${testPassword}"`) });
    const resData = JSON.parse(response.text);
    if (resData.data) {
      expect(response.statusCode).toEqual(200);
      expect(resData.data.login.access_token).toBeTruthy();
      token = resData.data.login.access_token;
    } else {
      expect(response.statusCode).toEqual(200);
      console.log(resData);
    }
  });

  test('user', async () => {
    const response = await req
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: connectWithUs(`"testTitle"`, `"testDescription"`) });
    const resData = JSON.parse(response.text);
    if (resData.data) {
      expect(response.statusCode).toEqual(200);
    } else {
      expect(response.statusCode).toEqual(200);
      console.log(resData);
    }
  });
});
