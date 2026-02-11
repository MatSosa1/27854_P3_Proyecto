import { Specialty } from './specialty';

describe('Specialty - Pruebas Unitarias con Patrón AAA', () => {
    let specialty: Specialty;

    beforeEach(() => {
        // ARRANGE: Preparar especialidad de prueba antes de cada test
        specialty = new Specialty(1, 'Cardiología');
    });

    describe('Creación de instancias', () => {
        it('Debe crear una instancia de Specialty correctamente', () => {
            // ARRANGE: Ya preparado en beforeEach
            
            // ACT: No hay acción específica
            
            // ASSERT: Verificar que la especialidad existe
            expect(specialty).toBeTruthy();
        });

        it('Debe crear una especialidad con valores por defecto', () => {
            // ARRANGE: No hay preparación previa
            
            // ACT: Crear especialidad sin parámetros
            const emptySpecialty = new Specialty();
            
            // ASSERT: Verificar valores por defecto
            expect(emptySpecialty.id).toBe(0);
            expect(emptySpecialty.name).toBe('');
        });

        it('Debe asignar todas las propiedades correctamente', () => {
            // ARRANGE: Especialidad ya creada en beforeEach
            
            // ACT: No hay acción
            
            // ASSERT: Verificar todas las propiedades
            expect(specialty.id).toBe(1);
            expect(specialty.name).toBe('Cardiología');
        });
    });

    describe('Transformaciones de texto', () => {
        it('Debe retornar el nombre en mayúsculas', () => {
            // ARRANGE: Especialidad con nombre 'Cardiología'
            
            // ACT: Obtener nombre en mayúsculas
            const upperName = specialty.getNameUpperCase();
            
            // ASSERT: Verificar formato en mayúsculas
            expect(upperName).toBe('CARDIOLOGÍA');
        });

        it('Debe retornar el nombre en minúsculas', () => {
            // ARRANGE: Especialidad con nombre 'Cardiología'
            
            // ACT: Obtener nombre en minúsculas
            const lowerName = specialty.getNameLowerCase();
            
            // ASSERT: Verificar formato en minúsculas
            expect(lowerName).toBe('cardiología');
        });
    });

    describe('Validaciones', () => {
        it('Debe validar como válida una especialidad con nombre', () => {
            // ARRANGE: Especialidad con nombre válido
            
            // ACT: Validar especialidad
            const isValid = specialty.isValid();
            
            // ASSERT: Debe ser válida
            expect(isValid).toBe(true);
        });

        it('Debe validar como inválida una especialidad vacía', () => {
            // ARRANGE: Crear especialidad sin nombre
            const emptySpecialty = new Specialty(1, '');
            
            // ACT: Validar especialidad vacía
            const isValid = emptySpecialty.isValid();
            
            // ASSERT: Debe ser inválida
            expect(isValid).toBe(false);
        });

        it('Debe validar como inválida una especialidad con solo espacios', () => {
            // ARRANGE: Crear especialidad con espacios
            const spacesSpecialty = new Specialty(1, '   ');
            
            // ACT: Validar especialidad
            const isValid = spacesSpecialty.isValid();
            
            // ASSERT: Debe ser inválida
            expect(isValid).toBe(false);
        });

        it('Debe validar nombre con solo letras y espacios', () => {
            // ARRANGE: Especialidad con nombre válido
            
            // ACT: Validar formato del nombre
            const hasValidName = specialty.hasValidName();
            
            // ASSERT: Debe ser válido
            expect(hasValidName).toBe(true);
        });

        it('Debe invalidar nombre con números', () => {
            // ARRANGE: Asignar nombre con números
            specialty.name = 'Cardiología123';
            
            // ACT: Validar formato del nombre
            const hasValidName = specialty.hasValidName();
            
            // ASSERT: Debe ser inválido
            expect(hasValidName).toBe(false);
        });

        it('Debe invalidar nombre con caracteres especiales', () => {
            // ARRANGE: Asignar nombre con caracteres especiales
            specialty.name = 'Cardiología@#';
            
            // ACT: Validar formato del nombre
            const hasValidName = specialty.hasValidName();
            
            // ASSERT: Debe ser inválido
            expect(hasValidName).toBe(false);
        });
    });

    describe('Comparaciones', () => {
        it('Debe comparar dos especialidades iguales correctamente', () => {
            // ARRANGE: Crear otra especialidad con mismo nombre
            const other = new Specialty(2, 'Cardiología');
            
            // ACT: Comparar especialidades
            const areEqual = specialty.equals(other);
            
            // ASSERT: Deben ser iguales
            expect(areEqual).toBe(true);
        });

        it('Debe comparar especialidades iguales sin importar mayúsculas', () => {
            // ARRANGE: Crear especialidad con diferente capitalización
            const other = new Specialty(2, 'CARDIOLOGÍA');
            
            // ACT: Comparar especialidades (case-insensitive)
            const areEqual = specialty.equals(other);
            
            // ASSERT: Deben ser iguales
            expect(areEqual).toBe(true);
        });

        it('Debe identificar dos especialidades diferentes', () => {
            // ARRANGE: Crear especialidad diferente
            const other = new Specialty(2, 'Pediatría');
            
            // ACT: Comparar especialidades
            const areEqual = specialty.equals(other);
            
            // ASSERT: Deben ser diferentes
            expect(areEqual).toBe(false);
        });

        it('Debe comparar nombre con string correctamente', () => {
            // ARRANGE: Especialidad con nombre 'Cardiología'
            
            // ACT: Comparar con string
            const nameMatches = specialty.equalsName('Cardiología');
            
            // ASSERT: Deben coincidir
            expect(nameMatches).toBe(true);
        });

        it('Debe comparar nombre con string sin importar mayúsculas', () => {
            // ARRANGE: Especialidad con nombre 'Cardiología'
            
            // ACT: Comparar con string en minúsculas
            const nameMatches = specialty.equalsName('cardiología');
            
            // ASSERT: Deben coincidir (case-insensitive)
            expect(nameMatches).toBe(true);
        });
    });

    describe('Serialización JSON', () => {
        it('Debe convertir especialidad a JSON correctamente', () => {
            // ARRANGE: Especialidad ya preparada
            
            // ACT: Convertir a JSON
            const json = specialty.toJSON();
            
            // ASSERT: Verificar propiedades en JSON
            expect(json.id).toBe(1);
            expect(json.name).toBe('Cardiología');
        });

        it('Debe crear especialidad desde JSON correctamente', () => {
            // ARRANGE: Preparar objeto JSON
            const json = {
                id: 2,
                name: 'Pediatría'
            };
            
            // ACT: Crear especialidad desde JSON
            const newSpecialty = Specialty.fromJSON(json);
            
            // ASSERT: Verificar todas las propiedades
            expect(newSpecialty.id).toBe(2);
            expect(newSpecialty.name).toBe('Pediatría');
        });
    });

    describe('Actualización de propiedades', () => {
        it('Debe permitir actualizar el nombre de la especialidad', () => {
            // ARRANGE: Especialidad inicial preparada
            
            // ACT: Actualizar nombre
            specialty.name = 'Neurología';
            
            // ASSERT: Verificar cambio
            expect(specialty.name).toBe('Neurología');
        });
    });
});
