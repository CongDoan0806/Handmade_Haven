const User = require('../models/UserModel');
const { otpStore } = require("./MailController.js");
class UserController{
    index(req, res, next){
        req.session.userId = null;
        res.render('loginRegister')
    }

    login(req, res, next) {
        const { email, password } = req.body;
        User.login(email, password, (err, result) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi đăng nhập", error: err });
            }
            console.log("Kết quả từ User.login:", result);
            if (!result) {
                return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
            }
    
            req.session.userId = result.customer_id;
            res.json({ message: "Đăng nhập thành công", userId: result.id });
        });
    }
    logout(req, res, next){
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        });
    }

    async register(req, res, next) {
        const { name, email, password, code } = req.body;
        const customer_img = 'default-avatar.png';
        const otpStore = global.otpStore;
        const storedOTP = otpStore?.get(email);

        if (!storedOTP || storedOTP.expiresAt < Date.now()) {
            return res.status(400).json({ message: "OTP expired or not found" });
        }

        if (storedOTP.code.toString() !== code) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        // Xóa OTP sau khi sử dụng
        otpStore.delete(email);
        User.findEmail(email, (err, existingUser) => {
            if (err) {
                return res.status(500).json({ message: "Lỗi kiểm tra email", error: err });
            }
            
            if (existingUser !== null) {  
                return res.status(409).json({ message: "Email đã tồn tại, vui lòng chọn email khác" });
            }            
    
            User.register(name, email, password, customer_img, (err, result) => {
                if (err) {
                    return res.status(500).json({ message: "Lỗi đăng ký", error: err });
                }
                
                if (!result) {
                    return res.status(500).json({ message: "Không thể đăng ký, vui lòng thử lại" });
                }
                res.json({ message: "Đăng ký thành công", userId: result.customer_id });
            });
        });
    }
    
}

module.exports = new UserController;