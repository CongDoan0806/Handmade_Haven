const Product = require('../models/ProductModel');
class ProductController {
    detail(req, res, next){
        Product.findBySlug(req.params.slug, (err, product) => {
            if (err) return res.status(500).send(err);
            res.render('detail', { product });
        });
    }
    shop(req, res, next){
        Product.getAllProducts((err, products) => {
            if (err) {
              return res.status(500).send('Lỗi khi lấy dữ liệu sản phẩm.');
            }
            res.render('shop', { products });
          });

       
    }
    homeShop(req, res, next){
        Product.getFourProduct((err, products) => {
                    if (err) {
                      return res.status(500).send('Lỗi khi lấy dữ liệu sản phẩm.');
                    }
                    res.render('homeShop', { products });
                  });
        
       
    }
    showCart(req, res, next){
        const customer_id = req.session.userId;
        console.log(customer_id);
        Product.showCart(customer_id, (err, products) => {
            if (err) {
                console.error("Lỗi SQL:", err);
                return res.status(500).json({ message: "Lỗi ", error: err });
            }
            res.render('shoppingCart', { products });
        })
    };
    addToCart(req, res, next) {
        let { productId, quantity } = req.body;
        const customerId = req.session.userId; 
        if (!customerId) {
            return res.status(401).json({ message: "Bạn cần đăng nhập để thêm vào giỏ hàng." });
        }
        if (!quantity){
            quantity = 1;
        }
        if (!customerId) {
            return res.status(401).json({ message: "Bạn cần đăng nhập để thêm vào giỏ hàng." });
        }
    
        Product.findProductCart(customerId, productId, (err, product) => {
            if (err) {
                console.error("Lỗi SQL:", err);
                return res.status(500).json({ message: "Lỗi khi tìm kiếm sản phẩm trong giỏ hàng", error: err });
            }
    
            if (product) {
                const newQuantity = Number(product.quantity) + Number(quantity);
                Product.updateCartQuantity(customerId, productId, newQuantity, (err, updatedProduct) => {
                    if (err) {
                        console.error("Lỗi SQL:", err);
                        return res.status(500).json({ message: "Lỗi khi cập nhật sản phẩm trong giỏ hàng", error: err });
                    }
                    res.status(200).json({ message: "Cập nhật sản phẩm trong giỏ hàng thành công", data: updatedProduct });
                });
            } else {
                Product.addToCart(productId, customerId, quantity, (err, result) => {
                    if (err) {
                        console.error("Lỗi SQL:", err);
                        return res.status(500).json({ message: "Lỗi khi thêm vào giỏ hàng", error: err });
                    }
                    console.log(result)
                    res.status(200).json({ message: "Thêm vào giỏ hàng thành công", data: ['success']});
                });
            }
        });
    }
    destroy(req, res, next){
        const customerId = req.session.userId;
        const productId = req.params.id;
        Product.removeFromCart(customerId, productId, (err, product) => {
            if (err) {
                console.error("Lỗi SQL:", err);
                return res.status(500).json({ message: "Lỗi", error: err });
            }
            res.redirect('back')
        })
    }

    updateCartItemQuantity(req, res, next){
        const customerId = req.session.userId;
        let { quantity, cartId} = req.body;
        Product.updateCartItemQuantity(quantity, cartId, (err, result) => {
            if (err) {
                console.error("Loi SQL:", err);
                return res.status(500).json({ message: "Loi khi cập nhật sản phẩm trong gio hàng", error: err });
            }
            res.status(200).json({ message: "Cập nhật sản phẩm trong gio hàng thành công", data: result });
        });
    }
    createOrder = (req, res, next) => {
        const { selectedItems, totalAmount } = req.body;
        const customer_id = req.session?.userId;
    
        if (!customer_id) {
            return res.status(401).json({ message: "Người dùng chưa đăng nhập!" });
        }
    
        if (!Array.isArray(selectedItems) || selectedItems.length === 0 || totalAmount <= 0) {
            return res.status(400).json({ message: "Dữ liệu không hợp lệ!" });
        }
    
        Product.createOrder(customer_id, selectedItems, (err, result) => {
            if (err) {
                console.error("Lỗi khi tạo đơn hàng:", err);
                return res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: err });
            }
    
            Product.removeItemsFromCart(customer_id, selectedItems, (err) => {
                if (err) {
                    console.error("Lỗi khi xóa sản phẩm khỏi giỏ hàng:", err);
                    return res.status(500).json({ message: "Lỗi khi xóa giỏ hàng", error: err });
                }
    
                res.status(201).json({
                    message: "Đơn hàng đã được tạo thành công!",
                    orderId: result.orderId,
                    totalAmount: result.totalAmount
                });
            });
        });
    };
    

    
}

module.exports = new ProductController;