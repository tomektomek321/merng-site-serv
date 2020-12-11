const { gql } = require('apollo-server');


module.exports = gql`
    type Post{
        id: ID!
        body: String!
        createdAt: String!
        username: String!
    }

    type User {
        id: ID!
        email: String!
        token: String!
        username: String!
        createdAt: String!
    }

    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
        email: String!
    }

    type Query {
        getPosts: [Post]
    }

    type Mutation {
        register(registerInput: RegisterInput): User!
    }
`;

/*
mutation {
    register(registerInput: {
      username: "tome"
      email: "tomek123@gmail.com"
      password: "ab"
      confirmPassword: "ab"

    }) {
      id
      email
      token
      username
      createdAt
    }*/