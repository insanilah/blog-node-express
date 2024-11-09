import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prismaClient.js';
import jwtConfig from '../config/jwt.js';
import publisher  from '../config/rabbit/publisher.js';
import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import Response from '../utils/Response.js';
import Auth from '../utils/Auth.js';

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
        
        return userModel;
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

        const generateToken = jwtConfig.generateToken(user);
        const accessToken = jwtConfig.createObjectToken(generateToken);
        return accessToken;

    } catch (error) {
        return new ErrorResponse("500", error.message);
    }
};

// Fungsi untuk mencari atau membuat pengguna di database menggunakan Prisma
const findOrCreateUser = async (profile, provider) => {
    const email = profile.emails ? profile.emails[0].value : null;

    if (!email) {
        throw new Error("Email tidak ditemukan dalam profil");
    }

    // Cari pengguna berdasarkan email
    let user = await prisma.users.findUnique({
        where: { email },
    });

    // Jika pengguna tidak ditemukan, buat pengguna baru
    if (!user) {
        const passwordGenerate = Auth.generatePassword();
        const password = await Auth.hashedPassword(passwordGenerate);
        
        // Mencari role dengan nama 'member'
        const role = await prisma.roles.findUnique({
            where: { role_name: 'member' },
        });
        
        if (!role) {
            console.log('Role "member" not found');
        }

        user = await prisma.users.create({
            data: {
                email,
                password,
                name: profile.name.givenName,
                password,
                roles: { connect: { id: role.id } }, // Mengaitkan dengan role menggunakan ID
            },
            include: { roles: true } // Menyertakan data role dalam respons
        });
    }

    return user;
};

export default {
    registerUser,
    loginUser,
    findOrCreateUser
};