import { db } from '../util/Firebase';
import { collection, doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
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
            
            // Criamos a referência exata do documento do usuário
            const docRef = doc(User.getRef(), id);

            //Ligamos a escuta em tempo real
            onSnapshot(docRef, (docSnapshot) => {
                
                if (docSnapshot.exists()) {
                    // Preenche o objeto com os dados novos e dispara o trigger('datachange') automaticamente!
                    this.fromJSON(docSnapshot.data());
                }
                
                s(docSnapshot); // Resolve a promessa na primeira leitura

            }, (error) => {
                f(error); // Se der erro de permissão ou conexão, rejeita a promessa
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

    addContact(contact){                 //adiciona usuários via e-mail(ID)

        // conexão com o banco, coleção principal, ID, subcoleção, ID para base64
        const docRef = doc(db, 'users', this.email, 'contacts', btoa(contact.email));
        //Salvamos os dados em formato de texto
        return setDoc(docRef, contact.toJSON());

    }

    static getContactsRef(id){
        return collection(db, 'users', id, 'contacts');
    }

    getContacts(){                         //coloca a lista de contatos na tela e mantém atualizada
        return new Promise((s, f) => {
            
            const contactsRef = User.getContactsRef(this.email);        //puxa pelo ID
            
            onSnapshot(contactsRef, (docSnapshot) => {
                
                let contacts = [];                              //criamos uma lista vazia

                docSnapshot.forEach(doc => {                    //pega contato por contato como um varredor
                    let data = doc.data();                      //pega os dados como e-mail, foto e nome
                    data.id = doc.id;                           // guarda o ID b64
                    contacts.push(data);                        //joga na tela
                });

                // Dispara o evento para atualizar a tela
                this.trigger('contactschange', docSnapshot);          

                // Devolve a lista preenchida
                s(contacts);

            }, (error) => {
                f(error);
            });

        }); 
    }
  
}