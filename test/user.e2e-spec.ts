/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../src/database/prisma.service';

import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('UsersService', () => {
  let app: INestApplication;
  let newUserId: number;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    // delete user from DB
    const dbService = new PrismaService();
    await dbService.user.delete({
      where: {
        id: newUserId
      }
    });
    // close app
    await app.close();
  });

  describe("TO-DO TEST", () => {
    describe('USERS - Success Test', () => {
      it('should create a user', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query: `mutation {
            createUser(
              username: "TestUser2"
              password: "passworded"
              email: "usertest122@gmail.com"
            ) {
              id
              username
              email
              createdAt
            }
          }
          ` })
          .expect(200)
          .expect((res) => {
            newUserId = res.body.data.createUser.id;
            expect(res.body.data.createUser).toHaveProperty('id')
            expect(res.body.data.createUser).toHaveProperty('username')
            expect(res.body.data.createUser).toHaveProperty('email')
            expect(res.body.data.createUser).toHaveProperty('createdAt')
          });
      });

      it('should login a user', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query: `mutation LoginUser {
            userLogin(password: "passworded", email: "usertest122@gmail.com") {
              id
              username
              email
              token
            }
          }
          ` })
          .expect(200)
          .expect((res) => {
            expect(res.body.data.userLogin).toHaveProperty('id');
            expect(res.body.data.userLogin).toHaveProperty('username');
            expect(res.body.data.userLogin).toHaveProperty('email');
            expect(res.body.data.userLogin).toHaveProperty('token');
          });
      });
    })

    describe('USERS - Error Test', () => {
      it('duplicate user - should throw', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query: `mutation {
            createUser(
              username: "TestUser2"
              password: "passworded"
              email: "usertest122@gmail.com"
            ) {
              id
              username
              email
              createdAt
            }
          }
          ` })
          .expect(200)
          .expect((res) => {
            const parsedError = JSON.parse(res.text);
            expect(parsedError).toHaveProperty('errors');
            expect(Array.isArray(parsedError.errors)).toEqual(true);
            expect(parsedError.errors[0]).toHaveProperty('message');
            expect(parsedError.errors[0].message).toEqual("User already exists.")
          });
      });

      it('should not login a user', () => {
        return request(app.getHttpServer())
          .post('/graphql')
          .send({ query: `mutation LoginUser {
            userLogin(password: "passwod", email: "usertest122@gmail.com") {
              id
              username
              email
              token
            }
          }
          ` })
          .expect(200)
          .expect((res) => {
            const parsedError = JSON.parse(res.text);
            expect(parsedError).toHaveProperty('errors');
            expect(Array.isArray(parsedError.errors)).toEqual(true);
            expect(parsedError.errors[0]).toHaveProperty('message');
            expect(parsedError.errors[0].message).toEqual('Please check credentials and try again.')
          });
      });
    })
  })
});

