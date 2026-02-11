// CRUD DE MEDICAMENTOS
const Medicamento = require('../models/Medicamento');

// GET
async function getAllMedicamentos(req, res) {
    try {
        const medicamentos = await Medicamento.find();
        res.json(medicamentos);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching medications', error: error.message });
    }
}

// POST
async function addNewMedicamento(req, res) {
    const { name, description, price, quantity, category, laboratory } = req.body;

    // Validación básica de entrada
    if (!name || !description || !price || !quantity || !category || !laboratory) {
        return res.status(400).json({ message: 'Name, Description, Price, Quantity, Category and Laboratory are required' });
    }

    try {
        // Creamos un objeto medicamento
        const newMedicamento = new Medicamento({
            name,
            description,
            price,
            quantity,
            category,
            laboratory
        });

        // Lo guardamos en la base de datos
        await newMedicamento.save();

        // Respondemos con el medicamento creado
        res.status(201).json(newMedicamento);
    } catch (error) {
        res.status(500).json({ message: 'Error creating medication', error: error.message });
    }
}

// PUT
async function updateMedicamento(req, res) {
    const { id } = req.params;
    const { name, description, price, quantity, category, laboratory } = req.body;

    try {
        const medicamento = await Medicamento.findById(id);
        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento not found' });
        }

        // Update all values
        if (name) medicamento.name = name;
        if (description) medicamento.description = description;
        if (price) medicamento.price = price;
        if (quantity) medicamento.quantity = quantity;
        if (category) medicamento.category = category;
        if (laboratory) medicamento.laboratory = laboratory;

        await medicamento.save();
        res.json(medicamento);
    } catch (error) {
        res.status(500).json({ message: 'Error updating medication', error: error.message });
    }
}

// DELETE
async function deleteMedicamento(req, res) {
    const { id } = req.params;

    try {
        const medicamento = await Medicamento.findByIdAndDelete(id);
        if (!medicamento) {
            return res.status(404).json({ message: 'Medicamento not found' });
        }

        res.json(medicamento);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting medication', error: error.message });
    }
}

module.exports = { getAllMedicamentos, addNewMedicamento, updateMedicamento, deleteMedicamento };
