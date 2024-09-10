let scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
scanner.addListener('scan', function (content) {
    document.getElementById('result').textContent = 'QR Code Detectado: ' + content;
});

Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
        scanner.start(cameras[0]);
    } else {
        alert('Nenhuma câmera encontrada.');
    }
}).catch(function (e) {
    console.error(e);
});