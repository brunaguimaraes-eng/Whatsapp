import { db } from '../util/Firebase';
import { collection, doc, getDoc } from 'firebase/firestore'; 
import { Model } from './Model';

export class User extends Model {

    //O construtor que inicializa os dados e decide se busca pelo ID (e-mail)
    constructor(id) {
        super();
        if (id) this.getById(id);
    }

    get name(){ return this._data.name; }
    set name(value){ this._data.name = value; }

    get email(){ return this._data.email; }
    set email(value){ this._data.email = value; }

    get photo(){ return this._data.photo; }
    set photo(value){ this._data.photo = value; }


    // O método que busca os dados usando a Promise
    getById(id) {
        return new Promise((s, f) => {
            
            User.findByEmail(id).then(docSnapshot => {
                
                if (docSnapshot.exists()) {
                    // Preenche o objeto com os dados vindos do banco
                    this.fromJSON(docSnapshot.data());
                }
                
                s(docSnapshot); // Resolve a promessa com sucesso

            }).catch(err => {
                f(err); // Se der erro, rejeita a promessa
            });

        });
    }

    save() {
        // Buscamos a referência exata do documento deste usuário pelo e-mail dele
        const docRef = doc(User.getRef(), this.email);
            
        // setDoc envia os dados mapeados em JSON. 
        // { merge: true } garante que se o usuário já existir, ele só atualize os campos modificados
        return setDoc(docRef, this.toJSON(), { merge: true });
    }

    //Aponta para a coleção 'users'
    static getRef() {
        return collection(db, 'users');
    }

    // Como o e-mail virou o ID do documento, buscamos direto com o doc() e getDoc()
    static findByEmail(email) {
        const docRef = doc(User.getRef(), email);
        return getDoc(docRef);
    }

}