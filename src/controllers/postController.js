import postService from '../services/postService.js';
import ErrorResponse from '../utils/ErrorResponse.js';

const createPost = async (req, res) => {
    const { title, content, slug, published, authorId, categoryIds, tagIds } = req.body;
    const response = await postService.createPost({ title, content, slug, published, authorId, categoryIds, tagIds });

    if (response instanceof ErrorResponse) {
        return res.status(parseInt(response.code)).json(response);
    }

    return res.status(201).json(response);
};

const getAllPosts = async (req, res) => {
    // Ambil parameter page, pageSize, dan query dari query string
    const { page = 1, pageSize = 10, query = '' } = req.query;

    // Panggil service getAllPosts dengan parameter dari query string
    const response = await postService.getAllPosts({
        page: parseInt(page, 10),
        pageSize: parseInt(pageSize, 10),
        query
    });

    if (response instanceof ErrorResponse) {
        return res.status(parseInt(response.code)).json(response);
    }

    return res.status(200).json(response);
};

const getPostById = async (req, res) => {
    const { postId } = req.params;

    // Memanggil service untuk mendapatkan detail post
    const result = await postService.getPostById(postId, req);

    if (result instanceof ErrorResponse) {
        return res.status(result.status).json({ error: result.message });
    }

    return res.status(200).json(result);
};

const updatePost = async (req, res) => {
    const { postId } = req.params;
    const { title, content, slug, published, authorId, categoryIds, tagIds } = req.body;

    const response = await postService.updatePost({
        postId,
        title,
        content,
        slug,
        published,
        authorId,
        categoryIds,
        tagIds,
    });

    if (response instanceof ErrorResponse) {
        return res.status(parseInt(response.code)).json(response);
    }

    return res.status(200).json(response);
};

const deletePost = async (req, res) => {
    const { postId } = req.params;

    const result = await postService.deletePost(postId);

    if (result instanceof ErrorResponse) {
        return res.status(result.code).json(result);
    }

    return res.status(200).json(result);
};

export default {
    createPost,
    getAllPosts,
    updatePost,
    deletePost,
    getPostById
};
