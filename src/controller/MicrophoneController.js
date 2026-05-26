export class MicrophoneController {

    constructor() {
        navigator.mediaDevices.getUserMedia({               //pede permissão para usar o MIC
            audio: true
        }).then(stream => {

            this._stream = stream;
            this._mediaRecorder = new MediaRecorder(stream);           //objeto que sabe gravar o strem
            this._audioChunks = [];                                    //array vazio que vai guardar os pedaços do áudio gravado

            this._mediaRecorder.ondataavailable = e => {          //enquanto grava o mediarecorder vai "despejando" os pedaços do audio, vada pedaço vai sendo empurrado pro array
                this._audioChunks.push(e.data);
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