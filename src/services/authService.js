import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prismaClient.js';
import publisher  from '../config/rabbit/publisher.js';
import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Response from '../utils/Response.js';

const registerUser = async (email, password, username, name) => {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Mencari role dengan nama 'member'
        const role = await prisma.roles.findUnique({
            where: { role_name: 'member' },
        });

        // Jika role tidak ditemukan, kembalikan respons kesalahan
        if (!role) {
            return new ErrorResponse("400", 'Role "member" not found');
        }

        // Membuat pengguna baru dan mengaitkan dengan role
        const user = await prisma.users.create({
            data: {
                email,
                password: hashedPassword,
                username,
                name,
                roles: { connect: { id: role.id } }, // Mengaitkan dengan role menggunakan ID
            },
            include: { roles: true } // Menyertakan data role dalam respons
        });

        // Buat instance Role dan User
        const userModel = new User(
            user.id,
            user.created_at,
            user.email,
            user.updated_at,
            user.username,
            user.name,
            role // Anda bisa menyesuaikan ini sesuai kebutuhan
        );

        await publisher.publishUserRegistration(userModel);
        
        return new Response("200", "User registered successfully", userModel);
    } catch (error) {
        return new ErrorResponse("500", error.message);
    }
};

const loginUser = async (email, password) => {
    try {
        if (!email) {
            throw new ErrorResponse('400', 'Email is required');
        }

        const user = await prisma.users.findUnique({ where: { email } });
        if (!user || !bcrypt.compare(password, user.password)) {
            throw new ErrorResponse('400', 'Invalid credentials');
        }

        const token = jwt.sign({ userId: user.id, username: user.username, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const accessToken = { accessToken: token };
        return new Response("200", "Success", accessToken);

    } catch (error) {
        return new ErrorResponse("500", error.message);
    }
};


export default {
    registerUser,
    loginUser
};