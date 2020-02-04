const canvas = document.getElementById("Canvas");
const context = canvas.getContext("2d");
const font_image = document.getElementById("font-img");
const wheel_image = document.getElementById("wheel-img");
const font_data = [
    "Y", "Q", "V",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "R", "S", "T",
    "U", "W", "X", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z", " "
];
const char_width = 14;
const char_height = 20;
const center_x = 295;
const center_y = center_x;
const max_radius = 285;
const elements_prime = [
    "Air",
    "Earth",
    "Fire",
    "Water",
    "White"
];
const elements_lower = [
    "Anima",
    "Leta",
    "Simulacra",
    "Vita"
];
const elements_higher = [
    "Arcane",
    "Light",
    "Shadow"
];
const data_elements = [
    "starting-law",
    "starting-aoe",
    "starting-duration",
    "starting-elements-prime",
    "starting-elements-lower",
    "starting-elements-higher",
    "starting-origin"
];
var rotation_interval;
var interval_running = false;
var hiding = false;
var circles = {
    laws: {
        color: "#444444",
        radius: max_radius,
        angle_per_part: 0.0,
        current_step: 0,
        target_step: 0,
        speed: 0,
        rotation_done: false,
        html_element: "starting-law",
        parts: ["Alteration", "Assertion", "Conjuration", "Destruction", "Exaltation", "Reduction", "Transmutation"]
    },
    areas_of_effect: {
        color: "#555555",
        radius: max_radius - 40,
        angle_per_part: 0.0,
        current_step: 0,
        target_step: 0,
        speed: 0,
        rotation_done: false,
        html_element: "starting-aoe",
        parts: ["Caster", "Single Target", "Presence", "Natural Effect", "Measured Area"]
    },
    durations: {
        color: "#666666",
        radius: max_radius - 80,
        angle_per_part: 0.0,
        current_step: 0,
        target_step: 0,
        speed: 0,
        rotation_done: false,
        html_element: "starting-duration",
        parts: ["Instantaneous", "Sustained", "Elapsed Time", "Permanent"]
    },
    elements: {
        color: "#777777",
        radius: max_radius - 120,
        angle_per_part: 0.0,
        current_step: 0,
        target_step: 0,
        speed: 0,
        rotation_done: false,
        html_element: "starting-elements-prime",
        element_category: "prime",
        parts: ["Air", "Earth", "Fire", "Water", "White"]
    },
    origins: {
        color: "#888888",
        radius: max_radius - 160,
        angle_per_part: 0.0,
        current_step: 0,
        target_step: 0,
        speed: 0,
        rotation_done: false,
        html_element: "starting-origin",
        parts: ["Personal", "Presence", "Sight"]
    }
}
const elements_data = {
    "Air": { ob: 1, ac: 6 },
    "Earth": { ob: 1, ac: 14 },
    "Fire": { ob: 2, ac: 4 },
    "Water": { ob: 2, ac: 8 },
    "White": { ob: 3, ac: 6 },
    "Anima": { ob: 4, ac: 4 },
    "Leta": { ob: 2, ac: 14 },
    "Simulacra": { ob: 5, ac: 4 },
    "Vita": { ob: 3, ac: 8 },
    "Arcane": { ob: 3, ac: 14 },
    "Light": { ob: 2, ac: 20 },
    "Shadow": { ob: 4, ac: 10 }
}
const laws_data = {
    "Alteration": { ob: 6, ac: 15 },
    "Assertion": { ob: 4, ac: 7 },
    "Conjuration": { ob: 7, ac: 33 },
    "Destruction": { ob: 3, ac: 1 },
    "Exaltation": { ob: 5, ac: 13 },
    "Reduction": { ob: 2, ac: 1 },
    "Transmutation": { ob: 4, ac: 27 }
}
const origins_data = {
    "Personal": { ob: 1, ac: 1 },
    "Presence": { ob: 2, ac: 3 },
    "Sight": { ob: 3, ac: 5 }
}
const durations_data = {
    "Instantaneous": { ob: 1, ac: 1 },
    "Sustained": { ob: 2, ac: 2 },
    "Actions/Seconds": { ob: 1, ac: 2 },
    "Exchanges": { ob: 2, ac: 6 },
    "Minutes": { ob: 3, ac: 8 },
    "Hours": { ob: 4, ac: 12 },
    "Days": { ob: 5, ac: 24 },
    "Months": { ob: 7, ac: 43 },
    "Years": { ob: 9, ac: 81 },
    "Permanent": { ob: 10, ac: 500 }
}
const areas_of_effect_data = {
    "Caster": { ob: 1, ac: 1 },
    "Single Target": { ob: 2, ac: 2 },
    "Presence": { ob: 3, ac: 3 },
    "Natural Effect": { ob: 4, ac: 4 },
    "Paces": { ob: 3, ac: 4 },
    "10s of Paces": { ob: 5, ac: 7 },
    "100s of Paces": { ob: 7, ac: 10 },
    "Miles": { ob: 9, ac: 13 },
    "10s of Miles": { ob: 11, ac: 16 },
    "100s of Miles": { ob: 13, ac: 19 }
}
var spell = {
    element: { name: "", obstacle: 0, actions: 0 },
    law: { name: "", obstacle: 0, actions: 0 },
    origin: { name: "", obstacle: 0, actions: 0 },
    duration: { name: "", obstacle: 0, actions: 0 },
    areaofeffect: { name: "", obstacle: 0, actions: 0 },
    element_law: { name: "", obstacle: 0, actions: 0 },
    origin_duration: { name: "", obstacle: 0, actions: 0 },
    final: { name: "", obstacle: 0, actions: 0, resource: 0 },
}

