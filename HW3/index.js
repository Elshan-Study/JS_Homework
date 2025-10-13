//@Task1

class CssObject{

    #selector;
    #styles;

    constructor(){
        this.#selector = "";
        this.#styles = {};
    }

    setSelector(selector){
        selector = selector.trim()
        if(selector === undefined || selector === null) return
        return this.#selector = selector;
    }

    addStyle(key, value){
        this.#styles[key] = value;
    }

    removeStyle(key){
        delete this.#styles[key];
    }

    getCss(){
        let styles_text = ""
        for(let key in this.#styles){
            styles_text += `\n\t${key}: ${this.#styles[key]};`;
        }
        return `${this.#selector} {${styles_text}\n}`;
    }
}

let css = new CssObject();
css.setSelector(".text")
css.addStyle("color", 'rgb(255, 0, 0)');
css.addStyle("background-color", 'rgb(255, 0, 0)');
console.log(css.getCss());
