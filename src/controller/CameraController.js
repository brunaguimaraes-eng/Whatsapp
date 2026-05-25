class CameraController {

    constructor(videoEl) {

        this._videoEl = videoEl;
        navigator.mediaDevices.getUserMedia({
            video:true
        }).then(stream => {

            this._videoEl.srcObject = stream;           //a forma como está no curso está depreciado e foi removido, não é mais utilizado, inserido o comando no padrão atual
            this._videoEl.play();
        }).catch(err=>{
            console.error(err);
        })

    }

    
}