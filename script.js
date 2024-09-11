let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
let cameras = [];
let activeCameraIndex = 0;
let stream;

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
        adjustVideoForCamera(camera);
    });
}

// Função para alternar entre as câmeras
document.getElementById('switch-camera').addEventListener('click', function() {
    activeCameraIndex = (activeCameraIndex + 1) % cameras.length;
    startCamera(cameras[activeCameraIndex]);
});

// Ajusta o vídeo para espelhar ou não, dependendo da câmera
function adjustVideoForCamera(camera) {
    const videoElement = document.getElementById('preview');
    
    if (camera.name.includes('back')) {
        // Câmera traseira: remover espelhamento
        videoElement.style.transform = 'none';
    } else {
        // Câmera frontal: aplicar espelhamento
        videoElement.style.transform = 'scaleX(-1)';
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

            // Alterna entre os ícones de flash
            if (!torchStatus) {
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
