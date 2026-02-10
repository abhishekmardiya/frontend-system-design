// hardcoded data
// Apollo Server can fetch data from any source you connect to (including a database, a REST API, a static object storage service, or even another GraphQL server). For the purposes of this tutorial, we'll hardcode our example data.
export const data = {
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
