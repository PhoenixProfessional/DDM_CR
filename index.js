const express = require('express');
const axios = require('axios');
const cors = require('cors');
const xml2js = require('xml2js');

const app = express();
const port = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());

// Goodreads API credentials
const apiKey = 'RDfV4oPehM6jNhxfNQzzQ';
const apiSecret = 'fu8fQ5oGQEDlwiICw45dGSuxiu13STyIrxY0Rb6ibI';

// Endpoint to handle search and pagination
app.get('/api/search', async (req, res) => {
  const { query, page } = req.query;

  try {
    // Make request to Goodreads API
    const response = await axios.get(
      `https://www.goodreads.com/search/index.xml?key=${apiKey}&q=${encodeURIComponent(query)}&page=${page}`
    );

    // Convert XML response to JSON
    const jsonResult = await xml2js.parseStringPromise(response.data);

    // Extract relevant data
    const books = jsonResult.GoodreadsResponse.search[0].results[0].work;

    // Format the response
    const formattedBooks = books.map((book) => ({
      id: book.best_book[0].id[0]._,
      title: book.best_book[0].title[0],
      author: book.best_book[0].author[0].name[0],
      image: book.best_book[0].image_url[0],
    }));

    return res.json(formattedBooks);
    // return "test string";
  } catch (error) {
    return res.status(500).json({ error: 'An error occurred while fetching data from Goodreads API' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
