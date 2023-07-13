## Description

A Node.js-based GraphQL API for a Todo List.

## Some Technologies Used

- [Nest JS](https://docs.nestjs.com/) as the Node.js framework.
- [Prisma ORM](https://www.prisma.io/) for database access, querying and migrations.
- [Joi](https://joi.dev/api/) for input data validation.
- [JWT Tokens](https://jwt.io/) for user authentication and authorization.

## Running The App With Docker Compose

1. Install [Docker Compose](https://docs.docker.com/compose/install/) onto the local machine. 

2. Navigate into the `to-do` directory.

3. Update the `.env` file with the correct credentials for a local postgres database.
  ```
  POSTGRES_DB="database-name"
  POSTGRES_HOST="localhost"
  POSTGRES_PORT="5432"
  POSTGRES_USER="database-user"
  POSTGRES_PASSWORD="database-password"
  ```

4. [Ensure that the Docker daemon is running](https://docs.docker.com/config/daemon/troubleshoot/#check-whether-docker-is-running) on the machine.

5. On the terminal, run the following command to [build and start the app's container](https://docs.docker.com/engine/reference/commandline/compose_up/#options):
```bash
docker-compose up -d
```

6. Open `http://localhost:3000/graphql` to test the API.

## How to Test The API

### Create a User:

To successfully create a user, the `username` must be alphanumeric and between 5 to 20 characters. The `password` should contain at least 6 characters and the `email` should be in a valid email format.

  **Sample query:**
  ```graphql
  mutation {
    createUser(username: "fiyin", password: "password", email: "user3@gmail.com") {
      id
      username
      email
      createdAt
    }
  }
  ```

  **Sample response:**
  ```graphql
  {
    "data": {
      "createUser": {
        "id": 5,
        "username": "fiyin",
        "email": "user2@gmail.com",
        "createdAt": "2023-06-10T04:02:59.676Z"
      }
    }
  }
  ```

### Login
**Sample query:**
  ```graphql
  mutation LoginUser {
    userLogin(email: "user3@gmail.com", password: "password") {
      id
      token
    }
  }
  ```

  **Sample response:**
  ```graphql
  {
    "data": {
      "userLogin": {
        "id": 5,
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZpeWluIiwiaWQiOjUsImlhdCI6MTY4NjM3MDExN30.ili3bVQlMDO9sjyWMNS8RJWi1MQTrynrSkHur7F1Lik"
      }
    }
  }
  ```

### Create an Item
This requires the `token` returned in the `Login` step. Add the `token` to the request header as `Bearer token` authorization.

The item must have a `title` between 5 and 50 characters. It can also have a `description` between 5 and 250 characters.

  **Sample query:**
  ```json
  {
    "headers": {
      "authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZpeWluIiwiaWQiOjUsImlhdCI6MTY4NjM3MDExN30.ili3bVQlMDO9sjyWMNS8RJWi1MQTrynrSkHur7F1Lik"
    }
  }
  ```

  ```graphql
  mutation CreateItem {
    createItem(title: "First Item!", description: "A new day, a new task!") {
      id
      title
      description
      userId
      completed
    }
  }
  ```

  **Sample response:**
  ```graphql
  {
    "data": {
      "createItem": {
        "id": 1,
        "title": "First Item!",
        "description": "A new day, a new task!",
        "userId": 5,
        "completed": false
      }
    }
  }
  ```

### Get All To-Do Items

This requires the `token` returned in the `Login` step. Add the `token` to the request header as `Bearer token` authorization. It can also accept a `page` value (default is 1) and `limit` (default is 10) to signify the number of items to return.

  **Sample query:**
  ```json
  {
    "headers": {
      "authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZpeWluIiwiaWQiOjUsImlhdCI6MTY4NjM3MDExN30.ili3bVQlMDO9sjyWMNS8RJWi1MQTrynrSkHur7F1Lik"
    }
  }
  ```

  ```graphql
  query GetItems {
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
}
  ```

  **Sample response:**
  ```graphql
  {
    "data": {
      "getAll": {
        "count": 5,
        "totalcount": 39,
        "page": 4,
        "items": [
          {
            "id": 20,
            "userId": 6,
            "title": "New Item!",
            "description": "This is a new item",
            "completed": false
          },
          {
            "id": 22,
            "userId": 6,
            "title": "New Item!",
            "description": "This is a new item",
            "completed": false
          },
          {...},
          {...},
          {...},
        ]
      }
    }
  }
  ```

### Get Item by ID
This requires the `token` returned in the `Login` step. Add the `token` to the request header as `Bearer token` authorization.

  **Sample query:**
  ```json
  {
    "headers": {
      "authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZpeWluIiwiaWQiOjUsImlhdCI6MTY4NjM3MDExN30.ili3bVQlMDO9sjyWMNS8RJWi1MQTrynrSkHur7F1Lik"
    }
  }
  ```

  ```graphql
  query GetOne {
    getById(id: 3) {
      id
      title
      description
      completed
    }
  }
  ```

  **Sample response:**
  ```graphql
  {
    "data": {
      "getById": {
        "id": 3,
        "title": "First Item!",
        "description": "A new day, a new task!",
        "completed": false
      }
    }
  }
  ```

### Search Items
This filters the user's items by `title`, `description`, or completion status (`completed`). It requires the `token` returned in the `Login` step. Add the `token` to the request header as `Bearer token` authorization.

  **Sample query:**
  ```json
  {
    "headers": {
      "authorization":"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZpeWluIiwiaWQiOjUsImlhdCI6MTY4NjM3MDExN30.ili3bVQlMDO9sjyWMNS8RJWi1MQTrynrSkHur7F1Lik"
    }
  }
  ```

  ```graphql
  query Search {
    searchItem(title: "First") {
      id
      title
      description
      completed
    }
  }
  ```

  **Sample response:**
  ```graphql
    {
    "data": {
      "searchItem": [
        {
          "id": 3,
          "title": "First Item!",
          "description": "A new day, a new task!",
          "completed": false
        }
      ]
    }
  }
  ```

## Test

```bash
# run tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Contact
Feel free to reach out via [LinkedIn](https://www.linkedin.com/in/fiyinfoluwa-akinsiku/).