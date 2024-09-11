const codeReader = new ZXing.BrowserMultiFormatReader();
let selectedDeviceId;
let cameras = [];
let activeCameraIndex = 0;

// Função para listar as câmeras disponíveis e iniciar a leitura
function startCamera() {
    codeReader.getVideoInputDevices().then((videoInputDevices) => {
        cameras = videoInputDevices;

        if (cameras.length > 0) {
            selectedDeviceId = cameras[activeCameraIndex].deviceId;
            startDecoding(selectedDeviceId);
        } else {
            alert('Nenhuma câmera encontrada.');
        }
    }).catch((err) => {
        console.error(err);
    });
}

// Função para iniciar a decodificação do vídeo
function startDecoding(deviceId) {
    codeReader.decodeFromVideoDevice(deviceId, 'preview', (result, err) => {
        if (result) {
            document.getElementById('result').textContent = `Código detectado: ${result.text}`;
        }
        if (err && !(err instanceof ZXing.NotFoundException)) {
            console.error(err);
        }
    });
}

// Função para alternar entre câmeras (frontal/traseira)
document.getElementById('switch-camera').addEventListener('click', function() {
    activeCameraIndex = (activeCameraIndex + 1) % cameras.length;
    codeReader.reset(); // Reseta o decodificador antes de alternar
    startDecoding(cameras[activeCameraIndex].deviceId);
});

// Inicia a câmera ao carregar a página
window.addEventListener('load', startCamera);
