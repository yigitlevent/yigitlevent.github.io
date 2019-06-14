document.addEventListener("DOMContentLoaded", function () { loadCircles(); });

var canvas = document.getElementById("Canvas");
var context = canvas.getContext("2d");

var wheel_image = new Image();
wheel_image.src = "wheel.png";
var font_bitmap_image = new Image();
font_bitmap_image.src = "font.png";
var font_data = [
    "Y", "Q", "V",
    "A", "B", "C", "D", "E", "F", "G", "H", "I", "J",
    "K", "L", "M", "N", "O", "P", "R", "S", "T",
    "U", "W", "X", "Z",
    "a", "b", "c", "d", "e", "f", "g", "h", "i", "j",
    "k", "l", "m", "n", "o", "p", "q", "r", "s", "t",
    "u", "v", "w", "x", "y", "z", " "
];
var char_width = 14;
var char_height = 20;

var center_x = canvas.width / 2;
var center_y = canvas.height / 2;
var max_radius = (canvas.width / 2) - 10

var rotation_interval;
var interval_running = false;

var hiding = false;

var elements_prime = ["Air", "Earth", "Fire", "Water", "White"];
var elements_lower = ["Anima", "Leta", "Simulacra", "Vita"];
var elements_higher = ["Arcane", "Light", "Shadow"];

var data_elements = ["starting-law", "starting-aoe", "starting-duration", "starting-elements-prime", "starting-elements-lower", "starting-elements-higher", "starting-origin"];

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

var dead_circle = {
    color: "#999999",
    radius: max_radius - 200
}

function loadCircles() {
    for (let circle in circles) { circles[circle].angle_per_part = (2 * Math.PI) / (circles[circle].parts.length); }
    font_bitmap_image.onload = function () { drawCircles(); }
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

        let clockwise = (document.getElementById("direction").value == "true");
        let steps = parseInt(document.getElementById("steps").value);
        if (clockwise) { steps *= -1; }

        for (let circle in circles) {
            circles[circle].target_step = circles[circle].current_step - steps;
            circles[circle].speed = ((Math.random() * 2) + 1) / (80 * circles[circle].angle_per_part);
        }

        rotation_interval = setInterval(rotationInterval, 16, steps);
    }
}

function rotationInterval(steps) {
    let rotation_done_for = 0;

    for (let circle in circles) {
        circles[circle].current_step -= (circles[circle].speed * steps);

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
        context.arc(center_x, center_y, circles[circle].radius, 0, 2 * Math.PI);
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
        context.drawImage(font_bitmap_image, (font_data.indexOf(string[n]) * char_width), 0,
            char_width, char_height, 0, 0, (char_width - 2), char_height);
        context.restore();
    }

    context.restore();
}

function drawDeadCircle() {
    context.fillStyle = dead_circle.color;

    context.beginPath();
    context.arc(center_x, center_y, dead_circle.radius, 0, 2 * Math.PI);
    context.fill();

    context.save();
    context.clip();
    context.drawImage(wheel_image, 210, 208, 170, 170);
    context.restore();
}

function drawWedge() {
    let first_angle = 240 * Math.PI / 180;
    let last_angle = 300 * Math.PI / 180;

    context.save();

    context.beginPath();
    context.arc(center_x, center_y, max_radius, first_angle, last_angle);
    context.lineTo(center_x, center_y);
    context.closePath();

    context.globalAlpha = 0.1;
    context.fillStyle = "#FFFFFF";
    context.fill();

    context.restore();
}

function drawHideWedge() {
    let first_angle = 300 * Math.PI / 180;
    let last_angle = 240 * Math.PI / 180;

    context.beginPath();
    context.arc(center_x, center_y, max_radius + 1, first_angle, last_angle);
    context.lineTo(center_x, center_y);
    context.closePath();

    context.fillStyle = "#2d2d2d";
    context.fill();
}