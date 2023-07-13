/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { PrismaService } from '../src/database/prisma.service';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('ItemsService', () => {
    let app: INestApplication;
    let newItemId: number;
    let secondnewItemId: number;
    let newusertoken: string;
    const dbService = new PrismaService();
    const jwtService = new JwtService();
    let user;

    const ids = []

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();
        app = module.createNestApplication();
        await app.init();

        user = await dbService.user.create({
            data: {
                username: "TestUser",
                password: "$2a$12$LUlbyPhxX",
                email: "testuser@gmail.com"
            }
        });
        
        newusertoken = jwtService.sign(
            {id: user.id, username: user.username},
            { secret: process.env.SECRET_KEY, expiresIn: 86400 },
        )
        

    });

    afterAll(async () => {
        // delete user from DB
        await dbService.item.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });

        await dbService.user.delete({
            where: {
              id: user.id
            }
          });

        // close app
        await app.close();
    });

    describe("TO-DO TEST", () => {
        describe('ITEMS - Success Test', () => {
            it('should create an item with description', () => {
                return request(app.getHttpServer())
                    .post('/graphql')
                    .set('Authorization', `Bearer ${newusertoken}`)
                    .send({
                        query: `mutation CreateItem {
                            createItem(title: "New Item!", description: "This is a new item") {
                                id
                                title
                                description
                                userId
                                completed
                            }
                        }` 
                    })
                    .expect(200)
                    .expect((res) => {
                        newItemId = res.body.data.createItem.id;
                        ids.push(newItemId)
                        expect(res.body.data.createItem).toHaveProperty('id')
                        expect(res.body.data.createItem).toHaveProperty('title')
                        expect(res.body.data.createItem).toHaveProperty('description')
                        expect(res.body.data.createItem).toHaveProperty('userId')
                        expect(res.body.data.createItem).toHaveProperty('completed')
                    });
            });

            it('should create an item without description', () => {
                return request(app.getHttpServer())
                    .post('/graphql')
                    .set('Authorization', `Bearer ${newusertoken}`)
                    .send({
                        query: `mutation CreateItem {
                            createItem(title: "New Item!") {
                                id
                                title
                                description
                                userId
                                completed
                            }
                        }` 
                    })
                    .expect(200)
                    .expect((res) => {
                        secondnewItemId = res.body.data.createItem.id;
                        ids.push(secondnewItemId);
                        expect(res.body.data.createItem).toHaveProperty('id');
                        expect(res.body.data.createItem).toHaveProperty('title');
                        expect(res.body.data.createItem).toHaveProperty('description');
                        expect(res.body.data.createItem).toHaveProperty('userId');
                        expect(res.body.data.createItem).toHaveProperty('completed');
                    });
            });

            it('should fetch an item', () => {
                const query = `
                query GetOne($id: Float!) {
                    getById(id: $id) {
                      id
                      userId
                      title
                      description
                      completed
                    }
                }`;
                const variables = { id: newItemId };
                return request(app.getHttpServer())
                    .post('/graphql')
                    .set('Authorization', `Bearer ${newusertoken}`)
                    .send({ query, variables })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.data.getById).toHaveProperty('id');
                        expect(res.body.data.getById).toHaveProperty('title');
                        expect(res.body.data.getById).toHaveProperty('description');
                        expect(res.body.data.getById).toHaveProperty('userId');
                        expect(res.body.data.getById).toHaveProperty('completed');
                    });
            });

            it('should search by `completed` ', () => {
                return request(app.getHttpServer())
                    .post('/graphql')
                    .set('Authorization', `Bearer ${newusertoken}`)
                    .send({
                        query: `query Search {
                            searchItem(completed: false) {
                              id
                              userId
                              title
                              description
                              completed
                            }
                        }` 
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(Array.isArray(res.body.data.searchItem)).toEqual(true);
                        res.body.data.searchItem.forEach((item: object) => {
                            expect(item.constructor.name).toEqual('Object');
                            expect(item).toHaveProperty('id');
                            expect(item).toHaveProperty('title');
                            expect(item).toHaveProperty('description');
                            expect(item).toHaveProperty('completed');
                            expect(item).toHaveProperty('userId');
                        })
                    });
            });

            it('should fetch all items', () => {
                const query = `query GetItems($page: Float, $limit: Float) {
                    getAll(page: $page, limit: $limit) {
                      count
                      totalcount
                      page
                      items {
                        id
                        userId
                        title
                        description
                        completed
                      }
                    }
                }`;

                const variables = { page: 1 };

                return request(app.getHttpServer())
                    .post('/graphql')
                    .set('Authorization', `Bearer ${newusertoken}`)
                    .send({ query, variables })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.data.getAll).toHaveProperty('totalcount');
                        expect(res.body.data.getAll).toHaveProperty('count');
                        expect(res.body.data.getAll).toHaveProperty('page', 1);
                        expect(res.body.data.getAll).toHaveProperty('items');
                        expect(Array.isArray(res.body.data.getAll.items)).toEqual(true);
                        expect(res.body.data.getAll.items.length).toEqual(res.body.data.getAll.count);
                        res.body.data.getAll.items.forEach((item: object) => {
                            expect(item.constructor.name).toEqual('Object');
                            expect(item).toHaveProperty('id');
                            expect(item).toHaveProperty('title');
                            expect(item).toHaveProperty('description');
                            expect(item).toHaveProperty('completed');
                            expect(item).toHaveProperty('userId');
                        })
                    });
            });

            it('empty array - should fetch all items', () => {
                return request(app.getHttpServer())
                    .post('/graphql')
                    .set('Authorization', `Bearer ${newusertoken}`)
                    .send({
                        query: `query GetItems {
                            getAll(page: 6, limit: 10) {
                              count
                              totalcount
                              page
                              items {
                                id
                                userId
                                title
                                description
                                completed
                              }
                            }
                          }` 
                    })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.data.getAll).toHaveProperty('totalcount');
                        expect(res.body.data.getAll).toHaveProperty('count');
                        expect(res.body.data.getAll).toHaveProperty('page');
                        expect(res.body.data.getAll).toHaveProperty('items');
                        expect(Array.isArray(res.body.data.getAll.items)).toEqual(true);
                        expect(res.body.data.getAll.items.length).toEqual(0);
                    });
            });

            it('should edit an item', () => {
                const query = `
                mutation EditItem($id: Float!) {
                    editItem(id: $id, description: "My second item!") {
                        id
                        userId
                        title
                        description
                        completed
                    }
                }`;
                const variables = { id: secondnewItemId };
                return request(app.getHttpServer())
                    .post('/graphql')
                    .set('Authorization', `Bearer ${newusertoken}`)
                    .send({ query, variables })
                    .expect(200)
                    .expect((res) => {
                        expect(res.body.data.editItem).toHaveProperty('id')
                        expect(res.body.data.editItem).toHaveProperty('title')
                        expect(res.body.data.editItem).toHaveProperty('description')
                        expect(res.body.data.editItem).toHaveProperty('userId')
                        expect(res.body.data.editItem).toHaveProperty('completed')
                    });
            });

        })

        describe('ITEMS - Error Test', () => {
            it('inalid data type - should throw', () => {
                return request(app.getHttpServer())
                    .post('/graphql')
                    .set('Authorization', `Bearer ${newusertoken}`)
                    .send({
                        query: `mutation CreateItem {
                            createItem(title: 9, description: "This is a new item") {
                                id
                                title
                                description
                                userId
                                completed
                            }
                        }` 
                    })
                    .expect(400)
                    .expect((res) => {
                        const parsedError = JSON.parse(res.text);
                        expect(parsedError).toHaveProperty('errors');
                        expect(Array.isArray(parsedError.errors)).toEqual(true);
                        expect(parsedError.errors[0]).toHaveProperty('message');
                        expect(parsedError.errors[0].message.indexOf('String cannot represent a non string value') > - 1).toEqual(true)
                    });
            });

            it('not found item - should throw', () => {
                return request(app.getHttpServer())
                    .post('/graphql')
                    .set('Authorization', `Bearer ${newusertoken}`)
                    .send({
                        query: `query GetOne {
                            getById(id: 390) {
                              id
                              title
                              description
                              completed
                            }
                        }` 
                    })
                    .expect(200)
                    .expect((res) => {
                        const parsedError = JSON.parse(res.text);
                        expect(parsedError).toHaveProperty('errors');
                        expect(Array.isArray(parsedError.errors)).toEqual(true);
                        expect(parsedError.errors[0]).toHaveProperty('message');
                        expect(parsedError.errors[0].message).toEqual('Item not found.')
                    });
            });

            it('<search> not found item - should throw', () => {
                return request(app.getHttpServer())
                    .post('/graphql')
                    .set('Authorization', `Bearer ${newusertoken}`)
                    .send({
                        query: `query Search {
                            searchItem(title: "yum") {
                                id
                                title
                                description
                                completed
                            }
                        }` 
                    })
                    .expect(200)
                    .expect((res) => {
                        const parsedError = JSON.parse(res.text);
                        expect(parsedError).toHaveProperty('errors');
                        expect(Array.isArray(parsedError.errors)).toEqual(true);
                        expect(parsedError.errors[0]).toHaveProperty('message');
                        expect(parsedError.errors[0].message).toEqual('Items not found.')
                    });
            });

            it('unauthorized - should throw', () => {
                return request(app.getHttpServer())
                    .post('/graphql')
                    .send({
                        query: `query GetOne {
                            getById(id: 3) {
                              id
                              title
                              description
                              completed
                            }
                        }` 
                    })
                    .expect(200)
                    .expect((res) => {
                        const parsedError = JSON.parse(res.text);
                        expect(parsedError).toHaveProperty('errors');
                        expect(Array.isArray(parsedError.errors)).toEqual(true);
                        expect(parsedError.errors[0]).toHaveProperty('message');
                        expect(parsedError.errors[0].message).toEqual('Unauthorized access.')
                    });
            });

        })
    })
});
