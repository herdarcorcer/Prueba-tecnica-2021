var express = require('express');
var logger = require('morgan');
var helmet = require('helmet');
var cors = require('cors');
var dotenv = require('dotenv');

dotenv.config();

var app = express();

var identidadRouter = require('./routes/identidad');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(logger('dev'));
app.use(cors());
app.use(helmet());

app.use('/api/identidad', identidadRouter);

app.listen(3000, function() {
    console.log('El sitio inició correctamente en el puerto 3000');
});