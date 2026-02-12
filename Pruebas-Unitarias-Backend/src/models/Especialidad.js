const mongoose = require('mongoose');

// Define el esquema de especialidad
const especialidadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Exporta el modelo Especialidad
module.exports = mongoose.model('Especialidad', especialidadSchema);
