import { Format } from './../util/Format.js';
import { CameraController } from './CameraController.js';
import { MicrophoneController } from './MicrophoneController.js';
import { DocumentPreviewController } from './DocumentPreviewController.js';
import { db, auth, storage, initAuth, logout, doc, setDoc } from './../util/Firebase.js';
import { onAuthStateChanged } from 'firebase/auth'; // Incluído o observador nativo

export class WhatAppController{

    constructor(){
        
        this._db = db;
        this._auth = auth;
        this._storage = storage;
        this.elementsPrototype();
        this.loadElements();
        this.initEvents();
        this.initAuth();
        
    }   

    initAuth() {
        onAuthStateChanged(this._auth, (user) => {
            if (user) {
                console.log("Usuário autenticado e ativo:", user.displayName);

                // Salvar/Atualizar o usuário no Banco de Dados
                this.saveUserInFirestore(user);
                
                // 1. Remove o botão de login da tela (se ele existir) para não ficar lixo no HTML
                const elementoLogin = document.getElementById('custom-login-container');
                if (elementoLogin) elementoLogin.remove();

                // 2. Mostra o layout do WhatsApp normalmente
                if (this.el.app) this.el.app.show();
                
                // Trata a foto de perfil do Google (com a proteção contra imagem quebrada)
                if (user.photoURL && this.el.myPhoto) {
                    const imgTag = this.el.myPhoto.querySelector('img');
                    if (imgTag) {
                        imgTag.onerror = () => { imgTag.style.display = 'none'; };
                        imgTag.onload = () => { imgTag.style.display = 'block'; };
                        imgTag.src = user.photoURL;
                    }
                }
                
            } else {
                console.log("Nenhum usuário logado. Bloqueando aplicação...");
                
                // 1. Esconde a tela do WhatsApp Clone
                if (this.el.app) this.el.app.hide();
                
                // 2. Cria o botão de login na tela
                if (!document.getElementById('custom-login-container')) {
                    
                    // Cria uma caixinha centralizada na tela
                    const loginContainer = document.createElement('div');
                    loginContainer.id = 'custom-login-container';
                    loginContainer.style.cssText = `
                        position: fixed;
                        top: 0; left: 0; width: 100vw; height: 100vh;
                        background-color: #00bfa5;
                        display: flex; flex-direction: column;
                        justify-content: center; align-items: center;
                        z-index: 99999; font-family: sans-serif;
                    `;

                    // Cria um título bonito
                    const titulo = document.createElement('h1');
                    titulo.innerText = "Bem Vindo!";
                    titulo.style.cssText = "color: white; margin-bottom: 20px;";

                    // Cria o botão de verdade
                    const botaoLogin = document.createElement('button');
                    botaoLogin.innerText = "Conectar com o Google";
                    botaoLogin.style.cssText = `
                        padding: 15px 30px; font-size: 18px; font-weight: bold;
                        background-color: white; color: #00bfa5;
                        border: none; border-radius: 5px; cursor: pointer;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                    `;

                    // Quando clicar NO BOTÃO, aí sim o pop-up do Google aparece!
                    botaoLogin.onclick = () => {
                        initAuth()
                            .then(response => {
                                console.log("Login feito via clique no botão!");
                            })
                            .catch(err => {
                                console.error("Erro ao clicar no botão de login:", err);
                            });
                    };

                    // Monta a tela de login e joga ela no corpo da página
                    loginContainer.appendChild(titulo);
                    loginContainer.appendChild(botaoLogin);
                    document.body.appendChild(loginContainer);
                }
            }
        });
    }

    saveUserInFirestore(user) {
            // Cria uma referência para o documento usando o UID único do usuário do Firebase como ID do documento
            const userRef = doc(this._db, "users", user.uid);

            // Dados que queremos salvar/atualizar
            const userData = {
                name: user.displayName,
                email: user.email,
                photo: user.photoURL,
                updatedAt: new Date() // Guarda o momento do último acesso
            };

            // Salva no Firestore. O { merge: true } garante que não vai sobrescrever outros dados antigos
            setDoc(userRef, userData, { merge: true })
                .then(() => {
                    console.log("Dados do usuário sincronizados com o Firestore com sucesso!");
                })
                .catch(err => {
                    console.error("Erro ao salvar usuário no Firestore:", err);
                });
        }
    

    loadElements(){

        //Criamos um objeto vazio el. Dentro dele que os elementos HTML serão guardados
        this.el = {};

        document.querySelectorAll('[id]').forEach(element =>{         //busca todos os elementos ID no código

            this.el[Format.getCamelCase(element.id)] = element;     //pega o html original e formata em camelCase
        })
        
    }

