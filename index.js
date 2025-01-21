var path = require('path');
const express = require('express')
const morgan = require('morgan')
const { engine } = require('express-handlebars');
var methodOverride = require('method-override');
const app = express()
const port = 3000
const db = require('./config/db')

// conect db
db.connect();

const route = require('./routes')

app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.urlencoded({
  extended: true  // parse application/x-www-form-urlencoded
})); // xuử lý data từ form submit lên

app.use(express.json()); // xuử lý data từ js lên vd fetch,ajax,...

app.use(morgan('combined'))

// template engine
app.engine('hbs', engine({
  extname: '.hbs',
  helpers: {
    sum: (a, b ) => a + b,
  }
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

route(app);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})