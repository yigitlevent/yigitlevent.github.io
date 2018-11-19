// BURNING WHEEL GOLD by github.com/Sifaus
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

/* DB Array Finder */
function chooseArray(stock = "", name = "", prefix = "", getRow = -1) {
	let a = prefix.replace(/\s/g, '') + stock.replace(/\s/g, '') + name.replace(/\s/g, '');
	if (debug) { console.log("Chosen " + prefix + ": " + a); }

	if (parseInt(getRow) > -1) { return window[a][parseInt(getRow)]; }
	else { return window[a]; }
}

/* Filter Search Results */
function filterList() {
	let srcStrng = document.getElementById("search").value.split(" ");
	let srcType, srcCost, srcName, srcRoot;
	for (let i = 0; i < srcStrng.length; i++) {
		if (srcStrng[i].indexOf('c:') == 0) { srcCost = srcStrng[i].slice(2); }
		else if (srcStrng[i].indexOf('t:') != -1) { srcType = srcStrng[i].slice(2); }
		else if (srcStrng[i].indexOf('r:') != -1) { srcRoot = srcStrng[i].slice(2); }
		else { srcName = srcStrng[i]; }
	}

	let liCC, liCT, liCTL, liCN, liCNL, liCR, liCRL;

	document.querySelectorAll(".listEntry").forEach(function (element) {
		element.parentElement.style.display = "inline-block";

		liCT = element.dataset.type;
		liCTL = element.dataset.type.toLowerCase();

		if (element.classList.contains("skill")) {
			liCR = element.dataset.root;
			liCRL = element.dataset.root.toLowerCase();
		}

		if (element.classList.contains("trait")) {
			liCC = element.dataset.cost;
		}

		liCN = element.textContent;
		liCNL = element.textContent.toLowerCase();

		if (srcCost != null && srcCost != "" && srcCost != undefined && srcCost != " " && parseInt(liCC) != parseInt(srcCost)) {
			element.parentElement.style.display = "none";
		}

		if (srcType != null && srcType != "" && srcType != undefined && srcType != " " && liCT.indexOf(srcType) == -1 && liCTL.indexOf(srcType) == -1) {
			element.parentElement.style.display = "none";
		}

		if (srcRoot != null && srcRoot != "" && srcRoot != undefined && srcRoot != " " && liCR.indexOf(srcRoot) == -1 && liCRL.indexOf(srcRoot) == -1) {
			element.parentElement.style.display = "none";
		}

		if (srcName != null && srcName != "" && srcName != undefined && srcName != " " && liCN.indexOf(srcName) == -1 && liCNL.indexOf(srcName) == -1) {
			element.parentElement.style.display = "none";
		}

	});
}

/* Event Handling */
function reloadEventListeners() {
	unloadEventListeners();
	loadEventListeners();
}

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

/* Get Objects from currentGame */
function getSkill(name) {
	let a = name.split("->");
	let nameIndex = currentGame.skillLists[a[0].replace(/\s/g, '')].skills.findIndex(x => x.name === a[1]);
	return currentGame.skillLists[a[0].replace(/\s/g, '')].skills[nameIndex];
}

