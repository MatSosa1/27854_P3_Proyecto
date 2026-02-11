const mongoose = require('mongoose');

// Cerrar conexión de MongoDB después de todas las pruebas
afterAll(async () => {
    await mongoose.connection.close();
});
