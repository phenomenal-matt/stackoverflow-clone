/* eslint-disable arrow-body-style */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const bcrypt = require('bcrypt');
const app = require('../index');
const User = require('../api/models/user.model');
const Question = require('../api/models/question.model');

describe('Question API', () => {
  let testQuestions = {
    validQuestion: {
      title: 'How do I do AES-256-CBC encryption in nodejs?',
      body: 'This is a crypto question'
    },
    questionWithoutBody: {
      title: 'Question'
    },
    questionWithoutTitle: {
      body: 'Is this a test question?'
    }
  };

  let answer = {
    body: 'This is the answer to your question'
  };
  let user1;
  let user2;
  let token;
  let question;
  let questionId;

  before(async () => {
    user1 = {
      email: 'john_snow@example.com',
      password: 'mypassword',
      name: 'John Snow'
    };

    user2 = {
      email: 'arya_stark@example.com',
      password: '123456',
      name: 'Arya Stark'
    };

    question = testQuestions.validQuestion;

    const salt = await bcrypt.genSalt(1);
    const hashedPass = await bcrypt.hash(user1.password, salt);
    const user = await User.create({
      ...user1,
      password: hashedPass
    });

    await Question.create({
      ...question,
      author: user._id
    });

    const response = await request(app)
      .post('/v1/auth/login')
      .send(user1);
    token = response.body.token;
  });

  after(async () => {
    await User.deleteMany({});
    await Question.deleteMany({});
  });

  describe('POST /v1/questions', () => {
    it('should successfully ask a question', async () => {
      const response = await request(app)
        .post('/v1/questions')
        .send(testQuestions.validQuestion)
        .set('Authorization', token);

      expect(response.status).to.eqls(httpStatus.OK);
      expect(response.body).to.be.an('object');
      expect(response.body.result).to.eqls('SUCCESS');
      expect(response.body.data.title).to.eqls(
        testQuestions.validQuestion.title
      );
      expect(response.body.data.body).to.eqls(testQuestions.validQuestion.body);
    });

    it('should fail to ask a question without a body', async () => {
      const response = await request(app)
        .post('/v1/questions')
        .send(testQuestions.questionWithoutBody)
        .set('Authorization', token);

      expect(response.status).to.eqls(httpStatus.BAD_REQUEST);
      expect(response.body.message).to.be.equal('Validation Error');
      expect(response.body.result).to.be.equal('ERROR');
      expect(response.body.errors).to.include('"body" is required');
    });

    it('should fail to ask a question without a title', async () => {
      const response = await request(app)
        .post('/v1/questions')
        .send(testQuestions.questionWithoutTitle)
        .set('Authorization', token);

      expect(response.status).to.eqls(httpStatus.BAD_REQUEST);
      expect(response.body.message).to.be.equal('Validation Error');
      expect(response.body.result).to.be.equal('ERROR');
      expect(response.body.errors).to.include('"title" is required');
    });

    it('should fail to ask a question without authorization', async () => {
      const response = await request(app)
        .post('/v1/questions')
        .send(testQuestions.validQuestion);

      expect(response.status).to.eqls(httpStatus.UNAUTHORIZED);
      expect(response.body.message).to.be.equal('Authorization is required');
      expect(response.body.result).to.be.equal('ERROR');
    });
  });

  describe('GET /v1/question', () => {
    it('should get a list questions', async () => {
      const response = await request(app).get('/v1/questions');

      questionId = response.body.data[0]._id;

      expect(response.status).to.eqls(httpStatus.OK);
      expect(response.body.result).to.eqls('SUCCESS');
      expect(response.body.data).to.be.an('array');
      expect(response.body.data[0].title).eqls(
        testQuestions.validQuestion.title
      );
    });

    it('should get a question', async () => {
      const response = await request(app).get(`/v1/questions/${questionId}`);

      expect(response.status).to.eqls(httpStatus.OK);
      expect(response.body.result).to.eqls('SUCCESS');
      expect(response.body.data).to.be.an('object');
      expect(response.body.data.title).eqls(testQuestions.validQuestion.title);
    });

    it('should fail to get a question that does not exist', async () => {
      const response = await request(app).get(
        '/v1/questions/5e37e6a4686cfb017dec618b'
      );

      expect(response.status).to.eqls(httpStatus.NOT_FOUND);
      expect(response.body.result).to.be.equal('ERROR');
      expect(response.body.message).to.be.equal('Question not found');
    });
  });

  describe('POST /v1/question/:id', () => {
    it('should answer a question', async () => {
      const response = await request(app)
        .post(`/v1/questions/${questionId}`)
        .send(answer)
        .set('Authorization', token);

      expect(response.status).to.eqls(httpStatus.OK);
      expect(response.body.result).to.eqls('SUCCESS');
      expect(response.body.data).to.be.an('object');
      expect(response.body.data.body).to.eqls(answer.body);
    });

    it('should fail to answer a question without Authorization', async () => {
      const response = await request(app)
        .post(`/v1/questions/${questionId}`)
        .send(answer);

      expect(response.status).to.eqls(httpStatus.UNAUTHORIZED);
      expect(response.body.message).to.be.equal('Authorization is required');
      expect(response.body.result).to.be.equal('ERROR');
    });

    it('should fail to answer a question that does not exist', async () => {
      const response = await request(app)
        .post('/v1/questions/5e37e6a4686cfb017dec618b')
        .send(answer)
        .set('Authorization', token);

      expect(response.status).to.eqls(httpStatus.NOT_FOUND);
      expect(response.body.result).to.be.equal('ERROR');
      expect(response.body.message).to.be.equal('Question not found');
    });
  });
});
