// API Base URL
const API_URL = 'https://hospital-api-81p9.onrender.com/api';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    loadDoctors();
    loadSpecialtyOptions();
    initForms();
});

// Tab Management
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.dataset.tab;
            openTab(tabName);
        });
    });
}

function openTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Load data for the selected tab
    switch (tabName) {
        case 'doctors':
            loadDoctors();
            loadSpecialtyOptions();
            break;
        case 'patients':
            loadPatients();
            break;
        case 'medicines':
            loadMedicines();
            break;
        case 'specialties':
            loadSpecialties();
            break;
    }
}

// Initialize Forms
function initForms() {
    document.getElementById('doctorForm').addEventListener('submit', handleDoctorSubmit);
    document.getElementById('patientForm').addEventListener('submit', handlePatientSubmit);
    document.getElementById('medicineForm').addEventListener('submit', handleMedicineSubmit);
    document.getElementById('specialtyForm').addEventListener('submit', handleSpecialtySubmit);
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// ==================== DOCTORS ====================

async function loadSpecialtyOptions() {
    try {
        const response = await fetch(`${API_URL}/especialidades`);
        const specialties = await response.json();

        const select = document.getElementById('doctorSpecialty');
        // Mantener la opción por defecto y limpiar las demás
        select.innerHTML = '<option value="">Seleccionar Especialidad *</option>';

        // Agregar las especialidades como opciones
        specialties.forEach(specialty => {
            const option = document.createElement('option');
            option.value = specialty.name;
            option.textContent = specialty.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading specialty options:', error);
        showToast('Error al cargar especialidades', 'error');
    }
}

async function loadDoctors() {
    try {
        const response = await fetch(`${API_URL}/doctores`);
        const doctors = await response.json();
        displayDoctors(doctors);
    } catch (error) {
        console.error('Error loading doctors:', error);
        showToast('Error al cargar doctores', 'error');
    }
}

function displayDoctors(doctors) {
    const container = document.getElementById('doctorsList');

    if (doctors.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No hay doctores registrados</p></div>';
        return;
    }

    container.innerHTML = doctors.map(doctor => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">Dr. ${doctor.name} ${doctor.lastName}</div>
                <div class="item-actions">
                    <button class="btn-edit" onclick='editDoctor(${JSON.stringify(doctor)})'>Editar</button>
                    <button class="btn-delete" onclick="deleteDoctor('${doctor._id}')">Eliminar</button>
                </div>
            </div>
            <div class="item-details">
                <div class="item-detail"><strong>Especialidad:</strong> ${doctor.specialty}</div>
                <div class="item-detail"><strong>Teléfono:</strong> ${doctor.phone}</div>
                <div class="item-detail"><strong>Email:</strong> ${doctor.email}</div>
                <div class="item-detail"><strong>Licencia:</strong> ${doctor.licenseNumber}</div>
            </div>
        </div>
    `).join('');
}

async function handleDoctorSubmit(e) {
    e.preventDefault();

    const doctor = {
        name: document.getElementById('doctorName').value,
        lastName: document.getElementById('doctorLastName').value,
        specialty: document.getElementById('doctorSpecialty').value,
        phone: document.getElementById('doctorPhone').value,
        email: document.getElementById('doctorEmail').value,
        licenseNumber: document.getElementById('doctorLicense').value,
    };

    const id = document.getElementById('doctorId').value;

    try {
        const url = id ? `${API_URL}/doctores/${id}` : `${API_URL}/doctores`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(doctor),
        });

        if (response.ok) {
            showToast(`Doctor ${id ? 'actualizado' : 'creado'} exitosamente`);
            clearDoctorForm();
            loadDoctors();
        } else {
            const error = await response.json();
            showToast(error.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar doctor', 'error');
    }
}

function editDoctor(doctor) {
    document.getElementById('doctorId').value = doctor._id;
    document.getElementById('doctorName').value = doctor.name;
    document.getElementById('doctorLastName').value = doctor.lastName;
    document.getElementById('doctorSpecialty').value = doctor.specialty;
    document.getElementById('doctorPhone').value = doctor.phone;
    document.getElementById('doctorEmail').value = doctor.email;
    document.getElementById('doctorLicense').value = doctor.licenseNumber;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteDoctor(id) {
    if (!confirm('¿Estás seguro de eliminar este doctor?')) return;

    try {
        const response = await fetch(`${API_URL}/doctores/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showToast('Doctor eliminado exitosamente');
            loadDoctors();
        } else {
            showToast('Error al eliminar doctor', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar doctor', 'error');
    }
}

function clearDoctorForm() {
    document.getElementById('doctorForm').reset();
    document.getElementById('doctorId').value = '';
}

// ==================== PATIENTS ====================

async function loadPatients() {
    try {
        const response = await fetch(`${API_URL}/pacientes`);
        const patients = await response.json();
        displayPatients(patients);
    } catch (error) {
        console.error('Error loading patients:', error);
        showToast('Error al cargar pacientes', 'error');
    }
}

function displayPatients(patients) {
    const container = document.getElementById('patientsList');

    if (patients.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No hay pacientes registrados</p></div>';
        return;
    }

    container.innerHTML = patients.map(patient => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${patient.name} ${patient.lastName}</div>
                <div class="item-actions">
                    <button class="btn-edit" onclick='editPatient(${JSON.stringify(patient)})'>Editar</button>
                    <button class="btn-delete" onclick="deletePatient('${patient._id}')">Eliminar</button>
                </div>
            </div>
            <div class="item-details">
                <div class="item-detail"><strong>Email:</strong> ${patient.email}</div>
                <div class="item-detail"><strong>Género:</strong> ${patient.gender}</div>
                <div class="item-detail"><strong>Enfermedad:</strong> ${patient.illness}</div>
            </div>
        </div>
    `).join('');
}

async function handlePatientSubmit(e) {
    e.preventDefault();

    const patient = {
        name: document.getElementById('patientName').value,
        lastName: document.getElementById('patientLastName').value,
        email: document.getElementById('patientEmail').value,
        gender: document.getElementById('patientGender').value,
        illness: document.getElementById('patientIllness').value,
    };

    const id = document.getElementById('patientId').value;

    try {
        const url = id ? `${API_URL}/pacientes/${id}` : `${API_URL}/pacientes`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patient),
        });

        if (response.ok) {
            showToast(`Paciente ${id ? 'actualizado' : 'creado'} exitosamente`);
            clearPatientForm();
            loadPatients();
        } else {
            const error = await response.json();
            showToast(error.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar paciente', 'error');
    }
}

function editPatient(patient) {
    document.getElementById('patientId').value = patient._id;
    document.getElementById('patientName').value = patient.name;
    document.getElementById('patientLastName').value = patient.lastName;
    document.getElementById('patientEmail').value = patient.email;
    document.getElementById('patientGender').value = patient.gender;
    document.getElementById('patientIllness').value = patient.illness;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deletePatient(id) {
    if (!confirm('¿Estás seguro de eliminar este paciente?')) return;

    try {
        const response = await fetch(`${API_URL}/pacientes/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showToast('Paciente eliminado exitosamente');
            loadPatients();
        } else {
            showToast('Error al eliminar paciente', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar paciente', 'error');
    }
}

function clearPatientForm() {
    document.getElementById('patientForm').reset();
    document.getElementById('patientId').value = '';
}

// ==================== MEDICINES ====================

async function loadMedicines() {
    try {
        const response = await fetch(`${API_URL}/medicamentos`);
        const medicines = await response.json();
        displayMedicines(medicines);
    } catch (error) {
        console.error('Error loading medicines:', error);
        showToast('Error al cargar medicamentos', 'error');
    }
}

function displayMedicines(medicines) {
    const container = document.getElementById('medicinesList');

    if (medicines.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No hay medicamentos registrados</p></div>';
        return;
    }

    container.innerHTML = medicines.map(medicine => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${medicine.name}</div>
                <div class="item-actions">
                    <button class="btn-edit" onclick='editMedicine(${JSON.stringify(medicine)})'>Editar</button>
                    <button class="btn-delete" onclick="deleteMedicine('${medicine._id}')">Eliminar</button>
                </div>
            </div>
            <div class="item-details">
                <div class="item-detail"><strong>Descripción:</strong> ${medicine.description}</div>
                <div class="item-detail"><strong>Precio:</strong> $${medicine.price}</div>
                <div class="item-detail"><strong>Cantidad:</strong> ${medicine.quantity}</div>
                <div class="item-detail"><strong>Categoría:</strong> ${medicine.category}</div>
                <div class="item-detail"><strong>Laboratorio:</strong> ${medicine.laboratory}</div>
            </div>
        </div>
    `).join('');
}

async function handleMedicineSubmit(e) {
    e.preventDefault();

    const medicine = {
        name: document.getElementById('medicineName').value,
        description: document.getElementById('medicineDescription').value,
        price: parseFloat(document.getElementById('medicinePrice').value),
        quantity: parseInt(document.getElementById('medicineQuantity').value),
        category: document.getElementById('medicineCategory').value,
        laboratory: document.getElementById('medicineLaboratory').value,
    };

    const id = document.getElementById('medicineId').value;

    try {
        const url = id ? `${API_URL}/medicamentos/${id}` : `${API_URL}/medicamentos`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicine),
        });

        if (response.ok) {
            showToast(`Medicamento ${id ? 'actualizado' : 'creado'} exitosamente`);
            clearMedicineForm();
            loadMedicines();
        } else {
            const error = await response.json();
            showToast(error.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar medicamento', 'error');
    }
}

function editMedicine(medicine) {
    document.getElementById('medicineId').value = medicine._id;
    document.getElementById('medicineName').value = medicine.name;
    document.getElementById('medicineDescription').value = medicine.description;
    document.getElementById('medicinePrice').value = medicine.price;
    document.getElementById('medicineQuantity').value = medicine.quantity;
    document.getElementById('medicineCategory').value = medicine.category;
    document.getElementById('medicineLaboratory').value = medicine.laboratory;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteMedicine(id) {
    if (!confirm('¿Estás seguro de eliminar este medicamento?')) return;

    try {
        const response = await fetch(`${API_URL}/medicamentos/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showToast('Medicamento eliminado exitosamente');
            loadMedicines();
        } else {
            showToast('Error al eliminar medicamento', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar medicamento', 'error');
    }
}

function clearMedicineForm() {
    document.getElementById('medicineForm').reset();
    document.getElementById('medicineId').value = '';
}

// ==================== SPECIALTIES ====================

async function loadSpecialties() {
    try {
        const response = await fetch(`${API_URL}/especialidades`);
        const specialties = await response.json();
        displaySpecialties(specialties);
    } catch (error) {
        console.error('Error loading specialties:', error);
        showToast('Error al cargar especialidades', 'error');
    }
}

function displaySpecialties(specialties) {
    const container = document.getElementById('specialtiesList');

    if (specialties.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No hay especialidades registradas</p></div>';
        return;
    }

    container.innerHTML = specialties.map(specialty => `
        <div class="item-card">
            <div class="item-header">
                <div class="item-title">${specialty.name}</div>
                <div class="item-actions">
                    <button class="btn-edit" onclick='editSpecialty(${JSON.stringify(specialty)})'>Editar</button>
                    <button class="btn-delete" onclick="deleteSpecialty('${specialty._id}')">Eliminar</button>
                </div>
            </div>
        </div>
    `).join('');
}

async function handleSpecialtySubmit(e) {
    e.preventDefault();

    const specialty = {
        name: document.getElementById('specialtyName').value,
    };

    const id = document.getElementById('specialtyId').value;

    try {
        const url = id ? `${API_URL}/especialidades/${id}` : `${API_URL}/especialidades`;
        const method = id ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(specialty),
        });

        if (response.ok) {
            showToast(`Especialidad ${id ? 'actualizada' : 'creada'} exitosamente`);
            clearSpecialtyForm();
            loadSpecialties();
            // Actualizar el dropdown de especialidades en el formulario de doctores
            loadSpecialtyOptions();
        } else {
            const error = await response.json();
            showToast(error.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al guardar especialidad', 'error');
    }
}

function editSpecialty(specialty) {
    document.getElementById('specialtyId').value = specialty._id;
    document.getElementById('specialtyName').value = specialty.name;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteSpecialty(id) {
    if (!confirm('¿Estás seguro de eliminar esta especialidad?')) return;

    try {
        const response = await fetch(`${API_URL}/especialidades/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            showToast('Especialidad eliminada exitosamente');
            loadSpecialties();
            // Actualizar el dropdown de especialidades en el formulario de doctores
            loadSpecialtyOptions();
        } else {
            showToast('Error al eliminar especialidad', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar especialidad', 'error');
    }
}

function clearSpecialtyForm() {
    document.getElementById('specialtyForm').reset();
    document.getElementById('specialtyId').value = '';
}