    elementsPrototype(){

        Element.prototype.hide = function(){
            this.style.display = 'none';
            return this;
        }

        Element.prototype.show = function(){
            this.style.display = 'block';
            return this;
        }

        Element.prototype.toggle = function(){
            this.style.display = (this.style.display === 'none') ? 'block' : 'none'
            return this;
        }

        Element.prototype.on = function(events, fn){
            
            events.split(' ').forEach(event => {
                this.addEventListener(event, fn);
            });
            return this;

        }

        Element.prototype.css = function(styles){

            for (let name in styles) {
                this.style[name] = styles[name];
            }
            return this;
        }

        Element.prototype.addClass = function(name){

            this.classList.add(name);
            return this;
        }

        Element.prototype.removeClass = function(name){

            this.classList.remove(name);
            return this;
        }

        Element.prototype.toggleClass = function(name){

            this.classList.toggle(name);
            return this;
        }

        Element.prototype.hasAttributeClass = function(name){
            return this.classList.contains(name);
        }

        HTMLFormElement.prototype.getForm = function () {

            return new FormData(this);
        }
        
        HTMLFormElement.prototype.toJSON = function () {

            let json = {};

            this.getForm().forEach((value, key) => {

                json[key] = value;

            });

            //return json;

        }


    }

    initEvents(){

        //console.log(this.el);

        this.el.myPhoto.on('click', e => {

            // 1. Se clicar segurando a tecla SHIFT, faz o Logout
            if (e.shiftKey) {
                logout()
                    .then(() => {
                        console.log("Deslogado com sucesso pelo clique com Shift!");
                    })
                    .catch(err => {
                        console.error("Erro ao deslogar:", err);
                    });
                    
                return; // Impede que o código de baixo rode junto
            }

            // 2. Se clicar NORMAL (sem Shift), roda o código original:
            this.closeAllLeftPanel();
            this.el.panelEditProfile.show();
            setTimeout(() => {
                this.el.panelEditProfile.addClass('open');
            }, 300);

        });

            this.el.btnNewContact.on('click', e=>{

                this.closeAllLeftPanel();  
                this.el.panelAddContact.show();      
                setTimeout(() =>{
                    this.el.panelAddContact.addClass('open');
                },300);
                

            });

            this.el.btnClosePanelEditProfile.on('click', e=>{

                this.el.panelEditProfile.removeClass('open');
        
            });    
            
            this.el.btnClosePanelAddContact.on('click', e => {

                this.el.panelAddContact.removeClass('open');

            });

            this.el.photoContainerEditProfile.on('click', e => {

                this.el.inputProfilePhoto.click();

            });

            this.el.inputNamePanelEditProfile.on('keypress', e => {

                if (e.key === 'Enter') {

                    e.preventDefault();
                    this.el.btnSavePanelEditProfile.click();

                }
            });

            this.el.btnSavePanelEditProfile.on('click', e => {

                console.log(this.el.inputNamePanelEditProfile.innerHTML);

            });

            this.el.formPanelAddContact.on('submit', e =>{

                e.preventDefault();

                let formData = new FormData(this.el.formPanelAddContact);

            });

            this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item => {

                item.on('click', e => {

                    this.el.home.hide();
                    this.el.main.css({
                        display: 'flex'
                    });

                });

            });

            this.el.btnAttach.on('click', e => {

                e.stopPropagation();
                this.el.menuAttach.addClass('open');
                document.addEventListener('click', this.closeMenuAttach.bind(this));
            });

            this.el.btnAttachPhoto.on('click', e => {
                
                this.el.inputPhoto.click();

            });

            this.el.inputPhoto.on('change', e => {

                console.log(this.el.inputPhoto.files);

                [...this.el.inputPhoto.files].forEach(file => {
                    console.log(file);
                });

            });

            this.el.btnAttachCamera.on('click', e => {
                
                this.closeAllMainPanel();
                this.el.panelCamera.addClass('open');
                this.el.panelCamera.css({
                    'height': 'calc(100% - 5px)'
                });

                
                this._camera = new CameraController(this.el.videoCamera);


            });

            this.el.btnClosePanelCamera.on('click', e => {

                this.closeAllMainPanel();
                this.el.panelMessagesContainer.show();
                this._camera.stop();
            });

            this.el.btnTakePicture.on('click', e => {
                let dataUrl = this._camera.takePicture();

                this.el.pictureCamera.src = dataUrl;
                this.el.pictureCamera.show();
                this.el.videoCamera.hide();
                this.el.btnReshootPanelCamera.show();
                this.el.containerTakePicture.hide();
                this.el.containerSendPicture.show();
            })

            this.el.btnReshootPanelCamera.on('click', e =>{

                this.el.pictureCamera.hide();
                this.el.videoCamera.show();
                this.el.btnReshootPanelCamera.hide();
                this.el.containerTakePicture.show();
                this.el.containerSendPicture.hide();

            })

            this.el.btnSendPicture.on('click', e => {

                console.log(this.el.pictureCamera.src)

            })

