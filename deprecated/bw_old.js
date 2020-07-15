// BURNING WHEEL GOLD by github.com/yigitlevent
// additional thanks to Samson for helping out with lifepaths, skills and traits
// loosely based on bwlp -well, the design is kinda same but "backend" %99 different
// icons from https://material.io/

///////////////////////////// TODO LIST ////////////////////////////////////////////////////////////////////////////////////////////
// (BS)  Add Anakhi Lifepaths (Settings: Desert, Ghetto; Subsettings: Cannibal)
// (CHN) Revise changeling age pools, lifepath years and resources and all that
// (N/A) Uhh i forgot what i was gonna write here
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var BoxId = 0;
var debug = false;

var currentGame;
var currentChar;
var appWeaponsList;

var sortableOptions = {
	group: "character_appweaporder",
	handle: ".handle",
	onUpdate: function () { currentChar.checkAppWeap(appWeaponsList.el.children) },
	store: {
		get: function (sortable) {
			let order = localStorage.getItem(sortable.options.group.name);
			return order ? order.split("|") : [];
		},
		set: function (sortable) {
			let order = sortable.toArray();
			localStorage.setItem(sortable.options.group.name, order.join("|"));
		}
	}
}

interact(".practiceBox").draggable({
	snap: {
		targets: [
			interact.createSnapGrid({ x: 24, y: 24 })
		],
		range: Infinity
	},
	inertia: false,
	autoScroll: true
}).on('dragmove', function (event) {
	let target = event.target,
		// keep the dragged position in the data-x/data-y attributes
		x = (parseFloat(target.style.left) || 0) + event.dx,
		y = (parseFloat(target.style.top) || 0) + event.dy;

	// translate the element
	target.style.left = x + "px";
	target.style.top = y + "px";
});

/* Everything Starts Here */
document.addEventListener("DOMContentLoaded", function () {
	appWeaponsList = Sortable.create(document.getElementById("appropriateWeapons"), sortableOptions);
	currentGame = new game();
	currentChar = new character();

	if (window.innerWidth < 1001) {
		document.querySelectorAll(".midTitle").forEach(function (element) { element.classList.remove("hide"); });

		let cont = document.getElementById("revealerWrapper");
		document.body.removeChild(cont);
		document.getElementById("leftMenu").appendChild(cont);
	}

	document.getElementById("practiceTableWrapper").innerHTML += "<table id='actualPracticeTable'><tr><td></td><td colspan='24'>Hours</td></tr><tr><td></td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15</td><td>16</td><td>17</td><td>18</td><td>19</td><td>20</td><td>21</td><td>22</td><td>23</td><td>24</td></tr></table>";

	currentGame.updateLeftMenu();
	currentChar.refresh();
});

/* Filter Search Results */


function unloadEventListeners() {
	let prevExp = document.getElementById("explorerWrapper").scrollTop;
	let prevBur = document.getElementById("burnerWrapper").scrollTop;
	let prevChr = document.getElementById("chroniclerWrapper").scrollTop;
	let prevAdj = document.getElementById("adjusterWrapper").scrollTop;
	let prevObs = document.getElementById("observerWrapper").scrollTop;
	let prevPra = document.getElementById("practicerWrapper").scrollTop;
	let prevRev = document.getElementById("revealerWrapper").scrollTop;

	let cloneThese = [
		"explorerWrapper", "burnerWrapper", "chroniclerWrapper",
		"adjusterWrapper", "practicerWrapper", "observerWrapper", "revealerWrapper",
		"infoBox", "tabs", "settingSelector"
	];

	for (var i = 0; i < cloneThese.length; i++) {
		let el = document.getElementById(cloneThese[i]);
		let elClone = el.cloneNode(true);
		el.parentNode.replaceChild(elClone, el);
	}

	document.getElementById("explorerWrapper").scrollTop = prevExp;
	document.getElementById("burnerWrapper").scrollTop = prevBur;
	document.getElementById("chroniclerWrapper").scrollTop = prevChr;
	document.getElementById("adjusterWrapper").scrollTop = prevAdj;
	document.getElementById("observerWrapper").scrollTop = prevObs;
	document.getElementById("practicerWrapper").scrollTop = prevPra;
	document.getElementById("revealerWrapper").scrollTop = prevRev;
}

function loadEventListeners() {
	let setti = document.querySelectorAll(".settingLink, .lead");
	setti.forEach(function (element) { element.addEventListener('mouseup', currentGame.showSettingContent); });
	let lists = document.querySelectorAll(".listLink");
	lists.forEach(function (element) { element.addEventListener('mouseup', currentGame.showListContent); });

	let setSel = document.querySelectorAll(".settingSelect");
	setSel.forEach(function (element) { element.addEventListener('click', currentGame.changeType.bind(currentGame)); });
	let extSel = document.querySelectorAll(".optionalSelect, .extraSelect");
	extSel.forEach(function (element) { element.addEventListener('click', currentGame.switchOptional.bind(currentGame)); });

	let mitle = document.querySelectorAll(".midTitle");
	mitle.forEach(function (element) { element.addEventListener('mouseup', currentGame.changeTab); });
	let sitle = document.querySelectorAll(".smallTitle");
	sitle.forEach(function (element) { element.addEventListener('mouseup', currentGame.switchNextElement.bind(currentGame)); });
	let infob = document.querySelectorAll(".skill, .trait, .info, .mandatory, .lifetrait, .doublecost, .extraSkill, .extraTrait, .commonTrait");
	infob.forEach(function (element) { element.addEventListener('mouseenter', currentGame.showInfoBox); });
	infob.forEach(function (element) { element.addEventListener('mouseleave', currentGame.removeInfoBox); });

	let addlp = document.querySelectorAll(".addLP");
	addlp.forEach(function (element) { element.addEventListener('mouseup', currentChar.addLifepath.bind(currentChar)); });
	let remlp = document.querySelectorAll(".removeLP");
	remlp.forEach(function (element) { element.addEventListener('mouseup', currentChar.removeLifepath.bind(currentChar)); });
	let updow = document.querySelectorAll(".up, .down");
	updow.forEach(function (element) { element.addEventListener('mouseup', currentChar.advancementSpending.bind(currentChar)); });
	let plmin = document.querySelectorAll(".plus, .minus");
	plmin.forEach(function (element) { element.addEventListener('mouseup', currentChar.openThis.bind(currentChar)); });
	let eithe = document.querySelectorAll(".addEither, .removeEither");
	eithe.forEach(function (element) { element.addEventListener('mouseup', currentChar.changeEither.bind(currentChar)); });
	let gener = document.querySelectorAll(".addGeneral, .removeGeneral");
	gener.forEach(function (element) { element.addEventListener('mouseup', currentChar.changeGeneral.bind(currentChar)); });
	let sklis = document.querySelectorAll(".skill.listEntry");
	sklis.forEach(function (element) { element.addEventListener('dblclick', currentChar.addExtraSkill.bind(currentChar)); });
	let trlis = document.querySelectorAll(".trait.listEntry");
	trlis.forEach(function (element) { element.addEventListener('dblclick', currentChar.addExtraTrait.bind(currentChar)); });
	let extsk = document.querySelectorAll(".extraSkill");
	extsk.forEach(function (element) { element.addEventListener('mouseup', currentChar.removeExtraSkill.bind(currentChar)); });
	let exttr = document.querySelectorAll(".extraTrait");
	exttr.forEach(function (element) { element.addEventListener('mouseup', currentChar.removeExtraTrait.bind(currentChar)); });
	let reset = document.querySelectorAll("#charReset");
	reset.forEach(function (element) { element.addEventListener('mouseup', currentChar.reset.bind(currentChar)); });
	let downl = document.querySelectorAll("#charDownload");
	downl.forEach(function (element) { element.addEventListener('mouseup', currentChar.downloadChar.bind(currentChar)); });

	let emose = document.querySelectorAll("#emoSelect");
	emose.forEach(function (element) { element.addEventListener('change', currentChar.checkEmoAtt.bind(currentChar)); });
	let quest = document.querySelectorAll(".questionCheckbox");
	quest.forEach(function (element) { element.addEventListener('change', currentChar.refreshQuestionAnswers.bind(currentChar)); });
	let weapo = document.querySelectorAll(".appWeaCheck");
	weapo.forEach(function (element) { element.addEventListener('change', currentChar.checkAppWeap.bind(currentChar)); });
	let resor = document.querySelectorAll(".resElement, .smallCheckbox");
	resor.forEach(function (element) { element.addEventListener('change', currentChar.addResources.bind(currentChar)); });

	document.getElementById("createPracticeBox").addEventListener('mouseup', currentGame.createBox.bind(currentGame));
	document.getElementById("createPracticeRegiment").addEventListener('mouseup', currentGame.createRegiment.bind(currentGame));
	document.getElementById("removePracticeRegiment").addEventListener('mouseup', currentGame.removeRegiment.bind(currentGame));

	let searc = document.querySelectorAll("#search");
	searc.forEach(function (element) {
		element.addEventListener("keyup", filterList);
		element.addEventListener("keydown", filterList);
		element.addEventListener("change", filterList);
		element.addEventListener("keypress", filterList);
	});
}

