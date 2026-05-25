export class CameraController {

    constructor(videoEl) {

        this._videoEl = videoEl;
        navigator.mediaDevices.getUserMedia({
            video:true
        }).then(stream => {          

            this._stream = stream;
            this._videoEl.srcObject = stream;           //a forma como está no curso está depreciado e foi removido, não é mais utilizado, inserido o comando no padrão atual
            this._videoEl.play();
        }).catch(err=>{
            console.error(err);
        })

    }

    stop(){

        this._stream.getTracks().forEach(track => {
            track.stop();        
        });

    }

    takePicture(mimeType = 'image/png'){

        let canvas = document.createElement('canvas');

        let maxWidth = 400;
        let maxHeight = 400;
        let ratio = Math.min(maxWidth / this._videoEl.videoWidth, maxHeight / this._videoEl.videoHeight);

        canvas.setAttribute('height', this._videoEl.videoHeight * ratio);
    canvas.setAttribute('width', this._videoEl.videoWidth * ratio);

        let context = canvas.getContext('2d');

        context.drawImage(this._videoEl, 0, 0, canvas.width, canvas.height);

        return canvas.toDataURL(mimeType);
    }

    
}