var drage = dragula([document.querySelector('#top'), document.querySelector('#left'), document.querySelector('#right')], {
        isContainer: function (el) {
            return false;
        },
        moves: function (el, source, handle, sibling) {
            return (el.classList.contains('draggable')); // elements are always draggable by default
        },
        accepts: function (el, target, source, sibling) {
            return (target.id == "left" || target.id == "right"); // elements can be dropped in any of the `containers` by default
        },
        invalid: function (el, handle) {
            return false; // don't prevent any drags from initiating by default
        },
        copy: function (el, source) {
            return (source.id == "top");
        },
        direction: 'vertical',
        copySortSource: false,
        revertOnSpill: false,
        removeOnSpill: true,
        mirrorContainer: document.body,
        ignoreInputTextSelection: false
    })
    .on('drop', function (el, source, target) {
        el.className = el.className.replace('onTop', '');
    });


class characterSheet {
    constructor() {
        this.basics = { name: "", age: 0, stock: "", lifepaths: "" }
        this.beliefs = { first: "", second: "", third: "", special: "" }
        this.instincts = { first: "", second: "", third: "", special: "" }

        this.stats = {
            Perception: { shade: "B", exponent: 1, difficult: 0, challenging: 0, fate: 0, persona: 0, deeds: 0 },
            Will:       { shade: "B", exponent: 2, difficult: 0, challenging: 0, fate: 0, persona: 0, deeds: 0 },
            Power:      { shade: "B", exponent: 3, difficult: 0, challenging: 0, fate: 0, persona: 0, deeds: 0 },
            Agility:    { shade: "B", exponent: 4, difficult: 0, challenging: 0, fate: 0, persona: 0, deeds: 0 },
            Forte:      { shade: "B", exponent: 5, difficult: 0, challenging: 0, fate: 0, persona: 0, deeds: 0 },
            Speed:      { shade: "B", exponent: 6, difficult: 0, challenging: 0, fate: 0, persona: 0, deeds: 0 }
        };
        
        this.attributes = {
            Health:         { shade: "B", exponent: 0, routine: 0, difficult: 0, challenging: 0, fate: 0, persona: 0, deeds: 0 },
            Steel:          { shade: "B", exponent: 0, routine: 0, difficult: 0, challenging: 0, fate: 0, persona: 0, deeds: 0 },
            Emotional:      { shade: "B", exponent: 0, routine: 0, difficult: 0, challenging: 0, fate: 0, persona: 0, deeds: 0, name: "Emotional Attribute" },
            Circles:        { shade: "B", exponent: 0, routine: 0, difficult: 0, challenging: 0, fate: 0, persona: 0, deeds: 0 },
            Resources:      { shade: "B", exponent: 0, routine: 0, difficult: 0, challenging: 0, fate: 0, persona: 0, deeds: 0 },
        };

        this.flatAttributes = {
            Stride:         { exponent: 0 },
            Hesitation:     { exponent: 0 },
            Reflexes:       { shade: "B", exponent: 0 },
            Misc:           { Cash: 0, Fund: 0, Debt: 0, Fate: 0, Persona: 0, Deeds: 0 }
        }
        
        this.skills = {};       // { name: "", shade: "B", exponent: 0, routine: 0, difficult: 0, challenging: 0, fate: 0, persona: 0, deeds: 0 }
        this.beingLearned = {}  // { name: "", tests: 0, root: "",  }
        this.practiceLog = {}   // { name: "", days: 0, testType: "" }

        this.traits = {};   // { name: "", type: "" }

        this.gear = {};     // { name: "", desc: "" }
        this.property = {}; // { name: "", desc: "" }

        this.relationships = {};    // { name: "", desc: "" }
        this.reputations = {};      // { name: "", dice: 0, desc: "" }
        this.affiliations = {};     // { name: "", dice: 0, desc: "" }

        this.circles = {}   // { name: "" }
        this.namedCharacters = {}   // { name: "", tests: 0 }

        this.ptgs = {
            shade: "B",
            tolerances: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""],
            wounds:     [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }

        this.armor = {
            head: { name: "", armor: 0, damage: 0},
            torso: { name: "", armor: 0, damage: 0},
            r_arm: { name: "", armor: 0, damage: 0},
            l_arm: { name: "", armor: 0, damage: 0},
            r_leg: { name: "", armor: 0, damage: 0},
            l_leg: { name: "", armor: 0, damage: 0},
            shield: { name: "", armor: 0, damage: 0}
        }

        this.melee = {}     // { name: "", power: 0, add: 0, va: 0, ws: 0, length: 0 }
        this.ranged = {}    // { name: "", incidental: 0, mark: 0, superb: 0, optimal: 0, extreme: 0, va: 0, dof: "" }

        this.spells = {}    // { name: "", ob: "", actions: 0, origin: "", element: "", aoe: "", impetus: "", duration: "" }
    }
}

var sheet;
document.addEventListener("DOMContentLoaded", function () {
    sheet = new characterSheet();

    doStats();
});

