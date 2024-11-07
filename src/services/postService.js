import prisma from '../config/prismaClient.js';
import publisher  from '../config/rabbit/publisher.js';
import Response from '../utils/Response.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Post from '../models/Post.js';
import userActivityService from './userActivityService.js';
import redis from '../config/redis.js';
import ActivityType from '../enums/ActivityType.js';

const createPost = async ({ title, content, slug, published = true, authorId, categoryIds, tagIds }) => {
    try {
        // Validasi input
        if (!title || !content || title.length < 10) {
            return new ErrorResponse("400", "Title and content are required, and title must be at least 10 characters.");
        }

        // Validasi `author_id`
        if (!authorId) {
            throw new Error("Author ID is required.");
        }

        // Ubah title menjadi lowercase untuk pengecekan

        // Check if a post with this title already exists (case-insensitive)
        const normalizedTitle = title.trim().toLowerCase();
        const existingTitle = await prisma.posts.findFirst({
            where: {
                title: {
                    equals: normalizedTitle,
                    mode: 'insensitive',
                }
            }
        });
        if (existingTitle) {
            return new ErrorResponse("400", "Title already exists.");
        }

        // Buat slug jika tidak ada
        if (!slug) {
            slug = normalizedTitle
                .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter yang tidak diinginkan
                .trim()
                .replace(/\s+/g, '-') // Ganti spasi dengan "-"
                .substring(0, 50); // Batasi panjang slug
        }

        // Cek apakah slug sudah ada
        const existingSlug = await prisma.posts.findUnique({ where: { slug } });
        if (existingSlug) {
            return new ErrorResponse("400", "Slug already exists.");
        }

        const newPost = await prisma.posts.create({
            data: {
                title,
                content,
                slug,
                published,
                author_id: authorId,
                post_categories: {
                    create: categoryIds.map(categoryId => ({
                        category_id: categoryId // Referensi langsung ke `category_id`
                    }))
                },
                post_tags: {
                    create: tagIds.map(tagId => ({
                        tag_id: tagId // Referensi langsung ke `tag_id`
                    }))
                }
            }
        });

        if (published == true) {
            await publisher.publishArticleNotification(newPost);
        }

        return new Response("201", "Post created successfully", newPost);
    } catch (error) {
        return new ErrorResponse("500", error.message);
    }
};

const getAllPosts = async ({ page = 1, pageSize = 10, query = '' }) => {
    try {
        const skip = (page - 1) * pageSize;

        // Mengatur filter pencarian
        const where = query
            ? {
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                ]
            }
            : {};

        // Ambil data posts dengan relasi author, categories, dan tags
        const posts = await prisma.posts.findMany({
            where,
            skip,
            take: pageSize,
            include: {
                user: { select: { id: true, username: true } },
                post_categories: { select: { categories: { select: { id: true, name: true } } } },
                post_tags: { select: { tags: { select: { id: true, name: true } } } }
            },
        });

        // Hitung total posts
        const totalPosts = await prisma.posts.count({ where });
        const totalPages = Math.ceil(totalPosts / pageSize);

        // Konversi hasil query menjadi instance Post
        const postModels = posts.map(post => {
            const categories = post.post_categories.map(pc => pc.categories);
            const tags = post.post_tags.map(pt => pt.tags);

            return new Post(
                post.id,
                post.title,
                post.content,
                post.created_at,
                post.updated_at,
                post.slug,
                post.published,
                post.user,
                categories,
                tags
            );
        });

        return new Response("200", "Posts retrieved successfully", {
            posts: postModels,
            pagination: {
                totalPosts,
                totalPages,
                currentPage: page,
                pageSize
            }
        });
    } catch (error) {
        return new ErrorResponse("500", error.message);
    }
};

