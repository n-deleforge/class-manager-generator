// =================================================
// =================================================
// ============ CORE VARIABLES

const version = 1.5;
const githubLink = "<a target=\"_blank\" href=\"https://github.com/n-deleforge/class-manager-generator\">GitHub</a>";
const homeLink = "<a target=\"_blank\" href=\"https://nicolas-deleforge.fr/\">nd</a>";
let tableName; let tableId; let className; let columnsName;

// =================================================
// =================================================
// ============ CORE INITIALISATION

// ===> French translation
const french = {
    'generate' : "Générer",
    'error' : "Tous les champs sont nécessaires.",
    'footer' : "Disponible sur " + githubLink + " (v " + version + ") - Hébergé sur " + homeLink,
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
const english = {
    'generate' : "Generate",
    'error' : "All the fields have to be filled.",
    'footer' : "Available on " + githubLink + " (v " + version + ") - Hosted on " + homeLink,
    'tableNameLabel' : "➡ TABLE NAME",
    'tableNameDesc' : "Name of the table in your database.",
    'tableIdLabel' : "➡ ID FIELD NAME",
    'tableIdDesc' : "Name of the ID field of your table.",
    'columnsNameLabel' : "➡ COLUMNS NAMES",
    'columnsNameDesc' : "All the columns' names of your table. Must respect this format : col1,col2,col3",
    'classNameLabel' : "➡ CLASS/MANAGER NAME",
    'classNameDesc' : "Name of the Class and the Manager."
}

// ===> Determine the language of the app
if (navigator.language == "fr" || navigator.language == "fr-FR") {
    display = french;
    get("#htmlTag").lang = "fr";
}
else {
    display = english;
    get("#htmlTag").lang = "en";
}

// ===> Automatically fill all ID fields
let names = Object.keys(display);
let values = Object.values(display);

for (let i = 0; i < names.length; i++) {
    if (get("#" + names[i])) {
        get("#" + names[i]).innerHTML = values[i];
    }
}