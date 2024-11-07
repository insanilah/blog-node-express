// src/models/User.js
class User {
    constructor(id, created_at, email, updated_at, username, name, role) {
        this.id = id;
        this.created_at = created_at;
        this.email = email;
        this.updated_at = updated_at;
        this.username = username;
        this.name = name;
        this.role = role; // Ini akan menjadi instance dari Role
    }
}

export default User;

