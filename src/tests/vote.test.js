/* eslint-disable arrow-body-style */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const app = require('../index');
const User = require('../api/models/user.model');
const Question = require('../api/models/question.model');
const Vote = require('../api/models/vote.model');

describe('Question API', () => {
  const question = {
    title: 'How do I do AES-256-CBC encryption in nodejs?',
    body: 'This is a crypto question'
  };

  const user1 = {
    email: 'john_snow@example.com',
    password: 'mypassword',
    name: 'John Snow'
  };
  const user2 = {
    email: 'arya_stark@example.com',
    password: '123456',
    name: 'Arya Stark'
  };

  const user3 = {
    email: 'tyrion_lannister@example.com',
    password: '652ws4fa',
    name: 'Lord Tyrion Lannister'
  };

  const upvote = {
    vote: 'up'
  };

  const downvote = {
    vote: 'down'
  };
  let token;
  let token2;
  let token3;
  let questionId;

  before(async () => {
    const response = await request(app)
      .post('/v1/auth/register')
      .send(user1);
    token = response.body.token;

    const response2 = await request(app)
      .post('/v1/auth/register')
      .send(user2);
    token2 = response2.body.token;

    const response3 = await request(app)
      .post('/v1/auth/register')
      .send(user3);
    token3 = response3.body.token;

    const qResponse = await request(app)
      .post('/v1/questions')
      .send(question)
      .set('Authorization', token);
    questionId = qResponse.body.data._id;
  });

  after(async () => {
    await User.deleteMany({});
    await Question.deleteMany({});
    await Vote.deleteMany({});
  });

  describe('POST /v1/votes/question/:id', () => {
    it('should successfully upvote a question', async () => {
      const response = await request(app)
        .post(`/v1/votes/question/${questionId}`)
        .send(upvote)
        .set('Authorization', token2);
      console.log(JSON.stringify(response.body));

      expect(response.status).to.eqls(httpStatus.OK);
      expect(response.body.result).to.eqls('SUCCESS');
      expect(response.body.data.message).to.include(
        'Question upvoted successfully'
      );

      const response2 = await request(app).get(`/v1/questions/${questionId}`);
      console.log(JSON.stringify(response2.body));

      expect(response.status).to.eqls(httpStatus.OK);
      expect(response.body.result).to.eqls('SUCCESS');
      expect(response.body.data).to.be.an('object');
      expect(response2.body.data.voteCount).to.eqls(1);
    });

    it('should successfully downvote a question', async () => {
      const response = await request(app)
        .post(`/v1/votes/question/${questionId}`)
        .send(downvote)
        .set('Authorization', token3);
      console.log(JSON.stringify(response.body));

      expect(response.status).to.eqls(httpStatus.OK);
      expect(response.body.result).to.eqls('SUCCESS');
      expect(response.body.data.message).to.include(
        'Question downvoted successfully'
      );

      const response2 = await request(app).get(`/v1/questions/${questionId}`);
      console.log(JSON.stringify(response2.body));

      expect(response.status).to.eqls(httpStatus.OK);
      expect(response.body.result).to.eqls('SUCCESS');
      expect(response.body.data).to.be.an('object');
      expect(response2.body.data.voteCount).to.eqls(0);
    });

    it('should successfully unvote a question', async () => {
      const response = await request(app)
        .post(`/v1/votes/question/${questionId}`)
        .send(upvote)
        .set('Authorization', token2);
      console.log(JSON.stringify(response.body));

      expect(response.status).to.eqls(httpStatus.OK);
      expect(response.body.result).to.eqls('SUCCESS');

      const response2 = await request(app).get(`/v1/questions/${questionId}`);
      console.log(JSON.stringify(response2.body));

      expect(response.status).to.eqls(httpStatus.OK);
      expect(response.body.result).to.eqls('SUCCESS');
      expect(response.body.data).to.be.an('object');
      expect(response2.body.data.voteCount).to.eqls(-1);
    });

    it('should successfully change a vote', async () => {
      const response = await request(app)
        .post(`/v1/votes/question/${questionId}`)
        .send(upvote)
        .set('Authorization', token3);
      console.log(JSON.stringify(response.body));

      expect(response.status).to.eqls(httpStatus.OK);
      expect(response.body.result).to.eqls('SUCCESS');

      const response2 = await request(app).get(`/v1/questions/${questionId}`);
      console.log(JSON.stringify(response2.body));

      expect(response.status).to.eqls(httpStatus.OK);
      expect(response.body.result).to.eqls('SUCCESS');
      expect(response.body.data).to.be.an('object');
      expect(response2.body.data.voteCount).to.eqls(1);
    });

    it('should fail to vote without authorization', async () => {
      const response = await request(app)
        .post(`/v1/votes/question/${questionId}`)
        .send();

      expect(response.status).to.eqls(httpStatus.UNAUTHORIZED);
      expect(response.body.message).to.be.equal('Authorization is required');
      expect(response.body.result).to.be.equal('ERROR');
    });

    it('should fail to vote for self', async () => {
      const response = await request(app)
        .post(`/v1/votes/question/${questionId}`)
        .send(upvote)
        .set('Authorization', token);

      expect(response.body.result).to.be.equal('ERROR');
      expect(response.body.message).to.be.equal(
        'Cannot vote for your own question'
      );
      expect(response.status).to.eqls(httpStatus.BAD_REQUEST);
    });
  });
});
