// ===> General variables
const version = 1.4;
const linkGitHub = "<a target=\"_blank\" href=\"https://github.com/n-deleforge/class-manager-generator\">GitHub</a>";
const linkHome = "<a target=\"_blank\" href=\"https://nicolas-deleforge.fr/\">nd</a>";
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

// ===> Determine the language of the app
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

for (let i = 0; i < idName.length; i++) {
    if (get("#" + idName[i])) get("#" + idName[i]).innerHTML = values[i];
}