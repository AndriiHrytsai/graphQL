const request = require('supertest');
const {
  getUserById,
  login,
  createUser,
  currentUser,
  forgotPassword,
  updateUser,
} = require('./types/user');

const req = request('http://localhost:4000');

describe('userResolver', function () {
  let token;
  test('createUser', async () => {
    const testEmail = 'test@gmail.com';
    const testPassword = 'test';
    const testFirstName = 'test';
    const testLastName = 'test';
    const response = await req
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({
        query: createUser(
          `"${testEmail}"`,
          `"${testPassword}"`,
          `"${testFirstName}"`,
          `"${testLastName}"`,
        ),
      });
    const resData = JSON.parse(response.text);
    if (resData.data) {
      expect(response.statusCode).toEqual(200);
      expect(resData.data.createUser.email).toEqual(testEmail);
    } else {
      expect(response.statusCode).toEqual(200);
      console.log(resData);
    }
  });
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
      .send({ query: getUserById(16) });
    const resData = JSON.parse(response.text);
    if (resData.data) {
      expect(response.statusCode).toEqual(200);
      expect(resData.data.user.id).toEqual(16);
    } else {
      expect(response.statusCode).toEqual(200);
      console.log(resData);
    }
  });
  test('currentUser', async () => {
    const response = await req
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: currentUser() });
    const resData = JSON.parse(response.text);
    if (resData.data) {
      expect(response.statusCode).toEqual(200);
      expect(resData.data.currentUser.email).toBe('test@gmail.com');
    } else {
      expect(response.statusCode).toEqual(200);
      console.log(resData);
    }
  });
  test('forgotPassword', async () => {
    const response = await req
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .send({ query: forgotPassword(`"test@gmail.com"`) });
    const resData = JSON.parse(response.text);
    if (resData.data) {
      expect(response.statusCode).toEqual(200);
    } else {
      expect(response.statusCode).toEqual(200);
      console.log(resData);
    }
  });
  test('updateUser', async () => {
    const response = await req
      .post('/graphql')
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({ query: updateUser(`"Dale"`) });
    const resData = JSON.parse(response.text);
    if (resData.data) {
      expect(response.statusCode).toEqual(200);
    } else {
      expect(response.statusCode).toEqual(200);
      console.log(resData);
    }
  });
});
