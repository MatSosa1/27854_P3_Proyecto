/**
 * Clase que representa un Doctor en el sistema hospitalario
 */
export class Doctor {
    id: number;
    name: string;
    lastName: string;
    specialty: string;
    phone: string;
    email: string;
    licenseNumber: string;

    constructor(
        id: number = 0,
        name: string = '',
        lastName: string = '',
        specialty: string = '',
        phone: string = '',
        email: string = '',
        licenseNumber: string = ''
    ) {
        this.id = id;
        this.name = name;
        this.lastName = lastName;
        this.specialty = specialty;
        this.phone = phone;
        this.email = email;
        this.licenseNumber = licenseNumber;
    }

    /**
     * Obtiene el nombre completo del doctor
     * @returns Nombre completo (nombre + apellido)
     */
    getFullName(): string {
        return `${this.name} ${this.lastName}`;
    }

    /**
     * Obtiene el nombre completo con título
     * @returns Dr./Dra. + nombre completo
     */
    getFullNameWithTitle(): string {
        return `Dr. ${this.getFullName()}`;
    }

    /**
     * Valida si el doctor tiene todos los campos requeridos
     * @returns true si todos los campos están completos
     */
    isValid(): boolean {
        return !!(
            this.name &&
            this.lastName &&
            this.specialty &&
            this.phone &&
            this.email &&
            this.licenseNumber
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
     * Convierte el doctor a un objeto JSON
     * @returns Objeto con las propiedades del doctor
     */
    toJSON(): any {
        return {
            id: this.id,
            name: this.name,
            lastName: this.lastName,
            specialty: this.specialty,
            phone: this.phone,
            email: this.email,
            licenseNumber: this.licenseNumber
        };
    }

    /**
     * Crea una instancia de Doctor desde un objeto JSON
     * @param json Objeto con datos del doctor
     * @returns Nueva instancia de Doctor
     */
    static fromJSON(json: any): Doctor {
        return new Doctor(
            json.id,
            json.name,
            json.lastName,
            json.specialty,
            json.phone,
            json.email,
            json.licenseNumber
        );
    }
}
