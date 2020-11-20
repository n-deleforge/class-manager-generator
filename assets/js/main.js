// =================================================
// =================================================
// ============ INITIALISATION

const version = 1.3; // the actual version of the app
const linkGitHub = "<a target=\"_blank\" href=\"https://github.com/n-deleforge/class-manager-generator\">GitHub</a>";
const linkHome = "<a target=\"_blank\" href=\"https://nicolas-deleforge.fr/\">nd</a>";

// ===> Some variables which will contain all the data of the form
let tableName;
let tableId;
let className;
let columnsName;

// ===> French translation
const FR = {
    'generate' : "Générer",
    'error' : "Tous les champs sont nécessaires.",
    'footer' : "Disponible sur " + linkGitHub + " (v " + version + ") - Hébergé sur " + linkHome,
    'tableNameLabel' : "➡ NOM DE LA TABLE",
    'tableNameDesc' : "Nom de table qui correspond au nom tel qu'il est dans votre base de données SQL.",
    'tableIdLabel' : "➡ NOM DU CHAMP ID",
    'tableIdDesc' : "Champ ID de votre table SQL",
    'columnsNameLabel' : "➡ NOM DE TOUTES LES COLONNES",
    'columnsNameDesc' : "Les différentes colonnes de votre table SQL (doit respecter le format exact suivant : \"col1,col2,col3\").",
    'classNameLabel' : "➡ NOM CLASS/MANAGER",
    'classNameDesc' : "Nom de la Class et du Manager que vous allez créer (une majuscule est automatiquement appliquée)."
}

// ===> English translation
const EN = {
    'generate' : "Generate",
    'error' : "All the fields have to be filled.",
    'footer' : "Available on " + linkGitHub + " (v " + version + ") - Hosted on " + linkHome,
    'tableNameLabel' : "➡ TABLE NAME",
    'tableNameDesc' : "Name of the table in your database.",
    'tableIdLabel' : "➡ ID FIELD NAME",
    'tableIdDesc' : "Name of the ID field of your table.",
    'columnsNameLabel' : "➡ COLUMNS NAMES",
    'columnsNameDesc' : "All the columns' names of your table. Must respect this format : col1,col2,col3",
    'classNameLabel' : "➡ CLASS/MANAGER NAME",
    'classNameDesc' : "Name of the Class and the Manager."
}

// ===> Will determine the language of the app
if (navigator.language == "fr" || navigator.language == "fr-FR") {
    display = FR;
    get("#htmlTag").lang = "fr";
}
else {
    display = EN;
    get("#htmlTag").lang = "en";
}

// ===> Automatically fill all ID fields
let idName = Object.keys(display);
let values = Object.values(display);
for (let i = 0; i < idName.length; i++) get("#" + idName[i]).innerHTML = values[i];

// =================================================
// =================================================
// ============ MAIN

// ===> Manage the generate button
get("#generate").addEventListener("click", function () {
    let error = 0; // error count
    let list = get(".gen"); // list of all inputs

    for (let i = 0; i < list.length; i++) {
        // increment error if an input is empty
        if (list[i].value === "") error++; 
    }

    if (error == 0) {
        get("#error").style.display = "none";

        // Fulfill variables with correct data
        tableName = get("#tableName").value;
        tableId = get("#tableId").value;
        className = ucFirst(get("#className").value);
        columnsName = get("#columnsName").value.split(',');

        // Generate data and make it downloadable
        download(generateClass(), className + ".Class.php");
        download(generateManager(), className + "Manager.Class.php");
    }
    else get("#error").style.display = "block";
});

// =================================================
// =================================================
// ============ CLASS

// ===> Merge together all the class functions
function generateClass() {
    return "<?php" + "\n" + 'class ' + className + "\n{\n" + generateAttributes() + "\n" + generateGetterSetter() + "\n" + genererConstruct() + "\n\n}";
}

// ===> Create the attributes part
function generateAttributes() {
    let attributes = "";

    for (let i = 0; i < columnsName.length; i++) {
        attributes += "private $_" + columnsName[i] + ";\n";
    }

    return attributes;
}

// ===> Create the getter/setter part
function generateGetterSetter() {
    let getterSetter = "";

    for (let i = 0; i < columnsName.length; i++) {
        getterSetter += "public function get" + ucFirst(columnsName[i]) + "()\n" + "{\n" + " return $this->_" + columnsName[i] + ";\n}\n";
        getterSetter += "public function set" + ucFirst(columnsName[i]) + "($_" + columnsName[i] + ")\n" + "{\n" + " return $this->_" + columnsName[i] + " = $_" + columnsName[i] + ";\n}\n";
    }

    return getterSetter;
}

