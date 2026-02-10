// hardcoded data
const data = {
	authors: [
		{ id: "1", name: "Author One", bookIds: ["101", "102"] },
		{ id: "2", name: "Author Two", bookIds: ["103"] },
	],
	books: [
		{ id: "101", title: "Book One", publishedYear: 2020, authorId: "1" },
		{ id: "102", title: "Book Two", publishedYear: 2021, authorId: "1" },
		{ id: "103", title: "Book Three", publishedYear: 2022, authorId: "2" },
	],
};

export const resolvers = {
	// relationship
	Book: {
		author: (parent, args, context, info) => {
			// parent --> the single Book object ({ id: "101", title: "Book One", publishedYear: 2020, authorId: "1" })
			return data?.authors?.find((el) => el?.id === parent?.authorId);
		},
	},
	Author: {
		books: (parent, args, context, info) => {
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
		addBook(parent, args, context, info) {
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