function doStats() {
    let str = "<div id='StatsInputs' class='i-050-marg'><div class='midTitle'>Stats</div>";

    for (let key in sheet.stats) {
        str += "<div id='" + key + "' class='i-050-marg statBox'>";

        str += "<input type='text' class='i-050-marg name' name='name-" + key + "' value='" + key + "' disabled/>"

        // Spent Data Block
        str += "<span class='i-012-marg data-block'>"
        str += "<input type='text' class='i-018-marg shade' name='shade-" + key + "' placeholder='0' value='" + sheet.stats[key].shade + "' />"
        str += "<input type='text' class='i-018-marg exponent' name='exponent-" + key + "' placeholder='0' value='" + sheet.stats[key].exponent + "' />"
        str += "</span>"

        // Spent Artha Block
        str += "<div class='i-100-marg spent-artha'>"
        str += "Fate: <input type='text' class='i-012-marg fate' name='fate-" + key + "' placeholder='0' value='" + sheet.stats[key].fate + "' />"
        str += "Persona: <input type='text' class='i-012-marg persona' name='persona-" + key + "' placeholder='0' value='" + sheet.stats[key].persona + "' />"
        str += "Deeds: <input type='text' class='i-012-marg deeds' name='deeds-" + key + "' placeholder='0' value='" + sheet.stats[key].deeds + "' />"
        str += "</div>"

        str += "<div class='gained-tests'>";

        let difNeeded = Math.ceil(sheet.stats[key].exponent / 2);
        str += "<div class='i-100-marg difficult'>Difficult: ";
        for (var i = 0; i < difNeeded; i++) {
            let checked = "";
            if (i < sheet.stats[key].difficult) { checked = "checked"; }
            str += "<input type='checkbox' class='round difficult' name='difficult-" + i + "' " + checked + " />";
        }
        str += "</div>"

        let chaNeeded = Math.ceil(sheet.stats[key].exponent / 3);
        str += "<div class='i-100-marg challenging'> Challenging: ";
        for (var i = 0; i < chaNeeded; i++) {
            let checked = "";
            if (i < sheet.stats[key].challenging) { checked = "checked"; }
            str += "<input type='checkbox' class='round challenging' name='challenging-" + i + "' " + checked + " />";
        }
        str += "</div>";

        str += "</div>";

        str += "</div>";
    }
    
    str += "</div>";

    str += "<div id='AttributesInputs' class='i-050-marg'><div class='midTitle'>Attributes</div>";

    for (let key in sheet.attributes) {
        str += "<div id='" + key + "' class='i-050-marg statBox'>";

        str += "<input type='text' class='i-050-marg name' name='name-" + key + "' value='" + key + "' disabled/>"

        // Spent Data Block
        str += "<span class='i-012-marg data-block'>"
        str += "<input type='text' class='i-018-marg shade' name='shade-" + key + "' placeholder='0' value='" + sheet.attributes[key].shade + "' />"
        str += "<input type='text' class='i-018-marg exponent' name='exponent-" + key + "' placeholder='0' value='" + sheet.attributes[key].exponent + "' />"
        str += "</span>"

        // Spent Artha Block
        str += "<div class='i-100-marg spent-artha'>"
        str += "Fate: <input type='text' class='i-012-marg fate' name='fate-" + key + "' placeholder='0' value='" + sheet.attributes[key].fate + "' />"
        str += "Persona: <input type='text' class='i-012-marg persona' name='persona-" + key + "' placeholder='0' value='" + sheet.attributes[key].persona + "' />"
        str += "Deeds: <input type='text' class='i-012-marg deeds' name='deeds-" + key + "' placeholder='0' value='" + sheet.attributes[key].deeds + "' />"
        str += "</div>"

        str += "<div class='gained-tests'>";

        let difNeeded = Math.ceil(sheet.attributes[key].exponent / 2);
        str += "<div class='i-100-marg difficult'>Difficult: ";
        for (var i = 0; i < difNeeded; i++) {
            let checked = "";
            if (i < sheet.attributes[key].difficult) { checked = "checked"; }
            str += "<input type='checkbox' class='round difficult' name='difficult-" + i + "' " + checked + " />";
        }
        str += "</div>"

        let chaNeeded = Math.ceil(sheet.attributes[key].exponent / 3);
        str += "<div class='i-100-marg challenging'> Challenging: ";
        for (var i = 0; i < chaNeeded; i++) {
            let checked = "";
            if (i < sheet.attributes[key].challenging) { checked = "checked"; }
            str += "<input type='checkbox' class='round challenging' name='challenging-" + i + "' " + checked + " />";
        }
        str += "</div>";

        str += "</div>";

        str += "</div>";
    }
    
    str += "</div>";
    
    str += "<div id='FlatAttributesInputs' class='i-068-marg'><div class='midTitle'>Misc</div>";

    str += "<div id='Reflexes' class='i-031-marg'>";
    str += "<input type='text' class='i-050-marg name' name='name-Reflexes' value='Reflexes' disabled/>"
    str += "<span class='i-012-marg data-block'>"
    str += "<input type='text' class='i-018-marg shade' name='shade-Reflexes' placeholder='0' value='" + sheet.flatAttributes["Reflexes"].shade + "' />"
    str += "<input type='text' class='i-018-marg exponent' name='exponent-Reflexes' placeholder='0' value='" + sheet.flatAttributes["Reflexes"].exponent + "' />"
    str += "</span>"
    str += "</div>";

    str += "<div id='Stride' class='i-031-marg'>";
    str += "<input type='text' class='i-050-marg name' name='name-Stride' value='Stride' disabled/>"
    str += "<span class='i-012-marg data-block'>"
    str += "<input type='text' class='i-018-marg exponent' name='exponent-Stride' placeholder='0' value='" + sheet.flatAttributes["Stride"].exponent + "' />"
    str += "</span>"
    str += "</div>";

    str += "<div id='Hesitation' class='i-031-marg '>";
    str += "<input type='text' class='i-050-marg name' name='name-Hesitation' value='Hesitation' disabled/>"
    str += "<span class='i-012-marg data-block'>"
    str += "<input type='text' class='i-018-marg exponent' name='exponent-Hesitation' placeholder='0' value='" + sheet.flatAttributes["Hesitation"].exponent + "' />"
    str += "</span>"
    str += "</div>";

    for (var key in sheet.flatAttributes["Misc"]) {
        str += "<div id='" + key + "' class='i-031-marg'>";
        str += "<input type='text' class='i-050-marg name' name='name-" + key + "' value='" + key +"' disabled/>"
        str += "<span class='i-012-marg data-block'>"
        str += "<input type='text' class='i-018-marg exponent' name='exponent-" + key + "' placeholder='0' value='" + sheet.flatAttributes["Misc"][key] + "' />"
        str += "</span>"
        str += "</div>";
    }

    str += "</div>";

    document.getElementById("Stats").innerHTML = str;
}

