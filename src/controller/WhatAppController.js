class WhatAppController{

    constructor(){

        console.log("WhatAppController ok");

        this.elementsPrototype();
        this.loadElements();

    }   

    loadElements(){

        //Criamos um objeto vazio el. Dentro dele que os elementos HTML serão guardados
        this.el = {};

        document.querySelectorAll('[id').forEach(element =>{         //busca todos os elementos ID no código

            this.el[Format.getCamelCase(element.id)] = element;     //pega o html original e formata em camelCase
        })
        
    }

    elementsPrototype(){

        Element.prototype.hide = function(){
            this.style.display = 'none';
            return this;
        }

        Element.prototype.show = function(){
            this.style.display = 'none';
            return this;
        }

        Element.prototype.toggle = function(){
            this.style.display = (this.style.display === 'none') ? 'block' : 'none'
            return this;
        }

        Element.prototype.on = function(events, fn){
            
            events.split (' ').forEach(event => {

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

            return this.classList.classList(name);

        }

    }

}