let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
let cameras = [];
let activeCameraIndex = 0;
let stream;
let flashOn = false;

// Inicializa as câmeras
Instascan.Camera.getCameras().then(function (availableCameras) {
    cameras = availableCameras;
    if (cameras.length > 0) {
        startCamera(cameras[activeCameraIndex]);
    } else {
        alert('Nenhuma câmera encontrada.');
    }
}).catch(function (e) {
    console.error(e);
});

// Função para iniciar a câmera selecionada
function startCamera(camera) {
    scanner.start(camera).then(function(s) {
        stream = s;
        const videoElement = document.getElementById('preview');

        // Verifica se a câmera é frontal ou traseira
        if (camera.name.toLowerCase().includes('front')) {
            // Câmera frontal: aplicar espelhamento e desativar flash
            videoElement.style.transform = 'scaleX(-1)';
            disableFlashButton();  // Desabilita o botão de flash para câmeras frontais
        } else {
            // Câmera traseira: não aplicar espelhamento e ativar flash
            videoElement.style.transform = 'none';
            checkFlashSupport();   // Verifica se a câmera traseira suporta o flash
        }
    });
}

// Alterna entre câmera frontal e traseira
document.getElementById('switch-camera').addEventListener('click', function() {
    activeCameraIndex = (activeCameraIndex + 1) % cameras.length;
    startCamera(cameras[activeCameraIndex]);
});

// Função para habilitar o botão de flash
function enableFlashButton() {
    const flashButton = document.getElementById('toggle-flash');
    flashButton.disabled = false;
}

// Função para desabilitar o botão de flash
function disableFlashButton() {
    const flashButton = document.getElementById('toggle-flash');
    flashButton.disabled = true;
}

// Verifica se o dispositivo suporta flash
function checkFlashSupport() {
    if (stream) {
        let track = stream.getVideoTracks()[0];
        let capabilities = track.getCapabilities();

        if (capabilities.torch) {
            enableFlashButton(); // Habilita o controle de flash se suportado
        } else {
            disableFlashButton(); // Desabilita o controle de flash se não for suportado
            alert('Este dispositivo não suporta o uso de flash.');
        }
    }
}

// Função para ativar/desativar o flash
document.getElementById('toggle-flash').addEventListener('click', function() {
    const flashIcon = document.getElementById('flash-icon');
    
    if (stream) {
        let track = stream.getVideoTracks()[0];
        let capabilities = track.getCapabilities();

        if (capabilities.torch) { // Verifica se o dispositivo suporta o modo torch (flash)
            let torchStatus = track.getSettings().torch || false;
            track.applyConstraints({
                advanced: [{torch: !torchStatus}]
            });
            flashOn = !flashOn; // Atualiza o status do flash

            // Alterna entre os ícones de flash
            if (flashOn) {
                flashIcon.src = 'https://xrjtjebxxpctygsnjcnr.supabase.co/storage/v1/object/public/icones/flash-on.svg?t=2024-09-11T13%3A21%3A08.716Z';
            } else {
                flashIcon.src = 'https://xrjtjebxxpctygsnjcnr.supabase.co/storage/v1/object/public/icones/flash-off.svg?t=2024-09-11T13%3A21%3A26.071Z';
            }
        } else {
            alert('Este dispositivo não suporta o uso de flash.');
        }
    } else {
        alert('Nenhuma câmera ativa no momento.');
    }
});

// Quando um QR Code for detectado, o conteúdo será mostrado
scanner.addListener('scan', function (content) {
    document.getElementById('result').textContent = 'QR Code Detectado: ' + content;
});
