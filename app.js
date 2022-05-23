const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const routes = require('./routes/index');
const cors = require('cors')
// const createCheckoutSession = require('./controllers/product.controller')

const app = express();
dotenv.config();

// Setting up frontend
const path = require('path');
app.use(express.static(path.join(__dirname, 'views')));
// Setting up frontend ends Here
app.use(cors({ origin: true }))
app.use('/uploads', express.static('uploads')); // Makes Upload Folder Available Publically

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Databse Connection
mongoose
	.connect(process.env.DATABASE_URL, {
		useNewUrlParser: true,
	})
	.then(() => {
		console.log('Database Connected !');
	})
	.catch((err) => {
		console.log('Error at Database Connection !', err);
		process.exit();
	});

// define a simple route
app.get('/', (req, res) => {
	res.json({ message: 'Welcome to E-Store.' });
});

// stripe session end point
// app.post('/create-checkout-session', createCheckoutSession)

app.use('/', routes);
// app.use(express.json())

const PORT = 3001;
app.listen(PORT, () => {
	console.log('Server is running on PORT: ' + PORT);
});
