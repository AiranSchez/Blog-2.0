---
template: blog-post
title: Loopback + Mongo
slug: /en/mongo-loopback-docker
date: 2021-03-29 15:35:00+00:00
description: API made with loopback4 and dockerized mongodb
featuredImage: /assets/images/posts/loopback-4-logo-sample.png
tags: ['Loopback', 'MongoDB', 'Learning', 'Guide', 'JavaScript', 'TypeScript', 'Docker', 'Backend','Blog']

---
## Introduction 

The other day I got curious about [Loopback](https://loopback.io/), a framework for nodejs and TypeScript that allows you to create APIs quickly without worrying too much. It's created by IBM and after some recommendations I ventured to try it and this was the result: 

## Loopback4

The main idea was to create an API that connects to a mongo container and allows creating, reading, updating and deleting users from an application (CRUD). For this, according to the official tutorial, these few commands are enough: 

```javascript
lb4 app
lb4 model
lb4 datasource
lb4 repository
lb4 controller
npm start
```

What do they mean? Well from start to finish they essentially follow these steps (all commands are CLI): 

1. lb4 app ➡ Creates your application, asks for name, description, features...etc

   ```
    ...
    ◉ Enable eslint: add a linter with pre-configured lint rules
    ◉ Enable prettier: install prettier to format code conforming to rules
    ◉ Enable mocha: install mocha to run tests
    ◉ Enable loopbackBuild: use @loopback/build helpers (e.g. lb-eslint)
    ◉ Enable vscode: add VSCode config files
    ◉ Enable docker: include Dockerfile and .dockerignore
    ◉ Enable repositories: include repository imports and RepositoryMixin
    ...
   ```
2. lb4 model ➡ Creates the model (or models) that will form your API. In my case I only put User, but you could add more without any problem. 

   ```typescript
   @model()
   export class User extends Entity {
     @property({
       type: 'number',
       id: true,
       generated: true,
     })
     id?: number;

     @property({
       type: 'string',
     })
     name?: string;

     @property({
       type: 'boolean',
       required: true,
     })
     hasAccount: boolean;

     constructor(data?: Partial<User>) {
       super(data);
     }
   }
   ```
3. lb4 datasource ➡ Creates a connection to a database that can be either relational or non-relational (and lets you choose the one you want most among mongodb, mysql, redis... )

   ```typescript
   ...
   const config = {
     name: 'db',
     connector: 'mongodb',
     url: '',
     host: 'localhost',
     port: 27018, // Important
     user: 'leanmind', // This user must exist 
     password: 'root',
     database: 'pruebita', // If it doesn't exist it will be created
   };
   ...
   ```

   Among everything it generates, it asks for a connection URL for the database, but you can perfectly modify it later to your liking if you want to change it. Since I wanted to use a dockerized mongodb I modified a couple of fields that I'll explain later
4. lb4 repository ➡ Binds the datasource with the model. It asks you to choose the model and datasource among all those that exist in your project. The code is not very extensive: 

   ```typescript
   export class UserRepository extends DefaultCrudRepository<
     User,
     typeof User.prototype.id,
     UserRelations
   > {
     constructor(
       @inject('datasources.db') dataSource: DbDataSource,
     ) {
       super(User, dataSource);
     }
   }
   ```
5. lb4 controller ➡ Here comes the good part. It creates GET, POST, PUT, PATCH and DELETE methods for each of the properties of your model. It asks for model, repository, property by which the endpoints will be distinguished (/users/id for example)

   ```typescript
   export class UserController {
     constructor(
       @repository(UserRepository)
       public userRepository : UserRepository,
     ) {}

     @post('/users')
     @response(200, {
       description: 'User model instance',
       content: {'application/json': {schema: getModelSchemaRef(User)}},
     })
     async create(
       @requestBody({
         content: {
           'application/json': {
             schema: getModelSchemaRef(User, {
               title: 'NewUser',
               exclude: ['id'],
             }),
           },
         },
       })
       user: Omit<User, 'id'>,
     ): Promise<User> {
       return this.userRepository.create(user);
     }

     @get('/users/count')...
     @patch('/users')...
     @get('/users/{id}')...
     ...
   ```
6. npm run start ➡ Launches the app and on port 80 of your localhost you have an API ready to receive requests 

## Mongodb + Docker

If we have the official mongodb application it would make managing the database connection much easier since having the mongodb service on would occupy port 27017 by default and you could see all the databases through Robo3T, for example.

The important thing about dockerizing this app lies in having a user and password creation script so that there are no authentication problems in the database and it can create the table.

So when doing `docker-compose up` the mongo would start up and create a user with permissions to administer the database we want and have indicated in the docker-compose.

Here's the docker-compose: 

```dockerfile
version: '3.8'
services:
  database:
    image: mongo
    container_name: loopbackdb
    environment:
      - MONGO_INITDB_DATABASE=pruebita
      - MONGO_INITDB_ROOT_USERNAME=leanmind
      - MONGO_INITDB_ROOT_PASSWORD=root
    volumes:
      - ./mongodb/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo-js:ro
      - mongodb:/data/db
    ports:
      - 27017:27017
    restart: unless-stopped
volumes:
  mongodb:
```

And the mongo script: 

```javascript
db.createUser(
  { 
    user: "leanmind", 
    pwd: "root", 
    roles: [
      "dbAdmin", 
      "readWrite"
    ]
  }
);
```

