// =================================================
// ======================= INITIALISATION

langage = EN;
if (localStorage.getItem('nd-generatorLang') == "FR") langage = FR; 
display();

// =================================================
// ======================= DISPLAY

function display() {
    get("#lang").innerHTML = langage["lang"];
    get("#generate").innerHTML = langage["button"];
    get("#error").innerHTML = langage["error"];
    get("#tableNameLabel").innerHTML = "&#10145 " + langage["tableNameLabel"];
    get("#tableNameDesc").innerHTML = langage["tableNameDesc"];
    get("#tableIdLabel").innerHTML = "&#10145 " + langage["tableIdLabel"];
    get("#tableIdDesc").innerHTML = langage["tableIdDesc"];
    get("#columnsNameLabel").innerHTML = "&#10145 " + langage["columnsNameLabel"];
    get("#columnsNameDesc").innerHTML = langage["columnsNameDesc"];
    get("#classNameLabel").innerHTML = "&#10145 " + langage["classNameLabel"];
    get("#classNameDesc").innerHTML = langage["classNameDesc"];
}

// ===> Management of the language button
get('#lang').addEventListener("click", function () {
    if (get('#lang').innerHTML == "FR") {
        localStorage.setItem('nd-generatorLang', 'EN');
        langage = EN;
    } 
    else {
        localStorage.setItem('nd-generatorLang', 'FR');
        langage = FR;
    }

    display();
})

// =================================================
// ======================= MAIN

// ===> Check the inputs and generate
get("#generate").addEventListener("click", function () {
    let error = 0;
    let list = get(".gen");

    for (let i = 0; i < list.length; i++) {
        if (list[i].value === "") error++;
    }

    if (error == 0) {
        get("#error").style.display = "none";
        tableName = get("#tableName").value;
        tableId = get("#tableId").value;
        className = ucFirst(get("#className").value);
        columnsName = get("#columnsName").value.split(',');

        download(generateClass(), className + ".Class.php");
        download(generateManager(), className + "Manager.Class.php");
    }
    else {
        get("#error").style.display = "block";
    }
});

// ===> Download a file
function download(c, n) {
    let file = new Blob([c], {
        type: 'text/plain'
    });

    let dl = document.createElement('a');
    dl.download = n;
    dl.href = window.URL.createObjectURL(file);
    dl.click();
}
