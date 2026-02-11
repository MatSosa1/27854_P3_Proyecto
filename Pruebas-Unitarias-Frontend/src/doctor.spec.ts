import { Doctor } from './doctor';

describe('Doctor - Pruebas Unitarias con Patrón AAA', () => {
    let doctor: Doctor;

    beforeEach(() => {
        // ARRANGE: Preparar doctor de prueba antes de cada test
        doctor = new Doctor(
            1,
            'Juan',
            'Pérez',
            'Cardiología',
            '0987654321',
            'juan.perez@hospital.com',
            'LIC-12345'
        );
    });

    describe('Creación de instancias', () => {
        it('Debe crear una instancia de Doctor correctamente', () => {
            // ARRANGE: Ya preparado en beforeEach
            
            // ACT: No hay acción específica
            
            // ASSERT: Verificar que el doctor existe
            expect(doctor).toBeTruthy();
        });

        it('Debe crear un doctor con valores por defecto', () => {
            // ARRANGE: No hay preparación previa
            
            // ACT: Crear doctor sin parámetros
            const emptyDoctor = new Doctor();
            
            // ASSERT: Verificar valores por defecto
            expect(emptyDoctor.id).toBe(0);
            expect(emptyDoctor.name).toBe('');
            expect(emptyDoctor.lastName).toBe('');
        });

        it('Debe asignar todas las propiedades correctamente', () => {
            // ARRANGE: Doctor ya creado en beforeEach
            
            // ACT: No hay acción
            
            // ASSERT: Verificar todas las propiedades
            expect(doctor.id).toBe(1);
            expect(doctor.name).toBe('Juan');
            expect(doctor.lastName).toBe('Pérez');
            expect(doctor.specialty).toBe('Cardiología');
            expect(doctor.phone).toBe('0987654321');
            expect(doctor.email).toBe('juan.perez@hospital.com');
            expect(doctor.licenseNumber).toBe('LIC-12345');
        });
    });

    describe('Métodos utilitarios', () => {
        it('Debe retornar el nombre completo correctamente', () => {
            // ARRANGE: Doctor ya preparado
            
            // ACT: Obtener nombre completo
            const fullName = doctor.getFullName();
            
            // ASSERT: Verificar formato nombre + apellido
            expect(fullName).toBe('Juan Pérez');
        });

        it('Debe retornar nombre completo con título "Dr."', () => {
            // ARRANGE: Doctor ya preparado
            
            // ACT: Obtener nombre con título
            const fullNameWithTitle = doctor.getFullNameWithTitle();
            
            // ASSERT: Verificar formato con título
            expect(fullNameWithTitle).toBe('Dr. Juan Pérez');
        });
    });

    describe('Validaciones', () => {
        it('Debe validar como válido un doctor completo', () => {
            // ARRANGE: Doctor completo ya preparado
            
            // ACT: Validar doctor
            const isValid = doctor.isValid();
            
            // ASSERT: Debe ser válido
            expect(isValid).toBe(true);
        });

        it('Debe validar como inválido un doctor incompleto', () => {
            // ARRANGE: Crear doctor con campos vacíos
            const incompleteDoctor = new Doctor(1, 'Juan', '', '', '', '', '');
            
            // ACT: Validar doctor incompleto
            const isValid = incompleteDoctor.isValid();
            
            // ASSERT: Debe ser inválido
            expect(isValid).toBe(false);
        });

        it('Debe validar formato de email correcto', () => {
            // ARRANGE: Doctor con email válido
            
            // ACT: Validar email
            const hasValidEmail = doctor.hasValidEmail();
            
            // ASSERT: Debe ser válido
            expect(hasValidEmail).toBe(true);
        });

        it('Debe invalidar formato de email incorrecto', () => {
            // ARRANGE: Asignar email inválido
            doctor.email = 'invalid-email';
            
            // ACT: Validar email
            const hasValidEmail = doctor.hasValidEmail();
            
            // ASSERT: Debe ser inválido
            expect(hasValidEmail).toBe(false);
        });
    });

    describe('Serialización JSON', () => {
        it('Debe convertir doctor a JSON correctamente', () => {
            // ARRANGE: Doctor ya preparado
            
            // ACT: Convertir a JSON
            const json = doctor.toJSON();
            
            // ASSERT: Verificar propiedades en JSON
            expect(json.id).toBe(1);
            expect(json.name).toBe('Juan');
            expect(json.licenseNumber).toBe('LIC-12345');
        });

        it('Debe crear doctor desde JSON correctamente', () => {
            // ARRANGE: Preparar objeto JSON
            const json = {
                id: 2,
                name: 'María',
                lastName: 'González',
                specialty: 'Pediatría',
                phone: '0991234567',
                email: 'maria@hospital.com',
                licenseNumber: 'LIC-67890'
            };
            
            // ACT: Crear doctor desde JSON
            const newDoctor = Doctor.fromJSON(json);
            
            // ASSERT: Verificar todas las propiedades
            expect(newDoctor.id).toBe(2);
            expect(newDoctor.name).toBe('María');
            expect(newDoctor.specialty).toBe('Pediatría');
        });
    });

    describe('Actualización de propiedades', () => {
        it('Debe permitir actualizar propiedades del doctor', () => {
            // ARRANGE: Doctor inicial preparado
            
            // ACT: Actualizar especialidad y teléfono
            doctor.specialty = 'Neurología';
            doctor.phone = '0999999999';
            
            // ASSERT: Verificar cambios
            expect(doctor.specialty).toBe('Neurología');
            expect(doctor.phone).toBe('0999999999');
        });
    });
});