/* Local Storage */
function setStorage(key, value) {
	if (typeof (Storage) !== "undefined") {
		if (typeof (value) == "object") {
			value = JSON.stringify(value);
		}
		localStorage.setItem(key, value);
	}
	else { console.log("no web storage support, data will not be stored locally."); }
}

function getStorage(key) {
	if (typeof (Storage) !== "undefined") {
		return JSON.parse(localStorage.getItem(key));
	}
	else { return null; }
}

/* Classes */
class game {
	constructor() {
		this.version = "4.19.04";
		this.title = "Burning Wheel Gold";
		this.gameType = ["bwg"];
		this.currentContent = [];
		this.stocks = [];
		this.skillLists = [];
		this.traitLists = [];
		this.lastMonth = 0;
		this.practiceTimes = {
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

		let version = localStorage.getItem("game_version");
		if (version === null || version != this.version) {
			localStorage.clear();
			setStorage("game_version", this.version);
			setStorage("game_database", database);
		}
		let db = getStorage("game_database");

		this.title = db.title;
		this.gameType = db.gameType;
		this.currentContent = db.currentContent;
		this.stocks = db.stocks;
		this.skillLists = db.skillLists;
		this.traitLists = db.traitLists;

		for (let i = 0; i < this.gameType.length; i++) { document.getElementsByName(this.gameType[i])[0].classList.add("added"); }
		this.refreshDisables();
	}

	createBox() {
		if (document.getElementById("practiceType").value != "" && document.getElementById("practiceData").value != "") {
			let data = document.getElementById("practiceData").value;
			let type = document.getElementById("practiceType").value;
			let name = document.getElementById("practiceSkillName").value;

			let dataName = "";
			if (data != "Will" && data != "Perception" && data != "Agility" && data != "Speed" &&
				data != "Power" && data != "Forte" && data != "Faith" && data != "Steel") {
				dataName = name + "<br>";
			}

			let cycle = this.practiceTimes[data]["Cycle"];
			let hours = this.practiceTimes[data][type];

			document.getElementById("practiceBlocksLayer").innerHTML += "<span class='practiceBox' style='top: 0; left: 0; width: " + (hours * 24) + "px; height: " + (cycle * 24) + "px' title='" + name + "/" + data + "/" + type + "'>" + dataName + data + "<br>" + type + "<div class='close' title='remove'>X</div></span>";

			interact(".practiceBox").draggable(true);

			let quest = document.querySelectorAll(".close");
			quest.forEach(function (element) { element.addEventListener('click', function () { element.parentElement.remove(); }) });
		}
	}

	createRegiment() {
		let length = document.getElementById("practiceLength").value;
		let duration = document.getElementById("practiceDuration").value;

		if (length.value != "" && duration.value != "") {
			let a = "";

			console.log(this.lastMonth)

			for (let i = 0; i < length; i++) {
				this.lastMonth++;
				a += "<tr><td>" + this.lastMonth + "</td>";

				for (let ii = 0; ii < duration; ii++) {
					a += "<td></td>";
				}

				a += "</tr>";
			}

			document.getElementById("actualPracticeTable").firstChild.innerHTML += a;
		}
	}

	removeRegiment() {
		if (this.lastMonth > 0) {
			document.getElementById("actualPracticeTable").firstChild.lastChild.remove();
			this.lastMonth--;
		}
	}

	showInfoBox() {
		// only things that i haven't added
		if (targetClass == "info") {
			infoBoxElement.innerHTML = "<h4>Search Box</h4>"
				+ "<div id='infoBoxContent'>"
				+ "you can also use these keywords:<br>"
				+ "t: for types<br>"
				+ "c: for cost (only traits)<br>"
				+ "r: for root (only skills)<br>"
				+ "<br>"
				+ "examples:<br>"
				+ "c:2 t:die - this searches for cost 2 die traits<br>"
				+ "t:academic r:will - this searches academic skills that have will for root<br>"
				+ "asd c:2 t:character - this searches for cost 2 character traits which include 'asd' in it"
				+ "</div>"
		}
		else if (targetClass == "mandatory") {
			infoBoxElement.innerHTML = "<h4>Mandatory Skill/Trait</h4>"
				+ "<div id='infoBoxContent'>This skill/trait must be opened.</div>"
		}
		else if (targetClass == "lifetrait") {
			infoBoxElement.innerHTML = "<h4>Lifepath Trait</h4>"
				+ "<div id='infoBoxContent'>This trait will cost only one point.</div>"
		}
		else if (targetClass == "doublecost") {
			infoBoxElement.innerHTML = "<h4>Training/Magical Skill</h4>"
				+ "<div id='infoBoxContent'>Opening this skill costs two points.</div>"
		}
		else if (targetClass == "extraSkill") {
			infoBoxElement.innerHTML = "<h4>Non-Lifepath Skill</h4>"
				+ "<div id='infoBoxContent'>Opening and advancing this skill requires general point spending.<br>Clicking on this will remove this skill.</div>"
		}
		else if (targetClass == "extraTrait") {
			infoBoxElement.innerHTML = "<h4>Non-Lifepath Trait</h4>"
				+ "<div id='infoBoxContent'>Opening this trait requires you to spend it's cost.<br>Clicking on this will remove this trait.</div>"
		}
		else if (targetClass == "commonTrait") {
			infoBoxElement.innerHTML = "<h4>Common Trait</h4>"
				+ "<div id='infoBoxContent'>This trait will not cost any points and it is gained by character's stock.</div>"
		}
	}
}

class character {
	constructor() {
		this.chosenLifepaths = [];

		this.stock = "n/a";
		this.age = 0;

		this.pools = {
			Resources: { base: 0, left: 0, spent: 0 },
			Either: { base: 0, left: 0, transferedToMental: 0, transferedToPhysical: 0 },
			Mental: { base: 0, left: 0, spent: 0 },
			Physical: { base: 0, left: 0, spent: 0 },
			General: { base: 0, left: 0, spentToOpen: 0, spentToAdvance: 0, transferedToSkill: 0 },
			Skill: { base: 0, left: 0, spentToOpen: 0, spentToAdvance: 0 },
			Trait: { base: 0, left: 0, spent: 0 }
		}

		this.stats = {
			Perception: { name: "Perception", shade: 0, exponent: 0, type: "mentalstat" },
			Will: { name: "Will", shade: 0, exponent: 0, type: "mentalstat" },
			Power: { name: "Power", shade: 0, exponent: 0, type: "physicalstat" },
			Agility: { name: "Agility", shade: 0, exponent: 0, type: "physicalstat" },
			Forte: { name: "Forte", shade: 0, exponent: 0, type: "physicalstat" },
			Speed: { name: "Speed", shade: 0, exponent: 0, type: "physicalstat" }
		}

		this.attributes = {
			Health: { name: "Health", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: true, fromQuestions: 0 },
			Steel: { name: "Steel", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: true, fromQuestions: 0 },
			Hesitation: { name: "Hesitation", shade: 0, exponent: 0, type: "attribute", hasShade: false, shifted: 0, canShift: false },
			Reflexes: { name: "Reflexes", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: false },
			MortalWound: { name: "Mortal Wound", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: true },
			Stride: { name: "Stride", shade: 0, exponent: 0, type: "attribute", hasShade: false, shifted: 0, canShift: false },
			Emotional: { name: "Emotional Attribute", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: true, fromQuestions: 0 },
			Circles: { name: "Circles", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: true },
			Resources: { name: "Resources", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: true }
		}

		this.skills = {};
		this.traits = {};

		this.extraSkills = {};
		this.extraTraits = {};

		this.brutalTraits = {};

		this.resources = [{ name: "", type: "none", cost: 0, note: "" }];

		this.appropriateWeapons = [];
		this.potentialEmotionalName = [];
		this.checkedQuestions = [];

		if (localStorage.getItem("character_data") === null || localStorage.getItem("character_appweaporder") === null) {
			this.setStore();
		}

		this.getStore();
	}

