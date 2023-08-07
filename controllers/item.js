// controllers/item.js
const Item = require('../models/item');

exports.getItemList = async (req, res) => {
  try {
    const itemList = await Item.find({}, '_id item_name price');

    res.status(200).json(itemList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching item list.' });
  }
};
