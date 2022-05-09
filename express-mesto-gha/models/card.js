const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL');

// Опишем схему:
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: [2, 'Мин длина 2 символа'],
    maxlength: [30, 'Мах длина 30 символа'],
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator: (value) => isURL(value),
      message: 'Некорректная ссылка',
    },
  },
  owner: {
    type: 'ObjectId',
    required: true,
  },
  likes: {
    type: 'array',
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

// создаём модель и экспортируем её
module.exports = mongoose.model('card', cardSchema);
