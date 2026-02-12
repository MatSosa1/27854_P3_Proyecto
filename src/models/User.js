const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define el esquema del usuario
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'patient', 'receptionist'],
        default: 'patient',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function () {
    // Solo hashear si la contraseña fue modificada
    if (!this.isModified('password')) {
        return;
    }

    try {
        this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
        throw error;
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (plainPassword) {
    try {
        return await bcrypt.compare(plainPassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Método para obtener el usuario sin la contraseña
userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

// Exporta el modelo User
module.exports = mongoose.model('User', userSchema);
