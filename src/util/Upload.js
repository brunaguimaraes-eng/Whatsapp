import { ref, uploadBytesResumable } from 'firebase/storage';
import { storage } from './../util/Firebase.js'; 

export class Upload {

    static send(file, from) {
        return new Promise((resolve, reject) => {
            
            //Criamos a referência no Storage usando a crase
            const storageRef = ref(storage, `${from}/${Date.now()}_${file.name}`);
            
            // Inicializa a tarefa de upload
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    console.info('upload', snapshot);
                }, 
                (err) => {
                    reject(err);
                }, 
                () => {
                    // Quando o upload termina, devolvemos o snapshot para o Controller
                    resolve(uploadTask.snapshot);
                }
            );
        });
    }
}