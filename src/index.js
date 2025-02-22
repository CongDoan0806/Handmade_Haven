var path = require('path');
const express = require('express')
const morgan = require('morgan') // thu vien log loi
const { engine } = require('express-handlebars');
const app = express()
const port = 3000
const db = require('./config/db')
const methodOverride = require('method-override');

const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',  // Chuỗi bí mật để mã hóa session
  resave: false,  
  saveUninitialized: false,  
  cookie: { secure: false }  // Để false nếu không dùng HTTPS
}));

app.use((req, res, next) => {
  res.locals.isAuthenticated = !!req.session.userId; 
  next();
});
// Sử dụng query string "_method" để override method
app.use(methodOverride('_method'));

const cartQuantityMiddleware = require('./app/middlewares/cartMiddlewares');

app.use(cartQuantityMiddleware);

const route = require('./routers')

// app.use(methodOverride('_method'))

app.use(express.static(path.join(__dirname, 'public'))) // xuử lý hiển thị ảnhảnh

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

