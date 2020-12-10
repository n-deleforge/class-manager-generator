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
    else get("#error").style.visibility = "visible";
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