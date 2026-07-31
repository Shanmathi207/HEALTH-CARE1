const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const storageFile = path.join(__dirname, '..', 'data', 'users.json');
const storageDir = path.dirname(storageFile);

if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
}

function loadUsers() {
    if (!fs.existsSync(storageFile)) {
        fs.writeFileSync(storageFile, '[]', 'utf8');
        return [];
    }

    try {
        const data = fs.readFileSync(storageFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function saveUsers(users) {
    fs.writeFileSync(storageFile, JSON.stringify(users, null, 2), 'utf8');
}

class User {
    constructor(data = {}) {
        Object.assign(this, data);
        this.createdAt = this.createdAt || new Date().toISOString();
        this._id = this._id || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    async save() {
        const users = loadUsers();

        if (!this.email) {
            throw new Error('Email is required');
        }

        if (!this.password) {
            throw new Error('Password is required');
        }

        const existingIndex = users.findIndex(user => user.email === this.email && user._id !== this._id);
        if (existingIndex >= 0) {
            throw new Error('User with this email already exists');
        }

        if (!this.password.startsWith('$2')) {
            this.password = await bcrypt.hash(this.password, 10);
        }

        const index = users.findIndex(user => user._id === this._id);
        if (index >= 0) {
            users[index] = { ...users[index], ...this };
        } else {
            users.push({ ...this });
        }

        saveUsers(users);
        return this;
    }

    async comparePassword(candidatePassword) {
        return bcrypt.compare(candidatePassword, this.password);
    }

    static async findOne(query = {}) {
        const users = loadUsers();
        const match = users.find(user => {
            return Object.entries(query).every(([key, value]) => user[key] === value);
        });

        return match ? new User(match) : null;
    }

    static async deleteMany() {
        saveUsers([]);
    }
}

module.exports = User;
