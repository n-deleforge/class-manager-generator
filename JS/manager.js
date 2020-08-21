/* ================================================= */
/* ======================= GENERATE MANAGER */

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
