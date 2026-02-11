/**
 * Clase que representa un Medicamento en el sistema hospitalario
 */
export class Medicine {
    id: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category: string;
    laboratory: string;

    constructor(
        id: number = 0,
        name: string = '',
        description: string = '',
        price: number = 0,
        quantity: number = 0,
        category: string = '',
        laboratory: string = ''
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.category = category;
        this.laboratory = laboratory;
    }

    /**
     * Calcula el valor total del inventario
     * @returns Precio * cantidad
     */
    getTotalValue(): number {
        return this.price * this.quantity;
    }

    /**
     * Verifica si hay stock disponible
     * @returns true si quantity > 0
     */
    isInStock(): boolean {
        return this.quantity > 0;
    }

    /**
     * Verifica si el stock está bajo (menos de 10 unidades)
     * @returns true si quantity < 10
     */
    isLowStock(): boolean {
        return this.quantity < 10 && this.quantity > 0;
    }

    /**
     * Obtiene el precio formateado con símbolo de dólar
     * @returns Precio formateado como string
     */
    getFormattedPrice(): string {
        return `$${this.price.toFixed(2)}`;
    }

    /**
     * Valida si el medicamento tiene todos los campos requeridos
     * @returns true si todos los campos están completos
     */
    isValid(): boolean {
        return !!(
            this.name &&
            this.description &&
            this.price > 0 &&
            this.quantity >= 0 &&
            this.category &&
            this.laboratory
        );
    }

    /**
     * Reduce el stock del medicamento
     * @param amount Cantidad a reducir
     * @returns true si se pudo reducir, false si no hay suficiente stock
     */
    reduceStock(amount: number): boolean {
        if (amount <= 0 || amount > this.quantity) {
            return false;
        }
        this.quantity -= amount;
        return true;
    }

    /**
     * Aumenta el stock del medicamento
     * @param amount Cantidad a agregar
     */
    addStock(amount: number): void {
        if (amount > 0) {
            this.quantity += amount;
        }
    }

    /**
     * Convierte el medicamento a un objeto JSON
     * @returns Objeto con las propiedades del medicamento
     */
    toJSON(): any {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            price: this.price,
            quantity: this.quantity,
            category: this.category,
            laboratory: this.laboratory
        };
    }

    /**
     * Crea una instancia de Medicine desde un objeto JSON
     * @param json Objeto con datos del medicamento
     * @returns Nueva instancia de Medicine
     */
    static fromJSON(json: any): Medicine {
        return new Medicine(
            json.id,
            json.name,
            json.description,
            json.price,
            json.quantity,
            json.category,
            json.laboratory
        );
    }
}
