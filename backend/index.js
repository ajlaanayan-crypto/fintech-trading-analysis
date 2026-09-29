const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Stock Market App Backend Running');
});

// Import Routes
const stockRoutes = require('./routes/stockRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/stocks', stockRoutes);
app.use('/api/ai', aiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
