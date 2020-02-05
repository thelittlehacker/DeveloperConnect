const express = require('express');
const app = express();
const connectDB = require('./config/db');

// Connect Database
connectDB();

//Init Middleware
app.use(express.json({ extended: false }))
app.get('/', (req, res) => res.send('API Running'));

// Define Routes
const userRouter = require('./routes/api/users');
const authRouter = require('./routes/api/auth');
const productRouter = require('./routes/api/products')


app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));