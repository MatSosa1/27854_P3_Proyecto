# ProyectoP2_PruebasDeSoftware

[![CI Workflow](https://github.com/cmbonifaz/proyectoejm/actions/workflows/ci.yml/badge.svg)](https://github.com/cmbonifaz/proyectoejm/actions/workflows/ci.yml)

## Hospital Management API

API REST para gestión hospitalaria con pruebas unitarias, de integración, carga y estrés.

### 🚀 Características

- ✅ **CRUD completo** para Pacientes, Doctores, Medicamentos y Especialidades
- ✅ **Pruebas Unitarias** con Jest (>95% cobertura)
- ✅ **Pruebas de Carga** con k6
- ✅ **Pruebas de Estrés** con JMeter
- ✅ **CI/CD** con GitHub Actions
- ✅ **Linting** con ESLint

### 📋 Requisitos

- Node.js 20+
- MongoDB 7.0+
- npm

### 🔧 Instalación

```bash
npm install
cp .env.example .env
```

### 🏃 Ejecución

```bash
# Desarrollo
npm start

# Tests
npm test

# Cobertura
npm run test:coverage

# Linting
npm run lint
```

### 🧪 Tests

- **Unitarios**: `npm test` (52 tests)
- **Cobertura**: Mínimo 95% requerido
- **Carga (k6)**: `k6 run carga-rendimiento.js`
- **Estrés (JMeter)**: Ver carpeta `JMeter/`