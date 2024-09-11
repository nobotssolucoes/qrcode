let selectedDeviceId;
let cameras = [];
let activeCameraIndex = 0;

// Verifica se o navegador suporta o acesso à câmera
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Função para abrir a câmera e mostrar o vídeo
    function startCamera(deviceId) {
        navigator.mediaDevices.getUserMedia({ video: { deviceId: deviceId ? { exact: deviceId } : undefined } })
        .then(function(stream) {
            // Exibe o vídeo da câmera no elemento de vídeo
            const video = document.getElementById('preview');
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.error("Erro ao acessar a câmera: ", err);
        });
    }

    // Obtém a lista de câmeras e inicia a primeira câmera
    navigator.mediaDevices.enumerateDevices()
    .then(function(devices) {
        cameras = devices.filter(device => device.kind === 'videoinput');
        if (cameras.length > 0) {
            selectedDeviceId = cameras[0].deviceId; // Seleciona a primeira câmera
            startCamera(selectedDeviceId);
        } else {
            console.error("Nenhuma câmera encontrada.");
        }
    });

    // Alterna entre câmeras (frontal/traseira)
    document.getElementById('switch-camera').addEventListener('click', function() {
        activeCameraIndex = (activeCameraIndex + 1) % cameras.length; // Alterna entre as câmeras
        selectedDeviceId = cameras[activeCameraIndex].deviceId;
        startCamera(selectedDeviceId); // Reinicia a câmera com o novo ID
    });

} else {
    console.error("Navegador não suporta o acesso à câmera.");
}