	/* State Cloning, Reseting */
	reset() {
		this.chosenLifepaths = [];

		this.stock = "n/a";
		this.age = 0;

		this.pools = {
			Resources: { base: 0, left: 0, spent: 0 },
			Either: { base: 0, left: 0, transferedToMental: 0, transferedToPhysical: 0 },
			Mental: { base: 0, left: 0, spent: 0 },
			Physical: { base: 0, left: 0, spent: 0 },
			General: { base: 0, left: 0, spentToOpen: 0, spentToAdvance: 0, transferedToSkill: 0 },
			Skill: { base: 0, left: 0, spentToOpen: 0, spentToAdvance: 0 },
			Trait: { base: 0, left: 0, spent: 0 }
		}

		this.stats = {
			Perception: { name: "Perception", shade: 0, exponent: 0, type: "mentalstat" },
			Will: { name: "Will", shade: 0, exponent: 0, type: "mentalstat" },
			Power: { name: "Power", shade: 0, exponent: 0, type: "physicalstat" },
			Agility: { name: "Agility", shade: 0, exponent: 0, type: "physicalstat" },
			Forte: { name: "Forte", shade: 0, exponent: 0, type: "physicalstat" },
			Speed: { name: "Speed", shade: 0, exponent: 0, type: "physicalstat" }
		}

		this.attributes = {
			Health: { name: "Health", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: true, fromQuestions: 0 },
			Steel: { name: "Steel", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: true, fromQuestions: 0 },
			Hesitation: { name: "Hesitation", shade: 0, exponent: 0, type: "attribute", hasShade: false, shifted: 0, canShift: false },
			Reflexes: { name: "Reflexes", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: false },
			MortalWound: { name: "Mortal Wound", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: true },
			Stride: { name: "Stride", shade: 0, exponent: 0, type: "attribute", hasShade: false, shifted: 0, canShift: false },
			Emotional: { name: "Emotional Attribute", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: true, fromQuestions: 0 },
			Circles: { name: "Circles", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: true },
			Resources: { name: "Resources", shade: 0, exponent: 0, type: "attribute", hasShade: true, shifted: 0, canShift: true }
		}

		this.skills = {};
		this.traits = {};

		this.extraSkills = {};
		this.extraTraits = {};

		this.brutalTraits = {};

		this.resources = [{ name: "", type: "none", cost: 0, note: "" }];

		this.appropriateWeapons = [];
		this.potentialEmotionalName = [];
		this.checkedQuestions = [];

		localStorage.setItem("character_appweaporder", "0|1|2|3|4|5|6|7|8|9|10|11|12|13");
		appWeaponsList.sort(localStorage.getItem("character_appweaporder").split("|"));

		document.querySelectorAll(".appWeaCheck").forEach(function (element) {
			element.checked = false;
		});

		document.querySelectorAll(".appWeaCheck").forEach(function (element) {
			element.checked = false;
		});
		document.querySelectorAll(".questionCheckbox").forEach(function (element) {
			element.checked = false;
		});

		localStorage.clear();
		this.setStore();
		this.refresh();
	}

	/* Import/Export */
	downloadChar() {
		let charInfo = "";
		charInfo += "Age: " + this.age + ", Stock: " + this.stock + "\r\n\r\n";

		charInfo += "Lifepaths:\r\n\t";
		for (var i = 0; i < this.chosenLifepaths.length; i++) {
			charInfo += this.chosenLifepaths[i].name;
			if (i < this.chosenLifepaths.length - 1) {
				charInfo += ", "
			}
		}
		charInfo += "\r\n\r\n";

		charInfo += "Stats:";
		for (var key in this.stats) {
			charInfo += "\r\n\t" + this.stats[key].name + " "
				+ this.colorShade(this.stats[key].shade)
				+ this.stats[key].exponent;
		}
		charInfo += "\r\n\r\n";

		charInfo += "Attributes:";
		for (var key in this.attributes) {
			if (this.attributes[key].hasShade) {
				charInfo += "\r\n\t" + this.attributes[key].name + " "
					+ this.colorShade(this.attributes[key].shade)
					+ this.attributes[key].exponent;
			}
			else {
				charInfo += "\r\n\t" + this.attributes[key].name + " "
					+ this.attributes[key].exponent;
			}
		}
		charInfo += "\r\n\r\n";

		charInfo += "Skills:";
		for (var key in this.skills) {
			if (this.skills[key].opened) {
				charInfo += "\r\n\t" + this.skills[key].name + " "
					+ this.colorShade(this.skills[key].shade)
					+ (parseInt(this.skills[key].baseExponent) + parseInt(this.skills[key].exponent));
			}
		}
		charInfo += "\r\n\r\n";

		charInfo += "Traits:";
		for (var key in this.traits) {
			if (this.traits[key].opened) {
				charInfo += "\r\n\t" + this.traits[key].name;
			}
		}
		charInfo += "\r\n\r\n";

		charInfo += "Resources:";
		for (var key in this.resources) {
			if (this.resources[key].type != "none") {
				charInfo += "\r\n\t" + this.resources[key].name
					+ " (cost: " + this.resources[key].cost
					+ ", type: " + this.resources[key].type
					+ ", note: " + this.resources[key].note + ")\r\n ";
			}
		}

		let element = document.createElement("a");
		element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(charInfo));
		element.setAttribute("download", "Char");
		element.style.display = "none";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}

	// DATA
	refresh() {
		this.checkAppWeap();

		this.refreshBasics();
		this.refreshSkills();
		this.refreshTraits();

		this.refreshAttributes();
		this.refreshQuestionAnswers();
		this.refreshSkillBaseValues();

		this.refreshPointsLeft();

		this.setStore();
		this.showData();

		reloadEventListeners();
	}

	refreshAttributes() {
		// Health - shade and exponent
		let healthReturn = this.checkShadeForTwo(this.stats["Will"].shade, this.stats["Forte"].shade);
		this.attributes["Health"].shade = healthReturn[0];
		this.attributes["Health"].exponent = Math.trunc((this.stats["Will"].exponent + this.stats["Forte"].exponent + healthReturn[1]) / 2) + this.attributes["Health"].fromQuestions;

		// Steel - shade and exponent
		this.attributes["Steel"].shade = 0 + this.attributes["Steel"].shifted;
		this.attributes["Steel"].exponent = 3 - (5 * this.attributes["Steel"].shifted) + this.attributes["Steel"].fromQuestions;

		// Hesitation
		this.attributes["Hesitation"].exponent = 10 - this.stats["Will"].exponent;

		// Reflexes - shade and exponent
		let reflexesReturn = this.checkShadeForThree(this.stats["Perception"].shade, this.stats["Agility"].shade, this.stats["Speed"].shade);
		let greatwolfAdj = 0;
		if (this.stock == "Great Wolf") { greatwolfAdj = 2; }
		this.attributes["Reflexes"].shade = reflexesReturn[0];
		this.attributes["Reflexes"].exponent = Math.trunc((this.stats["Perception"].exponent + this.stats["Agility"].exponent + this.stats["Speed"].exponent + greatwolfAdj + reflexesReturn[1]) / 3);

		// Mortal Would - shade and exponent
		let mortalWoundReturn = this.checkShadeForThree(this.stats["Power"].shade, this.stats["Forte"].shade);
		this.attributes["MortalWound"].shade = mortalWoundReturn[0] + this.attributes["MortalWound"].shifted;
		if ("Tough" in this.traits && this.traits["Tough"].opened) {
			this.attributes["MortalWound"].exponent = Math.ceil((this.stats["Power"].exponent + this.stats["Forte"].exponent + mortalWoundReturn[1]) / 2) + 6 - (5 * this.attributes["MortalWound"].shifted);
		}
		else {
			this.attributes["MortalWound"].exponent = Math.trunc((this.stats["Power"].exponent + this.stats["Forte"].exponent + mortalWoundReturn[1]) / 2) + 6 - (5 * this.attributes["MortalWound"].shifted);
		}

		// Stride
		let stride = 7;
		if (this.stock != "n/a") { stride = currentGame.stocks[this.stock.replace(/\s/g, '')].stride; }
		this.attributes["Stride"].exponent = stride;

		// Emotional Attribute - shade and exponent
		this.attributes["Emotional"].shade = 0 + this.attributes["Emotional"].shifted;
		if (this.stock == "Great Wolf") { this.attributes["Emotional"].shade = this.stats["Will"].shade + this.attributes["Emotional"].shifted; }
		if (this.attributes["Emotional"].name == "Dead Faith") { this.attributes["Emotional"].shade = this.stats["Will"].shade; }
		this.attributes["Emotional"].exponent = this.attributes["Emotional"].fromQuestions - (5 * this.attributes["Emotional"].shifted);

		// Circles - shade and exponent
		let circlesBonus = 0;
		let circlesSpending = 0;
		for (var i = 0; i < this.resources.length; i++) {
			if (this.resources[i].type == "Property" || this.resources[i].type == "Relationship") { circlesSpending += this.resources[i].cost; }
		}
		if (circlesSpending > 50) { circlesBonus = 1; }

		this.attributes["Circles"].shade = 0 + this.attributes["Circles"].shifted;
		this.attributes["Circles"].exponent = circlesBonus + Math.max(Math.trunc(this.stats["Will"].exponent / 2), 1) - (5 * this.attributes["Circles"].shifted);

		// Resources - shade and exponent
		let resourceExponent = 0;
		for (var i = 0; i < this.resources.length; i++) {
			if (this.resources[i].type == "Property" || this.resources[i].type == "Reputation" || this.resources[i].type == "Affiliation") { resourceExponent += parseInt(this.resources[i].cost); }
		}
		resourceExponent = Math.trunc(resourceExponent / 15);

		this.attributes["Resources"].shade = 0 + this.attributes["Resources"].shifted;
		this.attributes["Resources"].exponent = resourceExponent - (5 * this.attributes["Resources"].shifted);
	}

