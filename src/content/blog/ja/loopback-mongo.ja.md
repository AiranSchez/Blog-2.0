---
template: blog-post
title: Loopback + Mongo
slug: /ja/mongo-loopback-docker
date: 2021-03-29 15:35:00+00:00
description: loopback4とdockerized mongodbで作成されたAPI
featuredImage: /assets/images/posts/loopback-4-logo-sample.png
tags: ['Loopback', 'MongoDB', '学習', 'ガイド', 'JavaScript', 'TypeScript', 'Docker', 'Backend','ブログ']

---
## はじめに 

先日、[Loopback](https://loopback.io/)について興味を持ちました。これはnodejsとTypeScript用のフレームワークで、あまり心配することなく迅速にAPIを作成できます。IBMによって作成されており、いくつかの推奨事項を受けて試してみることにしました。これが結果です： 

## Loopback4

主なアイデアは、mongoコンテナに接続し、アプリケーションからユーザーの作成、読み取り、更新、削除を可能にするAPIを作成することでした（CRUD）。このために、公式チュートリアルによれば、これらのいくつかのコマンドで十分です： 

```javascript
lb4 app
lb4 model
lb4 datasource
lb4 repository
lb4 controller
npm start
```

これらは何を意味しますか？最初から最後まで、基本的に次の手順に従います（すべてのコマンドはCLIです）： 

1. lb4 app ➡ アプリケーションを作成し、名前、説明、機能などを要求します

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
2. lb4 model ➡ APIを形成するモデル（または複数のモデル）を作成します。私の場合はUserだけを入れましたが、問題なく追加できます。 

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
3. lb4 datasource ➡ リレーショナルまたは非リレーショナルのいずれかのデータベースへの接続を作成します（mongodb、mysql、redisなどの中から最も必要なものを選択できます）

   ```typescript
   ...
   const config = {
     name: 'db',
     connector: 'mongodb',
     url: '',
     host: 'localhost',
     port: 27018, // 重要
     user: 'leanmind', // このユーザーが存在する必要があります 
     password: 'root',
     database: 'pruebita', // 存在しない場合は作成されます
   };
   ...
   ```

   生成されるすべての中で、データベースの接続URLを要求しますが、変更したい場合は後で好みに合わせて変更できます。dockerized mongodbを使用したかったので、後で説明するいくつかのフィールドを変更しました
4. lb4 repository ➡ データソースをモデルにバインドします。プロジェクトに存在するすべてのモデルとデータソースの中から選択するように求められます。コードはあまり広範囲ではありません： 

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
5. lb4 controller ➡ ここが良い部分です。モデルの各プロパティのGET、POST、PUT、PATCH、DELETEメソッドを作成します。モデル、リポジトリ、エンドポイントが区別されるプロパティ（例：/users/id）を要求します

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
6. npm run start ➡ アプリを起動し、localhostのポート80でリクエストを受け取る準備ができたAPIがあります 

## Mongodb + Docker

公式のmongodbアプリケーションがある場合、データベース接続の管理がはるかに簡単になります。mongodbサービスがオンになっているとデフォルトでポート27017を占有し、例えばRobo3Tを介してすべてのデータベースを表示できます。

このアプリをdockerizeすることの重要な点は、データベースに認証の問題がなく、テーブルを作成できるように、ユーザーとパスワードの作成スクリプトを持つことにあります。

したがって、`docker-compose up`を実行すると、mongoが起動し、docker-composeで必要かつ示したデータベースを管理する権限を持つユーザーが作成されます。

docker-composeは次のとおりです： 

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

そしてmongoスクリプト： 

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

