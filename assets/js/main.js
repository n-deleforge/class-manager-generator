// =================================================
// =================================================
// ============ MAIN

/**
 * Check the errors in the form and create the files
 **/

get("#generate").addEventListener("click", () => {
    let error = 0;
    let list = get(".gen");

    // Each empty input increment the error variable
    for (let i = 0; i < list.length; i++) {
        if (list[i].value === "") error++; 
    }

    // Creation of the files
    if (error == 0) {
        get("#error").style.visibility = "hidden";

        // Fulfill variables with correct data
        TABLE_NAME = get("#tableName").value;
        TABLE_ID = get("#tableId").value;
        CLASS_NAME = ucFirst(get("#className").value);
        COLUMNS_NAME = get("#columnsName").value.split(',');

        // Generate data and make it downloadable
        download(generateClass(), CLASS_NAME + ".Class.php");
        download(generateManager(), CLASS_NAME + "Manager.Class.php");
    }
    else get("#error").style.visibility = "visible";
});

// =================================================
// =================================================
// ============ CLASS

/**
 * Merge all the functions and generate the class
 **/

function generateClass() {
    return "<?php" + "\n" + 'class ' + CLASS_NAME + "\n{\n" + generateAttributes() + "\n" + generateGetterSetter() + "\n" + genererConstruct() + "\n\n}";
}

/**
 * Generate the attributes of the class
 **/

function generateAttributes() {
    let attributes = "";

    for (let i = 0; i < COLUMNS_NAME.length; i++) {
        attributes += "private $_" + COLUMNS_NAME[i] + ";\n";
    }

    return attributes;
}

/**
 * Generate the getter and the setter of the class
 **/

function generateGetterSetter() {
    let getterSetter = "";
    
    for (let i = 0; i < COLUMNS_NAME.length; i++) {
        getterSetter += "public function get" + ucFirst(COLUMNS_NAME[i]) + "()\n" + "{\n" + " return $this->_" + COLUMNS_NAME[i] + ";\n}\n";
        getterSetter += "public function set" + ucFirst(COLUMNS_NAME[i]) + "($_" + COLUMNS_NAME[i] + ")\n" + "{\n" + " return $this->_" + COLUMNS_NAME[i] + " = $_" + COLUMNS_NAME[i] + ";\n}\n";
    }

    return getterSetter;
}

/**
 * Generate the constructor of the class
 **/

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

/**
 * Merge all the functions and generate the manager
 **/

function generateManager() {
    let key = COLUMNS_NAME.find(element => element == TABLE_ID);
    if (key != "undefined") COLUMNS_NAME.splice(COLUMNS_NAME.indexOf(key), 1)

    return "<?php\nclass " + CLASS_NAME + "Manager\n{\n" + generateAdd() + "\n\n" + generateUpdate() + "\n\n" + generateDelete() + "\n\n" + generateFindById() + "\n\n" + generateGetList() + "\n\n}";
}

/**
 * Generate the add function of the manager
 **/

function generateAdd() {
    let attributesList = "";
    let sqlValues = "";
    let bindsList = "";

    for (let i = 0; i < COLUMNS_NAME.length; i++) {
        attributesList += COLUMNS_NAME[i] + ",";
        sqlValues += ":" + COLUMNS_NAME[i] + ",";
        bindsList += '$q->bindValue(":' + COLUMNS_NAME[i] + '", $obj->get' + ucFirst(COLUMNS_NAME[i]) + "());\n";
    }

    attributesList = attributesList.substr(0, attributesList.length - 1);
    sqlValues = sqlValues.substr(0, sqlValues.length - 1);

    return "public static function add(" + CLASS_NAME + " $obj)\n{\n$db = DbConnect::getDb();\n" + '$q = $db->prepare("INSERT INTO ' + TABLE_NAME + ' (' + attributesList + ') VALUES (' + sqlValues + ')");\n' + bindsList + "$q->execute();\n}";;
}

/**
 * Generate the update function of the manager
 **/

function generateUpdate() {
    let attributesList = "";
    let bindsList = "";

    for (let i = 0; i < COLUMNS_NAME.length; i++) {
        attributesList += COLUMNS_NAME[i] + "=:" + COLUMNS_NAME[i] + ", ";
        bindsList += '$q->bindValue(":' + COLUMNS_NAME[i] + '", $obj->get' + ucFirst(COLUMNS_NAME[i]) + "());\n";
    }

    bindsList += '$q->bindValue(":' + TABLE_ID + '", $obj->get' + ucFirst(TABLE_ID) + "());\n";
    attributesList = attributesList.substr(0, attributesList.length - 2);

    return 'public static function update(' + CLASS_NAME + " $obj)\n{\n$db = DbConnect::getDb();\n" + '$q = $db->prepare("UPDATE ' + TABLE_NAME + ' SET ' + attributesList + " WHERE " + TABLE_ID + "=:" + TABLE_ID + "\");\n" + bindsList + "$q->execute();\n}";
}

/**
 * Generate the delete function of the manager
 **/

function generateDelete() {
    return 'public static function delete(' + CLASS_NAME + " $obj)\n{\n$db = DbConnect::getDb();\n" + '$db->exec("DELETE FROM ' + CLASS_NAME + ' WHERE ' + TABLE_ID + '=" . $obj->get' + ucFirst(TABLE_ID) + '());\n}';
}

/**
 * Generate the findById function of the manager
 **/

function generateFindById() {
    return "public static function findById($id)\n{\n$db = DbConnect::getDb();\n$id = (int) $id;\n" + '$q = $db->query("SELECT * FROM ' + CLASS_NAME + ' WHERE ' + TABLE_ID + '=".$id);\n' + "$results = $q->fetch(PDO::FETCH_ASSOC);\nif ($results != false) {\nreturn new " + CLASS_NAME + " ($results);\n }else {\nreturn false;\n}\n}";
}

/**
 * Generate the getList function of the manager
 **/

function generateGetList() {
    return "public static function getList()\n{\n$db = DbConnect::getDb();\n$tab = [];\n" + '$q = $db->query("SELECT * FROM ' + CLASS_NAME + '");\n' + "while ($donnees = $q->fetch(PDO::FETCH_ASSOC)) {\nif ($donnees != false) {\n$tab[] = new " + CLASS_NAME + "($donnees);\n}\n}\nreturn $tab;\n}";
}