const getPostById = async (postId, req) => {
    try {
        // Misalnya, untuk menyimpan aktivitas ke MongoDB
        const username = req.user.username;
        await userActivityService.createUserActivity(username, postId, ActivityType.VIEW);

        // Cek apakah post sudah ada di cache Redis
        const cachedPost = await redis.get(`post:${postId}`);
        if (cachedPost) {
            return new Response("200", "Post retrieved from cache successfully", JSON.parse(cachedPost));
        }

        // Cek apakah post dengan ID UUID tersebut ada
        const post = await prisma.posts.findUnique({
            where: { id: postId },
            include: {
                user: { select: { id: true, username: true } },
                post_categories: { select: { categories: { select: { id: true, name: true } } } },
                post_tags: { select: { tags: { select: { id: true, name: true } } } }
            },
        });

        if (!post) {
            return new ErrorResponse("404", "Post not found.");
        }

        // Formatkan data untuk response
        const categories = post.post_categories.map(pc => pc.categories);
        const tags = post.post_tags.map(pt => pt.tags);

        const postModel = new Post(
            post.id,
            post.title,
            post.content,
            post.created_at,
            post.updated_at,
            post.slug,
            post.published,
            post.user,
            categories,
            tags
        );

        // Simpan post ke cache Redis
        await redis.set(`post:${postId}`, JSON.stringify(postModel), 'EX', 3600); // Cache selama 1 jam

        return new Response("200", "Post retrieved successfully", postModel);
    } catch (error) {
        console.log("Error:", error);
        return new ErrorResponse("500", error.message);
    }
};

const updatePost = async ({ postId, title, content, slug, published, authorId, categoryIds, tagIds }) => {
    try {
        // Check if the post exists
        const existingPost = await prisma.posts.findUnique({ where: { id: postId } });
        if (!existingPost) {
            return new ErrorResponse("404", "Post not found.");
        }

        // Check if a post with this title already exists (case-insensitive)
        const normalizedTitle = title.trim().toLowerCase();
        const existingTitle = await prisma.posts.findFirst({
            where: {
                title: {
                    equals: normalizedTitle,
                    mode: 'insensitive',
                }
            }
        });
        if (existingTitle) {
            return new ErrorResponse("400", "Title already exists.");
        }

        // Buat slug jika tidak ada
        if (!slug) {
            slug = normalizedTitle
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, '') // Hapus karakter yang tidak diinginkan
                .trim()
                .replace(/\s+/g, '-') // Ganti spasi dengan "-"
                .substring(0, 50); // Batasi panjang slug
        }

        // Cek apakah slug sudah ada
        const existingSlug = await prisma.posts.findUnique({ where: { slug } });
        if (existingSlug) {
            return new ErrorResponse("400", "Slug already exists.");
        }

        // Update fields only if provided
        const updatedData = {
            title: title || existingPost.title,
            content: content || existingPost.content,
            slug: slug || existingPost.slug,
            published: published !== undefined ? published : existingPost.published,
            author_id: authorId || existingPost.author_id,
        };

        // Start the update transaction
        const updatedPost = await prisma.posts.update({
            where: { id: postId },
            data: {
                ...updatedData,
                post_categories: {
                    deleteMany: {}, // Clear existing categories
                    create: categoryIds?.map(categoryId => ({ category_id: categoryId })) || [],
                },
                post_tags: {
                    deleteMany: {}, // Clear existing tags
                    create: tagIds?.map(tagId => ({ tag_id: tagId })) || [],
                },
            },
            include: {
                user: { select: { id: true, username: true } },
                post_categories: { select: { categories: { select: { id: true, name: true } } } },
                post_tags: { select: { tags: { select: { id: true, name: true } } } },
            },
        });

        // Format the response data as a `Post` model
        const categories = updatedPost.post_categories.map(pc => pc.categories);
        const tags = updatedPost.post_tags.map(pt => pt.tags);
        const postModel = new Post(
            updatedPost.id,
            updatedPost.title,
            updatedPost.content,
            updatedPost.created_at,
            updatedPost.updated_at,
            updatedPost.slug,
            updatedPost.published,
            updatedPost.user,
            categories,
            tags
        );

        return new Response("200", "Post updated successfully", postModel);
    } catch (error) {
        console.log("Error:", error)
        return new ErrorResponse("500", error.message);
    }
};

const deletePost = async (postId) => {
    try {
        // Cek apakah post dengan ID tersebut ada
        const existingPost = await prisma.posts.findUnique({ where: { id: postId } });
        if (!existingPost) {
            return new ErrorResponse("404", "Post not found.");
        }

        // Hapus post beserta relasinya (categories dan tags)
        await prisma.posts.delete({
            where: { id: postId },
        });

        return new Response("200", "Post deleted successfully");
    } catch (error) {
        console.log("Error:", error);
        return new ErrorResponse("500", error.message);
    }
};

export default {
    createPost,
    getAllPosts,
    updatePost,
    deletePost,
    getPostById
};
