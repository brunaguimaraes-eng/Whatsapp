import { ClassEvent } from "../util/ClassEvent";

export class MicrophoneController extends ClassEvent {

    constructor() {

    super();

    this._mimeType = 'audio/webm;codecs=opus';

    this._available = false;

    navigator.mediaDevices.getUserMedia({               //pede permissão para usar o MIC
        audio: true
    }).then(stream => {

            this._available = true;
            this._stream = stream;
            this.trigger('ready', this._stream);

        }).catch(err => {
            console.error(err);
        });
    }

    isAvailable(){
        return this._available;
    }

    startRecorder() {
        
        if(this.isAvailable()){

            this._mediaRecorder = new MediaRecorder(this._stream,);

            this._recordedChunks = [];

            this._mediaRecorder.addEventListener('dataavailable', e => {

                if (e.data.size > 0) this._recordedChunks.push(e.data);

            });

            this._mediaRecorder.addEventListener('stop', e =>{

                let blob = new Blob(this._recordedChunks, {
                    type: this._mimeType
                });

                let filename = `rec${Date.now()}.webm`;

                // Instancia o leitor e o decodificador de áudio
                let audioContext = new AudioContext();
                let reader = new FileReader();

                reader.onload = e => {
                    
                    // Decodifica os dados para descobrir a duração do áudio
                    audioContext.decodeAudioData(reader.result).then(decode => {
                        
                        let file = new File([blob], filename, {
                            type: this._mimeType,
                            lastModified: Date.now()
                        });

                        // Cria o metadado que vamos enviar para o Firebase!
                        let metadata = {
                            duration: decode.duration // Pegamos a duração decodificada aqui
                        };

                        this.trigger('recorded', file, metadata);

                    }).catch(err => {
                        console.error("Erro ao decodificar áudio:", err);
                    });
                };

                // Inicia a leitura do arquivo como Array de Bytes (dispara o onload acima)
                reader.readAsArrayBuffer(blob);

            });
            
            this._mediaRecorder.start();
            this.startTimer();

        };
    };

    stopRecorder(){

        if (this.isAvailable()){

            this._mediaRecorder.stop();
            this._stream.getTracks().forEach(track => track.stop());
            this.stopTimer();
        }
    }

    startTimer(){

        let start = Date.now();

        this._recordMicrophoneInterval = setInterval(() => {

            this.trigger('recordtimer', (Date.now() - start));

        }, 100);

    }

    stopTimer(){

        clearInterval(this._recordMicrophoneInterval);

    }

};