function getTrait(name) {
	let a = name.split("->");
	let nameIndex = currentGame.traitLists[a[0].replace(/\s/g, '')].traits.findIndex(x => x.name === a[1]);
	return currentGame.traitLists[a[0].replace(/\s/g, '')].traits[nameIndex];
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
		this.version = "4.19.01";
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
	
	changeType(targetObj) {
		document.getElementById("content").innerHTML = "";

		let name = targetObj.target.attributes.name.value;

		this.gameType[0] = name;
		if (name == "bwg") { this.title = "Burning Wheel Gold"; }
		else if (name == "bwc") { this.title = "Burning Wheel Codex"; }
		else if (name == "bsn") { this.title = "Burning Sun"; }

		let stt = document.getElementsByClassName("settingSelect");
		for (let i = 0; i < stt.length; i++) { stt[i].classList.remove("added"); }
		targetObj.target.classList.add("added")

		this.updateLeftMenu();

		if (this.currentContent.length > 0 && this.currentContent[0] == "Setting") { this.showSettingContent(this.currentContent[1]); }
		else if (this.currentContent.length > 0 && this.currentContent[0] == "List") { this.showListContent(this.currentContent[1]); }

		document.getElementById("revealerWrapper").scrollTop = 0;

		let db = getStorage("game_database");
		db.title = this.title;
		db.gameType = this.gameType;
		setStorage("game_database", db);
	}

	switchOptional(targetObj) {
		document.getElementById("content").innerHTML = "";

		let name = targetObj.target.attributes.name.value;

		let index = this.gameType.findIndex(x => x === name);
		if (index == -1) {
			this.gameType.push(name);
			targetObj.target.classList.add("added")
		}
		else {
			this.gameType.splice(index, 1);
			targetObj.target.classList.remove("added");
		}

		this.updateLeftMenu();

		if (this.currentContent.length > 0 && this.currentContent[0] == "Setting") { this.showSettingContent(this.currentContent[1]); }
		else if (this.currentContent.length > 0 && this.currentContent[0] == "List") { this.showListContent(this.currentContent[1]); }

		document.getElementById("revealerWrapper").scrollTop = 0;

		let db = getStorage("game_database");
		db.title = this.title;
		db.gameType = this.gameType;
		setStorage("game_database", db);
	}

	updateLeftMenu() {
		this.refreshDisables();

		document.title = this.title;
		document.getElementById("settings").innerHTML = "<div id='stocks'></div><div id='references'></div>";

		document.getElementById("stocks").innerHTML = "";

		// Create Stocks 
		for (var stock in this.stocks) {
			if (!this.stocks[stock].disabled) {
				let a, b = "";
				if (this.stocks[stock].hasSetting) { a = "<span class='Setting'> Settings: </span>"; }
				if (this.stocks[stock].hasSubsetting) { b += "<span class='Subsetting'> Subsettings: </span>" }

				let nameConc = this.stocks[stock].name.split(" ");

				document.getElementById("stocks").innerHTML += "<div class=" + nameConc[0] + "><h2>" + this.stocks[stock].name + "</h2>" + a + b + "</div>";

				// Add Settings in
				let prevSettingType = "";
				for (var setting in this.stocks[stock].settings) {

					if (!this.stocks[stock].settings[setting].disabled) {
						if ((this.stocks[stock].settings[setting].type == "Subsetting" && prevSettingType == "Subsetting") ||
							(this.stocks[stock].settings[setting].type == "Setting" && prevSettingType == "Setting")) {
							document.querySelector("#stocks > ." + nameConc[0] + " > ." + this.stocks[stock].settings[setting].type).innerHTML += ", ";
						}

						document.querySelector("#stocks > ." + nameConc[0] + " > ." + this.stocks[stock].settings[setting].type)
							.innerHTML += "<span class='settingLink'"
							+ " data-stock-index=" + stock
							+ " data-setting-index=" + setting
							+ " data-type=" + this.stocks[stock].settings[setting].type
							+ " name=" + this.stocks[stock].settings[setting].class + ">" + this.stocks[stock].settings[setting].name + "</span>";

						prevSettingType = this.stocks[stock].settings[setting].type;
					}
				}
			}
		}

		// Create Lists 
		document.getElementById("references").innerHTML = "<h2>Reference</h2>"
			+ "Lists: "
			+ "<span class='listLink' data-type='skillList'>Skills</span>, "
			+ "<span class='listLink' data-type='traitList'>Traits</span>";

		reloadEventListeners();
	}

	refreshDisables() {
		for (var stock in this.stocks) {
			let cStk = this.stocks[stock];
			if (debug) { console.log(cStk); }
			if (cStk.allowed.findIndex(x => x === this.gameType[0]) > -1) { cStk.disabled = false; }
			else if (this.gameType.length > 1 && this.gameType.findIndex(x => x === cStk.allowed[0]) > -1) { cStk.disabled = false; }
			else { cStk.disabled = true; }

			for (var setting in cStk.settings) {
				let cStt = cStk.settings[setting];
				if (debug) { console.log(cStt); }
				if (cStt.allowed.findIndex(x => x === this.gameType[0]) > -1) { cStt.disabled = false; }
				else if (this.gameType.length > 1 && this.gameType.findIndex(x => x === cStt.allowed[0]) > -1) { cStt.disabled = false; }
				else { cStt.disabled = true; }

				for (var lifepath in cStt.lifepaths) {
					let cLps = cStt.lifepaths[lifepath];
					if (debug) { console.log(cLps); }
					if (cLps.allowed.findIndex(x => x === this.gameType[0]) > -1) { cLps.disabled = false; }
					else if (this.gameType.length > 1 && this.gameType.findIndex(x => x === cLps.allowed[0]) > -1) { cLps.disabled = false; }
					else { cLps.disabled = true; }
				}
			}
		}

		for (var skillList in this.skillLists) {
			let skLst = this.skillLists[skillList];
			if (debug) { console.log(skLst); }
			if (skLst.allowed.findIndex(x => x === this.gameType[0]) > -1) { skLst.disabled = false; }
			else if (this.gameType.length > 1 && this.gameType.findIndex(x => x === skLst.allowed[0]) > -1) { skLst.disabled = false; }
			else { skLst.disabled = true; }

			for (var skill in skLst.skills) {
				let sk = skLst.skills[skill];
				if (debug) { console.log(sk); }
				if (sk.allowed.findIndex(x => x === this.gameType[0]) > -1) { sk.disabled = false; }
				else if (this.gameType.length > 1 && this.gameType.findIndex(x => x === sk.allowed[0]) > -1) { sk.disabled = false; }
				else { sk.disabled = true; }
			}
		}

		for (var traitList in this.traitLists) {
			let trLst = this.traitLists[traitList];
			if (debug) { console.log(trLst); }
			if (trLst.allowed.findIndex(x => x === this.gameType[0]) > -1) { trLst.disabled = false; }
			else if (this.gameType.length > 1 && this.gameType.findIndex(x => x === trLst.allowed[0]) > -1) { trLst.disabled = false; }
			else { trLst.disabled = true; }

			for (var trait in trLst.traits) {
				let tr = trLst.traits[trait];
				if (debug) { console.log(tr); }
				if (tr.allowed.findIndex(x => x === this.gameType[0]) > -1) { tr.disabled = false; }
				else if (this.gameType.length > 1 && this.gameType.findIndex(x => x === tr.allowed[0]) > -1) { tr.disabled = false; }
				else { tr.disabled = true; }
			}
		}
	}

	showInfoBox() {
		let obj = this;

		let targetId = obj.getAttribute("id");
		let targetCl = obj.getAttribute("class");
		let targetElement = document.getElementById(targetId);

		// Get Position values for the element that is being hovered
		let offsetLeft = targetElement.getBoundingClientRect().left;
		let offsetWidth = targetElement.getBoundingClientRect().width;
		let offsetTop = targetElement.getBoundingClientRect().top;

		let clientWidth = document.documentElement.clientWidth
		let infoBoxElement = document.getElementById("infoBox");
		let infoBoxWidth = 400;

		// Vertical Position
		let infoBoxY = offsetTop - 8;
		let infoBoxX;

		// Horizontal Position
		if (clientWidth - offsetLeft - offsetWidth - 10 > infoBoxWidth) {
			infoBoxX = offsetLeft + offsetWidth + 0;
		}
		else {
			infoBoxX = offsetLeft - infoBoxWidth - 8;
		}

		// Set the box and empty it
		infoBoxElement.innerHTML = "";
		infoBoxElement.style.display = "block";
		infoBoxElement.style.left = infoBoxX + "px";
		infoBoxElement.style.top = infoBoxY + "px";

		let targetClass = targetCl.split(" ")[0];
		let array = obj.getAttribute("data-array");
		let index = obj.getAttribute("data-index");

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
		else {
			// Print values into the box
			if (targetClass == "skill") {
				let data = currentGame.skillLists[array].skills[index];

				let RestrictionString;
				if (data.restriction != "N/A") { RestrictionString = "<br>" + data.restriction; }
				else { RestrictionString = ""; }

				let MagicalString;
				if (data.magical == 1) { MagicalString = "<br>Magical Skill"; }
				else { MagicalString = ""; }

				let TrainingString;
				if (data.training == 1) { TrainingString = "<br>Training Skill"; }
				else { TrainingString = ""; }

				let DescriptionString;
				if (data.desc.length > 0) { DescriptionString = data.desc + "<br><br>"; }
				else if (data.desc.length == 0 && data.type == "Wise") {
					DescriptionString = "A wise is a skill through which a character can call upon the knowledge of various details of the game world—knowledge of “who’s who” or “what’s what” for the areas encompassed by his wises. For the most part, wises are fairly self-explanatory—their name says it all. Some of the more bizarre examples have detailed descriptions in the individual lifepath sections. The following are the general skill obstacles applicable to all wises.<br><br>";
				}
				else { DescriptionString = ""; }

				infoBoxElement.innerHTML = "<h4>" + data.name + "</h4>"
					+ "<div id='infoBoxContent'>"
					+ DescriptionString
					+ "Root: " + data.root + "<br>"
					+ "Type: " + data.type + "<br>"
					+ "Tools: " + data.tools + "<br>"
					+ RestrictionString
					+ MagicalString
					+ TrainingString
					+ "</div>"
			}
			else if (targetClass == "trait") {
				let data = currentGame.traitLists[array].traits[index];

				let DescriptionString;
				if (data.desc.length > 0) { DescriptionString = data.desc + "<br><br>"; }
				else { DescriptionString = ""; }

				let CostString;
				if (data.cost > 0) { CostString = "Cost: " + data.cost + "<br>"; }
				else { CostString = ""; }

				infoBoxElement.innerHTML = "<h4>" + data.name + "</h4>"
					+ "<div id='infoBoxContent'>"
					+ DescriptionString
					+ CostString
					+ "Type: " + data.type + "<br>"
					+ "Stock: " + data.stock
					+ "</div>"
			}
		}
	}

	removeInfoBox() {
		document.getElementById("infoBox").style.display = "none";
	}

	changeTab() {
		document.querySelectorAll(".midTitle").forEach(function (element) { element.classList.remove("chosenTab"); });
		this.classList.add("chosenTab");
		let name = this.getAttribute("name");

		document.querySelectorAll("#explorerWrapper, #chroniclerWrapper, #burnerWrapper, #adjusterWrapper, #practicerWrapper, #observerWrapper").forEach(function (element) {
			element.style.display = "none";
		});

		document.querySelector("#" + name + "Wrapper").style.display = "block";
	}

	showSettingContent(targetObj) {
		if (this + "" == "[object HTMLSpanElement]") { targetObj = this; }

		let stockIndex = targetObj.getAttribute("data-stock-index");
		let settingIndex = targetObj.getAttribute("data-setting-index");
		let settingType = targetObj.getAttribute("data-type");

		let a = "<div id='contentTop'>"
			+ "<div id='innerTitle'>" + targetObj.innerHTML + " " + settingType + "</div>"
			+ "<div id='lifepathTopTitles'>"
			+ "<span class='lifepathName'>Lifepath</span>"
			+ "<span class='lifepathYears'>Time</span>"
			+ "<span class='lifepathResources'>Res</span>"
			+ "<span class='lifepathStats'>Stat</span>"
			+ "<span class='lifepathLeadsTop'>Leads</span>"
			+ "</div>"
			+ "</div>";
		for (var i = 0; i < currentGame.stocks[stockIndex].settings[settingIndex].lifepaths.length; i++) {
			a += currentGame.getLifepathWithIndexes(stockIndex, settingIndex, i);
		}
		document.getElementById("content").innerHTML = a;

		document.getElementById("revealerWrapper").scrollTop = 0;
		currentGame.currentContent = ["Setting", targetObj];

		if (document.querySelectorAll("[class*='lifepathBox']").length == 0) {
			currentGame.currentContent = [];
			document.getElementById("content").innerHTML = "";
		}
		else {
			currentGame.currentContent = ["Setting", targetObj];
		}

		reloadEventListeners();
	}

	showListContent(targetObj) {
		if (this + "" == "[object HTMLSpanElement]") { targetObj = this; }

		document.getElementById("content").innerHTML = "<div id='contentTop'>"
			+ "<div id='innerTitle'>" + targetObj.innerHTML + " List</div>"
			+ "<div id='listSearch'>Search: <input type='text' id='search'/><span id=" + BoxId++ + " class='info'></span></div>"
			+ "</div>";

		let listType = targetObj.getAttribute("data-type");

		// for skills
		if (listType == "skillList") {
			for (var list in currentGame.skillLists) {
				let lst = currentGame.skillLists[list];
				let listName = list.replace(/\s/g, '');

				if (!lst.disabled) {
					document.getElementById("content").innerHTML += "<div class='smallTitle'>" + lst.name + "</div> <ul id='List' class='" + listName + "'></ul>";

					let a = "";
					for (var ii = 0; ii < lst.skills.length; ii++) {
						if (!lst.skills[ii].disabled && !lst.skills[ii].noList) {
							a += "<li><span class='skill listEntry'"
								+ "id='" + BoxId++
								+ "' name='" + lst.skills[ii].name
								+ "' data-type='" + lst.skills[ii].type
								+ "' data-root='" + lst.skills[ii].root
								+ "' data-array='" + listName
								+ "' data-index='" + ii
								+ "'>" + lst.skills[ii].name + "</span></li>";
						}
					}
					document.querySelector("#content > [class='" + listName + "']").innerHTML += a;
				}
			}
		}

		if (listType == "traitList") {
			for (var list in currentGame.traitLists) {
				let lst = currentGame.traitLists[list];
				let listName = list.replace(/\s/g, '');

				if (!lst.disabled) {
					document.getElementById("content").innerHTML += "<div class='smallTitle'>" + lst.name + "</div> <ul id='List' class='" + listName + "'></ul>";

					let a = "";
					for (var ii = 0; ii < lst.traits.length; ii++) {
						if (!lst.traits[ii].disabled) {
							a += "<li><span class='trait listEntry'"
								+ "id='" + BoxId++
								+ "' name='" + lst.traits[ii].name
								+ "' data-cost='" + lst.traits[ii].cost
								+ "' data-type='" + lst.traits[ii].type
								+ "' data-array='" + listName
								+ "' data-index='" + ii
								+ "'>" + lst.traits[ii].name + "</span></li>";
						}
					}
					document.querySelector("#content > [class='" + listName + "']").innerHTML += a;
				}
			}
		}

		document.getElementById("revealerWrapper").scrollTop = 0;
		currentGame.currentContent = ["List", targetObj];

		reloadEventListeners();
	}

	switchNextElement(targetObj) {
		let a = window.getComputedStyle(targetObj.target.nextSibling.nextSibling, null).getPropertyValue("display");
		if (a == "none") { targetObj.target.nextSibling.nextSibling.style.display = "block"; }
		else { targetObj.target.nextSibling.nextSibling.style.display = "none"; }
	}

	makeArrayValuesString(nonArray, type) {
		let stringList = "";

		if (nonArray[0] != "n/a" && nonArray.length == 0) {
			stringList = "—";
		}
		else if (nonArray[0] != "n/a") {
			for (var i = 0; i < nonArray.length; i++) {
				if (i != 0) { stringList += (", "); }

				let a = nonArray[i].split("->");
				let arrayName = a[0];
				let thingName = a[1];
				if (debug) { console.log(a); }

				let nameIndex;
				if (type == "skill") {
					nameIndex = currentGame.skillLists[arrayName.replace(/\s/g, '')].skills.findIndex(x => x.name === thingName);
				}
				else if (type == "trait") {
					nameIndex = currentGame.traitLists[arrayName.replace(/\s/g, '')].traits.findIndex(x => x.name === thingName);
				}

				stringList += ("<span class=" + type + " id=" + BoxId++ + " data-array=" + arrayName.replace(/\s/g, '') + " data-index=" + nameIndex + ">" + thingName + "</span>");
			}
		}
		else {
			stringList = "n/a";
		}

		return stringList;
	}

	getLifepathWithIndexes(stockIndex, settingIndex, lifepathIndex, char = false) {
		return this.getLifepathWithArray(this.stocks[stockIndex].settings[settingIndex].lifepaths[lifepathIndex]);
	}

	/* Single Lifepath Return via Array Itself */
	getLifepathWithArray(lifepathArray, char = false) {
		if (!lifepathArray.disabled) {
			// Stat String
			let lifepathStats;
			if (lifepathArray.eitherPool > 0) {  // Any Positive
				lifepathStats = "+" + lifepathArray.eitherPool + " M/P"
			}
			else if (lifepathArray.eitherPool < 0) {  // Any Negative
				lifepathStats = lifepathArray.eitherPool + " M/P"
			}
			else if (lifepathArray.mentalPool > 0 && lifepathArray.physicalPool > 0) { // Both Positive
				lifepathStats = "+" + lifepathArray.mentalPool + " M,P";
			}
			else if (lifepathArray.mentalPool < 0 && lifepathArray.physicalPool < 0) { // Both Negative
				lifepathStats = lifepathArray.mentalPool + " M,P";
			}
			else if (lifepathArray.mentalPool > 0 && lifepathArray.physicalPool == 0) { // Only Mental Positive
				lifepathStats = "+" + lifepathArray.mentalPool + " M";
			}
			else if (lifepathArray.mentalPool < 0 && lifepathArray.physicalPool == 0) {  // Only Mental Negative
				lifepathStats = lifepathArray.mentalPool + " M";
			}
			else if (lifepathArray.mentalPool == 0 && lifepathArray.physicalPool > 0) {  // Only Physical Positive
				lifepathStats = "+" + lifepathArray.physicalPool + " P";
			}
			else if (lifepathArray.mentalPool == 0 && lifepathArray.physicalPool < 0) {  // Only Physical Negative
				lifepathStats = lifepathArray.physicalPool + " P";
			}
			else if (lifepathArray.mentalPool < 0 && lifepathArray.physicalPool > 0) {  // Mental Neg, Physical Pos
				lifepathStats = lifepathArray.mentalPool + " M, +" + lifepathArray.physicalPool + " P";
			}
			else if (lifepathArray.mentalPool > 0 && lifepathArray.physicalPool < 0) {  // Mental Pos, Physical Neg
				lifepathStats = "+" + lifepathArray.physicalPool + " M, " + lifepathArray.mentalPool + " P";
			}
			else if (lifepathArray.mentalPool == 0 && lifepathArray.physicalPool == 0) {   // None
				lifepathStats = "—";
			}
			else { lifepathStats = "something is really wrong here"; }

			// Output Skill Points string
			let lifepathSkillPoints;
			let GPointString;
			let LPointString;

			if (lifepathArray.generalSkillPool > 0) {
				let nameIndexGen = currentGame.skillLists["AnyGeneral"].skills.findIndex(x => x.name === "General");
				let generalString = ("<span class='skill' id=" + BoxId++ + " data-array='AnyGeneral' data-index=" + nameIndexGen + ">General</span>");

				if (lifepathArray.generalSkillPool > 1) {
					GPointString = lifepathArray.generalSkillPool + " pts: " + generalString + "; ";
				}
				else if (lifepathArray.generalSkillPool == 1) {
					GPointString = "1 pt: " + generalString + "; ";
				}
			}
			else { GPointString = ""; }

			if (lifepathArray.skillPool > 1) {
				LPointString = lifepathArray.skillPool + " pts:";
			}
			else if (lifepathArray.skillPool == 1) {
				LPointString = "1 pt:";
			}
			else { LPointString = ""; }

			lifepathSkillPoints = GPointString + LPointString;

			// Output Trait Points string
			let lifepathTraitPoints;
			if (lifepathArray.traitPool > 1) {
				if (lifepathArray.traits.length > 0) { lifepathTraitPoints = lifepathArray.traitPool + " pt:" }
				else { lifepathTraitPoints = lifepathArray.traitPool + " pt: " }
			}
			else if (lifepathArray.traitPool == 1) {
				if (lifepathArray.traits.length > 0) { lifepathTraitPoints = lifepathArray.traitPool + " pt:" }
				else { lifepathTraitPoints = lifepathArray.traitPool + " pt: " }
			}
			else if (lifepathArray.traitPool == 0) { lifepathTraitPoints = "" }

			// Check if there is lp requirements
			let lifepathRequirement;
			if (lifepathArray.requirements.length > 0) {
				lifepathRequirement = "<div id='lifepathRequirements'>Requirements: " + lifepathArray.requirements + "</div>";
			}
			else {
				lifepathRequirement = "";
			}

			// Construct Skills list
			let lpSkillsList = this.makeArrayValuesString(lifepathArray.skills, "skill");

			// Construct Traits list
			let lpTraitsList = this.makeArrayValuesString(lifepathArray.traits, "trait");

			// Construct Leads list
			let lpLeadsList = "";
			for (var i = 0; i < lifepathArray.leads.length; i++) {

				let a = lifepathArray.leads[i].split("->");
				let stockName = a[0];
				let settingName = a[1];

				if (!this.stocks[stockName.replace(/\s/g, '')].settings[settingName.replace(/\s/g, '')].disabled) {
					if (i > 0) {
						let p = lifepathArray.leads[i - 1].split("->");
						let pstockName = p[0];
						let psettingName = p[1];

						if (!this.stocks[pstockName.replace(/\s/g, '')].settings[psettingName.replace(/\s/g, '')].disabled) {
							lpLeadsList += (", ");
						}
					}

					lpLeadsList += ("<span class='lead' id=" + BoxId++
						+ " data-stock-index=" + stockName.replace(/\s/g, '')
						+ " data-setting-index=" + settingName.replace(/\s/g, '')
						+ " data-type=" + this.stocks[stockName.replace(/\s/g, '')].settings[settingName.replace(/\s/g, '')].type + ">" + settingName + "</span>");
				}
			}

			let lifepathIndex = this.stocks[lifepathArray.stock].settings[lifepathArray.setting].lifepaths.findIndex(x => x.name === lifepathArray.name);

			let addremove = "<span class='addLP'></span>";
			if (char) { addremove = "<span class='removeLP'></span>"; }

			return "<div class='lifepathBox' data-stock-index=" + lifepathArray.stock
				+ " data-setting-index=" + lifepathArray.setting
				+ " data-lifepath-index=" + lifepathIndex + ">"
				+ "<div id='lifepathTop'>"
				+ addremove
				+ "<span class='lifepathName'>" + lifepathArray.name + "</span>"
				+ "<span class='lifepathYears'>" + lifepathArray.years + "</span>"
				+ "<span class='lifepathResources'>" + lifepathArray.resources + "</span>"
				+ "<span class='lifepathStats'>" + lifepathStats + "</span>"
				+ "<span class='lifepathLeads'>" + lpLeadsList + "</span>"
				+ "</div>"
				+ "<div id='lifepathSkills'>Skills: " + lifepathSkillPoints + " " + lpSkillsList + "</div>"
				+ "<div id='lifepathTraits'>Traits: " + lifepathTraitPoints + " " + lpTraitsList + "</div>"
				+ lifepathRequirement
				+ "</div>";
		}
		else { return ""; }
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

	setStore() {
		setStorage("character_data",
			[this.stock, this.age, this.pools,
			this.stats, this.attributes, this.skills,
			this.traits, this.resources, this.appropriateWeapons,
			this.checkedQuestions, this.extraSkills, this.extraTraits,
			this.brutalTraits, this.chosenLifepaths]
		);
		localStorage.setItem("character_appweaporder", "0|1|2|3|4|5|6|7|8|9|10|11|12|13");
	}

	getStore() {
		let d = getStorage("character_data");
		this.stock = d[0];
		this.age = d[1];
		this.pools = d[2];
		this.stats = d[3];
		this.attributes = d[4];
		this.skills = d[5];
		this.traits = d[6];
		this.resources = d[7];
		this.appropriateWeapons = d[8];
		this.checkedQuestions = d[9];
		this.extraSkills = d[10];
		this.extraTraits = d[11];
		this.brutalTraits = d[12];
		this.chosenLifepaths = d[13];

		for (var i = 0; i < d[8].length; i++) {
			document.querySelector("input[value='" + d[8][i].name + "']").checked = true;
			document.querySelector("input[value='" + d[8][i].name + "']").parentElement.classList.remove("notPicked");
			document.querySelector("input[value='" + d[8][i].name + "']").parentElement.classList.add("picked");
		}

		for (var i = 0; i < d[9].length; i++) {
			document.querySelector("input[name='" + d[9][i] + "']").checked = true;
		}

		appWeaponsList.sort(localStorage.getItem("character_appweaporder").split("|"));
	}

	/* Import/Export */
	downloadChar() {
		let charInfo = "";
		charInfo += "Age: " + this.age + ", Stock: " + this.stock + "\r\n\r\n";

		charInfo += "Lifepaths:\r\n\t";
		for (var i = 0; i < this.chosenLifepaths.length; i++) {
			charInfo += currentChar.chosenLifepaths[i].name;
			if (i < currentChar.chosenLifepaths.length - 1) {
				charInfo += ", "
			}
		}
		charInfo += "\r\n\r\n";

		charInfo += "Stats:";
		for (var key in this.stats) {
			charInfo += "\r\n\t" + currentChar.stats[key].name + " "
				+ this.colorShade(currentChar.stats[key].shade)
				+ currentChar.stats[key].exponent;
		}
		charInfo += "\r\n\r\n";

		charInfo += "Attributes:";
		for (var key in this.attributes) {
			if (currentChar.attributes[key].hasShade) {
				charInfo += "\r\n\t" + currentChar.attributes[key].name + " "
					+ this.colorShade(currentChar.attributes[key].shade)
					+ currentChar.attributes[key].exponent;
			}
			else {
				charInfo += "\r\n\t" + currentChar.attributes[key].name + " "
					+ currentChar.attributes[key].exponent;
			}
		}
		charInfo += "\r\n\r\n";

		charInfo += "Skills:";
		for (var key in this.skills) {
			if (currentChar.skills[key].opened) {
				charInfo += "\r\n\t" + currentChar.skills[key].name + " "
					+ this.colorShade(currentChar.skills[key].shade)
					+ currentChar.skills[key].exponent;
			}
		}
		charInfo += "\r\n\r\n";

		charInfo += "Traits:";
		for (var key in this.traits) {
			if (currentChar.traits[key].opened) {
				charInfo += "\r\n\t" + currentChar.traits[key].name;
			}
		}
		charInfo += "\r\n\r\n";

		charInfo += "Resources:";
		for (var key in this.resources) {
			if (currentChar.resources[key].type != "none") {
				charInfo += "\r\n\t" + currentChar.resources[key].name
					+ " (cost: " + currentChar.resources[key].cost
					+ ", type: " + currentChar.resources[key].type
					+ ", note: " + currentChar.resources[key].note + ")\r\n ";
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

	// LIFEPATHS
	addLifepath(targetObj) {
		let obj = targetObj.target.parentElement.parentElement;

		this.chosenLifepaths.push(
			currentGame.stocks[obj.getAttribute("data-stock-index")].settings[obj.getAttribute("data-setting-index")].lifepaths[obj.getAttribute("data-lifepath-index")]
		);

		this.refresh();
	}

	removeLifepath(targetObj) {
		let obj = targetObj.target.parentElement.parentElement;

		let stockIndex = obj.getAttribute("data-stock-index");
		let settingIndex = obj.getAttribute("data-setting-index");
		let lifepathIndex = obj.getAttribute("data-lifepath-index");

		this.chosenLifepaths.splice(
			this.chosenLifepaths.findIndex(x => x.name == currentGame.stocks[stockIndex].settings[settingIndex].lifepaths[lifepathIndex].name), 1
		);

		this.refresh();
		reloadEventListeners();
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

	refreshPointsLeft() {
		this.pools["Resources"].left = this.pools["Resources"].base - this.pools["Resources"].spent;

		this.pools["Mental"].left = this.pools["Either"].transferedToMental + this.pools["Mental"].base - this.pools["Mental"].spent;
		this.pools["Physical"].left = this.pools["Either"].transferedToPhysical + this.pools["Physical"].base - this.pools["Physical"].spent;
		this.pools["Either"].left = this.pools["Either"].base - this.pools["Either"].transferedToMental - this.pools["Either"].transferedToPhysical;

		this.pools["General"].left = this.pools["General"].base - this.pools["General"].spentToOpen - this.pools["General"].spentToAdvance - this.pools["General"].transferedToSkill;
		this.pools["Skill"].left = this.pools["Skill"].base - this.pools["Skill"].spentToOpen - this.pools["Skill"].spentToAdvance + this.pools["General"].transferedToSkill;

		this.pools["Trait"].left = this.pools["Trait"].base - this.pools["Trait"].spent;
	}

	refreshBasics() {
		this.stock = "n/a";
		this.age = 0;
		this.pools["Resources"].base = 0;
		this.pools["Either"].base = 0;
		this.pools["Mental"].base = 0;
		this.pools["Physical"].base = 0;
		this.pools["General"].base = 0;
		this.pools["Skill"].base = 0;
		this.pools["Trait"].base = 0;

		if (this.chosenLifepaths.length > 0) {
			this.stock = this.chosenLifepaths[0].stock;

			for (var i = 0; i < this.chosenLifepaths.length; i++) {
				let lp = this.chosenLifepaths[i];
				let lpCount = 1;
				for (var c = 0; c < i; c++) { if (this.chosenLifepaths[c] == lp) { lpCount++; } }

				this.age += lp.years;
				if (i != 0 && lp.setting != this.chosenLifepaths[i - 1].setting) { this.age += 1; }

				if (lpCount == 1) {
					this.pools["Resources"].base += parseInt(lp.resources);

					this.pools["Either"].base += parseInt(lp.eitherPool);
					this.pools["Mental"].base += parseInt(lp.mentalPool);
					this.pools["Physical"].base += parseInt(lp.physicalPool);

					this.pools["General"].base += parseInt(lp.generalSkillPool);
					this.pools["Skill"].base += parseInt(lp.skillPool);

					this.pools["Trait"].base += parseInt(lp.traitPool);
				}
				else if (lpCount == 2) {
					this.pools["Resources"].base += parseInt(lp.resources);

					this.pools["Either"].base += parseInt(lp.eitherPool);
					this.pools["Mental"].base += parseInt(lp.mentalPool);
					this.pools["Physical"].base += parseInt(lp.physicalPool);

					this.pools["Skill"].base += parseInt(lp.skillPool);
					this.pools["General"].base += parseInt(lp.generalSkillPool);

					this.pools["Trait"].base += parseInt(lp.traitPool);
					if (lp.traits.length < 2) { this.pools["Trait"].base -= 1; }
				}
				else if (lpCount == 3) {
					this.pools["Resources"].base += Math.trunc(parseInt(lp.resources) / 2);

					this.pools["Skill"].base += Math.trunc(parseInt(lp.skillPool) / 2);
				}
				else if (lpCount > 3) {
					this.pools["Resources"].base += Math.trunc(parseInt(lp.resources) / 2);
				}
			}

			// Add stock stuff at the end
			let stockPools = [0, 0];
			let stockAgeArray = currentGame.stocks[this.stock.replace(/\s/g, '')].agepool;
			for (var i = 0; i < stockAgeArray.length; i++) {
				if (this.age <= stockAgeArray[i][0] && this.age >= stockAgeArray[i][1]) {
					stockPools = [stockAgeArray[i][2], stockAgeArray[i][3]];
					break;
				}
			}
			this.pools["Mental"].base += stockPools[0];
			this.pools["Physical"].base += stockPools[1];
		}
	}

	refreshSkills() {
		let tempSkillNames = [];
		let hasAppWeap = false;
		let mandAppWeap = false;

		if (this.chosenLifepaths.length > 0) {
			this.stock = this.chosenLifepaths[0].stock;

			for (var i = 0; i < this.chosenLifepaths.length; i++) {
				let lp = this.chosenLifepaths[i];
				let lpCount = 1;
				for (var c = 0; c < i; c++) { if (this.chosenLifepaths[c] == lp) { lpCount++; } }

				if (lpCount == 1) {
					for (var sk = 0; sk < lp.skills.length; sk++) {
						if (lp.skills[sk] != "—" && lp.skills[sk] != "*" && lp.skills[sk].split("->")[1] != "Appropriate Weapons") {
							let s = getSkill(lp.skills[sk]);

							if (!(s.name in this.skills)) {
								s.nonLifepath = false;
								s.opened = false;
								s.openCost = 1;
								if (s.magical || s.training) { s.openCost = 2; }
								s.exponent = 0;
								s.baseExponent = 0;
								s.shade = 0;
								s.dataCode = lp.skills[sk];

								this.skills[s.name] = s;
								this.skills[s.name].mandatory = false;
							}
							if (sk == 0) {
								this.skills[s.name].mandatory = true;
							}

							tempSkillNames.push(s.name);
						}
						else if (lp.skills[sk].split("->")[1] == "Appropriate Weapons") {
							hasAppWeap = true;
							if (sk == 0) { mandAppWeap = true; }
						}
					}
				}
				else if (lpCount == 2) {
					if (lp.skills.length > 1) {
						let s = getSkill(lp.skills[1]);
						s.dataCode = lp.skills[1];
						this.skills[s.name].mandatory = true;
					}
				}
			}
		}

		if (hasAppWeap) {
			for (var i = 0; i < this.appropriateWeapons.length; i++) {
				if (mandAppWeap && i == 0) { this.appropriateWeapons[i].mandatory = true; }
				if (!(this.appropriateWeapons[i].name in this.skills)) {
					this.skills[this.appropriateWeapons[i].name] = this.appropriateWeapons[i];
				}
			}
		}

		for (var key in this.extraSkills) {
			if (!(key in this.skills)) {
				this.skills[key] = this.extraSkills[key];
			}
		}

		for (var key in this.skills) {
			if (!(key in this.extraSkills) && !(hasAppWeap && this.appropriateWeapons.findIndex(x => x.name === key) > -1) && tempSkillNames.findIndex(x => x === key) < 0) {
				if (this.skills[key].nonLifepath) {
					if (this.skills[key].opened) { this.pools["General"].spentToOpen -= this.skills[key].openCost; }
					this.pools["General"].spentToAdvance -= this.skills[key].exponent;
				}
				else {
					if (this.skills[key].opened) { this.pools["Skill"].spentToOpen -= this.skills[key].openCost; }
					this.pools["Skill"].spentToAdvance -= this.skills[key].exponent;
				}

				delete this.skills[key];
			}
		}
	}

	refreshTraits() {
		let tempTraitNames = [];

		if (this.chosenLifepaths.length > 0) {
			this.stock = this.chosenLifepaths[0].stock;

			for (var i = 0; i < this.chosenLifepaths.length; i++) {
				let lp = this.chosenLifepaths[i];
				let lpCount = 1;
				for (var c = 0; c < i; c++) { if (this.chosenLifepaths[c] == lp) { lpCount++; } }

				if (lpCount == 1) {
					for (var tr = 0; tr < lp.traits.length; tr++) {
						if (lp.traits[tr] != "—" && lp.traits[tr] != "*") {
							let t = getTrait(lp.traits[tr]);

							if (!(t.name in this.traits)) {
								t.nonLifepath = false;
								t.opened = false;
								t.openCost = 1;
								t.dataCode = lp.traits[tr];
								if (t.name == "Spite") { t.openCost = 0; }

								this.traits[t.name] = t;
								this.traits[t.name].mandatory = false;
							}
							if (tr == 0) {
								this.traits[t.name].mandatory = true;
							}

							tempTraitNames.push(t.name);
						}
					}
				}
				else if (lpCount == 2) {
					if (lp.traits.length > 1) {
						let t = getTrait(lp.traits[1]);
						t.dataCode = lp.traits[tr];
						this.traits[t.name].mandatory = true;
					}
				}
			}
		}

		let commonTraits = {};
		if (this.stock != "Man" && this.stock != "n/a") {
			let ctListIndex = this.stock.replace(/\s/g, '') + "Common";

			for (var ct = 0; ct < currentGame.traitLists[ctListIndex].traits.length; ct++) {
				if (!currentGame.traitLists[ctListIndex].traits[ct].disabled) {
					let t = currentGame.traitLists[ctListIndex].traits[ct];

					t.nonLifepath = false;
					t.common = true;
					t.mandatory = true;
					t.opened = true;
					t.openCost = 0;
					t.dataCode = currentGame.traitLists[ctListIndex].name + "->" + currentGame.traitLists[ctListIndex].traits[ct].name;

					commonTraits[t.name] = t;
					this.traits[t.name] = t;
				}
			}
		}

		for (var key in this.extraTraits) {
			if (!(key in this.traits)) {
				this.traits[key] = this.extraTraits[key];
			}
		}

		for (var key in this.brutalTraits) {
			if (!(key in this.traits)) {
				this.traits[key] = this.brutalTraits[key];
			}
		}

		for (var key in this.traits) {
			if (!(key in this.extraTraits) && !(key in this.brutalTraits) && !(key in commonTraits) && tempTraitNames.findIndex(x => x === key) < 0) {
				if (this.traits[key].opened) {
					this.pools["Trait"].spent -= this.traits[key].openCost;
				}

				delete this.traits[key];
			}
		}
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
		if (document.querySelectorAll("input[name='Q5']:checked").length > 0) { healthAdj += 1; }
		if (document.querySelectorAll("input[name='Q6']:checked").length > 0) { healthAdj += 1; }
		if (document.querySelectorAll("input[name='Q7']:checked").length > 0) { healthAdj += 1; }

		if (document.querySelectorAll("input[name='Q8']:checked").length > 0) { steelAdj += 1; }
		if (document.querySelectorAll("input[name='Q8']:checked").length > 0 && document.querySelectorAll("input[name='Q9']:checked").length > 0) { steelAdj += 1; }
		if (document.querySelectorAll("input[name='Q8']:checked").length > 0 && document.querySelectorAll("input[name='Q9']:checked").length == 0) { steelAdj -= 1; }
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

	addStatElement(statObject) {
		let elementToAppend;

		let upShade = "<div class='emptyUD'></div>";
		let upExponent = "<div class='emptyUD'></div>";

		let downShade = "<div class='emptyUD'></div>";
		let downExponent = "<div class='emptyUD'></div>";

		if (statObject.type == "mentalstat") {
			elementToAppend = "burnerMentalStats";

			if (this.pools["Mental"].left > 0) { upExponent = "<div class='up' data-type='" + statObject.type + "' data-object='" + statObject.name + "'  data-part='exponent'></div>"; }
			if (this.pools["Mental"].left > 4) { upShade = "<div class='up' data-type='" + statObject.type + "' data-object='" + statObject.name + "'  data-part='shade'></div>"; }
			if (this.pools["Mental"].spent > 0 && statObject.exponent > 0) { downExponent = "<div class='down' data-type='" + statObject.type + "' data-object='" + statObject.name + "'  data-part='exponent'></div>"; }
			if (this.pools["Mental"].spent > 4 && statObject.shade > 0) { downShade = "<div class='down' data-type='" + statObject.type + "' data-object='" + statObject.name + "'  data-part='shade'></div>"; }
		}
		else if (statObject.type == "physicalstat") {
			elementToAppend = "burnerPhysicalStats";

			if (this.pools["Physical"].left > 0) { upExponent = "<div class='up' data-type='" + statObject.type + "' data-object='" + statObject.name + "'  data-part='exponent'></div>"; }
			if (this.pools["Physical"].left > 4) { upShade = "<div class='up' data-type='" + statObject.type + "' data-object='" + statObject.name + "'  data-part='shade'></div>"; }
			if (this.pools["Physical"].spent > 0 && statObject.exponent > 0) { downExponent = "<div class='down' data-type='" + statObject.type + "' data-object='" + statObject.name + "'  data-part='exponent'></div>"; }
			if (this.pools["Physical"].spent > 4 && statObject.shade > 0) { downShade = "<div class='down' data-type='" + statObject.type + "' data-object='" + statObject.name + "'  data-part='shade'></div>"; }
		}

		document.getElementById(elementToAppend).innerHTML += "<div class='burnerBlock picked'>"
			+ "<div class='" + statObject.type + "'>"
			+ upShade
			+ "<div class='shade'>" + this.colorShade(statObject.shade) + "</div>"
			+ downShade
			+ "</div>"
			+ "<div class='" + statObject.type + "'>"
			+ upExponent
			+ "<div class='exponent'>" + statObject.exponent + "</div>"
			+ downExponent
			+ "</div>"
			+ "<div class='stat name'>" + statObject.name + "</div>"
			+ "</div>";
	}

	addAttributeElement(attributeObject, key) {
		let upShade = "<div class='emptyUD'></div>";
		let downShade = "<div class='emptyUD'></div>";
		if (attributeObject.canShift) {
			if (attributeObject.exponent > 5) {
				upShade = "<div class='up' data-type='" + attributeObject.type + "' data-object='" + key + "'  data-part='shade'></div>";
			}
			if (attributeObject.shade > 0) {
				downShade = "<div class='down' data-type='" + attributeObject.type + "' data-object='" + key + "'  data-part='shade'></div>";
			}
		}

		let shadeBlock = "";
		if (attributeObject.hasShade) {
			shadeBlock = "<div class='" + attributeObject.type + "'>" + upShade + "<div class='shade'>" + this.colorShade(attributeObject.shade) + "</div>" + downShade + "</div>";
		}

		let name = attributeObject.name;
		if (key == "Emotional") {
			name = "<select id='emoSelect'><option value='Emotional Attribute'>Emotional Attribute</option>"
			for (var i = 0; i < this.potentialEmotionalName.length; i++) {
				if (this.potentialEmotionalName[i] == this.attributes["Emotional"].name) {
					name += "<option value='" + this.potentialEmotionalName[i] + "' selected>" + this.potentialEmotionalName[i] + "</option>";
				}
				else {
					name += "<option value='" + this.potentialEmotionalName[i] + "'>" + this.potentialEmotionalName[i] + "</option>";
				}
			}
			name += "</select>";
		}

		document.getElementById("burnerAttributes").innerHTML += "<div class='burnerBlock picked'>"
			+ shadeBlock
			+ "<div class='" + attributeObject.type + "'>"
			+ "<div class='exponent'>" + attributeObject.exponent + "</div>"
			+ "</div>"
			+ "<div class='stat name'>" + name + "</div>"
			+ "</div>";
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