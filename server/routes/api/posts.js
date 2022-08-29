const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post.js');
const User = require('../../models/User.js');

//@route    DELETE api/posts/comment/:post_id/:comment_id
//@desc     Delete comment from a post
//@access   private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);

        // invalid post id
        if (!post) {
            return res
                .status(404)
                .json({ errors: [{ msg: 'Post Not found' }] });
        }

        const comment = post.comments.find(
            (comment) => comment.id === req.params.comment_id,
        );

        // invalid comment id
        if (!comment) {
            return res
                .status(404)
                .json({ errors: [{ msg: 'Comment does not exist' }] });
        }

        // check if user is authorized to delete comment
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
        }

        post.comments = post.comments.filter(
            ({ id }) => id !== req.params.comment_id,
        );

        await post.save();
        res.json(post.comments);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId')
            return res
                .status(404)
                .json({ errors: [{ msg: 'Post Not found' }] });
        return res.status(500).send('Internal Server Error');
    }
});

//@route    PUT api/posts/comment/:post_id
//@desc     Add comment to a post
//@access   private
router.put(
    '/comment/:post_id',
    auth,
    check('text', 'Text is required').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.post_id);

            if (!post) {
                return res
                    .status(404)
                    .json({ errors: [{ msg: 'Post Not found' }] });
            }

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            };
            post.comments.unshift(newComment);
            await post.save();
            res.json(post.comments);
        } catch (err) {
            console.error(err.message);
            if (err.kind === 'ObjectId')
                return res
                    .status(404)
                    .json({ errors: [{ msg: 'Post Not found' }] });
            return res.status(500).send('Internal Server Error');
        }
    },
);

//@route    DELETE api/posts/like/:post_id
//@desc     Unlike a post
//@access   private
router.delete('/like/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res
                .status(404)
                .json({ errors: [{ msg: 'Post Not found' }] });
        }

        // check if post is already liked by user
        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length <= 0
        ) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Post not liked by user' }] });
        }

        // remove like from post
        const newLikes = post.likes.filter(
            (like) => like.user.toString() !== req.user.id,
        );
        post.likes = newLikes;
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId')
            return res
                .status(404)
                .json({ errors: [{ msg: 'Post Not found' }] });
        return res.status(500).send('Internal Server Error');
    }
});

//@route    PUT api/posts/like/:post_id
//@desc     Like a post
//@access   private
router.put('/like/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res
                .status(404)
                .json({ errors: [{ msg: 'Post Not found' }] });
        }

        // check if post is already liked by user
        if (
            post.likes.filter((like) => like.user.toString() === req.user.id)
                .length > 0
        ) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'User already liked the post' }] });
        }

        // add like to post
        post.likes.unshift({ user: req.user.id });
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId')
            return res
                .status(404)
                .json({ errors: [{ msg: 'Post Not found' }] });
        return res.status(500).send('Internal Server Error');
    }
});

//@route    DELETE api/posts/:post_id
//@desc     Delete Post by id
//@access   private
router.delete('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res
                .status(404)
                .json({ errors: [{ msg: 'Post Not found' }] });
        }

        // if post is not written by current user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ errors: [{ msg: 'Unauthorized' }] });
        }

        post.remove();
        res.json({ msg: 'post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId')
            return res
                .status(404)
                .json({ errors: [{ msg: 'Post Not found' }] });
        return res.status(500).send('Internal Server Error');
    }
});

//@route    GET api/posts/:post_id
//@desc     Get post by id
//@access   private
router.get('/:post_id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.post_id);
        if (!post) {
            return res
                .status(404)
                .json({ errors: [{ msg: 'Post Not found' }] });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId')
            return res
                .status(404)
                .json({ errors: [{ msg: 'Post Not found' }] });
        return res.status(500).send('Internal Server Error');
    }
});

//@route    GET api/posts
//@desc     Get all posts
//@access   private
router.get('/', auth, async (_req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        return res.status(500).send('Internal Server Error');
    }
});

//@route    POST api/posts
//@desc     Create a post
//@access   private
router.post(
    '/',
    auth,
    check('text', 'Text is required').notEmpty(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const user = await User.findById(req.user.id).select('-password');
            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id,
            });
            const post = await newPost.save();
            res.json(post);
        } catch (err) {
            console.error(err.message);
            return res.status(500).send('Internal Server Error');
        }
    },
);

module.exports = router;
