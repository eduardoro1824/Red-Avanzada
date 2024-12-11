// Variables globales
let wifiActive = false;
let aiEnabled = false;
let aiActive = false;
let devices = [];
let threatCounter = 0;

// Elementos del DOM
const wifiStatus = document.getElementById('wifiStatus');
const deviceTableBody = document.getElementById('deviceTableBody');
const threatAlerts = document.getElementById('threatAlerts');

// Botones
const startWifiZone = document.getElementById('startWifiZone');
const enableAI = document.getElementById('enableAI');
const toggleAI = document.getElementById('toggleAI');
const clearDevices = document.getElementById('clearDevices');
const addDeviceManually = document.getElementById('addDeviceManually');

// Eventos
startWifiZone.addEventListener('click', toggleWifiZoneEvent);
enableAI.addEventListener('click', toggleAIEvent);
toggleAI.addEventListener('click', toggleAutoConnection);
clearDevices.addEventListener('click', clearAllDevices);
addDeviceManually.addEventListener('click', addManualDevice);

// Función para mostrar alertas con estilo
function showSweetAlert(message, type) {
    // Puedes integrar una biblioteca como SweetAlert para mejorar la experiencia
    alert(`${type.toUpperCase()}: ${message}`);
}

// Función para activar/desactivar la Zona Wi-Fi
function toggleWifiZoneEvent(event) {
    wifiActive = !wifiActive;
    wifiStatus.textContent = wifiActive
        ? 'Estado: Zona Wi-Fi activa'
        : 'Estado: Zona Wi-Fi no activa';
    event.target.textContent = wifiActive ? 'Detener Zona Wi-Fi' : 'Iniciar Zona Wi-Fi';

    // Habilitar o deshabilitar botones según el estado de la zona Wi-Fi
    enableAI.disabled = !wifiActive;
    clearDevices.disabled = !wifiActive;
    addDeviceManually.disabled = !wifiActive;
    toggleAI.disabled = !wifiActive;

    if (!wifiActive) {
        devices = [];
        renderDeviceTable();
        clearThreatAlerts();
    }

    showSweetAlert(wifiActive ? 'Zona Wi-Fi activada.' : 'Zona Wi-Fi detenida.', 'success');
}

// Función para habilitar/deshabilitar la IA
function toggleAIEvent(event) {
    if (!wifiActive) {
        showSweetAlert('Activa la Zona Wi-Fi antes de habilitar la IA.', 'warning');
        return;
    }

    aiEnabled = !aiEnabled;
    event.target.textContent = aiEnabled ? 'Deshabilitar IA' : 'Habilitar IA';
    showSweetAlert(`IA ${aiEnabled ? 'habilitada' : 'deshabilitada'}.`, 'success');
}

// Función para iniciar/detener la conexión automática mediante IA
function toggleAutoConnection(event) {
    if (!aiEnabled) {
        showSweetAlert('La IA no está habilitada. Por favor, habilítala primero.', 'warning');
        return;
    }

    aiActive = !aiActive;
    event.target.textContent = aiActive
        ? 'Detener Conexión Automática (IA)'
        : 'Iniciar Conexión Automática (IA)';

    aiActive ? startAutoConnection() : stopAutoConnection();
    showSweetAlert(`Conexión automática ${aiActive ? 'iniciada' : 'detenida'}.`, 'success');
}

// Función para iniciar la conexión automática mediante IA
function startAutoConnection() {
    const interval = setInterval(() => {
        if (!aiActive || !wifiActive) {
            clearInterval(interval);
            return;
        }

        const randomDevice = generateRandomDevice();
        devices.push(randomDevice);
        renderDeviceTable();
        generateThreatAlert(randomDevice);
    }, 3000);
}

// Función para detener la conexión automática
function stopAutoConnection() {
    aiActive = false;
}

