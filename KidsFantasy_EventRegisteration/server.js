const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb'); 
const app = express();
const port = 8080;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const uri = "mongodb+srv://ridafarheen321:Iminfogirl123@cluster0.fgisn9c.mongodb.net/KidsFantasy?retryWrites=true&w=majority";


const client = new MongoClient(uri);

app.get('/', (req, res) => {
    res.render('index', { events: [] });
});
app.get('/events', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('KidsFantasy');
        const collection = db.collection('Event');

        const events = await collection.find({}).toArray();
        res.json(events); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});

app.post('/register', async (req, res) => {
    try {
        await client.connect();
        console.log('Connected to MongoDB');

        const db = client.db('KidsFantasy');
        const collection = db.collection('Event');

        const eventData = {
            additionalDemands: req.body['additional-demands'],
            venue: req.body.venue,
            catering: req.body.catering,
            foodStyle: Array.isArray(req.body['food-style']) ? req.body['food-style'] : [], // Ensure it's an array
            eventType: req.body['event-type'],
            eventTypeDescription: req.body['event-type-description'],
            eventDate: req.body['event-date'],
            theme: req.body.theme,
            weatherChecked: req.body['weather-check'] === 'yes'
        };
        

        const result = await collection.insertOne(eventData);
        console.log('Event data inserted');

        
        const newEvent = await collection.findOne({ _id: result.insertedId });

        res.json(newEvent); 
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