function doSkills() {
    let str = "<div id='SkillInputs' class='i-050-marg'><div class='midTitle'>Stats</div>";

    for (let key in sheet.skills) {
        str += "<div id='" + key + "' class='i-050-marg statBox'>";

        str += "<input type='text' class='i-050-marg name' name='name-" + key + "' value='" + key + "' disabled/>"

        // Spent Data Block
        str += "<span class='i-012-marg data-block'>"
        str += "<input type='text' class='i-018-marg shade' name='shade-" + key + "' placeholder='0' value='" + sheet.stats[key].shade + "' />"
        str += "<input type='text' class='i-018-marg exponent' name='exponent-" + key + "' placeholder='0' value='" + sheet.stats[key].exponent + "' />"
        str += "</span>"

        // Spent Artha Block
        str += "<div class='i-100-marg spent-artha'>"
        str += "Fate: <input type='text' class='i-012-marg fate' name='fate-" + key + "' placeholder='0' value='" + sheet.stats[key].fate + "' />"
        str += "Persona: <input type='text' class='i-012-marg persona' name='persona-" + key + "' placeholder='0' value='" + sheet.stats[key].persona + "' />"
        str += "Deeds: <input type='text' class='i-012-marg deeds' name='deeds-" + key + "' placeholder='0' value='" + sheet.stats[key].deeds + "' />"
        str += "</div>"

        str += "<div class='gained-tests'>";

        if (sheet.stats[key].exponent < 5) {
            let rouNeeded = sheet.stats[key].exponent;
            str += "<div class='i-100-marg routine'>Routine: ";
            for (var i = 0; i < rouNeeded; i++) {
                let checked = "";
                if (i < sheet.stats[key].routine) { checked = "checked"; }
                str += "<input type='checkbox' class='round routine' name='routine-" + i + "' " + checked + " />";
            }
            str += "</div>"
        }

        let difNeeded = Math.ceil(sheet.stats[key].exponent / 2);
        str += "<div class='i-100-marg difficult'>Difficult: ";
        for (var i = 0; i < difNeeded; i++) {
            let checked = "";
            if (i < sheet.stats[key].difficult) { checked = "checked"; }
            str += "<input type='checkbox' class='round difficult' name='difficult-" + i + "' " + checked + " />";
        }
        str += "</div>"

        let chaNeeded = Math.ceil(sheet.stats[key].exponent / 3);
        str += "<div class='i-100-marg challenging'> Challenging: ";
        for (var i = 0; i < chaNeeded; i++) {
            let checked = "";
            if (i < sheet.stats[key].challenging) { checked = "checked"; }
            str += "<input type='checkbox' class='round challenging' name='challenging-" + i + "' " + checked + " />";
        }
        str += "</div>";

        str += "</div>";

        str += "</div>";
    }
    
    str += "</div>";
    
    document.getElementById("Skills").innerHTML = str;
}