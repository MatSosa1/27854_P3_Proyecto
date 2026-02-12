import { Medicine } from './medicine';

describe('Medicine - Pruebas Unitarias con Patrón AAA', () => {
    let medicine: Medicine;

    beforeEach(() => {
        // ARRANGE: Preparar medicamento de prueba antes de cada test
        medicine = new Medicine(
            1,
            'Paracetamol',
            'Analgésico y antipirético',
            5.50,
            100,
            'Analgésicos',
            'Bayer'
        );
    });

    describe('Creación de instancias', () => {
        it('Debe crear una instancia de Medicine correctamente', () => {
            // ARRANGE: Ya preparado en beforeEach
            
            // ACT: No hay acción específica
            
            // ASSERT: Verificar que el medicamento existe
            expect(medicine).toBeTruthy();
        });

        it('Debe crear un medicamento con valores por defecto', () => {
            // ARRANGE: No hay preparación previa
            
            // ACT: Crear medicamento sin parámetros
            const emptyMedicine = new Medicine();
            
            // ASSERT: Verificar valores por defecto
            expect(emptyMedicine.id).toBe(0);
            expect(emptyMedicine.name).toBe('');
            expect(emptyMedicine.price).toBe(0);
            expect(emptyMedicine.quantity).toBe(0);
        });

        it('Debe asignar todas las propiedades correctamente', () => {
            // ARRANGE: Medicamento ya creado en beforeEach
            
            // ACT: No hay acción
            
            // ASSERT: Verificar todas las propiedades
            expect(medicine.id).toBe(1);
            expect(medicine.name).toBe('Paracetamol');
            expect(medicine.description).toBe('Analgésico y antipirético');
            expect(medicine.price).toBe(5.50);
            expect(medicine.quantity).toBe(100);
            expect(medicine.category).toBe('Analgésicos');
            expect(medicine.laboratory).toBe('Bayer');
        });
    });

    describe('Cálculos y métodos utilitarios', () => {
        it('Debe calcular el valor total del inventario correctamente', () => {
            // ARRANGE: Medicamento con precio 5.50 y cantidad 100
            
            // ACT: Calcular valor total
            const totalValue = medicine.getTotalValue();
            
            // ASSERT: Verificar cálculo (5.50 * 100 = 550)
            expect(totalValue).toBe(550);
        });

        it('Debe formatear el precio correctamente', () => {
            // ARRANGE: Medicamento con precio 5.50
            
            // ACT: Obtener precio formateado
            const formattedPrice = medicine.getFormattedPrice();
            
            // ASSERT: Verificar formato con símbolo $
            expect(formattedPrice).toBe('$5.50');
        });
    });

    describe('Validaciones de stock', () => {
        it('Debe indicar que hay stock cuando quantity > 0', () => {
            // ARRANGE: Medicamento con cantidad 100
            
            // ACT: Verificar stock
            const inStock = medicine.isInStock();
            
            // ASSERT: Debe estar en stock
            expect(inStock).toBe(true);
        });

        it('Debe indicar que no hay stock cuando quantity = 0', () => {
            // ARRANGE: Establecer cantidad en 0
            medicine.quantity = 0;
            
            // ACT: Verificar stock
            const inStock = medicine.isInStock();
            
            // ASSERT: No debe estar en stock
            expect(inStock).toBe(false);
        });

        it('Debe indicar stock bajo cuando quantity < 10', () => {
            // ARRANGE: Establecer cantidad baja
            medicine.quantity = 5;
            
            // ACT: Verificar stock bajo
            const lowStock = medicine.isLowStock();
            
            // ASSERT: Debe estar en stock bajo
            expect(lowStock).toBe(true);
        });

        it('No debe indicar stock bajo cuando quantity >= 10', () => {
            // ARRANGE: Establecer cantidad normal
            medicine.quantity = 10;
            
            // ACT: Verificar stock bajo
            const lowStock = medicine.isLowStock();
            
            // ASSERT: No debe estar en stock bajo
            expect(lowStock).toBe(false);
        });

        it('No debe indicar stock bajo cuando quantity = 0', () => {
            // ARRANGE: Establecer cantidad en 0
            medicine.quantity = 0;
            
            // ACT: Verificar stock bajo
            const lowStock = medicine.isLowStock();
            
            // ASSERT: No debe estar en stock bajo (está agotado)
            expect(lowStock).toBe(false);
        });
    });

    describe('Operaciones de stock', () => {
        it('Debe reducir el stock correctamente', () => {
            // ARRANGE: Medicamento con 100 unidades
            
            // ACT: Reducir 20 unidades
            const result = medicine.reduceStock(20);
            
            // ASSERT: Verificar reducción exitosa
            expect(result).toBe(true);
            expect(medicine.quantity).toBe(80);
        });

        it('No debe reducir stock si la cantidad es mayor a la disponible', () => {
            // ARRANGE: Medicamento con 100 unidades
            
            // ACT: Intentar reducir 150 unidades
            const result = medicine.reduceStock(150);
            
            // ASSERT: Operación fallida, cantidad sin cambios
            expect(result).toBe(false);
            expect(medicine.quantity).toBe(100);
        });

        it('No debe reducir stock si la cantidad es cero o negativa', () => {
            // ARRANGE: Medicamento con 100 unidades
            
            // ACT: Intentar reducir 0 unidades
            const result = medicine.reduceStock(0);
            
            // ASSERT: Operación fallida
            expect(result).toBe(false);
            expect(medicine.quantity).toBe(100);
        });
    });

    describe('Validaciones generales', () => {
        it('Debe validar como válido un medicamento completo', () => {
            // ARRANGE: Medicamento completo ya preparado
            
            // ACT: Validar medicamento
            const isValid = medicine.isValid();
            
            // ASSERT: Debe ser válido
            expect(isValid).toBe(true);
        });

        it('Debe validar como inválido un medicamento incompleto', () => {
            // ARRANGE: Crear medicamento con campos vacíos
            const incompleteMedicine = new Medicine(1, '', '', 0, 0, '', '');
            
            // ACT: Validar medicamento incompleto
            const isValid = incompleteMedicine.isValid();
            
            // ASSERT: Debe ser inválido
            expect(isValid).toBe(false);
        });
    });

    describe('Operaciones avanzadas de stock', () => {
        let medicine: Medicine;

        beforeEach(() => {
            medicine = new Medicine(
                1,
                'Paracetamol',
                'Analgésico y antipirético',
                5.00,
                50,
                'Analgésicos',
                'FarmaLab',
            );
        });

        it('Debe agregar stock correctamente', () => {
            // ARRANGE: Medicamento con 50 unidades
            const initialQuantity = medicine.quantity;
            
            // ACT: Agregar 30 unidades
            medicine.addStock(30);
            
            // ASSERT: Debe tener 80 unidades
            expect(medicine.quantity).toBe(initialQuantity + 30);
        });

        it('No debe agregar stock negativo', () => {
            // ARRANGE: Medicamento con 50 unidades
            const initialQuantity = medicine.quantity;
            
            // ACT: Intentar agregar -10 unidades
            medicine.addStock(-10);
            
            // ASSERT: Debe mantener cantidad original
            expect(medicine.quantity).toBe(initialQuantity);
        });

        it('No debe agregar stock de cero', () => {
            // ARRANGE: Medicamento con 50 unidades
            const initialQuantity = medicine.quantity;
            
            // ACT: Intentar agregar 0 unidades
            medicine.addStock(0);
            
            // ASSERT: Debe mantener cantidad original
            expect(medicine.quantity).toBe(initialQuantity);
        });

        it('Debe convertir medicamento a JSON correctamente', () => {
            // ARRANGE: Medicamento existente
            
            // ACT: Convertir a JSON
            const json = medicine.toJSON();
            
            // ASSERT: JSON debe contener todos los campos
            expect(json.id).toBe(1);
            expect(json.name).toBe('Paracetamol');
            expect(json.price).toBe(5.00);
            expect(json.quantity).toBe(50);
        });

        it('Debe crear medicamento desde JSON', () => {
            // ARRANGE: Objeto JSON
            const json = {
                id: 2,
                name: 'Ibuprofeno',
                description: 'Antiinflamatorio',
                price: 7.50,
                quantity: 100,
                category: 'Antiinflamatorios',
                laboratory: 'FarmaCorp',
            };
            
            // ACT: Crear medicamento desde JSON
            const newMedicine = Medicine.fromJSON(json);
            
            // ASSERT: Medicamento debe tener datos correctos
            expect(newMedicine.id).toBe(2);
            expect(newMedicine.name).toBe('Ibuprofeno');
            expect(newMedicine.quantity).toBe(100);
        });
    });
});

