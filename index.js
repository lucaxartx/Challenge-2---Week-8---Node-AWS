require('dotenv').config();
const express = require('express');



const app = express();

const db = require('./src/db/db');

const accountRouter = require('./src/routes/account_route');

const notFoundMiddleware = require('./src/middlewares/not-found');
const errorHandlerMiddleware = require('./src/middlewares/error-handler');


app.use(express.json());


app.use('/api/v1/account', accountRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


const port = 3000;

const start = async () => {
    try {
        await db(process.env.MONGOURL);
        app.listen(port);
    } catch (e) {

    }
}

start();