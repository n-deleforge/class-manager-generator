// =====================================
// ============================ SETTINGS 
// =====================================

// Display erros and informations
const log = false;

// =====================================
// ================================ MAIN 
// =====================================

// =============================
// ===== Select an element
// "#"  for an ID
// "~"  for a selector
// "."   for a class

function get(n) {
    if (n.search("#") != -1 && document.getElementById(n.split("#")[1]) != null) { return document.getElementById(n.split("#")[1]); }
    if (n.search("~") != -1 && document.querySelectorAll(n.split('~')[1]) != null) { return document.querySelectorAll(n.split('~')[1]); }
    if (n.search("\\.") != -1 && document.querySelectorAll(n).length != 0) { return document.querySelectorAll(n); }
    if (log) { console.log("Error with " + n); }
    return false;
}

// =====================================
// ================================ MISC 
// =====================================

// =============================
// ===> Add a a majuscule
function ucFirst(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

