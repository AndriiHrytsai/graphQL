const request = require('supertest');
const { chatHistory, readMessage, newMessage } = require('./types/chat');
const { login } = require('./types/user');

const req = request('http://localhost:4000');

describe('chatResolver', function () {
    let token;

    test('login', async () => {
        let testEmail = 'andriyhrytsay@gmail.com'
        let testPassword = 'test'
        const response = await req.post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .send({ query: login(`"${testEmail}"`, `"${testPassword}"`) })
        const resData = JSON.parse(response.text);
        if (resData.data) {
            expect(response.statusCode).toEqual(200)
            expect(resData.data.login.access_token).toBeTruthy()
            token = resData.data.login.access_token;
        } else {
            expect(response.statusCode).toEqual(200)
            console.log(resData)
        }
    });

    test('chatHistory', async () => {
        const response = await req.post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({ query: chatHistory(16) })
        const resData = JSON.parse(response.text)
        if (resData.data) {
            expect(response.statusCode).toEqual(200)
        } else {
            expect(response.statusCode).toEqual(200)
            console.log(resData)
        }
    });
    test('newMessage', async () => {
        const response = await req.post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({ query: newMessage(`"hello"`, 16) })
        const resData = JSON.parse(response.text)
        if (resData.data) {
            expect(response.statusCode).toEqual(200)
        } else {
            expect(response.statusCode).toEqual(200)
            console.log(resData)
        }
    });
    test('readMessage', async () => {
        const response = await req.post('/graphql')
            .set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .send({ query: readMessage(16) })
        const resData = JSON.parse(response.text)
        if (resData.data) {
            expect(response.statusCode).toEqual(200)
        } else {
            expect(response.statusCode).toEqual(200)
            console.log(resData)
        }
    });
});

