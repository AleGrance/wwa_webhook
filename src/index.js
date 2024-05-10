import express from 'express';
import consign from 'consign';

// Importar para leer los valores de entorno
require('dotenv').config()

//console.log(process.env);

const app = express();

//cross access
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization. apikey');
    next();
}
app.use(allowCrossDomain);

consign({
    cwd: __dirname
})
    .include('libs/config.js')
    .then('db.js')
    .then('libs/middlewares.js')
    .then('routes')
    .then('libs/boot.js')
    .into(app)


