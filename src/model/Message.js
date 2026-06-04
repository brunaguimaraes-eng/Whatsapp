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

    //GERA O BALÃO DE MENSAGEM NA TELA
    getViewElement(me = true) {

        let div = document.createElement('div');
        div.className = 'message';

        switch (this.type) {

            case 'contact':
                div.innerHTML = 
                `<div class="font-style _3DFk6 tail" id="_${this.id}">
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
                <div class="font-style _3DFk6 tail" id="_${this.id}">
                    <span class="tail-container"></span>
                    <span class="tail-container highlight"></span>
                    <div class="Tkt2p">
                        <div class="_3zb-j ZhF0n">
                            <span dir="ltr" class="selectable-text invisible-space message-text">Oi, tudo bem?</span>
                        </div>
                        <div class="_2f-RV">
                            <div class="_1DZAH" role="button">
                                <span class="message-time">${Format.timeStampToTime(this.timeStamp)}</span>
                            </div>
                        </div>
                    </div>
                </div>`;
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

            // Cria o caminho/endereço do arquivo
            const fileRef = ref(storage, `${from}/${Date.now()}_${file.name}`);

            // Inicia o upload task assíncrono
            const uploadTask = uploadBytesResumable(fileRef, file); //upload da imagem, o resumable serve para pausar/retomar/continuar caso tenha oscilação de rede

            uploadTask.on('state_changed', 
                (snapshot) => {
                    console.info('upload', snapshot);
                }, 
                (err) => {
                    console.error(err);
                    f(err);
                }, 
                () => {
                    
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {        //quando o arquivo termina de carregar, mostra na tela

                        // Envia a mensagem salvando a URL gerada no conteúdo!
                        Message.send(chatId, from, 'image', downloadUrl).then(() => {
                            s();
                        }).catch(err => f(err));

                    }).catch(err => f(err));
                }
            );

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
                    // 🚀 CORREÇÃO CIRÚRGICA: Resolvemos devolvendo direto o snapshot estável!
                    s(uploadTask.snapshot);
                }
            );

        });
    }

    static sendImage(chatId, from, file) {
        return new Promise((s, f) => {

            //Executa o upload genérico (que devolve a tarefa de upload)
            Message.upload(file, from).then((uploadTask) => {

                //Extrai a URL estável do Firebase Moderno usando a referência do snapshot
                getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {

                    // Grava no banco de dados Firestore
                    Message.send(
                        chatId,
                        from,
                        'image',
                        downloadUrl // Aqui entra a URL que traduz o 'snapshot.downloadURL'
                    ).then(() => {
                        s();
                    }).catch(err => f(err));

                }).catch(err => f(err));

            }).catch(err => f(err));

        });
    }

    static sendDocument(chatId, from, file, filePreview = null, filenameText = '') {
        return new Promise((s, f) => {

            // Cria a mensagem inicial do tipo 'document'
            Message.send(chatId, from, 'document', '').then((msgRef) => {

                // Faz o upload do arquivo real (PDF, TXT, etc)
                Message.upload(file, from).then((snapshot1) => {

                    // 🚀 CORREÇÃO CIRÚRGICA: Lemos a referência direto do snapshot resolvido
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
                            // Se NÃO for PDF (não tem preview), salva direto os metadados básicos
                            setDoc(msgRef, docData, { merge: true }).then(() => s()).catch(err => f(err));
                        }

                    }).catch(err => f(err));
                }).catch(err => f(err));
            }).catch(err => f(err));
        });
    }




}