	refreshSkillBaseValues() {
		for (var key in this.skills) {
			let exp = 0;
			let sha = 0;

			let rootArray = this.skills[key].root.split("/");

			if (rootArray.length == 1) {
				if (this.checkIfUnique(this.stats, rootArray[0]) != -1) {
					sha = this.stats[rootArray[0]].shade;
					exp = Math.trunc(this.stats[rootArray[0]].exponent / 2);
				}
				else {
					sha = this.attributes["Emotional"].shade;
					exp = Math.trunc(this.attributes["Emotional"].exponent / 2);
				}

			}
			else if (rootArray.length == 2) {
				let shades = [];
				for (var i = 0; i < rootArray.length; i++) {
					if (this.checkIfUnique(this.stats, rootArray[i]) != -1) { shades.push(this.stats[rootArray[i]].shade); }
					else { shades.push(this.attributes["Emotional"].shade); }
				}
				let a = this.checkShadeForTwo(shades[0], shades[1]);
				sha = a[0];

				let tmp = 0;
				for (var i = 0; i < rootArray.length; i++) {
					if (this.checkIfUnique(this.stats, rootArray[i]) != -1) { tmp += this.stats[rootArray[i]].exponent; }
					else { tmp += this.attributes["Emotional"].exponent; }
				}
				exp = Math.trunc(((tmp + a[1]) / rootArray.length) / 2);
				if (exp < 1) { exp = 1; }
			}

			this.skills[key].shade = sha;
			this.skills[key].baseExponent = exp;
		}
	}

