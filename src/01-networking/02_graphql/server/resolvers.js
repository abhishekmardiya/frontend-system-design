import { data } from "./data.js";

export const resolvers = {
  // relationship
  Book: {
    author: (parent, _args, _context, _info) => {
      // parent --> the single Book object ({ id: "101", title: "Book One", publishedYear: 2020, authorId: "1" })
      return data?.authors?.find((el) => el?.id === parent?.authorId);
    },
  },
  Author: {
    books: (parent, _args, _context, _info) => {
      return data?.books?.filter((el) => parent?.bookIds?.includes(el?.id));
    },
  },

  Query: {
    authors: () => {
      return data?.authors;
    },

    books: () => {
      return data?.books;
    },
  },

  Mutation: {
    addBook(_parent, args, _context, _info) {
      const newBook = {
        ...args,
        id: data?.books?.length + 1,
      };

      data.books.push(newBook);

      return newBook;
    },
  },
};

/*
query ExampleQuery {
  authors {
    id
    name
    books {
      id
      title
    }
  }
  books{
    id
    title
    author {
      id
      name
    }
  }
}
*/

/*
mutation AddBook($title:String!,$authorId:ID!) {
  addBook(title:$title,authorId:$authorId){
    title
  }
}
*/
