import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';

export class Firebase {

    constructor(){

        this._config = {
            apiKey: "AIzaSyDfjsf7GQsLOqjTmPHHFPDxuTVmDcEwLOs",
            authDomain: "whatsapp-hcode.firebaseapp.com",
            projectId: "whatsapp-hcode",
            storageBucket: "whatsapp-hcode.firebasestorage.app",
            messagingSenderId: "124790784670",
            appId: "1:124790784670:web:ca8cc455b6104200db718f"
        }

        this.init();
    }

    init(){
        
        if(!this._initialize){
            firebase.initializeApp(this._config);
            this._initialize = true;
        }
    }

    static db(){
        return firebase.firestore();
    }

    static hd(){
        return firebase.storage();
    }
}