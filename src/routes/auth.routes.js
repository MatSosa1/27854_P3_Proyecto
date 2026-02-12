const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth.middleware');

// Rutas públicas (sin autenticación)

/**
 * POST /api/auth/register
 * Registrar un nuevo usuario
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * Iniciar sesión
 */
router.post('/login', authController.login);

// Rutas protegidas (requieren autenticación)

/**
 * GET /api/auth/profile
 * Obtener el perfil del usuario autenticado
 */
router.get('/profile', authMiddleware, authController.getProfile);

/**
 * PUT /api/auth/profile
 * Actualizar información del perfil
 */
router.put('/profile', authMiddleware, authController.updateProfile);

/**
 * POST /api/auth/change-password
 * Cambiar la contraseña del usuario
 */
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;
