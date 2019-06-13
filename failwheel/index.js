var canvas = document.getElementById("Canvas");
var context = canvas.getContext("2d");
let center_x = canvas.width / 2;
let center_y = canvas.height / 2;
let max_radius = (canvas.width / 2) - 10

var rotation_interval;
var interval_running = false;

var elements_prime = ["Air", "Earth", "Fire", "Water", "White"];
var elements_lower = ["Anima", "Leta", "Simulacra", "Vita"];
var elements_higher = ["Arcane", "Light", "Shadow"];

let circles = {
    laws: {
        color: "#666666",
        radius: max_radius,
        angle_per_part: 0.0,
        current_step: 0,
        target_step: 0,
        rotation_done: false,
        html_element: "starting-law",
        parts: ["Alteration", "Assertion", "Conjuration", "Destruction", "Exaltation", "Reduction", "Transmutation"]
    },
    areas_of_effect: {
        color: "#666666",
        radius: max_radius - 40,
        angle_per_part: 0.0,
        current_step: 0,
        target_step: 0,
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
        rotation_done: false,
        html_element: "starting-duration",
        parts: ["Instantaneous", "Sustained", "Elapsed Time", "Permanent"]
    },
    elements: {
        color: "#666666",
        radius: max_radius - 120,
        angle_per_part: 0.0,
        current_step: 0,
        target_step: 0,
        rotation_done: false,
        html_element: "starting-elements-prime",
        element_category: "prime",
        parts: ["Air", "Earth", "Fire", "Water", "White"]
    },
    origins: {
        color: "#666666",
        radius: max_radius - 160,
        angle_per_part: 0.0,
        current_step: 0,
        target_step: 0,
        rotation_done: false,
        html_element: "starting-origin",
        parts: ["Personal", "Presence", "Sight"]
    }
}

var dead_circle = {
    color: "#2d2d2d",
    radius: max_radius - 200
}

document.addEventListener("DOMContentLoaded", function () { loadCircles(); });

function loadCircles() {
    for (let circle in circles) { circles[circle].angle_per_part = (2 * Math.PI) / (circles[circle].parts.length); }
    drawCircles();
}

function changeCategory() {
    let data = document.getElementById("element-category").value;

    document.getElementById("starting-law").value = 0;
    document.getElementById("starting-aoe").value = 0;
    document.getElementById("starting-duration").value = 0;
    document.getElementById("starting-elements-prime").value = 0;
    document.getElementById("starting-elements-lower").value = 0;
    document.getElementById("starting-elements-higher").value = 0;
    document.getElementById("starting-origin").value = 0;

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
    for (let circle in circles) {
        let step = document.getElementById(circles[circle].html_element).value;
        circles[circle].current_step = step;
    }

    drawCircles();
}

function startRotation() {
    if (!interval_running && typeof (rotation_interval) === "undefined") {
        interval_running = true;

        let clockwise = (document.getElementById("direction").value == "true");
        let steps = parseInt(document.getElementById("steps").value);
        if (clockwise) { steps *= -1; }
        for (let circle in circles) {
            circles[circle].target_step = circles[circle].current_step - steps;
        }

        rotation_interval = setInterval(rotationInterval, 16, steps);
    }
}

function rotationInterval(steps) {
    let rotation_done_for = 0;

    for (let circle in circles) {
        circles[circle].current_step -= (steps / (50 * circles[circle].angle_per_part));
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
        context.fillStyle = circles[circle].color;
        context.lineWidth = 2;
        context.fill();
        context.stroke();

        for (let i = 0; i < circles[circle].parts.length; i++) {
            let letter_angle = 16 / circles[circle].radius;
            drawTextAlongArc(
                circles[circle].parts[i],
                circles[circle].radius,
                letter_angle,
                circles[circle].angle_per_part * ((-1 * circles[circle].current_step) + i)
            );
        }
    }

    drawDeadCircle();
    drawLine();
}

function drawTextAlongArc(string, radius, letter_angle, start_angle) {
    context.textAlign = "left";
    context.textBaseline = "hanging";
    context.font = "16px consolas black";
    context.fillStyle = "#000000";

    context.save();
    context.translate(center_x, center_y);
    context.rotate(start_angle);
    for (var n = 0; n < string.length; n++) {
        context.rotate(letter_angle);
        context.save();
        context.translate(0, -1 * radius + 13);
        context.fillText(string[n], 0, 0);  // performance sink
        context.restore();
    }
    context.restore();
}

function drawDeadCircle() {
    context.beginPath();
    context.arc(center_x, center_y, dead_circle.radius, 0, 2 * Math.PI);
    context.fillStyle = dead_circle.color;
    context.lineWidth = 2;
    context.fill();
    context.stroke();
}

function drawLine() {
    context.save()
    context.beginPath();
    context.moveTo(center_x, center_y);
    context.lineTo(center_x, 11);
    context.globalAlpha = 0.5;
    context.strokeStyle = "#660000";
    context.stroke();
    context.restore();
}