window.onload = function () { loadCircles(); };

function loadCircles() {
    for (let circle in circles) { circles[circle].angle_per_part = (2 * Math.PI) / (circles[circle].parts.length); }
    drawCircles();
}

function changeMenu(obj) {
    document.getElementById("butt-wheel").style.backgroundColor = "#2d2d2d";
    document.getElementById("butt-disti").style.backgroundColor = "#2d2d2d";
    document.getElementById(obj.id).style.backgroundColor = "#444444";

    document.getElementById("wheel").style.display = "none";
    document.getElementById("disti").style.display = "none";
    document.getElementById(obj.name).style.display = "block";
}

function calculateDist() {
    let el_val = document.getElementById("spell-element-1").value;
    let el_val_2 = document.getElementById("spell-element-2").value;
    let el_val_3 = document.getElementById("spell-element-3").value;
    let la_val = document.getElementById("spell-law-1").value;
    let la_val_2 = document.getElementById("spell-law-2").value;
    let or_val = document.getElementById("spell-origin").value;
    let du_val = document.getElementById("spell-duration").value;
    let ar_val = document.getElementById("spell-area-of-effect").value;
    let pattern_limit = document.getElementById("spell-pattern-limit").checked;
    let pattern_asv = document.getElementById("spell-pattern-asv").checked;
    let pattern_exte = document.getElementById("spell-pattern-exte").value;
    let pattern_comp = document.getElementById("spell-pattern-comp").value;
    let pattern_minor = document.getElementById("spell-pattern-minor-num").value;
    let pattern_minor_act = document.getElementById("spell-pattern-minor-act").value;
    let pattern_major = document.getElementById("spell-pattern-major-num").value;
    let pattern_major_pen = document.getElementById("spell-pattern-major-pen").value;
    let pattern_major_act = document.getElementById("spell-pattern-major-act").value;

    if (el_val != "") { document.getElementById("spell-element-2").disabled = false; }
    else { document.getElementById("spell-element-2").value = ""; document.getElementById("spell-element-2").disabled = true; }

    if (el_val_2 != "") { document.getElementById("spell-element-3").disabled = false; }
    else { document.getElementById("spell-element-3").value = ""; document.getElementById("spell-element-3").disabled = true; }

    if (la_val != "") { document.getElementById("spell-law-2").disabled = false; }
    else { document.getElementById("spell-law-2").value = ""; document.getElementById("spell-law-2").disabled = true; }

    if (pattern_minor > 0) { document.getElementById("spell-pattern-minor-act").disabled = false; }
    else { document.getElementById("spell-pattern-minor-act").value = ""; document.getElementById("spell-pattern-minor-act").disabled = true; }

    if (pattern_major > 0) {
        document.getElementById("spell-pattern-major-pen").disabled = false;
        document.getElementById("spell-pattern-major-act").disabled = false;
    }
    else {
        document.getElementById("spell-pattern-major-pen").value = "";
        document.getElementById("spell-pattern-major-act").value = "";
        document.getElementById("spell-pattern-major-pen").disabled = true;
        document.getElementById("spell-pattern-major-act").disabled = true;
    }

    if (document.getElementById("spell-element-1").value != "" &&
        document.getElementById("spell-law-1").value != "" &&
        document.getElementById("spell-origin").value != "" &&
        document.getElementById("spell-duration").value != "" &&
        document.getElementById("spell-area-of-effect").value != "") {

        spell = {
            element: { name: "", obstacle: 0, actions: 0 },
            law: { name: "", obstacle: 0, actions: 0 },
            origin: { name: "", obstacle: 0, actions: 0 },
            duration: { name: "", obstacle: 0, actions: 0 },
            areaofeffect: { name: "", obstacle: 0, actions: 0 },
            element_law: { name: "", obstacle: 0, actions: 0 },
            origin_duration: { name: "", obstacle: 0, actions: 0 },
            final: { name: "", obstacle: 0, actions: 0, resource: 0 },
        }

        spell.element.name = el_val;
        spell.element.obstacle = parseInt(elements_data[el_val].ob);
        spell.element.actions = parseInt(elements_data[el_val].ac);
        if (el_val_2 != "") {
            spell.element.name += ("/" + el_val_2);
            spell.element.obstacle += parseInt(elements_data[el_val_2].ob);
            spell.element.actions += parseInt(elements_data[el_val_2].ac);
        }
        if (el_val_3 != "") {
            spell.element.name += ("/" + el_val_3);
            spell.element.obstacle += parseInt(elements_data[el_val_3].ob);
            spell.element.actions += parseInt(elements_data[el_val_3].ac);
        }

        spell.law.name = la_val;
        spell.law.obstacle = parseInt(laws_data[la_val].ob);
        spell.law.actions = parseInt(laws_data[la_val].ac);
        if (la_val_2 != "") {
            spell.law.name += ("/" + la_val_2);
            spell.law.obstacle += parseInt(laws_data[la_val_2].ob);
            spell.law.actions += parseInt(laws_data[la_val_2].ac);
        }

        spell.origin.name = or_val;
        spell.origin.obstacle = (origins_data[or_val].ob);
        spell.origin.actions = (origins_data[or_val].ac);

        spell.duration.name = du_val;
        spell.duration.obstacle = parseInt(durations_data[du_val].ob);
        spell.duration.actions = parseInt(durations_data[du_val].ac);

        spell.areaofeffect.name = ar_val;
        spell.areaofeffect.obstacle = parseInt(areas_of_effect_data[ar_val].ob);
        spell.areaofeffect.actions = parseInt(areas_of_effect_data[ar_val].ac);

        let sum_1 = spell.element.obstacle + spell.law.obstacle;
        let sum_1_a = spell.element.actions + spell.law.actions;
        document.getElementById("spell-first-ob").value = sum_1;
        document.getElementById("spell-first-ti").value = sum_1_a;
        spell.element_law.obstacle = Math.round(sum_1 / 2);
        spell.element_law.actions = Math.round(sum_1_a / 2);

        let sum_2 = spell.origin.obstacle + spell.duration.obstacle;
        let sum_2_a = spell.origin.actions + spell.duration.actions;
        document.getElementById("spell-second-ob").value = sum_2;
        document.getElementById("spell-second-ti").value = sum_2_a;
        spell.origin_duration.obstacle = Math.round(sum_2 / 2);
        spell.origin_duration.actions = Math.round(sum_2_a / 2);

        let sum_3 = spell.element_law.obstacle + spell.origin_duration.obstacle + spell.areaofeffect.obstacle;
        let sum_3_a = spell.element_law.actions + spell.origin_duration.actions + spell.areaofeffect.actions;
        document.getElementById("spell-third-ob").value = Math.round(sum_3 / 2);
        document.getElementById("spell-third-ti").value = sum_3_a;
        spell.final.obstacle = Math.round(sum_3 / 2);
        spell.final.actions = Math.round(sum_3_a / 2);
        spell.final.resource = spell.final.obstacle * 4;

        if (pattern_limit) { spell.final.obstacle -= 1; }

        if (pattern_asv) { spell.final.actions *= 5; }

        if (pattern_exte > 0) {
            for (let i = 0; i < pattern_exte; i++) {
                spell.final.obstacle -= 1;
                spell.final.actions *= 5;
            }
        }

        if (pattern_comp > 0) {
            for (let i = 0; i < pattern_comp; i++) {
                spell.final.obstacle += 1;
                spell.final.actions -= Math.round(spell.final.actions / 2);
            }
        }

        if (pattern_minor > 0) {
            let percent = false;
            for (let i = 0; i < pattern_minor; i++) {
                spell.final.obstacle -= 1;
                if (!percent) { spell.final.actions *= (pattern_minor_act / 100); }
            }
        }

        if (pattern_major > 0) {
            for (let i = 0; i < pattern_major; i++) {
                spell.final.obstacle += parseInt(pattern_major_pen);
                spell.final.actions *= pattern_major_act;
            }
        }

        spell.final.obstacle = Math.round(spell.final.obstacle);
        spell.final.actions = Math.round(spell.final.actions);

        if (spell.final.obstacle < 1) { spell.final.obstacle = 1; }
        if (spell.final.actions < 1) { spell.final.actions = 1; }

        if (pattern_asv) { spell.final.obstacle = "[Stat]"; }
        if (!pattern_limit) { spell.final.obstacle += "^"; }

        document.getElementById("spell-final-ob").value = spell.final.obstacle;
        document.getElementById("spell-final-ac").value = spell.final.actions;
        document.getElementById("spell-final-re").value = spell.final.resource;

    }

}

