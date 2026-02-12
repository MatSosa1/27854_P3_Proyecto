const jwt = require('jsonwebtoken');

// Middleware para verificar el token JWT
const authMiddleware = (req, res, next) => {
    try {
        // Obtener el token del header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado o formato inválido',
            });
        }

        // Extraer el token (eliminar "Bearer " del inicio)
        const token = authHeader.substring(7);

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'hospital_secret_key_2025');

        // Guardar la información del usuario en la request
        req.userId = decoded.userId;
        req.userEmail = decoded.email;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado',
            });
        }

        res.status(401).json({
            success: false,
            message: 'Token inválido',
            error: error.message,
        });
    }
};

// Middleware para verificar rol
const roleMiddleware = (allowedRoles) => {
    return async (req, res, next) => {
        try {
            const User = require('../models/User');
            const user = await User.findById(req.userId);

            if (!user || !allowedRoles.includes(user.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'No tiene permiso para acceder a este recurso',
                });
            }

            req.userRole = user.role;
            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al verificar permisos',
                error: error.message,
            });
        }
    };
};

module.exports = { authMiddleware, roleMiddleware };
