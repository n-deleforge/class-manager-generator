// =================================================
// ======================= VARIABLES

let tableName;
let tableId;
let className;
let columnsName;
let langage;

const FR = [];
    FR["lang"] = "FR";
    FR["button"] = "Générer";
    FR["error"] = "Tous les champs sont nécessaires.";
    FR["tableNameLabel"] = "NOM DE LA TABLE";
    FR["tableNameDesc"] = "Nom de table qui correspond au nom tel qu'il est dans votre base de données SQL.";
    FR["tableIdLabel"] = "NOM DU CHAMP ID";
    FR["tableIdDesc"] = "Champ ID de votre table SQL.";
    FR["columnsNameLabel"] = "NOM DE TOUTES LES COLONNES";
    FR["columnsNameDesc"] = "Les différentes colonnes de votre table SQL (doit respecter le format exact suivant : \"col1,col2,col3\").";
    FR["classNameLabel"] = "NOM CLASS/MANAGER";
    FR["classNameDesc"] = "Nom de la Class et du Manager que vous allez créer (une majuscule est automatiquement appliquée).";

const EN = [];
    EN["lang"] = "EN";
    EN["button"] = "Generate";
    EN["error"] = "All the fileds have to be filled.";
    EN["tableNameLabel"] = "TABLE NAME";
    EN["tableNameDesc"] = "Name of the table in your database.";
    EN["tableIdLabel"] = "ID FIELD NAME";
    EN["tableIdDesc"] = "Name of the ID field of your table.";
    EN["columnsNameLabel"] = "COLUMNS NAMES";
    EN["columnsNameDesc"] = "All the columns' names of your table. Must respect this format : col1,col2,col3.";
    EN["classNameLabel"] = "CLASS/MANAGER NAME";
    EN["classNameDesc"] = "Name of the Class and the Manager.";