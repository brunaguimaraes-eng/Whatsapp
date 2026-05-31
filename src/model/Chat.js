import { Model } from "./Model";
import { Firebase } from "../util/Firebase.js";
import { db } from "./../util/Firebase.js";
import { collection, doc, getDoc, setDoc, query, where, onSnapshot, getDocs, addDoc } from "firebase/firestore";

export class Chat extends Model {

    constructor() {
        super();
    }

    
    get users() { return this._data.users; }
    set users(value) { this._data.users = value; }

    get timeStamp() { return this._data.timeStamp; }
    set timeStamp(value) { this._data.timeStamp = value; }


    // --- REFERÊNCIA DA COLEÇÃO ---
    static getRef() {
        return collection(db, 'chats');
    }

    static create(meEmail, contactEmail){

        return new Promise((s, f)=>{

            // Monta o objeto de usuários com e-mails em Base64
            let users = {};
            users[btoa(meEmail)] = true;
            users[btoa(contactEmail)] = true;

            addDoc(Chat.getRef(), {
                users,
                timeStamp: new Date()
            }).then(docRef => {
                
                getDoc(docRef).then(chat => {             //documento completo com tudo que tem dentro

                    s(chat);

                }).catch(err => { f(err); });

            }).catch(err => { f(err); });

        });

    }
    //esse bloco valida se existe uma conversa criada com o meu e-mail e o do meu amigo, que estejam registrados ao mesmo tempo
    static find(meEmail, contactEmail){

        return getDocs(
            query(
                Chat.getRef(), 
                where(btoa(meEmail), '==', true), 
                where(btoa(contactEmail), '==', true)
            )
        );

    }

    static createIfNotExists(meEmail, contactEmail){

        return new Promise((s, f)=>{

            Chat.find(meEmail, contactEmail).then(chats => {

                // Se não encontrou nenhum chat ativo no banco...
                if (chats.empty) {

                    // ...chama o método para criar o chat do zero
                    Chat.create(meEmail, contactEmail).then(chat=>{
                        
                        s(chat); // s = Sucesso (devolve o chat criado)

                    });

                } else {

                    // Se encontrou, varre os chats existentes e devolve o ativo
                    chats.forEach(chat=>{
                        s(chat);
                    });

                }

            }).catch(err=>{ f(err) });

        });
    }

}



