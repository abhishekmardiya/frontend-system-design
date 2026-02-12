// get data from the server
const fetchUser = async () => {
  try {
    const response = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization: "Bearer your_token_here",
      },
      body: JSON.stringify({
        query: `
            query GetData {
              authors {
                id
                name
              }
              books {
                id
                title
                publishedYear
              }
            }
          `,
        // operationName helps the server identify which named operation to run
        // especially useful when multiple queries/mutations are in a single request
        // Helpful for logging and analytics; required if multiple operations exist
        operationName: "GetData",
      }),
    });

    const result = await response.json();

    console.log("result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Error fetching user:", error);
  }
};

fetchUser();

// create data on the server
const addBook = async (title, publishedYear, authorId) => {
  try {
    const response = await fetch("http://localhost:4000", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Authorization header can be added if needed
        // 'Authorization': 'Bearer your_token_here'
      },
      body: JSON.stringify({
        query: `
            mutation AddBook {
              addBook(title: "${title}", publishedYear: ${publishedYear}, authorId: "${authorId}") {
                id
                title
                publishedYear
              }
            }
          `,
        operationName: "AddBook",
      }),
    });

    const result = await response.json();
    console.log("Mutation result:", JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("Mutation error:", error);
  }
};

addBook("Book Five", 2024, "1");
