/**
 * Utilidades para manejar autenticación con JWT
 */

const API_URL = 'http://localhost:3000/api';

// Obtener token del localStorage
export const getToken = () => {
    return localStorage.getItem('token');
};

// Obtener usuario del localStorage
export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Guardar token y usuario
export const saveAuth = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

// Limpiar autenticación
export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// Verificar si el usuario está autenticado
export const isAuthenticated = () => {
    return !!getToken();
};

// Realizar una petición con autenticación
export const authenticatedFetch = async (endpoint, options = {}) => {
    const token = getToken();

    if (!token) {
        throw new Error('No authentication token found');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    // Si el token ha expirado (401), limpiar autenticación y redirigir a login
    if (response.status === 401) {
        clearAuth();
        window.location.href = '/login.html';
        throw new Error('Authentication failed');
    }

    return response;
};

// Login
export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
    }

    saveAuth(data.token, data.user);
    return data;
};

// Register
export const register = async (email, password, firstName, lastName, role = 'patient') => {
    const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, firstName, lastName, role }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
        throw new Error(data.message || 'Registration failed');
    }

    saveAuth(data.token, data.user);
    return data;
};

// Get profile
export const getProfile = async () => {
    const response = await authenticatedFetch('/auth/profile');
    return response.json();
};

// Update profile
export const updateProfile = async (firstName, lastName) => {
    const response = await authenticatedFetch('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName }),
    });
    return response.json();
};

// Change password
export const changePassword = async (currentPassword, newPassword) => {
    const response = await authenticatedFetch('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
    });
    return response.json();
};

// Logout
export const logout = () => {
    clearAuth();
    window.location.href = '/login.html';
};
