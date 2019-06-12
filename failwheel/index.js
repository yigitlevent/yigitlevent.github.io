var canvas = document.getElementById("Canvas");
var context = canvas.getContext("2d");
let center_x = canvas.width / 2;
let center_y = canvas.height / 2;
let max_radius = (canvas.width / 2) - 10

var turn_interval;
var interval_running = false;
var element_category = "prime";

var elements_prime = ["Air", "Earth", "Fire", "Water", "White"];
var elements_lower = ["Anima", "Leta", "Simulacra", "Vita"];
var elements_higher = ["Arcane", "Light", "Shadow"];

let circles = {
    laws: {
        color: "#666666",
        radius: max_radius,
        rotation: 0.0,
        angle_per_part: 0.0,
        current_step: 0,
        parts: ["Alteration", "Assertion", "Conjuration", "Destruction", "Exaltation", "Reduction", "Transmutation"]
    },
    areas_of_effect: {
        color: "#666666",
        radius: max_radius - 40,
        rotation: 0.0,
        angle_per_part: 0.0,
        current_step: 0,
        parts: ["Caster", "Single Target", "Presence", "Natural Effect", "Measured Area"]
    },
    durations: {
        color: "#666666",
        radius: max_radius - 80,
        rotation: 0.0,
        angle_per_part: 0.0,
        current_step: 0,
        parts: ["Instantaneous", "Sustained", "Elapsed Time", "Permanent"]
    },
    elements: {
        color: "#666666",
        radius: max_radius - 120,
        rotation: 0.0,
        angle_per_part: 0.0,
        current_step: 0,
        parts: ["Air", "Earth", "Fire", "Water", "White"]
    },
    origins: {
        color: "#666666",
        radius: max_radius - 160,
        rotation: 0.0,
        angle_per_part: 0.0,
        current_step: 0,
        parts: ["Personal", "Presence", "Sight"]
    },
    dead_circle: {
        color: "#2d2d2d",
        radius: max_radius - 200,
        rotation: 0.0,
        angle_per_part: 0.0,
        current_step: 0,
        parts: ["", ""]
    }
}
let circles_reset = {
    laws: {
        color: "#666666",
        radius: max_radius,
        rotation: 0.0,
        angle_per_part: 0.0,
        current_step: 0,
        parts: ["Alteration", "Assertion", "Conjuration", "Destruction", "Exaltation", "Reduction", "Transmutation"]
    },
    areas_of_effect: {
        color: "#666666",
        radius: max_radius - 40,
        rotation: 0.0,
        angle_per_part: 0.0,
        current_step: 0,
        parts: ["Caster", "Single Target", "Presence", "Natural Effect", "Measured Area"]
    },
    durations: {
        color: "#666666",
        radius: max_radius - 80,
        rotation: 0.0,
        angle_per_part: 0.0,
        current_step: 0,
        parts: ["Instantaneous", "Sustained", "Elapsed Time", "Permanent"]
    },
    elements: {
        color: "#666666",
        radius: max_radius - 120,
        rotation: 0.0,
        angle_per_part: 0.0,
        current_step: 0,
        parts: ["Air", "Earth", "Fire", "Water", "White"]
    },
    origins: {
        color: "#666666",
        radius: max_radius - 160,
        rotation: 0.0,
        angle_per_part: 0.0,
        current_step: 0,
        parts: ["Personal", "Presence", "Sight"]
    },
    dead_circle: {
        color: "#2d2d2d",
        radius: max_radius - 200,
        rotation: 0.0,
        angle_per_part: 0.0,
        current_step: 0,
        parts: ["", ""]
    }
}

document.addEventListener("DOMContentLoaded", function () { loadCircles(); });
document.getElementById("element-category").addEventListener("change", function () { changeCategory() });
document.getElementById("starting-law").addEventListener("change", function () { changeStart(); });
document.getElementById("starting-aoe").addEventListener("change", function () { changeStart(); });
document.getElementById("starting-duration").addEventListener("change", function () { changeStart(); });
document.getElementById("starting-elements-prime").addEventListener("change", function () { changeStart(); });
document.getElementById("starting-elements-lower").addEventListener("change", function () { changeStart(); });
document.getElementById("starting-elements-higher").addEventListener("change", function () { changeStart(); });
document.getElementById("starting-origin").addEventListener("change", function () { changeStart(); });
document.getElementById("turnbutton").addEventListener("click", function () { startRotation(); });

