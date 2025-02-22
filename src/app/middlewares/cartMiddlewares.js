
const Product = require('../models/ProductModel');

const cartQuantityMiddleware = (req, res, next) => {
    const userId = req.session.userId;
    Product.cartQuantity(userId, (err, results) => {
        if (err) {
            return next(err); 
        }
        res.locals.cartQuantity = results[0] ? results[0]['COUNT(cart_id)'] : 0;  
        next(); 
    });
};
module.exports = cartQuantityMiddleware;
