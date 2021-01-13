// =================================================
// =================================================
// ============ CORE VARIABLES

let tableName; let tableId; let columnsName; let className; 
const VERSION = 1.5;
const GITHUB = "<a target=\"_blank\" href=\"https://github.com/n-deleforge/class-manager-generator\">GitHub</a>";
const HOME = "<a target=\"_blank\" href=\"https://nicolas-deleforge.fr/\">nd</a>";
const FRENCH = {
    'generate' : "Générer",
    'error' : "Tous les champs sont nécessaires.",
    'footer' : "Disponible sur " + GITHUB + " (v " + VERSION + ") - Hébergé sur " + HOME,
    'tableNameLabel' : "➡ NOM DE LA TABLE",
    'tableNameDesc' : "Nom de table qui correspond au nom tel qu'il est dans votre base de données SQL.",
    'tableIdLabel' : "➡ NOM DU CHAMP ID",
    'tableIdDesc' : "Champ ID de votre table SQL",
    'columnsNameLabel' : "➡ NOM DE TOUTES LES COLONNES",
    'columnsNameDesc' : "Les différentes colonnes de votre table SQL (doit respecter le format exact suivant : \"col1,col2,col3\").",
    'classNameLabel' : "➡ NOM CLASS/MANAGER",
    'classNameDesc' : "Nom de la Class et du Manager que vous allez créer (une majuscule est automatiquement appliquée)."
};
const ENGLISH = {
    'generate' : "Generate",
    'error' : "All the fields have to be filled.",
    'footer' : "Available on " + GITHUB + " (v " + VERSION + ") - Hosted on " + HOME,
    'tableNameLabel' : "➡ TABLE NAME",
    'tableNameDesc' : "Name of the table in your database.",
    'tableIdLabel' : "➡ ID FIELD NAME",
    'tableIdDesc' : "Name of the ID field of your table.",
    'columnsNameLabel' : "➡ COLUMNS NAMES",
    'columnsNameDesc' : "All the columns' names of your table. Must respect this format : col1,col2,col3",
    'classNameLabel' : "➡ CLASS/MANAGER NAME",
    'classNameDesc' : "Name of the Class and the Manager."
};

// =================================================
// =================================================
// ============ CORE INITIALISATION

// ===> Determine the language of the application
const CONTENT = (navigator.language == "fr" || navigator.language == "fr-FR") ? FRENCH : ENGLISH;
let names = Object.keys(CONTENT);
let values = Object.values(CONTENT);

for (let i = 0; i < names.length; i++) {
    if (get("#" + names[i])) {
        get("#" + names[i]).innerHTML = values[i];
    }
}