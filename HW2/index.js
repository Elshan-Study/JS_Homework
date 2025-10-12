
//@Task1
let arr = [{color: "pink", height: "320px"}];

function style_to_doc(style_arr, text) {
    let doc = '<p style="';

    for (let i = 0; i < style_arr.length; i++) {
        for (let j in style_arr[i]) {
            doc += `${j}:${style_arr[i][j]};`
        }
    }

    doc+=`">${text}</p>`;

    document.write(doc);
}

//style_to_doc(arr, "Hello, World!"); - расскоментируйте

//@Task2.1

function isUpperCase(letter) {
    return letter === letter.toLocaleUpperCase() && letter !== letter.toLocaleLowerCase();
}

function isLowerCase(letter) {
    return letter === letter.toLocaleLowerCase() && letter !== letter.toLocaleUpperCase();
}

function isDigit(char) {
    const code = char.charCodeAt(0);
    return code >= 48 && code <= 57;
}

function formatText(text){
    let result = "";

    for (const char of text) {
        if (isUpperCase(char)) {
            result += char.toLocaleLowerCase();
        } else if (isLowerCase(char)) {
            result += char.toLocaleUpperCase();
        } else if (isDigit(char)) {
            result += "_";
        } else {result += char}
    }

    return result;
}

console.log(`1. Aboba99 format to ${formatText("Aboba99")}`)

//@Task2.2

function toCamelCase(cssProp) {
    cssProp = cssProp.trim().toLowerCase();
    let result = '';
    let makeUpper = false;

    for (const char of cssProp) {
        if (char === '-') {
            makeUpper = true;
        } else if (makeUpper) {
            result += char.toUpperCase();
            makeUpper = false;
        } else {
            result += char;
        }
    }

    return result;
}

console.log(`2. font-size toCamelCase ${toCamelCase("font-size")}`);

//@Task2.3

function toAbbreviation(text){
    text = text.trim().toLocaleUpperCase().split(" ");
    let result = '';

    for (const word of text) {
        result+=word[0];
    }

    return result;
}

console.log(`3. cascading style sheets toAbbreviation ${toAbbreviation("cascading style sheets")}`);

//@Task2.4

function getInfoFromUrl(url) {
    const protocolEnd = url.indexOf(':');
    const protocol = url.slice(0, protocolEnd);

    const domainStart = url.indexOf('//') + 2;
    const domainEnd = url.indexOf('/', domainStart);
    const domain = domainEnd !== -1 ? url.slice(domainStart, domainEnd) : url.slice(domainStart);

    const path = domainEnd !== -1 ? url.slice(domainEnd) : '/';

    return `protocol: ${protocol}, domain: ${domain}, path: ${path}`;
}

console.log(`4. info from https://itstep.org/ua/about ${getInfoFromUrl("https://itstep.org/ua/about")}`);

//@Task 2.5

function print(template, ...args) {
    let result = "";
    let i = 0;

    while (i < template.length) {
        if (template[i] === "%") {
            i++;
            let numStr = "";
            while (i < template.length && !isNaN(template[i]) && template[i] !== " ") {
                numStr += template[i];
                i++;
            }
            const index = parseInt(numStr, 10) - 1;
            result += args[index] !== undefined ? args[index] : "%" + numStr;
        } else {
            result += template[i];
            i++;
        }
    }

    return result;
}

const result = print("Today is %1 %2.%3.%4", "Monday", 10, 8, 2020);
console.log(`5. print "Today is %1 %2.%3.%4", "Monday", 10, 8, 2020 = ${result}`);