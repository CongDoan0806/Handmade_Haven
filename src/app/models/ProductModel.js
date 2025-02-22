const db = require('../../config/db');

exports.getAllProducts = (callback) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  };
  exports.findById = (id, callback) => {
    const query = 'SELECT * FROM products WHERE product_id = ?';
    db.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  };

  exports.findBySlug = (sl, callback) => {
    const query = 'SELECT * FROM products WHERE slug = ?';
    db.query(query, [sl], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  };
  exports.addToCart = (productId, customerId, quantity, callback) => {
    const query = 'INSERT INTO cart (product_id, customer_id, quantity) VALUES (?, ?, ?)';
    db.query(query, [productId, customerId, quantity], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  };

  exports.cartQuantity = (customerId, callback) => {
    const query = 'SELECT COUNT(cart_id) FROM cart AS cartQuantity WHERE customer_id = ?';
    db.query(query, [customerId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  };

  exports.findProductCart = (customerId, productId, callback) => {
    const query = 'SELECT * FROM cart WHERE customer_id = ? AND product_id = ?';
    db.query(query, [customerId, productId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]); 
    })
  }

  exports.updateCartQuantity = (customerId, productId, quantity, callback) => {
    const query = 'UPDATE cart SET quantity =? WHERE customer_id = ? AND product_id = ?';
    db.query(query, [quantity, customerId, productId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  };

  exports.showCart = (customerId, callback) => {
    const query = `SELECT ct.cart_id, ct.product_id, p.product_image, p.product_name, p.product_price, c.category_name, ct.quantity, (p.product_price * ct.quantity) AS total_price
                  FROM Cart AS ct
                  JOIN Products AS p ON p.product_id = ct.product_id
                  JOIN Categories AS c ON p.category_id = c.category_id
                  WHERE ct.customer_id =? 
                  ORDER BY ct.cart_id DESC;`;
      db.query(query, [customerId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
      });
  };

  exports.removeFromCart = (customerId, productId, callback) => {
    const query = 'DELETE FROM cart WHERE customer_id =? AND product_id =?';
    db.query(query, [customerId, productId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  };
  
  exports.getFourProduct = (callback) => {
    const query = 'SELECT * FROM products LIMIT 4';
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  }

  exports.searchProduct = (content, callback) => {
    const query = 'SELECT * FROM products where product_name like ?';
    const searchValue = `%${content}%`;
    db.query(query, [searchValue], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  };

  exports.updateCartItemQuantity = (quantity, cartId, callback) => {
    const query = `UPDATE Cart 
                    SET quantity = ? 
                    WHERE cart_id = ?`;
    db.query(query, [quantity, cartId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
  }

  exports.createOrder = (customerId, orderItems, callback) => {
    const totalAmount = orderItems.reduce((sum, item) => sum + item.quantity * item.price, 0);

    const orderQuery = "INSERT INTO Orders (customer_id, total_amount) VALUES (?, ?)";
    db.query(orderQuery, [customerId, totalAmount], (err, orderResult) => {
        if (err) return callback(err, null);

        const orderId = orderResult.insertId;
        const orderDetailsQuery = "INSERT INTO Order_Details (order_id, product_id, quantity, price) VALUES ?";
        const orderDetailsValues = orderItems.map(item => [orderId, item.product_id, item.quantity, item.price]);

        db.query(orderDetailsQuery, [orderDetailsValues], (err, detailsResult) => {
            if (err) return callback(err, null);
            callback(null, { orderId, totalAmount });
        });
    });


    exports.removeItemsFromCart = (customerId, orderItems, callback) => {
      if (!Array.isArray(orderItems) || orderItems.length === 0) {
          return callback(new Error("Không có sản phẩm nào để xóa"), null);
      }
  
      const productIds = orderItems.map(item => item.product_id); // Lấy danh sách product_id
  
      const query = "DELETE FROM Cart WHERE customer_id = ? AND product_id IN (?)";
      db.query(query, [customerId, productIds], (err, result) => {
          if (err) return callback(err, null);
          callback(null, result);
      });
  };
  
};