const express = require('express');
const app = express();
const cors= require('cors');
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT || 3000;
const connectDB = require('./config/db');
connectDB();
const userRoutes = require('./routes/user.route');
const cookieParser= require('cookie-parser');
const captainRoutes = require('./routes/captain.route');



app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Welcome to the backend of the Uber-Clone app');
});

app.use('/users',userRoutes);
app.use('/captains',captainRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});