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
        const videoElement = document.getElementById('preview');

        // Verifica se a câmera é frontal ou traseira
        if (camera.name.toLowerCase().includes('front')) {
            // Câmera frontal: aplicar espelhamento
            videoElement.style.transform = 'scaleX(-1)';
        } else {
            // Câmera traseira: não aplicar espelhamento
            videoElement.style.transform = 'none';
        }
    });
}

// Alterna entre câmera frontal e traseira
document.getElementById('switch-camera').addEventListener('click', function() {
    activeCameraIndex = (activeCameraIndex + 1) % cameras.length;
    startCamera(cameras[activeCameraIndex]);
});

// Quando um QR Code for detectado, o conteúdo será mostrado
scanner.addListener('scan', function (content) {
    document.getElementById('result').textContent = 'QR Code Detectado: ' + content;
});
