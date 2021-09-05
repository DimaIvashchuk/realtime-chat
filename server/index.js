const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const router = require('./roomRouter.js')


const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors({
  credentials: true,
  origin: ['http://localhost:3000']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    status: false,
    message: err.message,
  });
});

app.use('/api/v1', router);

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    app.listen(PORT, () => {
      console.log(`Example app listening at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
