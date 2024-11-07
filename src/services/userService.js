import prisma from '../config/prismaClient.js';
import Response from '../utils/Response.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import User from '../models/User.js';

const getAllUsers = async (page, limit, searchTerm) => {
    try {
        const skip = (page - 1) * limit;

          // Mengatur filter pencarian
          const where = searchTerm
          ? {
              OR: [
                  { email: { contains: searchTerm, mode: 'insensitive' } },
                  { username: { contains: searchTerm, mode: 'insensitive' } },
                  { name: { contains: searchTerm, mode: 'insensitive' } }
              ]
          }
          : {};

        const users = await prisma.users.findMany({
            where,
            skip,
            take: limit,
            include: { roles: true }, // Sertakan data role jika dibutuhkan
        });

        const totalUsers = await prisma.users.count();
        const totalPages = Math.ceil(totalUsers / limit);

        const userModels = users.map(user =>
            new User(
                user.id,
                user.created_at,
                user.email,
                user.updated_at,
                user.username,
                user.name,
                user.roles
            )
        );

        return new Response("200", "Success", {
            currentPage: page,
            totalPages,
            totalUsers,
            users: userModels,
        });
    } catch (error) {
        return new ErrorResponse("500", error.message);
    }
};

const getUserById = async (id) => {
    try {
        const user = await prisma.users.findUnique({
            where: { id },
            include: { roles: true },
        });

        if (!user) {
            return new ErrorResponse("404", "User not found");
        }

        const userModel = new User(
            user.id,
            user.created_at,
            user.email,
            user.updated_at,
            user.username,
            user.name,
            user.roles
        );

        return new Response("200", "Success", userModel);
    } catch (error) {
        return new ErrorResponse("500", error.message);
    }
};

export default {
    getAllUsers,
    getUserById
};
