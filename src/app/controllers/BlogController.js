const Blog = require('../models/BlogModel');
class BlogController {
    index(req, res, next) {
        Blog.getAllBlogs((err, blogs) => {
            if (err) {
              return res.status(500).send('Lỗi khi lấy dữ liệu blog.');
            }
            res.render('blog', { blogs });
        })
           
    }
    detail(req, res, next) {
        const blogId = req.params.id;
    
        Blog.getBlogById(blogId, (err, blogs) => {
            if (err) return res.status(500).send("Lỗi khi lấy bài viết.");
            if (!blogs) return res.status(404).send("Bài viết không tồn tại.");
            const blog = blogs[0];
            Blog.getCommentById(blogId, (err, comments) => {
                if (err) return res.status(500).send("Lỗi khi lấy bình luận.");
                res.render('blogDetail', { blog, comments, countComments: comments.length});
            });
        });
    }
    
    addComment(req, res, nex){
        let {  blogId, content } = req.body;
        const customerId = req.session.userId;
        if (!customerId) {
            return res.status(401).json({ message: "Bạn cần đăng nhập để thêm vào giỏ hàng." });
        }
        Blog.addComment(blogId, customerId, content , (err, result) => {
            if (err) {
                console.error("Lỗi SQL:", err);
                return res.status(500).json({ message: "Lỗi khi thêm binh luan", error: err });
            }

            const newCommentId = result.insertId;
            Blog.getNewCommentById(newCommentId, (err, comment) => {
                if (err) {
                    console.error("Loi SQL:", err);
                    return res.status(500).json({ message: "Loi khi lấy binh luan mới", error: err });
                }
                res.status(200).json({ message: "Lấy binh luan mới thành công", comment: comment[0] });
            })

        
        })
    }

    deleteComment(req, res, next){
        const { commentId } = req.body;
        const customer_id = req.session.userId;
        Blog.deleteComment(commentId, customer_id, (err, comment) => {
            if (err) {
                console.error("Loi SQL:", err);
                return res.status(500).json({ message: "Loi khi xóa binh luan", error: err });
            }
            res.status(200).json({ message: "Xóa binh luan thành công", commentId });
        })
    }
}

module.exports = new BlogController;