//Imports das Bibliotecas Oficiais do Firebase (Nativas)
import { collection, addDoc, doc, setDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//Utilitários Locais
import { db, storage } from "./../util/Firebase.js";
import { Format } from "./../util/Format.js";

//Classe Base (Model)
import { Model } from "./Model";


export class Message extends Model {

    constructor() {
        super();
    }

    get content() { return this._data.content; }
    set content(value) { this._data.content = value; }

    get type() { return this._data.type; }
    set type(value) { this._data.type = value; }

    get timeStamp() { return this._data.timeStamp; }
    set timeStamp(value) { this._data.timeStamp = value; }

    get status() { return this._data.status; }
    set status(value) { this._data.status = value; }

    get id() { return this._data.id; }
    set id(value) { this._data.id = value; }

    get preview() { return this._data.preview; }
    set preview(value) { this._data.preview = value; }

    get info() { return this._data.info; }
    set info(value) { this._data.info = value; }

    get fileType() { return this._data.fileType; }
    set fileType(value) { this._data.fileType = value; }

    get size() { return this._data.size; }
    set size(value) { this._data.size = value; }

    get from() { return this._data.from; }
    set from(value) { this._data.from = value; }

    get filename() { return this._data.filename; }
    set filename(value) { this._data.filename = value; }

    get photo() { return this._data.photo; }
    set photo(value) { this._data.photo = value; }

    get duration() { return this._data.duration; }
    set duration(value) { this._data.duration = value; }

    //GERA O BALÃO DE MENSAGEM NA TELA
    getViewElement(me = true) {

        let div = document.createElement('div');
        div.className = 'message';

        switch (this.type) {

            case 'contact':

                div.innerHTML = `
                <div class="_3_7SH _1ZPgd" id="_${this.id}">
                    <div class="_1fnMt _2CORf" style="padding: 10px 10px 5px 10px; min-width: 250px;">
                        
                        <div style="display: flex; align-items: center; margin-bottom: 12px; width: 100%;">
                            
                            <div style="width: 45px; height: 45px; border-radius: 50%; overflow: hidden; background-color: #dfe5e7; margin-right: 15px; flex-shrink: 0; position: relative;">
                                <img src="#" class="photo-contact-sended" style="width: 100%; height: 100%; object-fit: cover; display: none;">
                                <div class="_3ZW2E" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                                    <span data-icon="default-user">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="100%" height="100%">
                                            <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                                            <g fill="#FFF">
                                                <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                                                </g>
                                            </svg>
                                        </span>
                                    </div>
                                </div>
                                
                                <div style="flex-grow: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 16px; color: #111;">
                                    ${this.content.name || 'Contato'}
                                </div>
                                
                            </div>

                            <div style="border-top: 1px solid rgba(0,0,0,0.06); padding-top: 10px; text-align: center;">
                                <span class="btn-message-send" role="button" style="color: #009688; font-size: 14.5px; font-weight: 500; cursor: pointer;">
                                    Enviar mensagem
                                </span>
                            </div>

                            <div style="display: flex; justify-content: flex-end; align-items: center; margin-top: 4px;">
                                <span class="message-time" style="font-size: 11px; color: rgba(0, 0, 0, 0.45); margin-right: 4px;">${Format.timeStampToTime(this.timeStamp)}</span>
                            </div>
                        </div>

                        <div class="_3S8Q-" role="button">
                            <span data-icon="forward-chat">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="25" height="25">
                                    <path fill="#FFF" d="M14.2 9.5V6.1l5.9 5.9-5.9 6v-3.5c-4.2 0-7.2 1.4-9.3 4.3.8-4.2 3.4-8.4 9.3-9.3z"></path>
                                </svg>
                            </span>
                        </div>
                    </div>`;

                if (this.content && this.content.photo) {
                    let img = div.querySelector('.photo-contact-sended');
                    if (img) {
                        img.src = this.content.photo;
                        img.style.display = 'block';
                        
                        let defaultAvatar = div.querySelector('._3ZW2E');
                        if (defaultAvatar) defaultAvatar.style.display = 'none';
                    }
                }

                let btnSend = div.querySelector('.btn-message-send');
                if (btnSend) {
                    btnSend.addEventListener('click', e => {
                        console.info('Enviar mensagem para:', this.content.name);
                    });
                }

            break;

            case 'image':
                div.innerHTML = `    
                <div class="_3_7SH _3qMSo" id="_${this.id}">
                    <div class="KYpDv">
                        <div>
                            <div class="_3v3PK" style="width: 330px; height: 330px;">
                                <div class="_34Olu" style="display:none;"> <div class="_2BzIU">
                                        <div class="_2X3l6">
                                            <svg class="_1UDDE" width="50" height="50" viewBox="0 0 43 43">
                                                <circle class="_3GbTq _2wGBy" cx="21.5" cy="21.5" r="20" fill="none" stroke-width="3"></circle>
                                            </svg>
                                        </div>
                                        <div class="_1l3ap">
                                            <span data-icon="media-disabled" class="">
                                                <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 44" width="44" height="44">
                                                    <path fill="#FFF" fill-opacity=".4" d="M29.377 16.099l-1.475-1.475L22 20.525l-5.901-5.901-1.476 1.475L20.525 22l-5.901 5.901 1.476 1.475 5.9-5.901 5.901 5.901 1.475-1.475L23.475 22l5.902-5.901z"></path>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <img src="${this.content}" class="_1JVSX message-photo" style="width: 100%;">
                                <div class="_1i3Za"></div>
                            </div>                        
                            <div class="_2TvOE">
                                <div class="_1DZAH text-white" role="button">
                                    <span class="message-time">${Format.timeStampToTime(this.timeStamp)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="_3S8Q-" role="button">
                        <span data-icon="forward-chat">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" width="25" height="25">
                                <path fill="#FFF" d="M14.2 9.5V6.1l5.9 5.9-5.9 6v-3.5c-4.2 0-7.2 1.4-9.3 4.3.8-4.2 3.4-8.4 9.3-9.3z"></path>
                            </svg>
                        </span>
                    </div>
                </div>`;

                //Escuta o evento de carregamento da imagem
                div.querySelector('.message-photo').addEventListener('load', e => {

                    div.querySelector('.message-photo').style.display = 'block';

                    let loadingEl = div.querySelector('._34Olu');
                    if (loadingEl) loadingEl.style.display = 'none';

                    let containerEl = div.querySelector('._3v3PK');
                    if (containerEl) containerEl.style.height = 'auto';

                });
            break;

            case 'document':
                // 🔍 Coleta os metadados vindos do banco de dados (Firestore)
                let docPreview = this._data.preview || this.preview || '';
                let docFilename = this._data.filename || this._data.name || this._data.fileName || this.filename || this.name || 'Arquivo.pdf';
                let docFileType = this._data.fileType || this._data.type || this.fileType || 'PDF';
                let docSize = this._data.size || this.size || 0;

                // Transforma o tamanho em KB ou MB legível
                let displaySize = '';
                if (docSize > 0) {
                    displaySize = docSize > 1024 * 1024 ? 
                        (docSize / (1024 * 1024)).toFixed(1) + ' MB' : 
                        (docSize / 1024).toFixed(0) + ' KB';
                }

                div.innerHTML = 
                `<div class="_3_7SH _1ZPgd" id="_${this.id}">
                    <div class="_1fnMt _2CORf">
                        <a class="_1vKRe" href="${this.content}" target="_blank">
                            <div class="_2jTyA" style="background-image: url(${docPreview}); display: ${docPreview ? 'block' : 'none'}; height: 150px; background-size: cover; background-position: center;"></div>
                            
                            <div class="_12xX7">
                                <div class="_3eW69">
                                    <div class="JdzFp message-file-icon icon-doc-pdf"></div>
                                </div>
                                <div class="nxILt">
                                    <span dir="auto" class="message-filename">${docFilename}</span>
                                </div>
                                <div class="_17viz">
                                    <span data-icon="audio-download" class="message-file-download">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                            <path fill="#919191" d="M12 15.5l4.5-4.5h-3.5V5h-2v6H7.5l4.5 4.5zM5 17h14v2H5v-2z"></path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </a>
                        <div class="_3cMIj">
                            <span class="PyPig message-file-info"></span>
                            <span class="PyPig message-file-type">${docFileType.includes('/') ? docFileType.split('/')[1].toUpperCase() : docFileType.toUpperCase()}</span>
                            <span class="PyPig message-file-size">${displaySize || '4 MB'}</span>
                        </div>
                        <div class="_3Lj_s">
                            <div class="_1DZAH" role="button">
                                <span class="message-time">${Format.timeStampToTime(this.timeStamp)}</span>                                
                            </div>
                        </div>
                    </div>
                </div>`;
            break;

            case 'audio':
                div.innerHTML = `                
                <div class="_3_7SH _1ZPgd ${me ? 'message-out' : 'message-in'}" id="_${this.id}" style="margin-bottom: 6px; display: flex; flex-direction: column; max-width: 360px;">
                    
                    <div class="_1QMEq _1kZiz fS1bA" style="display: flex; align-items: center; padding: 12px 14px 4px 14px; gap: 10px; min-width: 310px;">
                        
                        <div class="_2fuJy" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                            <div class="_1WliW" style="height: 40px; width: 40px; position: relative; display: flex; align-items: center; justify-content: center;">
                                <img src="#" class="Qgzj8 gqwaM message-photo" style="display:none; width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">
                                <div class="_3ZW2E" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                                    <span data-icon="default-user">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="40" height="40">
                                            <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                                        </svg>
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div class="E5U9C" style="position: relative; width: 34px; height: 34px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                            <svg class="_1UDDE audio-load" width="34" height="34" viewBox="0 0 43 43" style="position: absolute; display: none;">
                                <circle class="_3GbTq _37WZ9" cx="21.5" cy="21.5" r="20" fill="none" stroke="${me ? '#00af9c' : '#51b695'}" stroke-width="3"></circle>
                            </svg>
                            
                            <button class="_2pQE3 audio-play" style="background: transparent; border: none; padding: 0; cursor: pointer; position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; outline: none;">
                                <span data-icon="audio-play">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" width="28" height="28">
                                        <path fill="rgba(0, 0, 0, 0.4)" d="M8.5 8.7c0-1.7 1.2-2.4 2.6-1.5l14 8.7c1.4.9 1.4 2.3 0 3.2l-14 8.7c-1.4.9-2.6.2-2.6-1.5V8.7z"></path>
                                    </svg>
                                </span>
                            </button>
                            
                            <button class="_2pQE3 audio-pause" style="background: transparent; border: none; padding: 0; cursor: pointer; position: absolute; width: 100%; height: 100%; display: none; align-items: center; justify-content: center; outline: none;">
                                <span data-icon="audio-pause">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 34 34" width="28" height="28">
                                        <path fill="${me ? '#00af9c' : '#51b695'}" d="M9.2 25c0 .5.4 1 .9 1h3.6c.5 0 .9-.5.9-1V9c0-.5-.4-1-.9-1h-3.6c-.5 0-.9.5-.9 1v16zm10.2 0c0 .5.4 1 .9 1h3.6c.5 0 .9-.5.9-1V9c0-.5-.4-1-.9-1h-3.6c-.5 0-.9.5-.9 1v16z"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>

                        <div class="_1_Gu6" style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px; justify-content: center; margin-left: -6px; margin-right: 6px;">
                            <div class="_1sLSi" style="width: 100%; height: 4px; background: rgba(0, 0, 0, 0.08); border-radius: 2px; position: relative;">
                                <span class="nDKsM" style="width: 0%; height: 100%; background: ${me ? '#00af9c' : '#51b695'}; border-radius: 2px; display: block; position: absolute; left: 0; top: 0;"></span>
                                <input type="range" min="0" max="100" value="0" class="_3geJ8" style="position: absolute; top: -6px; left: 0; width: 100%; height: 16px; opacity: 0; cursor: pointer; margin: 0;">
                                <audio src="${this.content}" preload="auto"></audio>
                            </div>

                            <div class="message-audio-duration" style="font-size: 11px; color: rgba(0, 0, 0, 0.45); line-height: 1;">0:00</div>
                        </div>

                        <div class="audio-speed-container" style="flex-shrink: 0; display: flex; align-items: center;">
                            <button class="audio-speed-btn" style="background: rgba(0, 0, 0, 0.05); border: none; border-radius: 12px; padding: 3px 6px; cursor: pointer; font-size: 10px; font-weight: bold; color: rgba(0, 0, 0, 0.5); outline: none;">1.0×</button>
                        </div>

                        <div class="_1mbqw" style="flex-shrink: 0; display: flex; align-items: center; justify-content: center;">
                            <div class="QnDup" style="display: flex; align-items: center;">
                                <span data-icon="ptt-out-blue">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19 26" width="16" height="22">
                                        <path fill="${me ? '#03A9F4' : '#a0a0a0'}" d="M9.217 24.401c-1.158 0-2.1-.941-2.1-2.1v-2.366c-3.111-.476-5.467-3.159-5.467-6.402v-1.748h1.4v1.748c0 3.143 2.557 5.7 5.7 5.7s5.7-2.557 5.7-5.7v-1.748h1.4v1.748c0 3.243-2.356 5.926-5.467 6.402v2.366c0 1.159-.942 2.1-2.1 2.1z"></path>
                                        <path fill="${me ? '#03A9F4' : '#a0a0a0'}" d="M9.367 15.668a2.765 2.765 0 0 0 2.765-2.765V5.26a2.765 2.765 0 0 0-5.53 0v7.643a2.765 2.765 0 0 0 2.765 2.765z"></path>
                                    </svg>
                                </span>
                            </div>
                        </div>

                    </div>

                    <div style="display: flex; justify-content: flex-end; align-items: center; padding: 0 12px 6px 0; gap: 4px; margin-top: -2px;">
                        <span class="message-time" style="font-size: 11px; color: rgba(0, 0, 0, 0.4); text-align: right;">${Format.timeStampToTime(this.timeStamp)}</span>
                        ${me ? `
                        <div class="_3S8Q-" role="button" style="display: flex; align-items: center;">
                            <span data-icon="status-dblcheck">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="15" height="15">
                                    <path fill="#4fc3f7" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                                </svg>
                            </span>
                        </div>
                        ` : ''}
                    </div>

                </div>`;

                // 🎙️ SELETORES DO JAVASCRIPT
                let audioEl = div.querySelector('audio');
                let loadEl = div.querySelector('.audio-load');
                let btnPlay = div.querySelector('.audio-play');
                let btnPause = div.querySelector('.audio-pause');
                let inputRange = div.querySelector('[type=range]');
                let audioDuration = div.querySelector('.message-audio-duration');
                let progressSpan = div.querySelector('.nDKsM');
                let btnSpeed = div.querySelector('.audio-speed-btn'); // <-- Seleciona o botão novo

                if (this.duration) {
                    audioDuration.innerHTML = Format.toTime(this.duration * 1000);
                }

                if (this.photo) {
                    let img = div.querySelector('.message-photo');
                    if (img) {
                        img.src = this.photo;
                        img.show();
                    }
                    let avatarPadrao = div.querySelector('._3ZW2E');
                    if (avatarPadrao) avatarPadrao.hide();
                }

                // --- OUVINTES DO CONTROLADOR DE ÁUDIO ---
                audioEl.onloadeddata = e => {
                    loadEl.hide();
                    btnPlay.show();
                };

                audioEl.onplay = e => {
                    btnPlay.hide();
                    btnPause.show();
                };

                audioEl.onpause = e => {
                    btnPlay.show();
                    btnPause.hide();
                };

                audioEl.onended = e => {
                    audioEl.currentTime = 0;
                    btnPlay.show();
                    btnPause.hide();
                    if (progressSpan) progressSpan.style.width = '0%';
                    if (inputRange) inputRange.value = 0;
                };

                audioEl.ontimeupdate = e => {
                    audioDuration.innerHTML = Format.toTime(audioEl.currentTime * 1000);
                    if (this.duration) {
                        let pct = (audioEl.currentTime * 100) / this.duration;
                        inputRange.value = pct;
                        if (progressSpan) progressSpan.style.width = `${pct}%`;
                    }
                };

                btnPlay.on('click', e => {
                    audioEl.play();
                });

                btnPause.on('click', e => {
                    audioEl.pause();
                });

                inputRange.on('change', e => {
                    if (this.duration) {
                        audioEl.currentTime = (inputRange.value * this.duration) / 100;
                    }
                });

                // 👇 ⚡ LÓGICA DO ACELERADOR DE ÁUDIO
                if (btnSpeed) {
                    btnSpeed.on('click', () => {
                        if (audioEl.playbackRate === 1.0) {
                            audioEl.playbackRate = 1.5;
                            btnSpeed.innerHTML = '1.5×';
                            btnSpeed.style.background = me ? 'rgba(0, 175, 156, 0.15)' : 'rgba(81, 182, 149, 0.15)';
                            btnSpeed.style.color = me ? '#00af9c' : '#51b695';
                        } else if (audioEl.playbackRate === 1.5) {
                            audioEl.playbackRate = 2.0;
                            btnSpeed.innerHTML = '2.0×';
                        } else {
                            audioEl.playbackRate = 1.0;
                            btnSpeed.innerHTML = '1.0×';
                            btnSpeed.style.background = 'rgba(0, 0, 0, 0.05)';
                            btnSpeed.style.color = 'rgba(0, 0, 0, 0.5)';
                        }
                    });
                }

            break;

            default:
                div.innerHTML = `                
                <div class="font-style _3DFk6 tail" id="_${this.id}">
                    <span class="tail-container"></span>
                    <span class="tail-container highlight"></span>
                    <div class="Tkt2p">
                        <div class="_3zb-j ZhF0n">
                            <span dir="ltr" class="selectable-text invisible-space message-text">${this.content}</span>
                        </div>
                        <div class="_2f-RV">
                            <div class="_1DZAH" role="button">
                                <span class="message-time">${Format.timeStampToTime(this.timeStamp)}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
            break;
        }

        let className = (me) ? 'message-out' : 'message-in';

        // Injeta o status ao lado do horário se a mensagem for minha
        if (me) {
            let timeEl = div.querySelector('.message-time');
            if (timeEl) {
                timeEl.parentElement.appendChild(this.getStatusViewElement());
            }
        }

        div.firstElementChild.classList.add(className);
        return div;
    }

    // GERA DINAMICAMENTE O ÍCONE DO STATUS (Relógio, Check, etc.)
    getStatusViewElement() {

        let div = document.createElement('div');
        div.className = 'message-status';

        switch (this.status) {

            case 'wait':
                div.innerHTML = `
                    <span data-icon="msg-time">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15">
                            <path fill="#859479" d="M9.75 7.713H8.244V5.359a.5.5 0 0 0-.5-.5H7.65a.5.5 0 0 0-.5.5v2.947a.5.5 0 0 0 .5.5h.094l.003-.001.003.002h2a.5.5 0 0 0 .5-.5v-.094a.5.5 0 0 0-.5-.5zm0-5.263h-3.5c-1.82 0-3.3 1.48-3.3 3.3v3.5c0 1.82 1.48 3.3 3.3 3.3h3.5c1.82 0 3.3-1.48 3.3-3.3v-3.5c0-1.82-1.48-3.3-3.3-3.3zm2 6.8a2 2 0 0 1-2 2h-3.5a2 2 0 0 1-2-2v-3.5a2 2 0 0 1 2-2h3.5a2 2 0 0 1 2 2v3.5z"></path>
                        </svg>
                    </span>`;
            break;

            case 'sent':
                div.innerHTML = `
                    <span data-icon="msg-check-light">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15">
                            <path fill="#92A58C" d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                        </svg>
                    </span>`;
            break;

            case 'received':
                div.innerHTML = `
                    <span data-icon="msg-dblcheck">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15">
                            <path fill="#92A58C" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                        </svg>
                    </span>`;
            break;

            case 'read':
                div.innerHTML = `
                    <span data-icon="msg-dblcheck-ack">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 15" width="16" height="15">
                            <path fill="#4FC3F7" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                        </svg>
                    </span>`;
            break;
        }

        return div;
    }
    
    // COMUNICAÇÃO DO BANCO DE DADOS 
    static getRef(chatId){
        return collection(db, 'chats', chatId, 'messages');
    }

    static send(chatId, from, type, content) {
        return new Promise((s, f) => {
            const messagesRef = Message.getRef(chatId);

            addDoc(messagesRef, {
                from: from,
                type: type,
                content: content,
                timeStamp: new Date(),
                status: 'wait'
            }).then((result) => {
                const docRef = doc(messagesRef, result.id);

                setDoc(docRef, {
                    status: 'sent'
                }, { merge: true }).then(() => {
                    s(docRef); 
                }).catch(err => f(err));
            }).catch(err => f(err));
        });
    }

    static sendImage(chatId, from, file) {
        return new Promise((s, f) => {

            // Executa o upload genérico (que devolve o snapshot estável)
            Message.upload(file, from).then((snapshot) => {

                // 🚀 CORREÇÃO: Lemos .ref direto do snapshot retornado!
                getDownloadURL(snapshot.ref).then((downloadUrl) => {

                    // Grava no banco de dados Firestore
                    Message.send(
                        chatId,
                        from,
                        'image',
                        downloadUrl
                    ).then(() => {
                        s();
                    }).catch(err => f(err));

                }).catch(err => f(err));

            }).catch(err => f(err));

        });
    }

    static upload(file, from) {
        return new Promise((s, f) => {

            // Cria a referência na nuvem usando a sintaxe modular
            const fileRef = ref(storage, `${from}/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(fileRef, file);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    console.info('upload:', snapshot);
                }, 
                (err) => {
                    console.error(err);
                    f(err);
                }, 
                () => {
                    // Devolve direto o snapshot estável e resolvido
                    s(uploadTask.snapshot);
                }
            );

        });
    }

    static sendImage(chatId, from, file) {
        return new Promise((s, f) => {

            Message.upload(file, from).then((snapshot) => {

                getDownloadURL(snapshot.ref).then((downloadUrl) => {

                    // Grava no banco de dados Firestore
                    Message.send(
                        chatId,
                        from,
                        'image',
                        downloadUrl
                    ).then(() => {
                        s();
                    }).catch(err => f(err));

                }).catch(err => f(err));

            }).catch(err => f(err));

        });
    }

    static sendContact(chatId, from, contact){

        return Message.send(chatId, from, 'contact', contact);


    }

    static sendDocument(chatId, from, file, filePreview = null, filenameText = '') {
        return new Promise((s, f) => {

            // Cria a mensagem inicial do tipo 'document'
            Message.send(chatId, from, 'document', '').then((msgRef) => {

                // Faz o upload do arquivo real (PDF, TXT, etc)
                Message.upload(file, from).then((snapshot1) => {

                    getDownloadURL(snapshot1.ref).then((downloadFile) => {

                        // Criamos o objeto base de metadados para salvar no Firestore
                        let docData = {
                            content: downloadFile,
                            filename: filenameText || file.name,
                            size: file.size,
                            fileType: file.type,
                            status: 'sent'
                        };

                        // Se for um PDF (ou seja, se tiver um arquivo de preview), faz o upload dele também
                        if (filePreview) {
                            Message.upload(filePreview, from).then((snapshot2) => {

                                getDownloadURL(snapshot2.ref).then((downloadPreview) => {
                                    
                                    // Adiciona o link do preview ao objeto
                                    docData.preview = downloadPreview;

                                    // Salva tudo com o setDoc moderno do Firebase v9+
                                    setDoc(msgRef, docData, { merge: true }).then(() => s()).catch(err => f(err));

                                }).catch(err => f(err));
                            }).catch(err => f(err));

                        } else {
                            // Se NÃO for PDF (not tem preview), salva direto os metadados básicos
                            setDoc(msgRef, docData, { merge: true }).then(() => s()).catch(err => f(err));
                        }

                    }).catch(err => f(err));
                }).catch(err => f(err));
            }).catch(err => f(err));
        });
    }

    static sendAudio(chatId, from, file, metadata, photo) {
        return new Promise((resolve, reject) => {
            
            // Cria o balão de mensagem no banco (ainda sem o áudio, só para aparecer na tela rápido)
            Message.send(chatId, from, 'audio', '').then(msgRef => {
                
                //Faz o upload do arquivo físico de áudio para o Firebase Storage
                Message.upload(file, from).then(snapshot => {
                    
                    //Pega a URL pública gerada pelo Storage
                    getDownloadURL(snapshot.ref).then(downloadUrl => {
                        
                        //Atualiza a mensagem que criamos no passo 1 com os dados completos
                        setDoc(msgRef, {
                            content: downloadUrl,
                            size: file.size,
                            fileType: file.type,
                            status: 'sent',
                            photo: photo,
                            duration: metadata.duration
                        }, { merge: true }).then(() => {
                            
                            resolve(); // Sucesso!
                            
                        }).catch(err => reject(err));
                        
                    }).catch(err => reject(err));
                    
                }).catch(err => reject(err));
                
            }).catch(err => reject(err));
            
        });
    }




}