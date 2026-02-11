/**
 * Clase que representa una Especialidad médica en el sistema hospitalario
 */
export class Specialty {
    id: number;
    name: string;

    constructor(
        id: number = 0,
        name: string = ''
    ) {
        this.id = id;
        this.name = name;
    }

    /**
     * Obtiene el nombre en mayúsculas
     * @returns Nombre de la especialidad en mayúsculas
     */
    getNameUpperCase(): string {
        return this.name.toUpperCase();
    }

    /**
     * Obtiene el nombre en minúsculas
     * @returns Nombre de la especialidad en minúsculas
     */
    getNameLowerCase(): string {
        return this.name.toLowerCase();
    }

    /**
     * Valida si la especialidad tiene nombre
     * @returns true si el nombre no está vacío
     */
    isValid(): boolean {
        return this.name.trim().length > 0;
    }

    /**
     * Valida si el nombre contiene solo letras y espacios
     * @returns true si el nombre es válido
     */
    hasValidName(): boolean {
        const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
        return nameRegex.test(this.name);
    }

    /**
     * Compara si dos especialidades son iguales (case-insensitive)
     * @param other Otra especialidad para comparar
     * @returns true si los nombres son iguales
     */
    equals(other: Specialty): boolean {
        return this.name.toLowerCase() === other.name.toLowerCase();
    }

    /**
     * Compara si el nombre es igual a un string dado (case-insensitive)
     * @param name Nombre para comparar
     * @returns true si los nombres son iguales
     */
    equalsName(name: string): boolean {
        return this.name.toLowerCase() === name.toLowerCase();
    }

    /**
     * Convierte la especialidad a un objeto JSON
     * @returns Objeto con las propiedades de la especialidad
     */
    toJSON(): any {
        return {
            id: this.id,
            name: this.name
        };
    }

    /**
     * Crea una instancia de Specialty desde un objeto JSON
     * @param json Objeto con datos de la especialidad
     * @returns Nueva instancia de Specialty
     */
    static fromJSON(json: any): Specialty {
        return new Specialty(json.id, json.name);
    }
}
