/**
 * Clase que representa un Paciente en el sistema hospitalario
 */
export class Patient {
    id: number;
    name: string;
    lastName: string;
    email: string;
    gender: 'M' | 'F' | '';
    illness: string;

    constructor(
        id: number = 0,
        name: string = '',
        lastName: string = '',
        email: string = '',
        gender: 'M' | 'F' | '' = '',
        illness: string = ''
    ) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.email = email;
        this.gender = gender;
        this.illness = illness;
    }

    /**
     * Obtiene el nombre completo del paciente
     * @returns Nombre completo (nombre + apellido)
     */
    getFullName(): string {
        return `${this.name} ${this.lastName}`;
    }

    /**
     * Obtiene el género en formato legible
     * @returns 'Masculino', 'Femenino' o 'No especificado'
     */
    getGenderText(): string {
        if (this.gender === 'M') return 'Masculino';
        if (this.gender === 'F') return 'Femenino';
        return 'No especificado';
    }

    /**
     * Valida si el paciente tiene todos los campos requeridos
     * @returns true si todos los campos están completos
     */
    isValid(): boolean {
        return !!(
            this.name &&
            this.lastName &&
            this.email &&
            this.gender &&
            this.illness
        );
    }

    /**
     * Valida el formato del email
     * @returns true si el email tiene formato válido
     */
    hasValidEmail(): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(this.email);
    }

    /**
     * Convierte el paciente a un objeto JSON
     * @returns Objeto con las propiedades del paciente
     */
    toJSON(): any {
        return {
            id: this.id,
            name: this.name,
            lastName: this.lastName,
            email: this.email,
            gender: this.gender,
            illness: this.illness
        };
    }

    /**
     * Crea una instancia de Patient desde un objeto JSON
     * @param json Objeto con datos del paciente
     * @returns Nueva instancia de Patient
     */
    static fromJSON(json: any): Patient {
        return new Patient(
            json.id,
            json.name,
            json.lastName,
            json.email,
            json.gender,
            json.illness
        );
    }
}
