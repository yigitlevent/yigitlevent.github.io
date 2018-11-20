document.getElementById("conjugate").addEventListener('click', conjugate);
document.getElementById("conjugatestore").addEventListener('click', conjugatestore);
document.getElementById("store").addEventListener('click', storeVerb);
document.getElementById("download").addEventListener('click', downloadStorage);
document.querySelector("#past > .simple > input").addEventListener('change', function () {
    let verb = document.querySelector("#past > .simple > input").value;
    document.querySelector("#past > .continuous > input").value = conjugateContinuous(verb);
    document.querySelector("#past > .perfect > input").value = conjugatePerfect(verb);
    document.querySelector("#past > .imperfect > input").value = conjugateImperfect(verb);
    document.querySelector("#past > .prospective > input").value = conjugateProspective(verb);
});
document.querySelector("#present > .simple > input").addEventListener('change', function () {
    let verb = document.querySelector("#present > .simple > input").value;
    document.querySelector("#present > .continuous > input").value = conjugateContinuous(verb);
    document.querySelector("#present > .perfect > input").value = conjugatePerfect(verb);
    document.querySelector("#present > .imperfect > input").value = conjugateImperfect(verb);
    document.querySelector("#present > .prospective > input").value = conjugateProspective(verb);
});
document.querySelector("#future > .simple > input").addEventListener('change', function () {
    let verb = document.querySelector("#future > .simple > input").value;
    document.querySelector("#future > .continuous > input").value = conjugateContinuous(verb);
    document.querySelector("#future > .perfect > input").value = conjugatePerfect(verb);
    document.querySelector("#future > .imperfect > input").value = conjugateImperfect(verb);
    document.querySelector("#future > .prospective > input").value = conjugateProspective(verb);
});

let storage = [
    "Verb,Meaning,Past Simple,Past Continuous,Past Perfect,Past Imperfect,Past Prospective,Present Simple,Present Continuous,Present Perfect,Present Imperfect,Present Prospective,Future Simple,Future Continuous,Future Perfect,Future Imperfect,Future Prospective"]
var legalLetters = ["a", "d", "e", "é", "f", "h", "i", "í", "k", "l", "m", "n", "ó", "r", "s", "t", "ú", "v", "y"];
var legalVowels = ["a", "e", "é", "i", "í", "ó", "ú"];
var legalConstants = ["d", "f", "h", "k", "l", "m", "n", "r", "s", "t", "v", "y"];
var legalVerbEndings = ["í", "e", "ó", "m", "n", "s"];

function storeVerb() {
    let data = document.getElementById("verb").value
        + "," + document.getElementById("meaning").value
        + "," + document.querySelector("#past > .simple > input").value
        + "," + document.querySelector("#past > .continuous > input").value
        + "," + document.querySelector("#past > .perfect > input").value
        + "," + document.querySelector("#past > .imperfect > input").value
        + "," + document.querySelector("#past > .prospective > input").value
        + "," + document.querySelector("#present > .simple > input").value
        + "," + document.querySelector("#present > .continuous > input").value
        + "," + document.querySelector("#present > .perfect > input").value
        + "," + document.querySelector("#present > .imperfect > input").value
        + "," + document.querySelector("#present > .prospective > input").value
        + "," + document.querySelector("#future > .simple > input").value
        + "," + document.querySelector("#future > .continuous > input").value
        + "," + document.querySelector("#future > .perfect > input").value
        + "," + document.querySelector("#future > .imperfect > input").value
        + "," + document.querySelector("#future > .prospective > input").value;

    document.getElementById("storage").innerHTML += "<div data-index=" + storage.length + "><span class='close'>X</span>" + document.getElementById("verb").value + "</div>";

    let quest = document.querySelectorAll(".close");
    quest.forEach(function (element) {
        element.addEventListener('click', function () {
            storage.splice(element.parentElement.getAttribute("data-index"), 1);
            element.parentElement.remove();
        })
    });

    storage.push(data);
}

function downloadStorage() {
    let csvContent = "data:text/csv;charset=utf-8,";
    for (var i = 0; i < storage.length; i++) { csvContent += storage[i] + "\r\n"; }
    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "conjugations.csv");
    document.body.appendChild(link);

    link.click();
}

function conjugatestore() {
    conjugate();
    storeVerb();
}

