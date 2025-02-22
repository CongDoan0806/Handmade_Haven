const Product = require('../models/ProductModel');
const Blog = require('../models/BlogModel');

class SiteController {
  index(req, res, next) {
    Product.getFourProduct((err, products) => {
        if (err) {
            return res.status(500).send('Lỗi khi lấy dữ liệu sản phẩm.');
        }
        Blog.getFourBlogs((err, blogs) => {
            if (err) {
                return res.status(500).send('Lỗi khi lấy dữ liệu blog.');
            }
            res.render('home', { products, blogs });
        });
    });
}
    search(req, res, next) {
        
    }
    cartQuantity(req, res, next)  {
      const customer_id = req.session.userId;
      Product.cartQuantity(customer_id, (err, results) => {
          if (err) {
              return next(err); 
          }
          res.locals.result = results; 
          next();
      });
  };

  search(req, res, next){
    const keyword = req.query.keyword;

    Product.searchProduct(keyword, (err, products) => {
      if (err) {
        return res.status(500).send('Loi khi tìm kiếm sản phẩm.');
      }
      res.render('search', { products });
    });
  }
  
}

module.exports = new SiteController;