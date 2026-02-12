const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Genera un token JWT
const generateToken = (userId, email) => {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET || 'hospital_secret_key_2025',
        { expiresIn: '24h' }
    );
};

// Controlador para registrar un nuevo usuario
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, role } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporcione email, contraseña, nombre y apellido',
            });
        }

        // Validar que la contraseña tenga al menos 6 caracteres
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La contraseña debe tener al menos 6 caracteres',
            });
        }

        // Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'El email ya está registrado',
            });
        }

        // Crear nuevo usuario
        const newUser = new User({
            email,
            password,
            firstName,
            lastName,
            role: role || 'patient',
        });

        // Guardar el usuario
        await newUser.save();

        // Generar token
        const token = generateToken(newUser._id, newUser.email);

        res.status(201).json({
            success: true,
            message: 'Usuario registrado exitosamente',
            token,
            user: newUser.toJSON(),
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar el usuario',
            error: error.message,
        });
    }
};

// Controlador para iniciar sesión
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validar que se proporcionen email y contraseña
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporcione email y contraseña',
            });
        }

        // Buscar el usuario por email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }

        // Verificar si el usuario está activo
        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: 'El usuario ha sido desactivado',
            });
        }

        // Comparar contraseñas
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas',
            });
        }

        // Generar token
        const token = generateToken(user._id, user.email);

        res.json({
            success: true,
            message: 'Sesión iniciada exitosamente',
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message,
        });
    }
};

// Controlador para obtener el perfil del usuario autenticado
exports.getProfile = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        res.json({
            success: true,
            user: user.toJSON(),
        });
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener el perfil',
            error: error.message,
        });
    }
};

// Controlador para actualizar el perfil del usuario
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { firstName, lastName } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        res.json({
            success: true,
            message: 'Perfil actualizado exitosamente',
            user: user.toJSON(),
        });
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar el perfil',
            error: error.message,
        });
    }
};

// Controlador para cambiar contraseña
exports.changePassword = async (req, res) => {
    try {
        const userId = req.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: 'Por favor proporcione la contraseña actual y la nueva',
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'La nueva contraseña debe tener al menos 6 caracteres',
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado',
            });
        }

        // Verificar que la contraseña actual es correcta
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'La contraseña actual es incorrecta',
            });
        }

        // Actualizar contraseña
        user.password = newPassword;
        await user.save();

        res.json({
            success: true,
            message: 'Contraseña actualizada exitosamente',
        });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({
            success: false,
            message: 'Error al cambiar la contraseña',
            error: error.message,
        });
    }
};