function changeCategory() {
    let data = document.getElementById("element-category").value;

    for (let i = 0; i < data_elements.length; i++) {
        document.getElementById(data_elements[i]).value = 0;
        document.getElementById(data_elements[i]).getAttribute("prev-value").value = 0;
    }

    document.getElementById("starting-elements-prime").style.display = "none";
    document.getElementById("starting-elements-lower").style.display = "none";
    document.getElementById("starting-elements-higher").style.display = "none";

    if (data == 0) {
        circles.elements.element_category = "prime";
        circles.elements.parts = elements_prime;
    }
    else if (data == 1) {
        circles.elements.element_category = "lower";
        circles.elements.parts = elements_lower;
    }
    else if (data == 2) {
        circles.elements.element_category = "higher";
        circles.elements.parts = elements_higher;
    }
    circles.elements.html_element = "starting-elements-" + circles.elements.element_category;

    document.getElementById(circles.elements.html_element).style.display = "inline-block";

    for (let circle in circles) {
        circles[circle].current_step = 0;
        circles[circle].angle_per_part = (2 * Math.PI) / (circles[circle].parts.length);
    }

    drawCircles();
}

function changeStart() {
    if (!interval_running && typeof (rotation_interval) === "undefined") {
        for (let circle in circles) {
            let en = circles[circle].html_element;
            document.getElementById(en).getAttribute("prev-value").value = document.getElementById(en).value;
            circles[circle].current_step = document.getElementById(en).value;
        }
        drawCircles();
    }
    else {
        for (let circle in circles) {
            let en = circles[circle].html_element;
            document.getElementById(en).value = document.getElementById(en).getAttribute("prev-value");
        }
    }
}