function conjugate() {
    document.getElementById("error").value = "";
    let verb = document.getElementById("verb").value;

    let illegalLetter = false;
    let illegalEnding = false;
    let illegalLetters = "";
    let illegalEndLetter = "";

    // Check if the last letter is legal
    if (legalVerbEndings.findIndex(x => x === verb[verb.length - 1]) < 0) {
        illegalEnding = true;
        illegalEndLetter = " '" + verb[verb.length - 1] + "'";
    }
    // check if the letters are legal
    for (let letter = 0; letter < verb.length; letter++) {
        if (legalLetters.findIndex(x => x === verb[letter]) < 0) {
            illegalLetter = true;
            illegalLetters += " '" + verb[letter] + "'" + " (" + (letter + 1) + ")";
        }
        else { }
    }

    if (illegalLetter) { document.getElementById("error").value += "illegal letter:" + illegalLetters; }
    if (illegalLetter && illegalEnding) { document.getElementById("error").value += ",  "; }
    if (illegalEnding) { document.getElementById("error").value += "illegal verb ending: " + illegalEndLetter; }

    // if legal, start conjugation
    if (!illegalLetter && !illegalEnding) {
        // past tense conjugation rules
        let pastVerb = verb;
        if (pastVerb.length > 3
            && ((legalVowels.findIndex(x => x === pastVerb[1]) > -1 && legalVowels.findIndex(x => x === pastVerb[2]) > -1)
                || (legalConstants.findIndex(x => x === pastVerb[1]) > -1 && legalConstants.findIndex(x => x === pastVerb[2]) > -1))) {
            pastVerb = pastVerb[0] + pastVerb.slice(2) + "é";
        }
        else if (pastVerb[pastVerb.length - 1] == "s") {
            pastVerb += "é";
        }
        else if (pastVerb[pastVerb.length - 1] == "i") {
            pastVerb = pastVerb.substring(0, pastVerb.length - 1);
            if (pastVerb[pastVerb.length - 1] == "e") { pastVerb = pastVerb.substring(0, pastVerb.length - 1); }
            pastVerb += "é";
        }
        else {
            pastVerb += "ie";
        }
        document.querySelector("#past > .simple > input").value = pastVerb;
        document.querySelector("#past > .continuous > input").value = conjugateContinuous(pastVerb);
        document.querySelector("#past > .perfect > input").value = conjugatePerfect(pastVerb);
        document.querySelector("#past > .imperfect > input").value = conjugateImperfect(pastVerb);
        document.querySelector("#past > .prospective > input").value = conjugateProspective(pastVerb);

        // present tense conjugation rules
        let presentVerb = verb;
        if (presentVerb[0] == "a") { }
        else if (presentVerb[0] == "é") { presentVerb = "e" + presentVerb.substring(1); }
        else if (presentVerb[0] == "í") { presentVerb = "i" + presentVerb.substring(1); }
        else if (presentVerb[0] == "ó") { presentVerb = "ór" + presentVerb.substring(1); }
        else if (presentVerb[0] == "ú") { presentVerb = "úr" + presentVerb.substring(1); }
        else if (presentVerb[0] == "e" && presentVerb[1] == "a") { presentVerb = "ae" + presentVerb.substring(2); }
        else { presentVerb = "a" + presentVerb; }
        document.querySelector("#present > .simple > input").value = presentVerb;
        document.querySelector("#present > .continuous > input").value = conjugateContinuous(presentVerb);
        document.querySelector("#present > .perfect > input").value = conjugatePerfect(presentVerb);
        document.querySelector("#present > .imperfect > input").value = conjugateImperfect(presentVerb);
        document.querySelector("#present > .prospective > input").value = conjugateProspective(presentVerb);

        // future tense conjugation rules
        let futureVerb = verb;
        if (futureVerb[futureVerb.length - 1] == "s") { futureVerb += "me"; }
        else { futureVerb += "ve"; }
        document.querySelector("#future > .simple > input").value = futureVerb;
        document.querySelector("#future > .continuous > input").value = conjugateContinuous(futureVerb);
        document.querySelector("#future > .perfect > input").value = conjugatePerfect(futureVerb);
        document.querySelector("#future > .imperfect > input").value = conjugateImperfect(futureVerb);
        document.querySelector("#future > .prospective > input").value = conjugateProspective(futureVerb);
    }
}

function conjugateContinuous(verb) {
    if (verb[0] == "ó" || verb[0] == "ú") { verb = "re'" + verb; }
    else { verb = "ró'" + verb; }
    return verb;
}

function conjugatePerfect(verb) {
    if (verb[0] == "n" || verb[0] == "t" || verb[0] == "k") { verb = "anó'" + verb; }
    else { verb = "an'" + verb; }
    return verb;
}

function conjugateImperfect(verb) {
    if (verb[0] == "ó" || verb[0] == "ú") { verb = "nóm'" + verb; }
    else { verb = "nó'" + verb; }
    return verb;
}

function conjugateProspective(verb) {
    if (legalVowels.findIndex(x => x === verb[verb.length - 1]) < 0) { verb += "'a"; }
    else { verb += "'na" }
    return verb;
}
