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

}