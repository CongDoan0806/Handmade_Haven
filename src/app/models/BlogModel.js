const db = require('../../config/db');

exports.getAllBlogs = (callback) => {
    const query = `SELECT ps.post_id, ps.post_title, ps.post_content, ps.post_img, ps.published_at, c.category_name, cus.name, cus.customer_sub
                    FROM posts AS ps
                    JOIN Categories AS c ON ps.category_id = c.category_id
                    JOIN Customers AS cus ON ps.author_id = cus.customer_id;`
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
};

exports.getFourBlogs = (callback) => {
    const query = `SELECT ps.post_id, ps.post_title, ps.post_content, ps.post_img, c.category_name
                    FROM posts AS ps
                    JOIN Categories AS c ON ps.category_id = c.category_id
                    ORDER BY ps.post_id DESC
                    LIMIT 6;`;
    db.query(query, (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
}

exports.getBlogById = (postId, callback) => {
    const query = `SELECT ps.post_id, ps.post_title, ps.post_content, ps.post_img, c.category_name
                    FROM posts AS ps
                    JOIN Categories AS c ON ps.category_id = c.category_id
                    WHERE ps.post_id = ?`;
    db.query(query, [postId], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    })
}

exports.addComment = (postId, customerId, comment, callback) => {
    const query = `INSERT INTO comments (post_id, customer_id, content) VALUES (?,?,?)`;
    db.query(query, [postId, customerId, comment], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    });
};

exports.getCommentById = (postId, callback) => {
  const query = `SELECT cm.comment_id, cu.name, cu.customer_img, cm.content, cm.created_at
                FROM comments AS cm
                JOIN customers AS cu ON cu.customer_id = cm.customer_id
                WHERE post_id = ?
                ORDER BY cm.created_at DESC;`
  db.query(query, [postId], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  })
};

exports.getNewCommentById = (comment_id, callback) => {
  const query = `SELECT cm.comment_id, cu.name, cu.customer_img, cm.content, cm.created_at
                FROM comments AS cm
                JOIN customers AS cu ON cu.customer_id = cm.customer_id
                WHERE comment_id = ?;`
  db.query(query, [comment_id], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  })
};

exports.deteteComment = (comment_id, userId, callback) => {
  const query = `DELETE FROM comments WHERE comment_id =? AND customer_id =?;`;
  db.query(query, [comment_id, userId], (err, result) => {
    if (err) return callback(err, null);
    callback(null, result);
  })
}
