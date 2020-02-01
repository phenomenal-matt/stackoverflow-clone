/* eslint-disable arrow-body-style */
const request = require('supertest');
const httpStatus = require('http-status');
const { expect } = require('chai');
const bcrypt = require('bcrypt');
// const moment = require('moment-timezone');
const app = require('../../index');
const User = require('../../api/models/user.model');

describe('Authentication API', () => {
  let user1;
  let user2;

  
  beforeEach(async () => {
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
  
    const salt = await bcrypt.genSalt(1);
    const hashedPass = await bcrypt.hash(user1.password, salt);
    await User.create({
      ...user1,
      password: hashedPass
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /v1/auth/register', () => {
    it('should register a new user when request is valid', async () => {
      const res = await request(app)
        .post('/v1/auth/register')
        .send(user2);

      expect(res.status).to.be.equal(httpStatus.CREATED);

      expect(res.body).to.have.a.property('token');
      expect(res.body.result).to.be.equal('SUCCESS');
      expect(res.body.name).to.be.equal(user2.name);
    });

    it('should return error when user email already exists', () => {
      return request(app)
        .post('/v1/auth/register')
        .send(user1)
        .expect(httpStatus.CONFLICT)
        .then(res => {
          expect(res.body.message).to.be.equal('Validation Error');
          expect(res.body.result).to.be.equal('ERROR');
          expect(res.body.errors).to.include('"email" already exists');
        });
    });

    it('should return error when the email provided is not valid', () => {
      user2.email = 'this_is_not_an_email';
      return request(app)
        .post('/v1/auth/register')
        .send(user2)
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.message).to.be.equal('Validation Error');
          expect(res.body.result).to.be.equal('ERROR');
          expect(res.body.errors).to.include('"email" must be a valid email');
        });
    });

    it('should return error when email and password are not provided', () => {
      return request(app)
        .post('/v1/auth/register')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.message).to.be.equal('Validation Error');
          expect(res.body.result).to.be.equal('ERROR');
          expect(res.body.errors).to.include('"email" is required');
        });
    });
  });

  describe('POST /v1/auth/login', () => {
    it('should return a token when email and password match that of a registered user', () => {
      return request(app)
        .post('/v1/auth/login')
        .send(user1)
        .expect(httpStatus.OK)
        .then(res => {
          expect(res.body).to.have.a.property('token');
          expect(res.body.result).to.be.equal('SUCCESS');
          expect(res.body.name).to.be.equal(user1.name);
        });
    });

    it('should return error when email and password are not provided', () => {
      return request(app)
        .post('/v1/auth/login')
        .send({})
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.message).to.be.equal('Validation Error');
          expect(res.body.result).to.be.equal('ERROR');
          expect(res.body.errors).to.include('"email" is required');
        });
    });

    it('should return error when the email provided is not valid', () => {
      user2.email = 'this_is_not_an_email';
      return request(app)
        .post('/v1/auth/login')
        .send(user2)
        .expect(httpStatus.BAD_REQUEST)
        .then(res => {
          expect(res.body.message).to.be.equal('Validation Error');
          expect(res.body.result).to.be.equal('ERROR');
          expect(res.body.errors).to.include('"email" must be a valid email');
        });
    });

    it("should return error when user password is incorrect", () => {
      user1.password = 'aaa';

      return request(app)
        .post('/v1/auth/login')
        .send(user1)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          const { message } = res.body;
          expect(res.body.result).to.be.equal('ERROR');
          expect(message).to.be.equal('Incorrect email or password');
        });
    });

    it("should return error when user email is incorrect ", () => {
      user1.email = 'a@example.com';

      return request(app)
        .post('/v1/auth/login')
        .send(user1)
        .expect(httpStatus.UNAUTHORIZED)
        .then(res => {
          const { message } = res.body;
          expect(res.body.result).to.be.equal('ERROR');
          expect(message).to.be.equal('Incorrect email or password');
        });
    });

  });
});
