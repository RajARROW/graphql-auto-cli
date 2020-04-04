const package = {
    "name": "spreadd-backend",
    "version": "1.0.0",
    "description": "Spreadd Backend",
    "main": "index.js",
    "scripts": {
        "start": "nodemon --exec babel-node server/index.js",
        "test": "echo \"Error: no test specified\" && exit 1"
    },
    "author": "",
    "license": "ISC",
    "dependencies": {
        "apollo-server-express": "^2.6.7",
        "aws-sdk": "^2.579.0",
        "babel-register": "^6.26.0",
        "bcryptjs": "^2.4.3",
        "body-parser": "^1.19.0",
        "dotenv": "^8.0.0",
        "eslint": "^6.5.1",
        "express": "^4.17.1",
        "express-graphql": "^0.8.0",
        "graphql": "^14.4.0",
        "graphql-tools": "^4.0.5",
        "jsonwebtoken": "^8.5.1",
        "lodash": "^4.17.15",
        "mongodb": "^3.2.7",
        "mongoose": "^5.6.3",
        "nodemailer": "^6.3.1",
        "passport": "^0.4.0",
        "passport-facebook": "^3.0.0",
        "passport-google-oauth2": "^0.2.0"
    },
    "devDependencies": {
        "@babel/core": "^7.4.5",
        "@babel/node": "^7.4.5",
        "@babel/preset-env": "^7.4.5",
        "nodemon": "^1.19.1"
    }
}

const gitIgnoreData = 'node_modules';

const evnData = `mongoURI=mongodb://localhost:27017
mongoDBName=spreadd
PORT=3000`

const bable = {
"presets": [
"@babel/preset-env"
]
};

const server = `require("dotenv").config();
var express = require('express');
var mongoose = require('mongoose');
const app = express();
import { ApolloServer } from 'apollo-server-express';
import * as schema from '../graphql';

//get Mongo URL and DB name from env
const { mongoURI: dbURL, mongoDBName: dbName } = process.env;
const db = \`\${dbURL}/\${dbName}\`;

const port = process.env.PORT || "4000";

//apollo server instance
const SERVER = new ApolloServer({
  typeDefs: schema.TYPEDEFS,
  resolvers: schema.RESOLVERS,
  playground: {
    endpoint: \`http://localhost:\${port}/graphql\`
  }
});

//apply middleware on app for apollo server
SERVER.applyMiddleware({ app });
mongoose
.connect(
  db,
  {
    useCreateIndex: true,
    useNewUrlParser: true
  }
)
.then(() => {
  console.log("MongoDB connected");
  app.listen(port, () => console.log(\`Spreadd Graphql server running on localhost:\${port}/graphql\`));
})
.catch(err => console.log(err));`;

const schema = `import TYPEDEFS from './schema';
import RESOLVERS from './resolvers';
export { TYPEDEFS, RESOLVERS };`

module.exports.basicFiles = [{
data: JSON.stringify(package, null, 2),
fileName: 'package.json'
},
{
data: gitIgnoreData,
fileName: '.gitignore'
},
{
data: evnData,
fileName: '.env'
},
{
data: JSON.stringify(bable, null, 2),
fileName: '.babelrc'
},
{
    data: server,
    fileName: '/index.js',
    path: './server'
},
{
  data: schema,
  fileName: '/index.js',
  path: './graphql'
}];