// Función para agregar dispositivos manualmente
function addManualDevice() {
    const name = document.getElementById('manualDeviceName').value;
    const ip = document.getElementById('manualDeviceIp').value;

    if (!name || !ip) {
        showSweetAlert('Por favor, completa todos los campos.', 'warning');
        return;
    }

    const newDevice = {
        name,
        ip,
        status: 'Conectado',
        threat: 'Ninguna',
        blocked: false // Estado inicial: no bloqueado
    };

    devices.push(newDevice);
    renderDeviceTable();

    document.getElementById('manualAddForm').reset();
}

// Función para generar un dispositivo aleatorio
function generateRandomDevice() {
    const randomNames = ['PC-1', 'Tablet-X', 'Phone-Y', 'Router-Z'];
    const randomIp = `192.168.1.${Math.floor(Math.random() * 255) + 1}`;
    const isThreat = Math.random() < 0.3; // 30% de probabilidad de amenaza

    return {
        name: randomNames[Math.floor(Math.random() * randomNames.length)],
        ip: randomIp,
        status: 'Conectado',
        threat: isThreat ? 'Amenaza detectada' : 'Ninguna',
        blocked: isThreat // Bloqueado automáticamente si hay amenaza
    };
}

// Función para generar una alerta de amenaza
function generateThreatAlert(device) {
    if (device.threat === 'Amenaza detectada') {
        const alert = document.createElement('li');
        alert.textContent = `¡ALERTA! Dispositivo ${device.name} (${device.ip}) detectado con amenaza y bloqueado automáticamente.`;
        threatAlerts.appendChild(alert);
        threatCounter++;
    }
}

// Función para limpiar todos los dispositivos
function clearAllDevices() {
    devices = [];
    renderDeviceTable();
    clearThreatAlerts();
}

// Función para limpiar alertas de amenazas
function clearThreatAlerts() {
    threatAlerts.innerHTML = '';
    threatCounter = 0;
}

// Función para renderizar la tabla de dispositivos
function renderDeviceTable() {
    deviceTableBody.innerHTML = '';

    devices.forEach((device, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${device.name}</td>
            <td>${device.ip}</td>
            <td>${device.status}</td>
            <td>${device.threat}</td>
            <td>
                <button onclick="toggleBlockDevice(${index})">
                    ${device.blocked ? 'Desbloquear' : 'Bloquear'}
                </button>
            </td>
            <td>
                <button onclick="removeDevice(${index})" class="remove-btn">Eliminar</button>
            </td>
        `;

        deviceTableBody.appendChild(row);
    });
}

// Función para bloquear/desbloquear un dispositivo
function toggleBlockDevice(index) {
    const device = devices[index];
    device.blocked = !device.blocked;
    device.status = device.blocked ? 'Bloqueado' : 'Conectado';
    renderDeviceTable();
}

// Función para eliminar un dispositivo individual
function removeDevice(index) {
    const confirmDelete = confirm(
        `¿Estás seguro de que deseas eliminar el dispositivo "${devices[index].name}" (${devices[index].ip})?`
    );
    if (confirmDelete) {
        devices.splice(index, 1);
        renderDeviceTable();
    }
}
document.getElementById('signupForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const role = document.getElementById('signupRole').value; // Nuevo campo para el rol

    // Guardamos el usuario en el localStorage con el rol
    const user = {
        username,
        password,
        email,
        phone,
        role  // Almacenamos el rol
    };

    localStorage.setItem('user', JSON.stringify(user));

    alert('Registro exitoso. Redirigiendo a la página de inicio...');
    window.location.href = 'inicio.html'; // Redirige a la página de inicio
});
document.getElementById('signinForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('signinUsername').value;
    const password = document.getElementById('signinPassword').value;

    const storedUser = JSON.parse(localStorage.getItem('user'));

    if (!storedUser) {
        alert('No hay registros. Por favor, regístrate primero.');
        return;
    }

    if (storedUser.username === username && storedUser.password === password) {
        alert('Inicio de sesión exitoso.');

        // Verifica si el usuario es administrador o usuario
        if (storedUser.role === 'admin') {
            window.location.href = 'admin.html'; // Redirige al administrador
        } else {
            window.location.href = 'usuario.html'; // Redirige al usuario
        }
    } else {
        alert('Nombre de usuario o contraseña incorrectos.');
    }
});
