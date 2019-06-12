var canvas = document.getElementById("Canvas");
var context = canvas.getContext("2d");
let center_x = canvas.width / 2;
let center_y = canvas.height / 2;
let max_radius = (canvas.width / 2) - 10

var turn_interval;
var interval_running = false;
var is_clockwise = true;
var step_number = 0;

var elements_prime = ["Air", "Earth", "Fire", "Water", "White"];
var elements_lower = ["Anima", "Leta", "Simulacra", "Vita"];
var elements_higher = ["Arcane", "Light", "Shadow"];

let circles = {
    laws: {
        color: "#666666",
        radius: max_radius,
        rotation: -0.03,
        last_rotation: 0.0,
        angle_per_part: 0.0,
        parts: ["Alteration", "Assertion", "Conjuration", "Destruction", "Exaltation", "Reduction", "Transmutation"]
    },
    areas_of_effect: {
        color: "#666666",
        radius: max_radius - 40,
        rotation: 0.0,
        last_rotation: 0.0,
        angle_per_part: 0.0,
        parts: ["Caster", "Single Target", "Presence", "Natural Effect", "Measured Area"]
    },
    durations: {
        color: "#666666",
        radius: max_radius - 80,
        rotation: 0.0,
        last_rotation: 0.0,
        angle_per_part: 0.0,
        parts: ["Instantaneous", "Sustained", "Elapsed Time", "Permanent"]
    },
    elements: {
        color: "#666666",
        radius: max_radius - 120,
        rotation: 0.0,
        last_rotation: 0.0,
        angle_per_part: 0.0,
        parts: ["Air", "Earth", "Fire", "Water", "White"]
    },
    origin: {
        color: "#666666",
        radius: max_radius - 160,
        rotation: 0.0,
        last_rotation: 0.0,
        angle_per_part: 0.0,
        parts: ["Personal", "Presence", "Sight"]
    },
    dead_circle: {
        color: "#2d2d2d",
        radius: max_radius - 200,
        rotation: 0.0,
        last_rotation: 0.0,
        angle_per_part: 0.0,
        parts: [""]
    }
}


document.addEventListener("DOMContentLoaded", function () {
    for (let circle in circles) { circles[circle].angle_per_part = (2 * Math.PI) / (circles[circle].parts.length); }
    drawCircles();
});

document.getElementById("turnbutton").addEventListener("click", function () {
    if (!interval_running) {
        rotateCircles(
            (document.getElementById("direction").value == "true"), 
            document.getElementById("steps").value
        );
    }
});


function rotateCircles(clockwise, steps) {
    interval_running = true;
    is_clockwise = clockwise;
    step_number = steps;
    console.log(step_number)
    turn_interval = setInterval(turnIt, 1);
}

function turnIt() {
    for (let circle in circles) {

        if (is_clockwise) { circles[circle].rotation -= circles[circle].angle_per_part * step_number / 20; }
        else { circles[circle].rotation += circles[circle].angle_per_part * step_number / 20; }
        if (circles[circle].rotation > 2 * Math.PI) { circles[circle].rotation -= (2 * Math.PI); }
        if (circles[circle].rotation < - 2 * Math.PI) { circles[circle].rotation += (2 * Math.PI); }

        drawCircles();

        if (circles[circle].rotation == circles[circle].last_rotation + (circles[circle].angle_per_part * step_number * -1) ||
            circles[circle].rotation == circles[circle].last_rotation + (circles[circle].angle_per_part * step_number)) {
            clearInterval(turn_interval);
            interval_running = false;
            circles[circle].last_rotation = circles[circle].rotation;
        }
    }
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
    context.rotate(start_angle /*- (50 / radius)*/);
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