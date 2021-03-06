'use strict';

const app = require('../../cognito-post-confirmation-trigger.js');
const chai = require('chai');
const expect = chai.expect;
var event = 
{
    "request": {
        "userAttributes": {
            "email": "user@example.com",
            "email_verified": true
        }
    },
    "response": {}
}, context;

describe('Tests index', function () {
    it('verifies successful response', async () => {
        const result = await app.handler(event, context)

        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
        expect(result.body).to.be.an('string');

        let response = JSON.parse(result.body);

        expect(response).to.be.an('object');
        expect(response.message).to.be.equal("hello world");
        // expect(response.location).to.be.an("string");
    });
});
