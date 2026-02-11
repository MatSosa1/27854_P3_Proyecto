// CRUD DE ESPECIALIDADES
const Especialidad = require('../models/Especialidad');

// GET listar
async function getAllSpecialties(req, res) {
    try {
        const especialidades = await Especialidad.find();
        res.json(especialidades);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching specialties', error: error.message });
    }
}


// POST agregar
async function addnewSpecialty(req, res) {
    const { name } = req.body;

    // Validación de entrada
    if (!name) {
        return res.status(400).json({ message: 'Specialty name is required' });
    }

    try {
        // Validación especialidad duplicada
        const existingSpecialty = await Especialidad.findOne({ 
            name: { $regex: new RegExp(`^${name}$`, 'i') } 
        });
        
        if (existingSpecialty) {
            return res.status(409).json({ message: 'Specialty already exists' });
        }

        // objeto especialidad
        const newSpecialty = new Especialidad({ name });

        // guardamos en la base de datos
        await newSpecialty.save();

        // respondemos con especialidad creada
        res.status(201).json(newSpecialty);
    } catch (error) {
        res.status(500).json({ message: 'Error creating specialty', error: error.message });
    }
}

// PUT actualizar
async function updateSpecialty(req, res) {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Name is required to update Specialty' });
    }

    try {
        const specialty = await Especialidad.findById(id);
        if (!specialty) {
            return res.status(404).json({ message: 'Specialty not found' });
        }

        specialty.name = name;
        await specialty.save();
        res.json(specialty);
    } catch (error) {
        res.status(500).json({ message: 'Error updating specialty', error: error.message });
    }
}

// DELETE eliminar
async function deleteSpecialty(req, res) {
    const { id } = req.params;

    try {
        const specialty = await Especialidad.findByIdAndDelete(id);
        if (!specialty) {
            return res.status(404).json({ message: 'Specialty not found' });
        }

        res.json(specialty);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting specialty', error: error.message });
    }
}

module.exports = { getAllSpecialties, addnewSpecialty, updateSpecialty, deleteSpecialty };
