const mongoose = require('mongoose');

// Define el esquema del paciente
const pacienteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Masculino', 'Femenino', 'Otro'],
        trim: true
    },
    illness: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Exporta el modelo Paciente
module.exports = mongoose.model('Paciente', pacienteSchema);
