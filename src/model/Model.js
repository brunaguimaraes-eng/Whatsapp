import { ClassEvent } from "../util/ClassEvent";

export class Model extends ClassEvent {

    constructor() {              
        super();
        this._data = {};
    }


    //Recebe os dados do banco de dados json, pega os dados e joga dentro do this._data sem apagar, mesclando os dados
    // Nesse momento o trigger dispara enviando os dados atualizados.
    fromJSON(json) {
        this._data = Object.assign(this._data, json);
        this.trigger('datachange', this.toJSON());
    }

    toJSON() {
        return this._data;
    }

}