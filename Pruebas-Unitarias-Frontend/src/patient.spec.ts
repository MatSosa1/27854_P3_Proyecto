import { Patient } from './patient';

describe('Patient - Pruebas Unitarias con Patrón AAA', () => {
    let patient: Patient;

    beforeEach(() => {
        // ARRANGE: Preparar paciente de prueba antes de cada test
        patient = new Patient(
            1,
            'Ana',
            'López',
            'ana.lopez@email.com',
            'F',
            'Gripe'
        );
    });

    describe('Creación de instancias', () => {
        it('Debe crear una instancia de Patient correctamente', () => {
            // ARRANGE: Ya preparado en beforeEach
            
            // ACT: Verificar que la instancia existe
            // (no hay acción específica aquí)
            
            // ASSERT: Verificar que el paciente es truthy
            expect(patient).toBeTruthy();
        });

        it('Debe crear un paciente con valores por defecto', () => {
            // ARRANGE: No hay preparación previa
            
            // ACT: Crear paciente sin parámetros
            const emptyPatient = new Patient();
            
            // ASSERT: Verificar valores por defecto
            expect(emptyPatient.id).toBe(0);
            expect(emptyPatient.name).toBe('');
            expect(emptyPatient.gender).toBe('');
        });

        it('Debe asignar todas las propiedades correctamente', () => {
            // ARRANGE: Paciente ya creado en beforeEach
            
            // ACT: No hay acción
            
            // ASSERT: Verificar todas las propiedades
            expect(patient.id).toBe(1);
            expect(patient.name).toBe('Ana');
            expect(patient.lastName).toBe('López');
            expect(patient.email).toBe('ana.lopez@email.com');
            expect(patient.gender).toBe('F');
            expect(patient.illness).toBe('Gripe');
        });
    });

    describe('Métodos utilitarios', () => {
        it('Debe retornar el nombre completo correctamente', () => {
            // ARRANGE: Paciente ya preparado
            
            // ACT: Obtener nombre completo
            const fullName = patient.getFullName();
            
            // ASSERT: Verificar formato nombre + apellido
            expect(fullName).toBe('Ana López');
        });

        it('Debe retornar texto de género "Femenino" para "F"', () => {
            // ARRANGE: Paciente con género 'F'
            
            // ACT: Obtener texto del género
            const genderText = patient.getGenderText();
            
            // ASSERT: Verificar texto correcto
            expect(genderText).toBe('Femenino');
        });

        it('Debe retornar texto de género "Masculino" para "M"', () => {
            // ARRANGE: Cambiar género a masculino
            patient.gender = 'M';
            
            // ACT: Obtener texto del género
            const genderText = patient.getGenderText();
            
            // ASSERT: Verificar texto correcto
            expect(genderText).toBe('Masculino');
        });

        it('Debe retornar "No especificado" para género vacío', () => {
            // ARRANGE: Establecer género vacío
            patient.gender = '';
            
            // ACT: Obtener texto del género
            const genderText = patient.getGenderText();
            
            // ASSERT: Verificar mensaje por defecto
            expect(genderText).toBe('No especificado');
        });
    });

    describe('Validaciones', () => {
        it('Debe validar como válido un paciente completo', () => {
            // ARRANGE: Paciente completo ya preparado
            
            // ACT: Validar paciente
            const isValid = patient.isValid();
            
            // ASSERT: Debe ser válido
            expect(isValid).toBe(true);
        });

        it('Debe validar como inválido un paciente incompleto', () => {
            // ARRANGE: Crear paciente con campos vacíos
            const incompletePatient = new Patient(1, 'Ana', '', '', '', '');
            
            // ACT: Validar paciente incompleto
            const isValid = incompletePatient.isValid();
            
            // ASSERT: Debe ser inválido
            expect(isValid).toBe(false);
        });

        it('Debe validar formato de email correcto', () => {
            // ARRANGE: Paciente con email válido
            
            // ACT: Validar email
            const hasValidEmail = patient.hasValidEmail();
            
            // ASSERT: Debe ser válido
            expect(hasValidEmail).toBe(true);
        });

        it('Debe invalidar formato de email incorrecto', () => {
            // ARRANGE: Asignar email inválido
            patient.email = 'invalid-email';
            
            // ACT: Validar email
            const hasValidEmail = patient.hasValidEmail();
            
            // ASSERT: Debe ser inválido
            expect(hasValidEmail).toBe(false);
        });
    });

    describe('Serialización JSON', () => {
        it('Debe convertir paciente a JSON correctamente', () => {
            // ARRANGE: Paciente ya preparado
            
            // ACT: Convertir a JSON
            const json = patient.toJSON();
            
            // ASSERT: Verificar propiedades en JSON
            expect(json.id).toBe(1);
            expect(json.name).toBe('Ana');
            expect(json.gender).toBe('F');
        });

        it('Debe crear paciente desde JSON correctamente', () => {
            // ARRANGE: Preparar objeto JSON
            const json = {
                id: 2,
                name: 'Carlos',
                lastName: 'Ramírez',
                email: 'carlos@email.com',
                gender: 'M',
                illness: 'Diabetes'
            };
            
            // ACT: Crear paciente desde JSON
            const newPatient = Patient.fromJSON(json);
            
            // ASSERT: Verificar todas las propiedades
            expect(newPatient.id).toBe(2);
            expect(newPatient.name).toBe('Carlos');
            expect(newPatient.gender).toBe('M');
        });
    });

    describe('Actualización de propiedades', () => {
        it('Debe permitir actualizar propiedades del paciente', () => {
            // ARRANGE: Paciente inicial preparado
            
            // ACT: Actualizar enfermedad y email
            patient.illness = 'Migraña';
            patient.email = 'ana.new@email.com';
            
            // ASSERT: Verificar cambios
            expect(patient.illness).toBe('Migraña');
            expect(patient.email).toBe('ana.new@email.com');
        });
    });
});
