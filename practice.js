let PracticeTimes = {
    "Academic": { Cycle: 6, Routine: 2, Difficult: 4, Challenging: 8 },
    "Artisan": { Cycle: 12, Routine: 4, Difficult: 8, Challenging: 12 },
    "Artist": { Cycle: 6, Routine: 3, Difficult: 6, Challenging: 12 },
    "Craftsman": { Cycle: 12, Routine: 3, Difficult: 8, Challenging: 12 },
    "Forester": { Cycle: 6, Routine: 3, Difficult: 6, Challenging: 12 },
    "Martial": { Cycle: 1, Routine: 2, Difficult: 4, Challenging: 8 },
    "Medicinal": { Cycle: 12, Routine: 4, Difficult: 8, Challenging: 12 },
    "Military": { Cycle: 6, Routine: 2, Difficult: 4, Challenging: 8 },
    "Musical": { Cycle: 1, Routine: 2, Difficult: 4, Challenging: 8 },
    "Peasant": { Cycle: 3, Routine: 1, Difficult: 4, Challenging: 12 },
    "Physical": { Cycle: 1, Routine: 2, Difficult: 4, Challenging: 8 },
    "School of Thought": { Cycle: 6, Routine: 3, Difficult: 6, Challenging: 12 },
    "Seafaring": { Cycle: 3, Routine: 2, Difficult: 4, Challenging: 8 },
    "Social": { Cycle: 1, Routine: 2, Difficult: 4, Challenging: 8 },
    "Sorcerous": { Cycle: 12, Routine: 5, Difficult: 10, Challenging: 15 },
    "Special": { Cycle: 3, Routine: 3, Difficult: 6, Challenging: 12 },
    "Will": { Cycle: 12, Routine: 4, Difficult: 8, Challenging: 16 },
    "Perception": { Cycle: 6, Routine: 3, Difficult: 6, Challenging: 12 },
    "Agility": { Cycle: 3, Routine: 2, Difficult: 4, Challenging: 8 },
    "Speed": { Cycle: 3, Routine: 3, Difficult: 6, Challenging: 9 },
    "Power": { Cycle: 1, Routine: 2, Difficult: 4, Challenging: 8 },
    "Forte": { Cycle: 2, Routine: 4, Difficult: 8, Challenging: 16 },
    "Faith": { Cycle: 12, Routine: 5, Difficult: 10, Challenging: 20 },
    "Steel": { Cycle: 2, Routine: 1, Difficult: 3, Challenging: 9 },
}

interact(".practiceBox")
    .draggable({
        snap: {
            targets: [
                interact.createSnapGrid({ x: 30, y: 30 })
            ],
            range: Infinity,
            relativePoints: [{ x: 0, y: 0 }]
        },
        inertia: false,
        autoScroll: true,
        onmove: dragMoveListener,
    });


document.getElementById("createBox").addEventListener('click', function () {
    if (document.getElementById("practiceType").value != "" &&
        document.getElementById("practiceData").value != "") {
        createBox();
    }
});

document.getElementById("practiceLength").addEventListener('change', function () {
    let length = document.getElementById("practiceLength").value;
    if (length.value != "") {
        let a = "";

        for (let i = 0; i < length; i++) {
            a += "<tr><td>" + (i + 1) + "</td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>"
        }

        document.getElementById("practiceTable").innerHTML = "<table id='actualTable'><tr><td></td><td colspan='24'>Hours</td></tr><tr><td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td></tr>" + a + "</table>";
    }
});

function dragMoveListener(event) {
    let target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
        target.style.transform =
        'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
}

function createBox() {
    let data = document.getElementById("practiceData").value;
    let type = document.getElementById("practiceType").value;
    let name = document.getElementById("skillName").value;

    let dataName = "";
    if (data != "Will" && data != "Perception" && data != "Agility" && data != "Speed" &&
        data != "Power" && data != "Forte" && data != "Faith" && data != "Steel") {
        dataName = name + "<br>";
    }

    let cycle = PracticeTimes[data]["Cycle"];
    let hours = PracticeTimes[data][type];

    document.getElementById("practiceBoxStart").innerHTML += "<span class='practiceBox' style='display: inline-block; width: " + (hours * 30) + "px; height: " + (cycle * 30) + "px' title='" + name + "/" + data + "/" + type + "'>" + dataName + data + "<br>" + type + "<div class='close' title='remove'>X</div></span>";

    interact(".practiceBox").draggable(true);

    let quest = document.querySelectorAll(".close");
    quest.forEach(function (element) { element.addEventListener('click', function () { element.parentElement.remove(); }) });
}