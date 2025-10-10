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

style_to_doc(arr, "Hello, World!");