// ===> Create the construct part
function genererConstruct() {
    return `public function __construct(array $options = [])
    {
        if (!empty($options))
        {
            $this->hydrate($options);
        }
    }

    public function hydrate($data)
    {
        foreach ($data as $key => $value) {
            $methode = "set" . ucfirst($key);
            if (is_callable(([$this, $methode])))
            {
                $this->$methode($value);
            }
        }
    }`;
}

// =================================================
// =================================================
// ============ MANAGER

// ===> Merge together all the manager functions
function generateManager() {
    let key = columnsName.find(element => element == tableId);
    if (key != "undefined") columnsName.splice(columnsName.indexOf(key), 1)

    return "<?php\nclass " + className + "Manager\n{\n" + generateAdd() + "\n\n" + generateUpdate() + "\n\n" + generateDelete() + "\n\n" + generateFindById() + "\n\n" + generateGetList() + "\n\n}";
}

// ===> Create the add functiion
function generateAdd() {
    let attributesList = "";
    let sqlValues = "";
    let bindsList = "";

    for (let i = 0; i < columnsName.length; i++) {
        attributesList += columnsName[i] + ",";
        sqlValues += ":" + columnsName[i] + ",";
        bindsList += '$q->bindValue(":' + columnsName[i] + '", $obj->get' + ucFirst(columnsName[i]) + "());\n";
    }

    attributesList = attributesList.substr(0, attributesList.length - 1);
    sqlValues = sqlValues.substr(0, sqlValues.length - 1);

    return "public static function add(" + className + " $obj)\n{\n$db = DbConnect::getDb();\n" + '$q = $db->prepare("INSERT INTO ' + tableName + ' (' + attributesList + ') VALUES (' + sqlValues + ')");\n' + bindsList + "$q->execute();\n}";;
}

// ===> Create the update function
function generateUpdate() {
    let attributesList = "";
    let bindsList = "";

    for (let i = 0; i < columnsName.length; i++) {
        attributesList += columnsName[i] + "=:" + columnsName[i] + ", ";
        bindsList += '$q->bindValue(":' + columnsName[i] + '", $obj->get' + ucFirst(columnsName[i]) + "());\n";
    }

    bindsList += '$q->bindValue(":' + tableId + '", $obj->get' + ucFirst(tableId) + "());\n";
    attributesList = attributesList.substr(0, attributesList.length - 2);

    return 'public static function update(' + className + " $obj)\n{\n$db = DbConnect::getDb();\n" + '$q = $db->prepare("UPDATE ' + tableName + ' SET ' + attributesList + " WHERE " + tableId + "=:" + tableId + "\");\n" + bindsList + "$q->execute();\n}";
}

// ===> Create the delete function
function generateDelete() {
    return 'public static function delete(' + className + " $obj)\n{\n$db = DbConnect::getDb();\n" + '$db->exec("DELETE FROM ' + tableName + ' WHERE ' + tableId + '=" . $obj->get' + ucFirst(tableId) + '());\n}';
}

// ===> Create the findById function
function generateFindById() {
    return "public static function findById($id)\n{\n$db = DbConnect::getDb();\n$id = (int) $id;\n" + '$q = $db->query("SELECT * FROM ' + tableName + ' WHERE ' + tableId + '=".$id);\n' + "$results = $q->fetch(PDO::FETCH_ASSOC);\nif ($results != false) {\nreturn new " + className + " ($results);\n }else {\nreturn false;\n}\n}";
}

// ===> Create the getList function
function generateGetList() {
    return "public static function getList()\n{\n$db = DbConnect::getDb();\n$tab = [];\n" + '$q = $db->query("SELECT * FROM ' + tableName + '");\n' + "while ($donnees = $q->fetch(PDO::FETCH_ASSOC)) {\nif ($donnees != false) {\n$tab[] = new " + className + "($donnees);\n}\n}\nreturn $tab;\n}";
}

// =================================================
// =================================================
// ============ GENERIC

// ===> Easy selector
function get(n) {
    if (n.search("#") == 0 && n.split("#")[1] != null && document.querySelector(n) != null) return document.querySelector(n);
    if (n.search(".") == 0 && n.split(".")[1] != null && document.querySelectorAll(n) != null) return document.querySelectorAll(n);
    if (n.search("~") == 0 && n.split("~")[1] != null && document.querySelectorAll(n.split("~")[1]) != null) return document.querySelectorAll(n.split("~")[1])[0];
}

// ===> Simplier usage of the local storage
function storage(a, n, v) {
    if (a == "get") return localStorage.getItem(n);
    if (a == "set") return localStorage.setItem(n, v);
    if (a == "rem") return localStorage.removeItem(n);
}

// ===> Create a download
function download(c, n) {
    let file = new Blob([c], { type: 'text/plain' });
    let dl = document.createElement('a');
    dl.download = n;
    dl.href = window.URL.createObjectURL(file);
    dl.click();
}

// ===> First-letter majuscule
function ucFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}