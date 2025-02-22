const axios = require('axios');
const crypto = require('crypto');

class MomoController {
    async index(req, res) {
        try {
            // Nhận dữ liệu từ client
            const { amount, orderInfo } = req.body;
            if (!amount || isNaN(amount) || amount <= 0) {
                return res.status(400).json({ message: "Số tiền không hợp lệ" });
            }

            // Cấu hình thông tin MoMo (Thông tin test)
            const accessKey = 'F8BBA842ECF85';
            const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
            const partnerCode = 'MOMO';
            const redirectUrl = 'http://localhost:5000/momo/success';
            const ipnUrl = 'http://localhost:5000/momo/ipn';
            const requestType = "captureWallet";

            const orderId = partnerCode + new Date().getTime();
            const requestId = orderId;
            const extraData = '';

            // Tạo chữ ký HMAC SHA256
            const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=${requestType}`;
            const signature = crypto.createHmac('sha256', secretKey).update(rawSignature).digest('hex');

            // Gửi yêu cầu lên MoMo
            const requestBody = {
                partnerCode,
                partnerName: "Test",
                storeId: "MomoTestStore",
                requestId,
                amount,
                orderId,
                orderInfo,
                redirectUrl,
                ipnUrl,
                lang: 'vi',
                requestType,
                autoCapture: true,
                extraData,
                signature
            };

            const response = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', requestBody, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.data && response.data.payUrl) {
                return res.status(200).json({ payUrl: response.data.payUrl });
            } else {
                return res.status(400).json({ message: "Lỗi khi tạo thanh toán MoMo", error: response.data });
            }
        } catch (error) {
            console.error("Lỗi thanh toán MoMo:", error);
            return res.status(500).json({ message: "Lỗi server" });
        }
    }

    async ipn(req, res) {
        try {
            const data = req.body;
            console.log("MoMo IPN Response:", data);

            if (data && data.resultCode === 0) {
                console.log("Thanh toán thành công:", data);
                // TODO: Cập nhật trạng thái đơn hàng trong database
            } else {
                console.log("Thanh toán thất bại:", data);
            }

            return res.status(200).json({ message: "IPN received" });
        } catch (error) {
            console.error("Lỗi xử lý IPN:", error);
            return res.status(500).json({ message: "Lỗi server" });
        }
    }
}

module.exports = new MomoController();