	refreshQuestionAnswers() {
		let healthAdj = 0;
		let steelAdj = 0;
		let emoAdj = 0;

		this.brutalTraits = {};

		this.checkedQuestions = [];
		let chk = [];
		document.querySelectorAll(".questionCheckbox").forEach(function (element) { if (element.checked) { chk.push(element.name); } });
		this.checkedQuestions = chk;

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
		// GENERAL
		if (document.querySelectorAll("input[name='Q1']:checked").length > 0) { healthAdj -= 1; }
		if (document.querySelectorAll("input[name='Q2']:checked").length > 0) { healthAdj -= 1; }
		if (document.querySelectorAll("input[name='Q3']:checked").length > 0) { healthAdj -= 1; }
		if (document.querySelectorAll("input[name='Q4']:checked").length > 0) { healthAdj -= 1; }
		if (this.stock != "Man") { healthAdj += 1; }
		if (document.querySelectorAll("input[name='Q6']:checked").length > 0) { healthAdj += 1; }
		if (document.querySelectorAll("input[name='Q7']:checked").length > 0) { healthAdj += 1; }

		if (document.querySelectorAll("input[name='Q8']:checked").length > 0) { steelAdj += 1; }
		if (document.querySelectorAll("input[name='Q8']:checked").length > 0 && document.querySelectorAll("input[name='Q3']:checked").length > 0) { steelAdj += 1; }
		if (document.querySelectorAll("input[name='Q8']:checked").length > 0 && document.querySelectorAll("input[name='Q3']:checked").length == 0) { steelAdj -= 1; }
		if (document.querySelectorAll("input[name='Q10']:checked").length > 0) { steelAdj += 1; }

		if (document.querySelectorAll("input[name='Q11']:checked").length > 0 || document.querySelectorAll("input[name='Q4']:checked").length > 0) {
			if (this.stats["Will"].exponent > 4) { steelAdj += 1; }
			else if (this.stats["Will"].exponent < 4) { steelAdj -= 1; }
		}

		if (document.querySelectorAll("input[name='Q12']:checked").length > 0) { steelAdj -= 1; }
		if (document.querySelectorAll("input[name='Q13']:checked").length > 0) { steelAdj += 1; }
		if (document.querySelectorAll("input[name='Q14']:checked").length > 0) { steelAdj += 1; }
		if (document.querySelectorAll("input[name='Q15']:checked").length > 0) { steelAdj += 1; }

		if (this.stats["Perception"].exponent > 5) { steelAdj += 1; }
		if (this.stats["Will"].exponent > 4) { steelAdj += 1; }
		if (this.stats["Will"].exponent > 6) { steelAdj += 1; }
		if (this.stats["Forte"].exponent > 5) { steelAdj += 1; }

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
		// ANCESTRAL TAINT
		if (this.attributes["Emotional"].name == "Ancestral Taint") {
			for (var key in this.traits) {
				if (this.traits[key].name == "Ancestral Taint" && this.traits[key].opened) { emoAdj += 1; }
				if (this.traits[key].name == "Spirit Nose" && this.traits[key].opened) { emoAdj += 1; }
				if (this.traits[key].name == "Stink of the Ancients" && this.traits[key].opened) { emoAdj += 1; }
			}
			for (var key in this.skills) {
				if (this.skills[key].name == "Primal Bark" && this.skills[key].opened) { emoAdj += 1; }
				if (this.skills[key].name == "Ancestral Jaw" && this.skills[key].opened) { emoAdj += 1; }
				if (this.skills[key].name == "Grandfather's Song" && this.skills[key].opened) { emoAdj += 1; }
			}
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
		// CORRUPTION
		if (this.attributes["Emotional"].name == "Corruption") {
			if (document.querySelectorAll("input[name='C1']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='C2']:checked").length > 0) { emoAdj += 1; }

			for (var key in this.traits) {
				if (this.traits[key].name == "Gifted" && this.traits[key].opened) { emoAdj += 1; }
				else if (this.traits[key].name == "Faithful" && this.traits[key].opened) { emoAdj += 1; }
				else if (this.traits[key].name == "Chosen One" && this.traits[key].opened) { emoAdj += 1; }
			}

			for (var i = 0; i < this.resources.length; i++) {
				if (this.resources[i].type == "Spirit Mark" || this.resources[i].type == "Order") { emoAdj += 1; }
			}
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
		// DEAD FAITH
		if (this.attributes["Emotional"].name == "Dead Faith") {
			emoAdj = 2;

			for (var key in this.skills) {
				if (this.skills[key].name == "Doctrine of Dead Gods " && this.skills[key].opened) { emoAdj += 1; }
			}

			for (var key in this.traits) {
				if (this.traits[key].name == "Riddle of Steel" && this.traits[key].opened) { emoAdj += 1; }
				if (this.traits[key].name == "Contemplation" && this.traits[key].opened) { emoAdj += 1; }
				if (this.traits[key].name == "The Nature of Power" && this.traits[key].opened) { emoAdj += 1; }
				if (this.traits[key].name == "Dreamer" && this.traits[key].opened) { emoAdj += 1; }
			}
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
		// FAITH
		if (this.attributes["Emotional"].name == "Faith") {
			emoAdj = 3;
			if (document.querySelectorAll("input[name='F1']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='F2']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='F3']:checked").length > 0) { emoAdj += 1; }
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// FAVORED
		if (this.attributes["Emotional"].name == "Favored") {
			emoAdj = 1;
			if (document.querySelectorAll("input[name='KF1']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='KF2']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='KF3']:checked").length > 0) { emoAdj += 1; }
		}

		//////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
		// GREED
		if (this.attributes["Emotional"].name == "Greed") {
			if (document.querySelectorAll("input[name='G1']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='G2']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='G3']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='G4']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='G5']:checked").length > 0) { emoAdj += 1; }
			if (this.years > 200) { emoAdj += 1; }
			if (this.years > 400) { emoAdj += 1; }
			if (this.stats["Will"] < 4) { emoAdj += 1; }

			emoAdj += Math.ceil(this.resourcesPool.base / 60);

			for (var i = 0; i < this.chosenLifepaths.length; i++) {
				if (this.chosenLifepaths[i].name == "Trader") { emoAdj += 1; }
				else if (this.chosenLifepaths[i].name == "Mask-Bearer") { emoAdj += 1; }
				else if (this.chosenLifepaths[i].name == "Master of Arches") { emoAdj += 1; }
				else if (this.chosenLifepaths[i].name == "Master of Forges") { emoAdj += 1; }
				else if (this.chosenLifepaths[i].name == "Master Engraver") { emoAdj += 1; }
				else if (this.chosenLifepaths[i].name == "Treasurer") { emoAdj += 1; }
				else if (this.chosenLifepaths[i].name == "Quartermaster") { emoAdj += 1; }
				else if (this.chosenLifepaths[i].name == "Seneschal") { emoAdj += 1; }
				else if (this.chosenLifepaths[i].name == "Prince") { emoAdj += 1; }
			}

			for (var i = 0; i < this.resources.length; i++) {
				if (this.resources[i].type == "Relationship" && this.resources[i].romantic == true) { emoAdj -= 1; }
				if (this.resources[i].type == "Relationship" && this.resources[i].rivalry == true && this.resources[i].immediate == false) { emoAdj += 1; }
				if (this.resources[i].type == "Relationship" && this.resources[i].rivalry == true && this.resources[i].immediate == true) { emoAdj += 2; }
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// GRIEF
		if (this.attributes["Emotional"].name == "Grief") {
			if (document.querySelectorAll("input[name='GF1']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='GF2']:checked").length > 0) { emoAdj += 1; }
			if (this.attributes["Steel"].exponent - 5 > 0) { emoAdj += (this.attributes["Steel"].exponent - 5) }
			if (this.stats["Perception"].exponent > 5) { emoAdj += 1; }
			if (this.years > 499) { emoAdj += 1; }
			if (this.years > 749) { emoAdj += 1; }
			if (this.years > 999) { emoAdj += 1; }

			let hasProtectorLP = false;

			for (var i = 0; i < this.chosenLifepaths.length; i++) {
				if (this.chosenLifepaths[i].setting == "Protector") { hasProtectorLP = true; }
				if (this.chosenLifepaths[i].name == "Lancer" ||
					this.chosenLifepaths[i].name == "Lieutenant" ||
					this.chosenLifepaths[i].name == "Captain") {
					emoAdj += 1;
				}
				if (this.chosenLifepaths[i].name == "Lord" ||
					this.chosenLifepaths[i].name == "Protector" ||
					this.chosenLifepaths[i].name == "Soother") {
					emoAdj += 1;
				}
				if (this.chosenLifepaths[i].name == "Born Etharch") {
					emoAdj += 1;
				}
				if (this.chosenLifepaths[i].name == "Loremaster" ||
					this.chosenLifepaths[i].name == "Adjutant" ||
					this.chosenLifepaths[i].name == "Althing") {
					emoAdj += 1;
				}
				if (this.chosenLifepaths[i].name == "Elder") {
					emoAdj += 1;
				}
			}

			if (hasProtectorLP) { emoAdj += 1; }

			let knowsLament = false;
			for (var key in this.skills) {
				if ((this.skills[key].name == "Lament for the Fallen" && this.skills[key].opened) ||
					(this.skills[key].name == "Lament of Mourning" && this.skills[key].opened) ||
					(this.skills[key].name == "Lament of Stars" && this.skills[key].opened) ||
					(this.skills[key].name == "Lament of the Westering Sun" && this.skills[key].opened)) {
					knowsLament = true;
				}
			}
			if (!knowsLament) { emoAdj += 1; }
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// HATRED
		if (this.attributes["Emotional"].name == "Hatred") {
			if (document.querySelectorAll("input[name='H1']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='H2']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='H3']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='H4']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='H5']:checked").length > 0) { emoAdj += 1; }
			if (this.stats["Will"].exponent < 3) { emoAdj += 1; }
			if (this.stats["Perception"].exponent > 5) { emoAdj += 1; }
			if (this.attributes["Steel"].exponent > 4) { emoAdj += 1; }

			if (document.querySelectorAll("input[name='H6']:checked").length > 0) {
				let t = getTrait("AnyCharacter->Missing Digit");
				t.nonLifepath = false;
				t.common = true;
				t.mandatory = true;
				t.opened = true;
				t.openCost = 0;
				t.dataCode = "AnyDie->Missing Digit";
				this.brutalTraits[t.name] = t;
			}
			if (document.querySelectorAll("input[name='H7']:checked").length > 0) {
				let t = getTrait("AnyDie->Lame");
				t.nonLifepath = false;
				t.common = true;
				t.mandatory = true;
				t.opened = true;
				t.openCost = 0;
				t.dataCode = "AnyDie->Lame";
				this.brutalTraits[t.name] = t;
			}
			if (document.querySelectorAll("input[name='H8']:checked").length > 0) {
				let t = getTrait("AnyDie->Missing Eye");
				t.nonLifepath = false;
				t.common = true;
				t.mandatory = true;
				t.opened = true;
				t.openCost = 0;
				t.dataCode = "AnyDie->Missing Eye";
				this.brutalTraits[t.name] = t;
			}
			if (document.querySelectorAll("input[name='H9']:checked").length > 0) {
				let t = getTrait("AnyDie->Missing Hand");
				t.nonLifepath = false;
				t.common = true;
				t.mandatory = true;
				t.opened = true;
				t.openCost = 0;
				t.dataCode = "AnyDie->Missing Hand";
				this.brutalTraits[t.name] = t;
			}
			if (document.querySelectorAll("input[name='H10']:checked").length > 0) {
				let t = getTrait("AnyDie->Missing Limb");
				t.nonLifepath = false;
				t.common = true;
				t.mandatory = true;
				t.opened = true;
				t.openCost = 0;
				t.dataCode = "AnyDie->Missing Limb";
				this.brutalTraits[t.name] = t;
			}
			if (document.querySelectorAll("input[name='H11']:checked").length > 0) {
				let t = getTrait("Trait Any Die->Missing Limb");
				t.nonLifepath = false;
				t.common = true;
				t.mandatory = true;
				t.opened = true;
				t.openCost = 0;
				t.dataCode = "AnyDie->Missing Limb";
				this.brutalTraits[t.name + "(2)"] = t;
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// PATH
		if (this.attributes["Emotional"].name == "Path") {
			emoAdj = 0;
			if (document.querySelectorAll("input[name='FO1']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='FO2']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='FO3']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='FO4']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='FO5']:checked").length > 0) { emoAdj += 1; }
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// RESTLESSNESS
		if (this.attributes["Emotional"].name == "Restlessness") {
			if (document.querySelectorAll("input[name='RS1']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='RS2']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='RS3']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='RS4']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='RS5']:checked").length > 0) { emoAdj += 1; }

			let hasUnexpectedJourneyLP = false;

			for (var i = 0; i < this.chosenLifepaths.length; i++) {
				if (this.chosenLifepaths[i].name == "Born Under the Hill") { emoAdj -= 1; }
				if (this.chosenLifepaths[i].name == "Born Odd" ||
					this.chosenLifepaths[i].name == "Born Among Little Folk") { emoAdj += 1; }
				if (this.chosenLifepaths[i].setting == "Unexpected Journey") { hasUnexpectedJourneyLP = true; }
			}

			if (hasUnexpectedJourneyLP) { emoAdj += 1; }

			for (var key in this.traits) {
				if (this.traits[key].name == "Jaded" && this.traits[key].opened) { emoAdj -= 1; }
			}

			if (this.stats["Will"].exponent < 4) { emoAdj += 1; }
			if (this.stats["Perception"].exponent > 4) { emoAdj += 1; }
			if (this.attributes["Steel"].exponent < 5) { emoAdj += 1; }
			if (this.attributes["Steel"].exponent > 5) { emoAdj -= 1; }
			if (this.age > 55) { emoAdj -= 1; }
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// SPITE
		if (this.attributes["Emotional"].name == "Spite") {
			emoAdj = 3;
			if (document.querySelectorAll("input[name='S1']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='S2']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='S3']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='S4']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='S5']:checked").length > 0) { emoAdj -= 1; }
			if (document.querySelectorAll("input[name='S6']:checked").length > 0) { emoAdj -= 2; }

			for (var key in this.traits) {
				if (this.traits[key].name == "Slayer" && this.traits[key].opened) { emoAdj += 1; }
				else if (this.traits[key].name == "Exile" && this.traits[key].opened) { emoAdj += 1; }
				else if (this.traits[key].name == "Feral" && this.traits[key].opened) { emoAdj += 1; }
				else if (this.traits[key].name == "Murderous" && this.traits[key].opened) { emoAdj += 1; }
				else if (this.traits[key].name == "Saturnine" && this.traits[key].opened) { emoAdj += 1; }
				else if (this.traits[key].name == "Femme/Homme Fatal" && this.traits[key].opened) { emoAdj += 1; }
				else if (this.traits[key].name == "Cold and Bitter" && this.traits[key].opened) { emoAdj += 1; }
			}

			for (var i = 0; i < this.resources.length; i++) {
				if (this.resources[i].name == "Bitter Reminder") { emoAdj += 1; }
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// VISIONARY FAITH
		if (this.attributes["Emotional"].name == "Visionary Faith") {
			emoAdj = 3;
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// VOID EMBRACE
		if (this.attributes["Emotional"].name == "Void Embrace") {
			emoAdj = 3;
			if (document.querySelectorAll("input[name='VE1']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='VE2']:checked").length > 0) { emoAdj += 1; }
			if (document.querySelectorAll("input[name='VE3']:checked").length > 0) { emoAdj += 1; }
		}

		this.attributes["Health"].fromQuestions = healthAdj;
		this.attributes["Steel"].fromQuestions = steelAdj;
		this.attributes["Emotional"].fromQuestions = emoAdj;

		this.refreshTraits();
		this.setStore();
		this.showData();
	}

	// SHOW
	showData() {
		this.refreshAttributes();
		this.refreshPointsLeft();
		this.refreshSkillBaseValues();

		this.potentialEmotionalName = [];

		if (currentGame.gameType == "bsn") {
			for (var key in this.traits) {
				if (this.traits[key].name == "Empty Faith" && this.traits[key].opened) { this.potentialEmotionalName.push("Dead Faith"); }
				if (this.traits[key].name == "Corrupted" && this.traits[key].opened) { this.potentialEmotionalName.push("Corruption"); }
				if (this.traits[key].name == "Favored" && this.traits[key].opened) { this.potentialEmotionalName.push("Favored"); }
			}
			if (this.stock == "Dwarf") { this.potentialEmotionalName.push("Path"); }
			if (this.stock == "Anakhi") { this.potentialEmotionalName.push("Hatred"); }
		}
		else {
			for (var key in this.traits) {
				if (this.traits[key].name == "Corrupted" && this.traits[key].opened) { this.potentialEmotionalName.push("Corruption"); }
				if (this.traits[key].name == "Faithful" && this.traits[key].opened) { this.potentialEmotionalName.push("Faith"); }
				if (this.traits[key].name == "Faith in Dead Gods" && this.traits[key].opened) { this.potentialEmotionalName.push("Dead Faith"); }
				if (this.traits[key].name == "Greed" && this.traits[key].opened) { this.potentialEmotionalName.push("Greed"); }
				if (this.traits[key].name == "Grief" && this.traits[key].opened) { this.potentialEmotionalName.push("Grief"); }
				if (this.traits[key].name == "Restlessness" && this.traits[key].opened) { this.potentialEmotionalName.push("Restlessness"); }
				if (this.traits[key].name == "Spite" && this.traits[key].opened) { this.potentialEmotionalName.push("Spite"); }
				if (this.traits[key].name == "Visionary Faith" && this.traits[key].opened) { this.potentialEmotionalName.push("Visionary Faith"); }
				if (this.traits[key].name == "Void Embrace" && this.traits[key].opened) { this.potentialEmotionalName.push("Void Embrace"); }
			}
			if (this.stock == "Orc") { this.potentialEmotionalName.push("Hatred"); }
			if (this.stock == "Great Wolf") { this.potentialEmotionalName.push("Ancestral Taint"); }
		}

		let eitherButtonsMental = " ";
		let eitherButtonsPhysical = " ";
		if (this.pools["Either"].left > 0) { eitherButtonsMental += "<span class='addEither'></span>"; eitherButtonsPhysical += "<span class='addEither'></span>"; }
		if (this.pools["Either"].transferedToMental > 0) { eitherButtonsMental += "<span class='removeEither'></span>"; }
		if (this.pools["Either"].transferedToPhysical > 0) { eitherButtonsPhysical += "<span class='removeEither'></span>"; }

		let generalButtons = " ";
		if (this.pools["General"].left > 0) { generalButtons += "<span class='addGeneral'></span>"; }
		if (this.pools["General"].transferedToSkill > 0) { generalButtons += "<span class='removeGeneral'></span>"; }

		document.getElementById("charImg").style.background = "url(./inc/img_wheel.png) no-repeat";
		if (this.stock != "n/a") {
			document.getElementById("charImg").style.background = "url(./inc/img_" + this.stock.split(" ")[0] + ".png) no-repeat";
		}

		document.querySelector("#sheetStock > .data").innerHTML = this.stock;
		document.querySelector("#sheetAge > .data").innerHTML = this.age;
		document.querySelector("#sheetRP > .data").innerHTML = this.pools["Resources"].base;

		let eithers = document.querySelectorAll(".remainingField.either");
		for (var i = 0; i < eithers.length; i++) { eithers[i].innerHTML = "Remaining Either Pool: " + this.pools["Either"].left; }
		document.querySelector(".remainingField.mental").innerHTML = "Remaining Mental Pool: " + this.pools["Mental"].left + eitherButtonsMental;
		document.querySelector(".remainingField.physical").innerHTML = "Remaining Physical Pool: " + this.pools["Physical"].left + eitherButtonsPhysical;
		document.querySelector(".remainingField.generalskillp").innerHTML = "Remaining General Skill Points: " + this.pools["General"].left;
		document.querySelector(".remainingField.skillp").innerHTML = "Remaining Skill Points: " + this.pools["Skill"].left + generalButtons;
		document.querySelector(".remainingField.traitp").innerHTML = "Remaining Trait Points: " + this.pools["Trait"].left;
		document.querySelector(".remainingField.resp").innerHTML = "Remaining Resource Points: " + this.pools["Resources"].left;

		document.getElementById("burnerMentalStats").innerHTML = "";
		document.getElementById("burnerPhysicalStats").innerHTML = "";
		for (var key in this.stats) { this.addStatElement(this.stats[key]); }

		document.getElementById("burnerAttributes").innerHTML = "";
		for (var key in this.attributes) { this.addAttributeElement(this.attributes[key], key); }

		document.getElementById("burnerSkills").innerHTML = "";
		for (var key in this.skills) { this.addSkillElement(this.skills[key]); }

		document.getElementById("burnerTraits").innerHTML = "";
		for (var key in this.traits) { this.addTraitElement(this.traits[key]); }

		document.getElementById("burnerResources").innerHTML = "";
		for (var i = 0; i < this.resources.length; i++) { this.addResourceElement(this.resources[i]); }

		document.getElementById("chosenLifepaths").innerHTML = "";
		for (var i = 0; i < this.chosenLifepaths.length; i++) {
			document.getElementById("chosenLifepaths").innerHTML += currentGame.getLifepathWithArray(this.chosenLifepaths[i], true);
		}

		document.querySelectorAll(".questionBox").forEach(function (element) { element.style.display = "none"; });
		document.getElementById("settingCharQuestions").style.display = "block";

		if (this.attributes["Emotional"].name == "Corruption") { document.getElementById("settingCorruptionQuestions").style.display = "block"; }
		else if (this.attributes["Emotional"].name == "Faith") { document.getElementById("settingFaithQuestions").style.display = "block"; }
		else if (this.attributes["Emotional"].name == "Greed") { document.getElementById("settingGreedQuestions").style.display = "block"; }
		else if (this.attributes["Emotional"].name == "Grief") { document.getElementById("settingGriefQuestions").style.display = "block"; }
		else if (this.attributes["Emotional"].name == "Hatred") { document.getElementById("settingHatredQuestions").style.display = "block"; }
		else if (this.attributes["Emotional"].name == "Restlessness") { document.getElementById("settingRestlessnessQuestions").style.display = "block"; }
		else if (this.attributes["Emotional"].name == "Spite") { document.getElementById("settingSpiteQuestions").style.display = "block"; }
		else if (this.attributes["Emotional"].name == "Void Embrace") { document.getElementById("settingVoidEmbraceQuestions").style.display = "block"; }
		else if (this.attributes["Emotional"].name == "Favored") { document.getElementById("settingFavoredQuestions").style.display = "block"; }
		else if (this.attributes["Emotional"].name == "Path") { document.getElementById("settingPathQuestions").style.display = "block"; }

		reloadEventListeners();
	}

	addSkillElement(skillObject) {
		let general = "false";
		let extras = "";
		if (skillObject.mandatory) { extras += "<span id=" + BoxId++ + " class='mandatory'></span>"; }
		if (skillObject.nonLifepath) { extras += "<span id=" + BoxId++ + " class='extraSkill'></span>"; general = "true"; }
		if (skillObject.magical || skillObject.training) { extras += "<span id=" + BoxId++ + " class='doublecost'></span>"; }

		let elementOpacity = "notPicked";
		let toggleBlock = "<div class='plus' data-nolp='" + general + "' data-object='" + skillObject.name + "' data-type='skill'></div>";
		if (skillObject.opened) {
			elementOpacity = "picked";
			toggleBlock = "<div class='minus' data-nolp='" + general + "' data-object='" + skillObject.name + "' data-type='skill'></div>";
		}

		let upShade = "<div class='emptyUD'></div>";
		let upExponent = "<div class='emptyUD'></div>";
		let downShade = "<div class='emptyUD'></div>";
		let downExponent = "<div class='emptyUD'></div>";
		if (this.pools["Skill"].left > 0) { upExponent = "<div class='up' data-nolp='" + general + "' data-type='burnerskill' data-object='" + skillObject.name + "'  data-part='exponent'></div>"; }
		if (this.pools["Skill"].left > 4) { upShade = "<div class='up' data-nolp='" + general + "' data-type='burnerskill' data-object='" + skillObject.name + "'  data-part='shade'></div>"; }
		if (this.pools["Skill"].spentToAdvance > 0 && skillObject.exponent > 0) { downExponent = "<div class='down' data-nolp='" + general + "' data-type='burnerskill' data-object='" + skillObject.name + "'  data-part='exponent'></div>"; }
		if (this.pools["Skill"].spentToAdvance > 4 && skillObject.shade > 0) { downShade = "<div class='down' data-nolp='" + general + "' data-type='burnerskill' data-object='" + skillObject.name + "'  data-part='shade'></div>"; }

		let d = skillObject.dataCode.split("->");
		let nameIndex = currentGame.skillLists[d[0].replace(/\s/g, '')].skills.findIndex(x => x.name === d[1]);

		document.getElementById("burnerSkills").innerHTML += "<div class='burnerBlockExtra " + elementOpacity + "'>"
			+ toggleBlock
			+ "<div class='burnerskill'>"
			+ upShade
			+ "<div class='shade'>" + this.colorShade(skillObject.shade) + "</div>"
			+ downShade
			+ "</div>"
			+ "<div class='burnerskill'>"
			+ upExponent
			+ "<div class='exponent'>" + (skillObject.exponent + skillObject.baseExponent) + "</div>"
			+ downExponent
			+ "</div>"
			+ "<div class='stat name'><span class='skill' id=" + BoxId++ + " data-array=" + d[0].replace(/\s/g, '') + " data-index=" + nameIndex + ">" + skillObject.name + "</span>" + extras + "</div>"
			+ "</div>";
	}

	addTraitElement(traitObject) {
		let elementOpacity = "notPicked";
		let toggleBlock = "<div class='plus' data-object='" + traitObject.name + "' data-type='trait'></div>";
		if (traitObject.opened && !traitObject.common) {
			elementOpacity = "picked";
			toggleBlock = "<div class='minus' data-object='" + traitObject.name + "' data-type='trait'></div>";
		}
		else if (traitObject.common) {
			elementOpacity = "picked";
			toggleBlock = "<div class='emptyUM'></div>";
		}

		let extras = "";
		if (traitObject.mandatory) { extras += "<span id=" + BoxId++ + " class='mandatory'></span>"; }
		if (traitObject.nonLifepath && !traitObject.common) { extras += "<span id=" + BoxId++ + " class='extraTrait'></span>"; }
		else if (traitObject.common) { extras += "<span id=" + BoxId++ + " class='commonTrait'></span>"; }
		else { extras += "<span id=" + BoxId++ + " class='lifetrait'></span>"; }

		let d = traitObject.dataCode.split("->");
		let nameIndex = currentGame.traitLists[d[0].replace(/\s/g, '')].traits.findIndex(x => x.name === d[1]);

		document.getElementById("burnerTraits").innerHTML += "<div class='burnerBlockExtra " + elementOpacity + "'>"
			+ toggleBlock
			+ "<div class='burnerskill'>"
			+ "<div class='exponent'>" + traitObject.openCost + "</div>"
			+ "</div>"
			+ "<div class='stat name'><span class='trait' id=" + BoxId++ + " data-array=" + d[0].replace(/\s/g, '') + " data-index=" + nameIndex + ">" + traitObject.name + "</span>" + extras + "</div>"
			+ "</div>";
	}

	addResourceElement(resourceObject) {
		let resourceTypes = ["none", "Gear", "Property", "Reputation", "Relationship", "Affiliation", "Spell"];
		if (currentGame.gameType[0] == "bwc") {
			resourceTypes.push("Spirit Mark");
			resourceTypes.push("Order");
		}

		let typeSelect = "<select class='resElement'>"
		for (var i = 0; i < resourceTypes.length; i++) {
			if (resourceObject.type == resourceTypes[i]) { typeSelect += "<option value=" + resourceTypes[i] + " selected>" + resourceTypes[i] + "</option>"; }
			else { typeSelect += "<option value=" + resourceTypes[i] + ">" + resourceTypes[i] + "</option>"; }
		}
		typeSelect += "</select>";

		let relationshipBlock = "";
		if (resourceObject.type == "Relationship") {
			let relationModifiers = ["Immediate Family", "Other Family", "Romantic", "Forbidden", "Hateful or Rival"];
			let relationModifiersShort = ["immediate", "other", "romantic", "forbidden", "rivalry"];

			relationshipBlock += "<div class='smallCheckboxBlock resrelation'>";
			for (var i = 0; i < relationModifiers.length; i++) {
				relationshipBlock += "<input type='checkbox' class='smallCheckbox resElement rel" + relationModifiersShort[i] + "' name='" + relationModifiersShort[i];
				if (resourceObject[relationModifiersShort[i]] == true) { relationshipBlock += "' checked>"; }
				else { relationshipBlock += "'>"; }
				relationshipBlock += relationModifiers[i];
			}
			relationshipBlock += "</div>";
		}

		document.getElementById("burnerResources").innerHTML += "<div class='burnerBlockFull resourceDetail'>"
			+ "<span class='resname'><input class='resElement' type='text' name='resname' value='" + resourceObject.name + "'></span>"
			+ "<span class='restype'>" + typeSelect + "</span>"
			+ "<span class='rescost'><input class='resElement' type='text' name='rescost' value='" + resourceObject.cost + "'></span>"
			+ "<span class='resnote'><input class='resElement' type='text' name='resnote' value='" + resourceObject.note + "'></span>"
			+ relationshipBlock
			+ "</div>";
	}

	// VALUE INCREASE AND DECREASE
	openThis(targetObj) {
		let obj = targetObj.target;

		let datachange = obj.getAttribute("class");
		let dataobject = obj.getAttribute("data-object");
		let datatype = obj.getAttribute("data-type");
		let datanolp = obj.getAttribute("data-nolp");

		if (datatype == "skill") {
			let cost = this.skills[dataobject].openCost;

			if (datanolp == "false") {
				if (datachange == "plus" && this.pools["Skill"].left >= cost) {
					this.pools["Skill"].spentToOpen += cost;
					this.skills[dataobject].opened = true;
				}
				else if (datachange == "minus") {
					this.pools["Skill"].spentToOpen -= cost;
					this.skills[dataobject].opened = false;
				}
			}
			else if (datanolp == "true") {
				if (datachange == "plus" && this.pools["General"].left >= cost) {
					this.pools["General"].spentToOpen += cost;
					this.skills[dataobject].opened = true;
				}
				else if (datachange == "minus") {
					this.pools["General"].spentToOpen -= cost;
					this.skills[dataobject].opened = false;
				}
			}
		}
		else if (datatype == "trait") {
			let cost = this.traits[dataobject].openCost;

			if (datachange == "plus" && this.pools["Trait"].left >= cost) {
				this.pools["Trait"].spent += cost;
				this.traits[dataobject].opened = true;
			}
			else if (datachange == "minus") {
				this.pools["Trait"].spent -= cost;
				this.traits[dataobject].opened = false;
			}
		}

		this.setStore();
		this.showData();
	}

	advancementSpending(targetObj) {
		let obj = targetObj.target;

		let changeType = obj.getAttribute('class');
		let dataType = obj.getAttribute('data-type');
		let dataObject = obj.getAttribute('data-object');
		let dataPart = obj.getAttribute('data-part');
		let datanolp = obj.getAttribute("data-nolp");

		let change = 0;
		if (changeType == "down") { change = -1; }
		else if (changeType == "up") { change = 1; }

		if (change > 0) {
			if (dataPart == "exponent") {
				if (dataType == "mentalstat") {
					if (this.pools["Mental"].left > 0 && this.stats[dataObject].exponent < 10) {
						this.stats[dataObject].exponent += change;
						this.pools["Mental"].spent += 1;
					}
				}
				else if (dataType == "physicalstat") {
					if (this.pools["Physical"].left > 0 && this.stats[dataObject].exponent < 10) {
						this.stats[dataObject].exponent += change;
						this.pools["Physical"].spent += 1;
					}
				}
				else if (dataType == "burnerskill") {
					if (datanolp == "false") {
						if (this.skills[dataObject].opened && this.pools["Skill"].left > 0 && this.skills[dataObject].exponent < 10) {
							this.skills[dataObject].exponent += change;
							this.pools["Skill"].spentToAdvance += 1;
						}
					}
					else if (datanolp == "true") {
						if (this.skills[dataObject].opened && this.pools["General"].left > 0 && this.skills[dataObject].exponent < 10) {
							this.skills[dataObject].exponent += change;
							this.pools["General"].spentToAdvance += 1;
						}
					}
				}
			}
			else if (dataPart == "shade") {
				if (dataType == "mentalstat") {
					if (this.pools["Mental"].left > 4 && this.stats[dataObject].shade < 2) {
						this.stats[dataObject].shade += change;
						this.pools["Mental"].spent += 5;
					}
				}
				else if (dataType == "physicalstat") {
					if (this.pools["Physical"].left > 4 && this.stats[dataObject].shade < 2) {
						this.stats[dataObject].shade += change;
						this.pools["Physical"].spent += 5;
					}
				}
				else if (dataType == "attribute") {
					if ((this.attributes[dataObject].exponent - (5 * this.attributes[dataObject].shifted)) > 0) {
						this.attributes[dataObject].shifted += 1;
					}
				}
				else if (this.skills[dataObject].opened && dataType == "burnerskill") {
					if (datanolp == "false") {
						if (this.pools["Skill"].left > 4 && this.skills[dataObject].shade < 2) {
							this.skills[dataObject].shade += change;
							this.pools["Skill"].spentToAdvance += 5;
						}
					}
					else if (datanolp == "true") {
						if (this.pools["General"].left > 4 && this.skills[dataObject].shade < 2) {
							this.skills[dataObject].shade += change;
							this.pools["General"].spentToAdvance += 5;
						}
					}
				}
			}
		}
		else if (change < 0) {
			if (dataPart == "exponent") {
				if (dataType == "mentalstat") {
					if (this.pools["Mental"].spent > 0 && this.stats[dataObject].exponent > 0) {
						this.stats[dataObject].exponent -= 1;
						this.pools["Mental"].spent -= 1;
					}
				}
				else if (dataType == "physicalstat") {
					if (this.pools["Physical"].spent > 0 && this.stats[dataObject].exponent > 0) {
						this.stats[dataObject].exponent -= 1;
						this.pools["Physical"].spent -= 1;
					}
				}
				else if (dataType == "burnerskill") {
					if (datanolp == "false") {
						if (this.pools["Skill"].spentToAdvance > 0 && this.skills[dataObject].exponent > 0) {
							this.skills[dataObject].exponent -= 1;
							this.pools["Skill"].spentToAdvance -= 1;
						}
					}
					else if (datanolp == "true") {
						if (this.pools["General"].spentToAdvance > 0 && this.skills[dataObject].exponent > 0) {
							this.skills[dataObject].exponent -= 1;
							this.pools["General"].spentToAdvance -= 1;
						}
					}
				}
			}
			else if (dataPart == "shade") {
				if (dataType == "mentalstat") {
					if (this.pools["Mental"].spent > 4 && this.stats[dataObject].shade > 0) {
						this.stats[dataObject].shade -= 1;
						this.pools["Mental"].spent -= 5;
					}
				}
				else if (dataType == "physicalstat") {
					if (this.pools["Physical"].spent > 4 && this.stats[dataObject].shade > 0) {
						this.stats[dataObject].shade -= 1;
						this.pools["Physical"].spent -= 5;
					}
				}
				else if (dataType == "attribute") {
					if (this.attributes[dataObject].shifted > 0) {
						this.attributes[dataObject].shifted -= 1;
					}
				}
				else if (dataType == "burnerskill") {
					if (datanolp == "false") {
						if (this.pools["Skill"].spentToAdvance > 4 && this.skills[dataObject].shade > 0) {
							this.skills[dataObject].shade -= 1;
							this.pools["Skill"].spentToAdvance -= 5;
						}
					}
					else if (datanolp == "true") {
						if (this.pools["General"].spentToAdvance > 4 && this.skills[dataObject].shade > 0) {
							this.skills[dataObject].shade -= 1;
							this.pools["General"].spentToAdvance -= 5;
						}
					}
				}
			}
		}

		this.setStore();
		this.showData();
	}

	changeEither(targetObj) {
		let obj = targetObj.target;

		let type = obj.getAttribute("class");
		let addTo = obj.parentElement.getAttribute("class").split(" ")[2];

		if (addTo == "mental") {
			if (type == "addEither" && this.pools["Either"].left > 0) { this.pools["Either"].transferedToMental += 1; }
			else if (type == "removeEither" && this.pools["Either"].transferedToMental > 0 && this.mentalPool.left > 0) { this.pools["Either"].transferedToMental -= 1; }
		}
		else if (addTo == "physical") {
			if (type == "addEither" && this.pools["Either"].left > 0) { this.pools["Either"].transferedToPhysical += 1; }
			else if (type == "removeEither" && this.pools["Either"].transferedToPhysical > 0 && this.physicalPool.left > 0) { this.pools["Either"].transferedToPhysical -= 1; }
		}

		this.setStore();
		this.showData();
	}

	changeGeneral(targetObj) {
		let obj = targetObj.target;

		if (obj.getAttribute("class") == "addGeneral" && this.pools["General"].left > 0) { this.pools["General"].transferedToSkill += 1; }
		else if (obj.getAttribute("class") == "removeGeneral" && this.pools["General"].transferedToSkill > 0) { this.pools["General"].transferedToSkill -= 1; }

		this.setStore();
		this.showData();
	}

	// EXTRA SKILL TRAIT 
	addExtraSkill(targetObj) {
		let obj = targetObj.target;

		let listIndex = obj.getAttribute("data-array");
		let nameIndex = obj.getAttribute("data-index");

		let s = currentGame.skillLists[listIndex].skills[nameIndex];

		if (!(s.name in this.extraSkills)) {
			s.nonLifepath = true;
			s.mandatory = false;
			s.opened = false;
			s.openCost = 1;
			if (s.magical || s.training) { s.openCost = 2; }
			s.exponent = 0;
			s.baseExponent = 0;
			s.shade = 0;
			s.dataCode = currentGame.skillLists[listIndex].name + "->" + currentGame.skillLists[listIndex].skills[nameIndex].name;

			this.extraSkills[s.name] = s;
		}

		this.setStore();
		this.refreshSkills();
		this.showData();
	}

	addExtraTrait(targetObj) {
		let obj = targetObj.target;

		let listIndex = obj.getAttribute("data-array");
		let nameIndex = obj.getAttribute("data-index");

		let t = currentGame.traitLists[listIndex].traits[nameIndex];

		if (!(t.name in this.extraTraits)) {
			t.nonLifepath = true;
			t.mandatory = false;
			t.opened = false;
			t.openCost = t.cost;
			t.dataCode = currentGame.traitLists[listIndex].name + "->" + currentGame.traitLists[listIndex].traits[nameIndex].name;

			this.extraTraits[t.name] = t;
		}

		this.setStore();
		this.refreshTraits();
		this.showData();
	}

	removeExtraSkill(targetObj) {
		let obj = targetObj.target;

		delete this.extraSkills[obj.parentElement.innerHTML.split("<")[1].split(">")[1]];

		document.getElementById("infoBox").style.display = "none";

		this.setStore();
		this.refreshSkills();
		this.showData();
	}

	removeExtraTrait(targetObj) {
		let obj = targetObj.target;

		delete this.extraTraits[obj.parentElement.innerHTML.split("<")[1].split(">")[1]];

		document.getElementById("infoBox").style.display = "none";

		this.setStore();
		this.refreshTraits();
		this.showData();
	}

	addResources() {
		this.pools["Resources"].spent = 0;
		this.resources = [];

		let res = document.getElementsByClassName("resourceDetail");
		for (var i = 0; i < res.length; i++) {
			let n = res[i].querySelector('.resname > .resElement').value;
			let t = res[i].querySelector('.restype > .resElement').value;
			let c = res[i].querySelector('.rescost > .resElement').value;
			let o = res[i].querySelector('.resnote > .resElement').value;

			this.pools["Resources"].spent += parseInt(c);

			if (t != "Relationship" || res[i].getElementsByClassName("resrelation").length == 0) {
				this.resources.push({ name: n, type: t, cost: c, note: o });
			}
			else if (t == "Relationship" && res[i].getElementsByClassName("resrelation").length > 0) {
				let im = res[i].querySelector('.resrelation > .relimmediate').checked;
				let ot = res[i].querySelector('.resrelation > .relother').checked;
				let ro = res[i].querySelector('.resrelation > .relromantic').checked;
				let fo = res[i].querySelector('.resrelation > .relforbidden').checked;
				let ri = res[i].querySelector('.resrelation > .relrivalry').checked;

				this.resources.push({ name: n, type: t, cost: c, note: o, immediate: im, other: ot, romantic: ro, forbidden: fo, rivalry: ri });
			}

			if (i == res.length - 1 && t != "none") { this.resources.push({ name: "", type: "none", cost: 0, note: "" }); }
		}

		for (var i = this.resources.length - 1; i > -1; i--) {
			if (this.resources[i].type == "none" && this.resources.length > 1) {
				if ((i == 0 && this.resources[i + 1].type != "none") || this.resources[i - 1].type == "none" ||
					(i < this.resources.length - 1 && this.resources[i - 1].type != "none" && this.resources[i + 1].type != "none")) {
					this.resources.splice(i, 1);
				}
			}
		}

		this.setStore();
		this.showData();
	}

	checkEmoAtt(targetObj) {
		let obj = targetObj.target;

		this.attributes["Emotional"].name = obj.value;
		this.setStore();
		this.refreshQuestionAnswers();
	}

	checkAppWeap() {
		let list = appWeaponsList.el.children;

		this.appropriateWeapons = [];

		for (var i = 0; i < list.length; i++) {
			if (list[i].querySelector('.appWeaCheck').checked) {
				list[i].classList.add("picked");
				list[i].classList.remove("notPicked");

				let skillName = list[i].textContent.substr(1);

				let s;
				let sCode;
				if (skillName == "Firebombs") {
					sCode = "AnyMonstrous->" + skillName;
					s = getSkill(sCode);
				}
				else {
					sCode = "AnyGeneral->" + skillName;
					s = getSkill(sCode);
				}

				s.nonLifepath = false;
				s.mandatory = false;
				s.opened = false;
				s.openCost = 1;
				if (s.magical || s.training) { s.openCost = 2; }
				s.exponent = 0;
				s.baseExponent = 0;
				s.shade = 0;
				s.dataCode = sCode;

				this.appropriateWeapons.push(s);
			}
			else {
				list[i].classList.add("notPicked");
				list[i].classList.remove("picked");
			}
		}

		this.setStore();
		this.refreshSkills();
		this.showData();
	}

	checkShadeForTwo(num1, num2) {
		let shade = 0;
		let extra = 0;

		if (num1 == num2) { shade = num1; }
		else if (num1 + num2 == 1) { extra = 2; }
		else if (num1 + num2 == 3) { extra = 4; }

		return [shade, extra];
	}

	checkShadeForThree(num1, num2, num3) {
		let shade = 0;
		let extra = 0;

		if (num1 == num2 && num1 == num3) { shade = num1; }
		else if (num1 + num2 + num3 == 1) { extra = 2; }
		else if (num1 + num2 + num3 == 2) { extra = 4; }
		else if (num1 + num2 + num3 == 4) { extra = 8; }
		else if (num1 + num2 + num3 == 5) { extra = 10; }

		return [shade, extra];
	}

	colorShade(num) {
		if (num == 0) { return "B"; }
		else if (num == 1) { return "G"; }
		else if (num == 2) { return "W"; }
	}

	checkIfUnique(obj, n) {
		let keys = Object.keys(obj);
		let matchingKey = keys.indexOf(n);
		return matchingKey;
	}
}