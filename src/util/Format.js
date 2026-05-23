class Format {

/**
 Converte uma string com hifens para camelCase. Utiliza a API nativa de 'dataset' do navegador para realizar a conversão 
 de forma performática, sem a necessidade de expressões regulares (RegEx).Exemplo: "btn-submit-message" vira "btnSubmitMessage"
 */

    static getCamelCase(text){

        let div = document.createElement('div');

        div.innerHTML = `<div data-${text}="id"></div>`;

        return Object.keys(div.firstChild.dataset)[0];
    }

    static toTime(duration){

        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if(hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }

    }

}