            this.el.btnAttachDocument.on('click', e => {
                
                this.closeAllMainPanel();
                this.el.panelDocumentPreview.addClass('open');
                this.el.panelDocumentPreview.css({
                    'height': 'calc(100% - 120px)'
                });

                this.el.inputDocument.click();
            });

            this.el.inputDocument.on('change', e => {

                if(this.el.inputDocument.files.length){

                this.el.panelDocumentPreview.css({
                    'height': '1%'
                });

                let file = this.el.inputDocument.files[0];
                
                this._documentPreviewController = new DocumentPreviewController(file);

                this._documentPreviewController.getPreviewData().then(result =>{

                    this.el.imgPanelDocumentPreview.src = result.src;
                    this.el.infoPanelDocumentPreview.innerHTML = result.info;
                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();

                    this.el.panelDocumentPreview.css({
                        'height': 'calc(100% - 120px)'
                    });

                }).catch(err =>{

                    this.el.panelDocumentPreview.css({
                        'height': 'calc(100% - 120px)'
                    });
                                    
                    switch (file.type) {

                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-xls';
                        
                        break;
                       
                        case 'application/vnd.ms-powerpoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-ppt';
                        
                        break;

                        case 'application/msword':
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-doc';
                        break;

                        case 'text/plain':
                        break;

                        default:
                            this.el.iconPanelDocumentPreview.className = 'jcxhw icon-doc-generic';

                        break;
                    }

                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.el.imagePanelDocumentPreview.hide();
                    this.el.filePanelDocumentPreview.show();
                });

               } 
                
            })

            this.el.btnClosePanelDocumentPreview.on('click', e => {

                this.closeAllMainPanel();
                this.el.panelMessagesContainer.show();
            })

            this.el.btnSendDocument.on('click', e => {

                console.log('send document');
            })

            this.el.btnAttachContact.on('click', e => {
                
                this.el.modalContacts.show();
            });

            this.el.btnCloseModalContacts.on('click', e =>{
                this.el.modalContacts.hide();
            });

            this.el.btnSendMicrophone.on('click', e =>{
                this.el.recordMicrophone.show();
                this.el.btnSendMicrophone.hide(); 
                
                
                this._microphoneController = new MicrophoneController();

                this._microphoneController.on('ready', musica => {
                    
                    console.log('ready event');

                    this._microphoneController.startRecorder();
                });

                this._microphoneController.on('recordtimer', timer => {

                    this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);

                })

            });

            this.el.btnCancelMicrophone.on('click', e =>{
                this._microphoneController.stopRecorded();
                this.closeRecordMicrophone()
            });

            this.el.btnFinishMicrophone.on('click', e =>{            
                this._microphoneController.stopRecorded();
                this.closeRecordMicrophone()
            });

            this.el.inputText.on('keypress', e =>{

                if(e.key === 'Enter' && !e.ctrlKey) {

                    e.preventDefault();
                    this.el.btnSend.click();

                }
            });


            this.el.inputText.on('keyup', e =>{

                const hasText = this.el.inputText.innerText.trim().length > 0;
                const hasEmoji = this.el.inputText.querySelectorAll('img').length > 0;

                if (hasText || hasEmoji) {

                    this.el.inputPlaceholder.hide();
                    this.el.btnSendMicrophone.hide();
                    this.el.btnSend.show();

                } else {

                    this.el.inputText.innerHTML = "";
                    this.el.inputPlaceholder.show();
                    this.el.btnSend.hide();
                    this.el.btnSendMicrophone.show();
                }

            });

            this.el.btnSend.on('click', e =>{
                console.log( this.el.inputText.innerHTML);
            })

            this.el.btnEmojis.on('click', e =>{
                this.el.panelEmojis.toggleClass('open');
            })

        

        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji => {
           
            emoji.on('click', e =>{

                let img = this.el.imgEmojiDefault.cloneNode();

                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(name =>{
                    img.classList.add(name);
                });

                let cursor = window.getSelection();

                if(!cursor.focusNode || !cursor.focusNode.id == 'input-text'){

                    this.el.inputText.focus();
                    cursor = window.getSelection();
                }

                let range = document.createRange();

                range = cursor.getRangeAt(0);
                range.deleteContents();

                let frag = document.createDocumentFragment();

                frag.appendChild(img);

                range.insertNode(frag);

                range.setStartAfter(img);

                this.el.inputText.dispatchEvent(new Event('keyup'))

            })
            
        });        

    }

    closeRecordMicrophone(){
        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();
        
    }

    closeAllMainPanel(){

        this.el.panelMessagesContainer.hide();
        this.el.panelDocumentPreview.removeClass('open');
        this.el.panelCamera.removeClass('open');

    }

    closeMenuAttach(e){
        document.removeEventListener('click', this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');
    }

    closeAllLeftPanel(){
        this.el.panelAddContact.hide();
        this.el.panelEditProfile.hide();            
    }





}