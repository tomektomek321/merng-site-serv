
const { ApolloServer } = require('apollo-server');
const gql = require('graphql-tag');

const typeDefs = gql`
    type Query {
        sayHi: String!
    }
`;


const resolvers = {
    Query: {
        sayHi: () => 'gello you'
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

server.listen({port: 5500}).then((res) => {
    console.log("serv ranning");
});

