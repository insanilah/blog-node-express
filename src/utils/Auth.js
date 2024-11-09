import bcrypt from 'bcryptjs';

// Fungsi untuk meng-hash password
const hashedPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword::",hashedPassword);
    return hashedPassword;
}

// Fungsi untuk menghasilkan password acak yang kuat
const generatePassword = () => {
    const length = 12;
    
    // Tentukan karakter per kategori
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
    const allChars = lower + upper + numbers + symbols;
    
    // Pastikan setidaknya ada satu karakter dari setiap kategori
    let password = [
        lower.charAt(Math.floor(Math.random() * lower.length)),
        upper.charAt(Math.floor(Math.random() * upper.length)),
        numbers.charAt(Math.floor(Math.random() * numbers.length)),
        symbols.charAt(Math.floor(Math.random() * symbols.length))
    ];

    // Isi sisa password dengan karakter acak dari allChars
    for (let i = password.length; i < length; i++) {
        password.push(allChars.charAt(Math.floor(Math.random() * allChars.length)));
    }

    // Acak urutan karakter agar tidak selalu berurutan
    password = password.sort(() => Math.random() - 0.5).join('');

    return password;
}

const isValidPassword = (password) => {
    const minLength = 12;
    
    // Ekspresi reguler untuk tiap kriteria
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/.test(password);
    
    // Periksa apakah password memenuhi semua kriteria
    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumber &&
        hasSpecialChar
    );
}

export default {
    hashedPassword,
    generatePassword,
    isValidPassword
};
