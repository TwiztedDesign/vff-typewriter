import TypeIt from 'typeit';

let template = document.createElement('template');
template.innerHTML = `
    <style>
    
        @keyframes blink {
          0% {opacity: 0}
          49% {opacity: 0}
          50% {opacity: 1}
        }

        .ti-cursor {
          animation: blink 1s infinite;
        }
        p {
            display: flex;
            margin: 0;
            white-space: pre-wrap;
        }
        p span.ti-wrapper{
            display: flex;
        }
      
    </style>
    <p></p>
`;


const defaultTypeOptions = {
    cursor : false,
    speed: 100,
    waitUntilVisible: true,
};

export default class VFFTypewriter extends HTMLElement {
    constructor() {
        super();
        this.typed;
        this._shadowRoot = this.attachShadow({mode: 'open'});
        this._shadowRoot.appendChild(template.content.cloneNode(true));
        window.vff.ready(() => {
            this.vffReady = true;
        });
    }

    connectedCallback() {
        this.p = this._shadowRoot.querySelector('p');
        this._text = this.getAttribute("text");
    }

    disconnectedCallback() {

    }

    clearText(){
        this.p.innerHTML = '';
    }
    setText(text){
        this.p.innerText = text;
    }
    typeText(text){
        if(this.typed){this.typed = null;}
        setTimeout(() => {
            let options = Object.assign({}, defaultTypeOptions, {
                cursor  : this.cursor,
                speed   : this.speed
            });
            options.strings = text.split('\n');
            this.typed = new TypeIt(this.p, options).go();}
        ,1);
    }
    render(text){
        this.clearText();
        if(!this.vffReady){
            this.setText(text);
        } else {
            if(window.vff.mode === window.vff.MODE.PREVIEW){
                this.setText(text);
            } else {
                this.typeText(text);
            }
        }
    }
    get text() {
        return this._text;
    }
    set text(value) {
        if(value !== this._text) {
            this._text = value;
            this.render(value);
        }
    }

    get cursor(){
        return this.getAttribute("cursor") === 'true';
    }
    set cursor(value){
        return this.setAttribute("cursor", value);
    }
    get speed(){
        return +this.getAttribute("speed") || 100;
    }
    set speed(value){
        return this.setAttribute("speed", value);
    }

    expose(){
        return {
            text : 'text',
            speed : 'speed',
            cursor : 'cursor',
        };
    }
}

window.vff.define("vff-typewriter", VFFTypewriter);

