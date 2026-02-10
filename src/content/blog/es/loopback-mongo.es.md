---
template: blog-post
title: Loopback + mongo
slug: /mongo /loopback /docker
date: 2021-03-29 15:35:00+00:00
description: API hecha con loopback4 y mongodb dockerizado
featuredImage: /assets/loopback-4-logo-sample.png
tags: ['Loopback', 'MongoDB', 'Aprendizaje', 'Guía', 'JavaScript', 'TypeScript', 'Docker', 'Backend','Blog']

---
## Introducción 

El otro día me dio por curiosear un poco acerca de [Loopback](https://loopback.io/), un framework para nodejs y TypeScript que te permite crear APIs de una forma rápida sin preocuparte de mucho. Está creado por IBM y tras alguna que otra recomendación me aventuré a probar y este fue el resultado: 

## Loopback4

La idea principal era crear una API que se conectara a un contenedor de mongo y permita crear, leer, actualizar y eliminar usuarios de una aplicación (CRUD). Para ello, según el tutorial oficial, basta con hacer estos pocos comandos: 

```javascript
lb4 app
lb4 model
lb4 datasource
lb4 repository
lb4 controller
npm start
```

¿Qué significan? Pues de principio a fin en esencia siguen estos pasos (todos los comandos son CLI): 

1. lb4 app ➡ Crea tu aplicación, te pide nombre, descripción, características...etc

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
2. lb4 model ➡ Crea el modelo (o varios) por el que se va a formar tu API. En mi caso solo puse User, pero se le podrían añadir más sin ningún problema. 

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
3. lb4 datasource ➡ Crea una conexión a una base de datos que puede ser tanto relacional como no relacional (y te deja elegir la que más quieras entre mongodb, mysql, redis... )

   ```typescript
   ...
   const config = {
     name: 'db',
     connector: 'mongodb',
     url: '',
     host: 'localhost',
     port: 27018, // Importante
     user: 'leanmind', // Debe existir este usuario 
     password: 'root',
     database: 'pruebita', // Si no existe se crea
   };
   ...
   ```

   Entre todo lo que te genera, te pide una URL de conexión para la base de datos, pero perfectamente lo puedes modificar luego a tu gusto si quieres cambiarla. Como yo quería usar un mongodb dockerizado modifiqué un par de campos que explicaré después
4. lb4 repository ➡ Ata el datasource con el modelo. Te pide que elijas el modelo y la datasource entre todas las que existan en tu proyecto. El código no es muy extenso: 

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
5. llb4 controller ➡Aquí viene lo bueno. Te crea métodos GET, POST, PUT, PATCH y DELETE de cada una de las propiedades de tu modelo. Te pide modelo, repositorio, propiedad por la que se distinguirán los endpoints (/users/id por ejemplo)

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
6. npm run start ➡ Lanza la app y en el puerto 80 de tu localhost tienes un API lista para recibir peticiones 

## Mongodb + Docker

Si poseemos la aplicación oficial de mongodb se nos facilitaría mucho la gestión de conectar la base de datos ya que al estar encendido el servicio de mongodb ocuparía el puerto 27017 de base y se podrían ver todas las bases de datos a través de Robo3T, por ejemplo.

Lo importante de dockerizar esta app recae en tener un script de creación de usuario y contraseña para que no hayan problemas de autenticación en la base de datos y pueda crear la tabla.

Así al realizar `docker-compose up` se levantaría el mongo y crearía un usuario con permisos para administrar la base de datos que queremos y hemos indicado en el docker-compose.

Aquí dejo el docker-compose: 

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

Y el script de mongo: 

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