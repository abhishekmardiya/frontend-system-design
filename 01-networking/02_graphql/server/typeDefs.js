// #graphql is for comments in GraphQL schema files
// name! --> "! is for mandatory field
// type Query --> for getting data
// type Mutation --> for modifying data

// [Author] --> for array of Author
// books:[book] --> return array of Book from the given Author

export const typeDefs = `#graphql
  type Author {
    id: ID!
    name: String!
    books:[Book]
  }

  type Book {
    id: ID!
    title: String!
    publishedYear: Int
    author: Author
  }

  type Query {
    authors: [Author]
    books: [Book]
  }

  type Mutation {
      addBook(title: String!, publishedYear: Int, authorId: ID!): Book!
  }
`;