function loadCircles() {
    for (let circle in circles) {
        circles[circle].angle_per_part = (2 * Math.PI) / (circles[circle].parts.length);
    }
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

    circles.elements.rotation = 0.0;
    circles.elements.current_step = 0;

    if (data == 0) {
        element_category = "prime";
        circles.elements.parts = elements_prime;
        document.getElementById("starting-elements-prime").style.display = "inline-block";
        document.getElementById("starting-elements-lower").style.display = "none";
        document.getElementById("starting-elements-higher").style.display = "none";
    }
    else if (data == 1) {
        element_category = "lower";
        circles.elements.parts = elements_lower;
        document.getElementById("starting-elements-prime").style.display = "none";
        document.getElementById("starting-elements-lower").style.display = "inline-block";
        document.getElementById("starting-elements-higher").style.display = "none";
    }
    else if (data == 2) {
        element_category = "higher";
        circles.elements.parts = elements_higher;
        document.getElementById("starting-elements-prime").style.display = "none";
        document.getElementById("starting-elements-lower").style.display = "none";
        document.getElementById("starting-elements-higher").style.display = "inline-block";
    }

    for (let circle in circles) { circles[circle].angle_per_part = (2 * Math.PI) / (circles[circle].parts.length); }

    drawCircles();
}

function changeStart() {
    circles.laws.rotation = -1 * circles.laws.angle_per_part * document.getElementById("starting-law").value;
    circles.laws.current_step = document.getElementById("starting-law").value;

    circles.areas_of_effect.rotation = -1 * circles.areas_of_effect.angle_per_part * document.getElementById("starting-aoe").value;
    circles.areas_of_effect.current_step = document.getElementById("starting-aoe").value;

    circles.durations.rotation = -1 * circles.durations.angle_per_part * document.getElementById("starting-duration").value;
    circles.durations.current_step = document.getElementById("starting-duration").value;

    if (element_category == "prime") {
        circles.elements.rotation = -1 * circles.elements.angle_per_part * document.getElementById("starting-elements-prime").value;
        circles.elements.current_step = document.getElementById("starting-elements-prime").value;
    }
    else if (element_category == "lower") {
        circles.elements.rotation = -1 * circles.elements.angle_per_part * document.getElementById("starting-elements-lower").value;
        circles.elements.current_step = document.getElementById("starting-elements-lower").value;
    }
    else if (element_category == "higher") {
        circles.elements.rotation = -1 * circles.elements.angle_per_part * document.getElementById("starting-elements-higher").value;
        circles.elements.current_step = document.getElementById("starting-elements-higher").value;
    }

    circles.origins.rotation = -1 * circles.origins.angle_per_part * document.getElementById("starting-origin").value;
    circles.origins.current_step = document.getElementById("starting-origin").value;

    drawCircles();
}

function startRotation() {
    let clockwise = (document.getElementById("direction").value == "true");
    let steps = parseInt(document.getElementById("steps").value);
    if (clockwise) { steps *= -1; }

    for (let circle in circles) {
        circles[circle].rotation += (circles[circle].angle_per_part * steps);
        circles[circle].current_step -= steps;
        while (circles[circle].current_step > circles[circle].parts.length - 1) { circles[circle].current_step -= circles[circle].parts.length; }
        while (circles[circle].current_step < 0) { circles[circle].current_step += circles[circle].parts.length; }
    }

    document.getElementById("starting-law").value = circles.laws.current_step;
    document.getElementById("starting-aoe").value = circles.areas_of_effect.current_step;
    document.getElementById("starting-duration").value = circles.durations.current_step;
    if (element_category == "prime") {
        document.getElementById("starting-elements-prime").value = circles.elements.current_step;
    }
    else if (element_category == "lower") {
        document.getElementById("starting-elements-lower").value = circles.elements.current_step;
    }
    else if (element_category == "higher") {
        document.getElementById("starting-elements-higher").value = circles.elements.current_step;
    }
    document.getElementById("starting-origin").value = circles.origins.current_step;

    drawCircles();
}


function drawCircles() {
    for (let circle in circles) {
        context.beginPath();
        context.arc(center_x, center_y, circles[circle].radius, 0, 2 * Math.PI);

        context.fillStyle = circles[circle].color;
        context.fill();

        context.lineWidth = 2;
        context.stroke();

        for (let i = 0; i < circles[circle].parts.length; i++) {
            let letter_angle = 16 / circles[circle].radius;
            drawTextAlongArc(circles[circle].parts[i], center_x, center_y, circles[circle].radius,
                letter_angle, circles[circle].rotation + (circles[circle].angle_per_part * i));
        }
    }

    context.save()
    context.beginPath();
    context.moveTo(center_x, center_y);
    context.lineTo(center_x, 11);
    context.globalAlpha = 0.5;
    context.strokeStyle = "#660000";
    context.stroke();
    context.restore();
}

function drawTextAlongArc(string, centerX, centerY, radius, letter_angle, start_angle) {
    context.save();
    context.translate(centerX, centerY);
    context.rotate(start_angle);
    for (var n = 0; n < string.length; n++) {
        context.rotate(letter_angle);
        context.save();
        context.translate(0, -1 * radius + 13);
        context.textAlign = "left";
        context.textBaseline = "hanging";
        context.font = "16px consolas black";
        context.fillStyle = "#000000";
        context.fillText(string[n], 0, 0);
        context.restore();
    }
    context.restore();
}