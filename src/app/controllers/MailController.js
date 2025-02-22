const nodemailer = require("nodemailer");

// Lưu OTP tạm thời trong bộ nhớ server
if (!global.otpStore) {
    global.otpStore = new Map();
}
// Hàm tạo mã OTP ngẫu nhiên
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000); // 6 chữ số
}

class MailController {
    // Gửi mã OTP
    async sendCodeAth(req, res, next) {
        const { email , user} = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const verificationCode = generateOTP();
        
        // Lưu OTP vào bộ nhớ tạm, hết hạn sau 3 phút
        global.otpStore.set(email, {
            code: verificationCode,
            expiresAt: Date.now() + 3 * 60 * 1000 
        });

        try {
            // Cấu hình gửi email
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "congdoan0806@gmail.com",
                    pass: "mjtr obtf igwy eqtn", // Nếu lỗi, kiểm tra App Password
                },
            });

            // Gửi email
            await transporter.sendMail({
                from: "congdoan0806@gmail.com",
                to: email,
                subject: "Your Verification Code",
                text: `Dear ${user},

Thank you for signing up. Your verification code is: ${verificationCode}

Please enter this code to verify your email address.

If you did not request this, please ignore this email.

Best regards,  
HandMade Haven`,
                html: `
                    <p>Dear ${user},</p>
                    <p>Thank you for signing up. Your verification code is:</p>
                    <h2 style="color: #007bff;">${verificationCode}</h2>
                    <p>Please enter this code to verify your email address.</p>
                    <p>If you did not request this, please ignore this email.</p>
                    <p>Best regards,<br> 
                    <strong>HandMade Haven</strong></p>
                `,
            });

            console.log("OTP Sent:", verificationCode);
            return res.json({ message: "OTP sent successfully!" });

        } catch (err) {
            console.error("Error sending email:", err);
            return res.status(500).json({ message: "Error sending email", error: err });
        }
    }
}
module.exports = new MailController(); 