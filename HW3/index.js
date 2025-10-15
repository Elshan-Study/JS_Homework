//@Task1

class CssObject {
    #selector;
    #styles;

    constructor(selector = "") {
        this.#selector = selector;
        this.#styles = {};
    }

    setSelector(selector) {
        if (selector === undefined || selector === null) return;
        this.#selector = String(selector).trim();
        return this;
    }

    addStyle(key, value) {
        if (!key) return;
        this.#styles[String(key).trim()] = String(value);
        return this;
    }

    removeStyle(key) {
        delete this.#styles[key];
        return this;
    }

    getCss() {
        let styles_text = "";
        for (let key in this.#styles) {
            styles_text += `\n    ${key}: ${this.#styles[key]};`;
        }
        return `${this.#selector} {${styles_text}\n}`;
    }
}

// @Task2: HtmlObject
class HtmlObject {
    constructor(tagName = 'div', selfClosing = false, textContent = '', attributes = [], styles = {}, children = []) {
        this.tagName = String(tagName);
        this.selfClosing = Boolean(selfClosing);
        this.textContent = textContent == null ? '' : String(textContent);
        this.attributes = Array.isArray(attributes) ? attributes.slice() : [];
        this.styles = Object.assign({}, styles);
        this.children = Array.isArray(children) ? children.slice() : [];
    }

    setAttribute(name, value) {
        name = String(name);
        const idx = this.attributes.findIndex(a => a.name === name);
        if (idx >= 0) {
            this.attributes[idx].value = String(value);
        } else {
            this.attributes.push({ name, value: String(value) });
        }
        return this;
    }

    setStyle(key, value) {
        this.styles[String(key)] = String(value);
        return this;
    }

    appendChild(htmlObject) {
        if (!(htmlObject instanceof HtmlObject)) {
            throw new Error('appendChild expects HtmlObject');
        }
        this.children.push(htmlObject);
        return this;
    }

    prependChild(htmlObject) {
        if (!(htmlObject instanceof HtmlObject)) {
            throw new Error('prependChild expects HtmlObject');
        }
        this.children.unshift(htmlObject);
        return this;
    }

    _escapeText(text) {
        return String(text)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    _attributesToString() {
        const parts = [];

        for (const attr of this.attributes) {
            if (attr.value === null || attr.value === undefined || attr.value === '') {
                parts.push(`${attr.name}`);
            } else {
                const val = String(attr.value).replace(/"/g, '&quot;');
                parts.push(`${attr.name}="${val}"`);
            }
        }

        const styleKeys = Object.keys(this.styles);
        if (styleKeys.length > 0) {
            const styleText = styleKeys.map(k => `${k}: ${this.styles[k]};`).join(' ');
            parts.push(`style="${styleText.replace(/"/g, '&quot;')}"`);
        }

        return parts.length > 0 ? ' ' + parts.join(' ') : '';
    }

    getHtml() {
        const attrs = this._attributesToString();
        if (this.selfClosing) {
            return `<${this.tagName}${attrs} />`;
        } else {
            const innerParts = [];
            if (this.textContent) innerParts.push(this._escapeText(this.textContent));
            for (const ch of this.children) {
                innerParts.push(ch.getHtml());
            }
            return `<${this.tagName}${attrs}>${innerParts.join('')}</${this.tagName}>`;
        }
    }
}

const card = new HtmlObject('div', false, '',
    [{ name: 'class', value: 'card' }], {});
const img = new HtmlObject('img', true, '',
    [{ name: 'src', value: 'https://portal.azertag.az/sites/default/files/YEsas.jpg' },
        { name: 'alt', value: 'image' }], {});
const content = new HtmlObject('div', false, '',
    [{ name: 'class', value: 'card-content' }], {});
const title = new HtmlObject('h2', false,
    'Заголовок карточки', [{ name: 'class', value: 'card-title' }], {});
const desc = new HtmlObject('p', false,
    'Краткое описание карточки. Здесь может быть любая полезная информация.',
    [{ name: 'class', value: 'card-desc' }], {});
const btn = new HtmlObject('button', false,
    'Подробнее', [{ name: 'class', value: 'card-btn' }], {});


content.appendChild(title);
content.appendChild(desc);
content.appendChild(btn);

card.appendChild(img);
card.appendChild(content);

const cssCard = new CssObject().setSelector('.card');
cssCard.addStyle('width', '320px');
cssCard.addStyle('border', '1px solid #ddd');
cssCard.addStyle('border-radius', '8px');
cssCard.addStyle('overflow', 'hidden');
cssCard.addStyle('box-shadow', '0 2px 8px rgba(0,0,0,0.08)');
cssCard.addStyle('font-family', 'Arial, sans-serif');
cssCard.addStyle('margin', '20px');

const cssImg = new CssObject().setSelector('.card img');
cssImg.addStyle('display', 'block');
cssImg.addStyle('width', '100%');
cssImg.addStyle('height', 'auto');

const cssContent = new CssObject().setSelector('.card-content');
cssContent.addStyle('padding', '12px');

const cssTitle = new CssObject().setSelector('.card-title');
cssTitle.addStyle('margin', '0 0 8px 0');
cssTitle.addStyle('font-size', '18px');

const cssDesc = new CssObject().setSelector('.card-desc');
cssDesc.addStyle('margin', '0 0 12px 0');
cssDesc.addStyle('font-size', '14px');
cssDesc.addStyle('color', '#444');

const cssBtn = new CssObject().setSelector('.card-btn');
cssBtn.addStyle('padding', '8px 14px');
cssBtn.addStyle('border', 'none');
cssBtn.addStyle('border-radius', '4px');
cssBtn.addStyle('background-color', '#1976d2');
cssBtn.addStyle('color', '#fff');
cssBtn.addStyle('cursor', 'pointer');

const cssBlocks = [
    cssCard.getCss(),
    cssImg.getCss(),
    cssContent.getCss(),
    cssTitle.getCss(),
    cssDesc.getCss(),
    cssBtn.getCss()
].join('\n\n');

// расскоментируйте
// document.write(`<style>\n${cssBlocks}\n</style>`);
// document.write(card.getHtml());

// @Task3: ExtendedDate
class ExtendedDate extends Date {
    constructor(...args) {
        super(...args);
    }

    toReadableString() {
        const months = [
            'января','февраля','марта','апреля','мая','июня',
            'июля','августа','сентября','октября','ноября','декабря'
        ];
        const d = this.getDate();
        const m = this.getMonth();
        return `${d} ${months[m]}`;
    }

    IsFuture() {
        const now = new Date();
        return this.getTime() >= now.getTime();
    }

    IsLeapYear() {
        const y = this.getFullYear();
        return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    }
}

const edFuture = new ExtendedDate('2030-12-25T00:00:00');
const edPast = new ExtendedDate('2000-02-29T00:00:00');
const edNow = new ExtendedDate();

console.log('edFuture', edFuture, edFuture.toReadableString(), edFuture.IsFuture(), edFuture.IsLeapYear());
console.log('edPast', edPast, edPast.toReadableString(), edPast.IsFuture(), edPast.IsLeapYear());
console.log('edNow', edNow, edNow.toReadableString(), edNow.IsFuture(), edNow.IsLeapYear());
