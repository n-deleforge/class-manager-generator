/* ================================================= */
/* ======================= GENERATE CLASS */

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
