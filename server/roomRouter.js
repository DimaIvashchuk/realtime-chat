const express = require('express');
const Room = require('./roomModel');

const router = express.Router();

router.get('/room', async (req, res) => {
  try {
    const allRooms = await Room.find({});

    res.send({
      status: 'ok',
      data: allRooms
    });
  } catch (error) {
    console.log(error);
  }
});

router.post('/room', async (req, res) => {
  try {
    const newRoom = new Room({ title: req.body.title });

    await newRoom.save();

    res.send({
      status: 'ok',
      data: newRoom
    })

  } catch (error) {
    console.log(error)
  }
});

module.exports = router;