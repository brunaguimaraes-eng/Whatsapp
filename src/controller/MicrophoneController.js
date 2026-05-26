import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent {

    constructor() {

        super();

        navigator.mediaDevices.getUserMedia({               //pede permissão para usar o MIC
            audio: true
        }).then(stream => {

            this._stream = stream;
            this._mediaRecorder = new MediaRecorder(stream);           //objeto que sabe gravar o stream
            this._audioChunks = [];                                    //array vazio que vai guardar os pedaços do áudio gravado

            this._mediaRecorder.start();

            this._mediaRecorder.onstop = () => {
                let blob = new Blob(this._audioChunks, { type: 'audio/mpeg' });
                let audio = new Audio(URL.createObjectURL(blob));
                this.trigger('play', audio); 
            };

        }).catch(err => {
            console.error(err);
        });
    }

    startRecording() {
        this._audioChunks = [];
        this._mediaRecorder.start();
    }

    stopRecording() {                          //para a gravação, junto tudo num BLOB, converte em URL e resolve a promise com essa URL.
        return new Promise(resolve => {
            this._mediaRecorder.onstop = () => {
                let blob = new Blob(this._audioChunks, { type: 'audio/mpeg' });
                resolve(URL.createObjectURL(blob));
            };
            this._mediaRecorder.stop();
        });
    }

    stop() {
        this._stream.getTracks().forEach(track => track.stop());
    }
}