function switchHiding() {
    (hiding) ? hiding = false : hiding = true;
    drawCircles();
}

function switchSettings() {
    let sit = document.getElementById("settings").style.display;
    if (sit == "block") {
        document.getElementById("settings").style.display = "none";
        document.getElementById("switchSettings").value = "Show Settings";
    }
    else {
        document.getElementById("settings").style.display = "block";
        document.getElementById("switchSettings").value = "Hide Settings";
    }
}

function startRotation() {
    if (!interval_running && typeof (rotation_interval) === "undefined") {
        interval_running = true;

        let counterclockwise = (document.getElementById("direction").value == "true");
        let steps = parseInt(document.getElementById("steps").value);
        if (counterclockwise) { steps *= -1; }

        for (let circle in circles) {
            circles[circle].target_step = circles[circle].current_step - steps;
            circles[circle].speed = (steps * ((Math.random() * 2) + 1)) / (50 * Math.abs(steps) * circles[circle].angle_per_part);
        }

        rotation_interval = setInterval(rotationInterval, 16, steps);
    }
}

function rotationInterval(steps) {
    let rotation_done_for = 0;

    for (let circle in circles) {
        circles[circle].current_step -= circles[circle].speed;

        if (steps < 0 && circles[circle].current_step >= circles[circle].target_step) {
            circles[circle].current_step = circles[circle].target_step;

            while (circles[circle].target_step > circles[circle].parts.length - 1) { circles[circle].target_step -= circles[circle].parts.length; }
            while (circles[circle].current_step > circles[circle].parts.length - 1) { circles[circle].current_step -= circles[circle].parts.length; }

            circles[circle].rotation_done = true;
        }
        else if (steps > 0 && circles[circle].current_step <= circles[circle].target_step) {
            circles[circle].current_step = circles[circle].target_step;

            while (circles[circle].target_step < 0) { circles[circle].target_step += circles[circle].parts.length; }
            while (circles[circle].current_step < 0) { circles[circle].current_step += circles[circle].parts.length; }

            circles[circle].rotation_done = true;
        }
    }

    for (let circle in circles) { if (circles[circle].rotation_done) { rotation_done_for++; } }

    if (rotation_done_for == 5) {
        clearInterval(rotation_interval);
        rotation_interval = undefined;
        interval_running = false;

        for (let circle in circles) {
            document.getElementById(circles[circle].html_element).value = circles[circle].current_step;
            circles[circle].rotation_done = false;
        }
    }

    drawCircles();
}

