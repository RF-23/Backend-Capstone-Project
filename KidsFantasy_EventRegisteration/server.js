// Importing the Express library
const express = require('express');
// Importing body-parser to handle form data
const bodyParser = require('body-parser');  
// Importing MongoClient from mongodb package for MongoDB connection
const { MongoClient } = require('mongodb');  
// Creating an instance of Express
const app = express();  
// Defining the port number for the server 
const port = 8080;  

// Setting EJS as the view engine for rendering views
app.set('view engine', 'ejs');
// Middleware to parse URL-encoded data (form data)
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware to serve static files from the 'public' directory
app.use(express.static('public'));

// MongoDB connection URI
const uri = "mongodb+srv://ridafarheen321:Iminfogirl123@cluster0.fgisn9c.mongodb.net/KidsFantasy?retryWrites=true&w=majority";

// Creating a new MongoClient instance with the MongoDB URI
const client = new MongoClient(uri);

// Route handler for the root URL ('/') that renders the 'index' view
app.get('/', (req, res) => {
    // Render 'index.ejs' with an empty events array
    res.render('index', { events: [] });  
});

// Route handler for '/events' URL to fetch and return all events from MongoDB
app.get('/events', async (req, res) => {
    try {
        // Connect to the MongoDB server
        await client.connect();  
        // Log success message
        console.log('Connected to MongoDB');  
        // Access the 'KidsFantasy' database
        const db = client.db('KidsFantasy');  
        // Access the 'Event' collection
        const collection = db.collection('Event');  
        // Fetch all events from the collection
        const events = await collection.find({}).toArray();  
        // Send the events array as a JSON response
        res.json(events);  
    } catch (err) {
        // Log any errors that occur
        console.error(err);  
        // Send a 500 error response
        res.status(500).send('Internal Server Error');  
    } finally {
        // Close the MongoDB connection
        await client.close();  
    }
});

// Route handler for '/register' URL to handle form submission and insert data into MongoDB
app.post('/register', async (req, res) => {
    try {
        await client.connect();   
        console.log('Connected to MongoDB');  
        const db = client.db('KidsFantasy');  
        const collection = db.collection('Event'); 
        
        // Create an object with the event data from the form
        const eventData = {
            mail: req.body['mail'],  // User Mail ID
            eventDate: req.body['event-date'],  // Date of the event
            venue: req.body.venue,  // Venue
            eventType: req.body['event-type'],  // Event type
            eventTypeDescription: req.body['event-type-description'],  // Description for 'Others' event type
            theme: req.body.theme,  // Party theme
            catering: req.body.catering,  // Catering option
            foodStyle: req.body['food-style'],
            weatherChecked: req.body['weather-check'] === 'Yes',  // Boolean indicating if weather was checked
            additionalDemands: req.body['additional-demands'],  // Additional demands
        };

        // Insert the event data into the collection
        const result = await collection.insertOne(eventData);
        console.log('Event data inserted');  
 
        // Fetch the newly inserted event data
        const newEvent = await collection.findOne({ _id: result.insertedId });
        // Send the new event data as a JSON response
        res.json(newEvent);  
    } catch (err) {
        console.error(err);  
        res.status(500).send('Internal Server Error');  
    } finally {
        await client.close();  
    }
});
 

// Start the server and listen for incoming requests on the specified port
app.listen(port, () => {
    // Log server startup message
    console.log("Server is running on port " + port);
});
