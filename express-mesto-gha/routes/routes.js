const express = require('express');
// const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const userRouter = require('./user');
const cardRouter = require('./card');
const NotFoundError = require('../errors/not-found-err');
const {
  createUser,
  login,
} = require('../controllers/user');
const { AVATAR_REGEX } = require('../constants');
const auth = require('../middlewares/auth'); // авторизация

const app = express();

// роуты, не требующие авторизации
//  регистрация
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
    avatar: Joi.string().custom((value, helpers) => {
      if (AVATAR_REGEX.test(value)) {
        return value;
      }
      return helpers.message('Некорректная ссылка');
    }),
  }),
}), createUser);
//  авторизация (логин)
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Некорректный email');
    }),
    password: Joi.string().required(),
  }),
}), login);

// авторизация
app.use(auth);

// роуты, которым авторизация нужна
app.use(userRouter);
app.use(cardRouter);

// Обработаем некорректный маршрут и вернём ошибку 404
// app.use('*', (req, res) => {
//   res
//     .status(ERROR_CODE_NOT_FOUND)
//     .send({ message: `Страницы по адресу ${req.baseUrl} не существует` });
// });
app.use('*', auth, (req, res, next) => next(new NotFoundError(`Страницы по адресу ${req.baseUrl} не существует`)));

module.exports = app;