function drawCircles() {
    for (let circle in circles) {
        context.beginPath();
        context.arc(center_x, center_y, circles[circle].radius, 0, 6.28318);
        context.closePath();

        context.fillStyle = circles[circle].color;
        context.fill();
    }

    drawWedge();
    drawText();
    if (hiding) { drawHideWedge(); }
    drawDeadCircle();
}

function drawText() {
    for (let circle in circles) {
        for (let i = 0; i < circles[circle].parts.length; i++) {
            drawTextAlongArc(
                circles[circle].parts[i],
                circles[circle].radius,
                12 / circles[circle].radius,
                circles[circle].angle_per_part * ((-1 * circles[circle].current_step) + i),
                (6 * (circles[circle].parts[i].length + 2) / circles[circle].radius)
            );
        }
    }
}

function drawTextAlongArc(string, radius, letter_angle, start_angle, center_angle) {
    context.save();
    context.translate(center_x, center_y);
    context.rotate(start_angle - center_angle);

    for (let n = 0; n < string.length; n++) {
        context.rotate(letter_angle);

        context.save();
        context.translate(0, -1 * radius + 11);
        context.drawImage(
            font_image,
            (font_data.indexOf(string[n]) * char_width), 0,
            char_width, char_height, 0, 0, (char_width - 2), char_height
        );
        context.restore();
    }

    context.restore();
}

function drawDeadCircle() {
    context.beginPath();
    context.arc(center_x, center_y, 85, 0, 6.28318);
    context.closePath();

    context.fillStyle = "#999999";
    context.fill();

    context.save();
    context.clip();
    context.drawImage(wheel_image, 210, 208, 170, 170);
    context.restore();
}

function drawWedge() {
    context.save();

    context.beginPath();
    context.arc(center_x, center_y, max_radius, 4.18879, 5.23599);
    context.lineTo(center_x, center_y);
    context.closePath();

    context.globalAlpha = 0.1;
    context.fillStyle = "#FFFFFF";
    context.fill();

    context.restore();
}

function drawHideWedge() {
    context.beginPath();
    context.arc(center_x, center_y, max_radius + 1, 5.23599, 4.18879);
    context.lineTo(center_x, center_y);
    context.closePath();

    context.fillStyle = "#2d2d2d";
    context.fill();
}

function downloadSpell() {
    let na_val = document.getElementById("spell-name").value;
    let de_val = document.getElementById("spell-description").value;

    let spellInfo = "";

    spellInfo += "\tName: " + na_val + ", ob: " + spell.final.obstacle + ", action: " + spell.final.actions + "\r\n";
    spellInfo += de_val + "\r\n";
    spellInfo += "\tElement: " + spell.element.name;
    spellInfo += "\r\n";

    spellInfo += "\tLaw: " + spell.law.name;
    spellInfo += "\r\n";

    spellInfo += "\tOrigin: " + spell.origin.name;
    spellInfo += "\r\n";

    spellInfo += "\tDuration: " + spell.duration.name;
    spellInfo += "\r\n";

    spellInfo += "\tArea of Effect: " + spell.areaofeffect.name;
    spellInfo += "\r\n\r\n";

    let sum_1 = spell.element.obstacle + spell.law.obstacle;
    let sum_1_a = spell.element.actions + spell.law.actions;
    let sum_2 = spell.origin.obstacle + spell.duration.obstacle;
    let sum_2_a = spell.origin.actions + spell.duration.actions;
    let sum_3 = spell.element_law.obstacle + spell.origin_duration.obstacle + spell.areaofeffect.obstacle;
    let sum_3_a = spell.element_law.actions + spell.origin_duration.actions + spell.areaofeffect.actions;

    spellInfo += "\tAnalysis Info";
    spellInfo += "\r\n";
    spellInfo += "Foundation Analysis, ob: " + sum_1 + ", duration:" + sum_1_a + " weeks";
    spellInfo += "\r\n";
    spellInfo += "Fundamental Analysis, ob: " + sum_2 + ", duration:" + sum_2_a + " weeks";
    spellInfo += "\r\n";
    spellInfo += "Binding Analysis, ob: " + sum_3 + ", duration: " + sum_3_a + " weeks";

    let element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(spellInfo));
    element.setAttribute("download", na_val + " Spell");
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}