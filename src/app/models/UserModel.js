const db = require('../../config/db');

exports.login = (email, password, callback) => {
    const query = 'SELECT * FROM customers WHERE email = ? AND password = ?';
    db.query(query, [email, password], (err, results) => {
        if (err) return callback(err, null);
        if (results.length === 0) return callback(null, null);
        callback(null, results[0]);
    });
}

exports.register = (name, email, password, customer_img, callback) => {
    const query = 'INSERT INTO customers (name, email, password, customer_img) VALUES (?,?,?,?)';
    db.query(query, [name, email, password, customer_img], (err, result) => {
        if (err) return callback(err, null);
        callback(null, result);
    });
}

exports.findEmail = (email, callback) => {
    const query = 'SELECT * FROM customers WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) return callback(err, null);
        callback(null, results.length > 0 ? results[0] : null); // Trả về null nếu không tìm thấy email
    });
};
