require('dotenv').config();
const express = require('express');



const app = express();

const db = require('./src/db/db');




const port = 3000;

const start = async () => {
    try {
        await db(process.env.MONGOURL);
        app.listen(port);
    } catch (e) {

    }
}

start();