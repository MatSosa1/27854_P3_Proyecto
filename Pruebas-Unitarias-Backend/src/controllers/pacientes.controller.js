// CRUD DE PACIENTES
const Paciente = require('../models/Paciente');

// GET
async function getAllPatients(req, res) {
    try {
        const pacientes = await Paciente.find();
        res.json(pacientes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error: error.message });
    }
}

// POST
async function addnewPatient(req, res) {
    const { name, lastName, email, gender, illness } = req.body;

    // Validación básica de entrada
    if (!name || !lastName || !email || !gender || !illness) {
        return res.status(400).json({ message: 'Name, Last Name, Email, Gender and Illness are required' });
    }

    try {
        // Creamos un objeto paciente
        const newPatient = new Paciente({
            name,
            lastName,
            email,
            gender,
            illness,
        });

        // Lo guardamos en la base de datos
        await newPatient.save();

        // Respondemos con el paciente creado
        res.status(201).json(newPatient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating patient', error: error.message });
    }
}

// PUT
async function updatePatient(req, res) {
    const { id } = req.params;
    const { name, lastName, email, gender, illness } = req.body;

    try {
        const paciente = await Paciente.findById(id);
        if (!paciente) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        // Update all values
        if (name) paciente.name = name;
        if (lastName) paciente.lastName = lastName;
        if (email) paciente.email = email;
        if (gender) paciente.gender = gender;
        if (illness) paciente.illness = illness;

        await paciente.save();
        res.json(paciente);
    } catch (error) {
        res.status(500).json({ message: 'Error updating patient', error: error.message });
    }
}

// DELETE
async function deletePatient(req, res) {
    const { id } = req.params;

    try {
        const paciente = await Paciente.findByIdAndDelete(id);
        if (!paciente) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.json(paciente);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting patient', error: error.message });
    }
}

module.exports = { getAllPatients, addnewPatient, updatePatient, deletePatient };
