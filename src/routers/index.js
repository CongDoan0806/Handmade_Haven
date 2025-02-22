
const productRouter = require('./product');
const siteRouter = require('./site');
const shopRouter = require('./shop');
const blogRouter = require('./blog');
const cartRouter = require('./cart');
const userRouter = require('./user');
const momoRouter = require('./momo');
function route(app){
      app.use('/product', productRouter); 
      app.use('/shop', shopRouter); 
      app.use('/blog', blogRouter); 
      app.use('/cart', cartRouter); 
      app.use('/user', userRouter); 
      app.use('/momo', momoRouter); 
      app.use('/', siteRouter); 
      
      app.use((req, res) => {
        res.status(404).render('404NotFound'); 
      });
      
    
}

module.exports = route;