const express =require('express');
const cors = require('cors');
const morgan = require('morgan');

const apiRouter = require('./apiRouter');

const app = express();

const PORT= 3001;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use('/',apiRouter)

app.listen(PORT, ()=>{
    console.log(`server is listening  on ${PORT}`);
});

module.exports = app;