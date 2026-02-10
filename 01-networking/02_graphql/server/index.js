import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { resolvers } from "./resolvers.js";
import { typeDefs } from "./typeDefs.js";

// The ApolloServer constructor requires two parameters: your schema definition and your set of resolvers.
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// this will start the apollo server playground at http://localhost:4000
const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
