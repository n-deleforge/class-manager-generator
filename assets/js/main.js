// =================================================
// ==================================== INITIALISATION
// =================================================

let tableName;
let tableId;
let className;
let columnsName;
let language;

const linkGitHub = "<a target=\"_blank\" href=\"https://github.com/n-deleforge/class-manager-generator\">GitHub</a>";
const linkHome = "<a target=\"_blank\" href=\"https://nicolas-deleforge.fr/\">nd</a>";
const version = "1.3";

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


if (navigator.language == "fr") language = FR;
else language = EN;
display();

// =================================================
// ============================================ MAIN
// =================================================

// =======================> Display the app text
// ========================================
function display() {
    get("#htmlTag").lang = navigator.language;
    let idName = Object.keys(language);
    let values = Object.values(language);
    for (let i = 0; i < idName.length; i++) get("#" + idName[i]).innerHTML = values[i];
}

// =================> Manage the generate button
// ========================================
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
    else get("#error").style.display = "block";
});

// =================================================
// =========================================== CLASS

function generateClass() {
    return "<?php" + "\n" + 'class ' + className + "\n{\n" + generateAttributes() + "\n" + generateGetterSetter() + "\n" + genererConstruct() + "\n\n}";
}

function generateAttributes() {
    let attributes = "";

    for (let i = 0; i < columnsName.length; i++) {
        attributes += "private $_" + columnsName[i] + ";\n";
    }

    return attributes;
}

function generateGetterSetter() {
    let getterSetter = "";

    for (let i = 0; i < columnsName.length; i++) {
        getterSetter += "public function get" + ucFirst(columnsName[i]) + "()\n" + "{\n" + " return $this->_" + columnsName[i] + ";\n}\n";
        getterSetter += "public function set" + ucFirst(columnsName[i]) + "($_" + columnsName[i] + ")\n" + "{\n" + " return $this->_" + columnsName[i] + " = $_" + columnsName[i] + ";\n}\n";
    }

    return getterSetter;
}

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
// ======================================== MANAGER

function generateManager() {
    let key = columnsName.find(element => element == tableId);
    if (key != "undefined") columnsName.splice(columnsName.indexOf(key), 1)

    return "<?php\nclass " + className + "Manager\n{\n" + generateAdd() + "\n\n" + generateUpdate() + "\n\n" + generateDelete() + "\n\n" + generateFindById() + "\n\n" + generateGetList() + "\n\n}";
}

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

function generateDelete() {
    return 'public static function delete(' + className + " $obj)\n{\n$db = DbConnect::getDb();\n" + '$db->exec("DELETE FROM ' + tableName + ' WHERE ' + tableId + '=" . $obj->get' + ucFirst(tableId) + '());\n}';
}

function generateFindById() {
    return "public static function findById($id)\n{\n$db = DbConnect::getDb();\n$id = (int) $id;\n" + '$q = $db->query("SELECT * FROM ' + tableName + ' WHERE ' + tableId + '=".$id);\n' + "$results = $q->fetch(PDO::FETCH_ASSOC);\nif ($results != false) {\nreturn new " + className + " ($results);\n }else {\nreturn false;\n}\n}";
}

function generateGetList() {
    return "public static function getList()\n{\n$db = DbConnect::getDb();\n$langage = [];\n" + '$q = $db->query("SELECT * FROM ' + tableName + '");\n' + "while ($donnees = $q->fetch(PDO::FETCH_ASSOC)) {\nif ($donnees != false) {\n$langage[] = new " + className + "($donnees);\n}\n}\nreturn $langage;\n}";
}

// =================================================
// ========================================= GENERIC
// =================================================

// =========================> Select an element
// ========================================
function get(n) {
    if (n.search("#") != -1 && document.getElementById(n.split("#")[1]) != null) { return document.getElementById(n.split("#")[1]); }
    if (n.search("~") != -1 && document.querySelectorAll(n.split('~')[1]) != null) { return document.querySelectorAll(n.split('~')[1]); }
    if (n.search("\\.") != -1 && document.querySelectorAll(n).length != 0) { return document.querySelectorAll(n); }
}

// ================> Faster usage of localStorage
// ========================================
function storage(a, n, v) {
    if (a == "get") return localStorage.getItem(n);
    if (a == "set") return localStorage.setItem(n, v);
    if (a == "rem") return localStorage.removeItem(n);
}

// ==========================> Download a file
// ========================================
function download(c, n) {
    let file = new Blob([c], {
        type: 'text/plain'
    });

    let dl = document.createElement('a');
    dl.download = n;
    dl.href = window.URL.createObjectURL(file);
    dl.click();
}

// ==========================> Add a majuscule
// ========================================
function ucFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}