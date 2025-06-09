const Express = require('express');
const morgan = require('morgan');
const app = Express()

app.use(morgan('dev')) // shows which route is hit
//to use middlewares
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))


module.exports = app;