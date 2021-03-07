const expect = require('chai').expect;
const request = require('supertest');

const app = require('../index.js');
const req = request(app);
const SUCCESS           = 200
const ACCESS_FORBIDDEN  = 403
const NOT_FOUND         = 404
const RTO               = 408
const INTERNAL_ERROR    = 500

const testCase = {
    "success" : {
        "getFeed" : "As a User, I want to be able to get feed list",
    },
    "false" : {
        "wrongID" : "As a User, I should got error message when I send request without id ",
        "noId" : "As a User, I should got error 404 when I send request with invalid API Key"
    }
}

describe('User API Endpoint Tests', () => {
    const id_success = '10156282988163547';
    const id_failed = '123456';

    it(`@get ${testCase.success.getFeed}`, async() => {
        const response = await request(app)
        .get(`/fb/user/feed/${id_success}`);

        expect(response.statusCode).to.equal(SUCCESS);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('Success');
        expect(response.body).to.have.property('data');
    }),

    it(`@get ${testCase.false.wrongID}`, async() => {
        const response = await request(app)
        .get(`/fb/user/feed/${id_failed}`);

        expect(response.statusCode).to.equal(NOT_FOUND);
        expect(response.body).to.have.property('message');
        expect(response.body.message).to.equal('user not found');
    }),
    it(`@get ${testCase.false.noId}`, async() => {
        const response = await request(app)
        .get(`/fb/user/feed/`);

        expect(response.statusCode).to.equal(NOT_FOUND);

    })
});
