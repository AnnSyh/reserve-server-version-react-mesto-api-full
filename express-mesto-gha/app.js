// const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const BodyParser = require('body-parser');
const { errors } = require('celebrate');
const auth = require('./middlewares/auth'); // авторизация
const cenralErrors = require('./middlewares/central-err');

const app = express();
const routes = require('./routes/routes');

const { PORT = 3000 } = process.env; // Слушаем 3000 порт

// функция обработки ошибок при подключении к серверу mongo
async function main() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mestodb');
  } catch (error) {
    console.log(error);
  }
  app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`); // Если всё работает, консоль покажет, какой порт приложение слушает
  });
}
// cors
// app.use(cors());
app.use(cors({
  origin: 'https://mesto.frontend.annsyh.nomoredomains.work/',
  credentials: true,
}));


// const cors = (req, res, next) => {

//   const { origin } = req.headers;
// 	console.log(origin)
//   const { method } = req;
//   const requestHeaders = req.headers['access-control-request-headers'];
//   const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

//   res.header('Access-Control-Allow-Origin', origin);
//   res.header('Access-Control-Allow-Credentials', true);

//   if (method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
//     res.header('Access-Control-Allow-Headers', requestHeaders);

//     return res.end();
//   }

//   return next();
// };

// app.use(cors());


// миддлвары
app.use(BodyParser.json()); // подключили миддлвару кот достает значения из тела запроса
app.use(auth); // авторизация

// подключаем роуты и всё остальное...
app.use(express.json());
app.use(routes);

// централизованная обработка ошибок
app.use(errors());
app.use(cenralErrors);

// запуск сервера
main();
