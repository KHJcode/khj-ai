const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();
const PORT = process.env.PORT || 8000;

const indexRouter = require('./routes/index');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layout');

app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));

app.use('/', indexRouter);

app.listen(PORT, console.log('Server has started.'));
