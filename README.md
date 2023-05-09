# mediql-npm-package
Mediql is a GraphQL developer tool, built to work on top of graphiql, and delivers query response visualization, error indication, and the ability to observe original external API response objects which graphiql can not. 

The `mediql` package contains only the functionality necessary to deliver a developer's resolved external API responses as well as the GraphQL query response to mediql's server. 

**Note:** this package is strictly for development mode. 

# Usage
```javascript
const {postOriginResp} = require('mediql')

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
