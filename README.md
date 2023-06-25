# mediql-npm-package
MediQL is a GraphQL developer tool, built to work on top of GraphiQL, an open-source web-based integrated development environment (IDE). MediQL takes it a step further by delivering query response visualization, error indication, and the ability to observe original external API response objects which GraphiQL can not. 

The `mediql` package contains only the functionality necessary to deliver a developer's resolved external API responses as well as the GraphQL query response to MediQL's server. 

**Note:** this package is strictly for development mode. 

# Usage
- [ ] In your application's GraphQL Schema file or your file with resolvers...
- [ ] Import the `postOriginResp` function from the `mediql` package using CommonJS module syntax.
- [ ] Invoke the `postOriginResp` function inside each of your resolvers with specific arguments shown below:
```javascript
//import the postOriginResp function from the mediql package
const { postOriginResp } = require('mediql');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
} = require("graphql");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    Movie: {
      type: SwapiMovieType,
      args: { id: { type: GraphQLString } },
      async resolve(parent, args, context, info) {
        try {

//declare the response variable assign it to the result of your fetch request to the external api url of your choice
          const response = await fetch(
            `https://swapi.dev/api/films/${args.id}`,
            {
              headers: { "content-type": "application/json" },
            }
          );

//declare the parsedResponse variable as the parsed JSON response of your previous response variable
          const parsedResponse = await response.json();
          
//invoke mediql's packaged function with the arguments of response, parsedResponse, and info respectively.
          postOriginResp(response, parsedResponse, info);

          return parsedResponse;
        } catch (err) {
          console.error("Error fetching movie:", err);
          throw new Error("Unable to fetch movie");
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
```
- [ ] In your application's server file... 
- [ ] Import the `postQueryResp` function from the `mediql` package using CommonJS module syntax.
- [ ] Import the `graphqlHTTP` function from the `express-graphql` package.
- [ ] Set up a route at the endpoint `/graphql` using Express and use the `graphqlHTTP()` middleware with arguments of `schema` which was declared beforehand, `graphiql` which enables GraphiQL, `context`,  and `extensions` to be able to call the `postQueryResp` function.
```javascript
const express = require("express");

//Import the graphqlHTTP function from the express-graphql package
const { graphqlHTTP } = require("express-graphql");

//Import the postQueryResp function from the mediql package
const { postQueryResp } = require("mediql");

const app = express();

//Import your GraphQL schema file and declare it as the variable schema
const schema = require("./schema/schema.js");

const cors = require("cors");
app.use(cors());
app.use(express.json())
const PORT = 3900;

//Set up the /graphql route (i.e.: http://localhost:${PORT}/graphql)
app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
    context: ({ req }) => ({ req }),
    extensions: async (
      { document, variables, operationName, result }) => {
      
//Invoke postQueryResp with result argument
      postQueryResp(result);
    },
  })
);

app.listen(PORT, console.log(`Server running on port ${PORT}`));
```
# Documentation
See https://github.com/oslabs-beta/MediQL#readme
See https://www.npmjs.com/package/mediql

# **Co-Creators**

- James Huang
  - [GitHub](https://github.com/JamesJunJieHuang)
  - [LinkedIn](https://www.linkedin.com/in/jamesjhuang/)
- Lily Hoong
  - [GitHub](https://github.com/hoonglily)
  - [LinkedIn](https://www.linkedin.com/in/lilyhoong/)
- Noah Tofte
  - [GitHub](https://github.com/nAndrewT)
  - [LinkedIn](https://www.linkedin.com/in/ntofte/)
- Jake Ruiz
  - [GitHub](https://github.com/J-Ruiz)
  - [LinkedIn](https://www.linkedin.com/in/jake-ruiz/)
