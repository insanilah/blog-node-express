import postService from '../services/postService.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Response from '../utils/Response.js';
import axios from 'axios';

const createPost = async (req, res) => {
    const { title, content, slug, published, authorId, categoryIds, tagIds } = req.body;
    const response = await postService.createPost({ title, content, slug, published, authorId, categoryIds, tagIds });

    if (response instanceof ErrorResponse) {
        return res.status(parseInt(response.code)).json(response);
    }

    const resp = new Response("201", "Post created successfully", response);
    return res.status(201).json(resp);
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

    const resp = new Response("200", "Posts retrieved successfully", response);
    return res.status(200).json(resp);
};

const getPostById = async (req, res) => {
    const { postId } = req.params;

    // Memanggil service untuk mendapatkan detail post
    const result = await postService.getPostById(postId, req);

    if (result instanceof ErrorResponse) {
        return res.status(result.status).json({ error: result.message });
    }

    const resp = new Response("200", "Post retrieved successfully", result);
    return res.status(200).json(resp);
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

    const resp = new Response("200", "Post updated successfully", response);
    return res.status(200).json(resp);
};

const deletePost = async (req, res) => {
    const { postId } = req.params;

    const result = await postService.deletePost(postId);

    if (result instanceof ErrorResponse) {
        return res.status(result.code).json(result);
    }

    const resp = new Response("200", "Post deleted successfully");
    return res.status(200).json(resp);
};

const fetchPosts = async (req, res) => {
    try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        console.log(response.data);  // Output data yang didapat dari API

        const resp = new Response("200", "Get post external API successfully", response.data);
        return res.status(200).json(resp);
    } catch (error) {
        console.error('Error fetching posts:', error);
        return res.status(500).json("internal server error");
    }
};

export default {
    createPost,
    getAllPosts,
    updatePost,
    deletePost,
    getPostById,
    fetchPosts
};
