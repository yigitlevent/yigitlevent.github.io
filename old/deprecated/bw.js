// BURNING WHEEL GOLD by github.com/yigitlevent
// additional thanks to Samson for helping out with lifepaths, skills and traits
// loosely based on bwlp -well, the design is kinda same but "backend" %99 different
// icons from https://material.io/

///////////////////////////// TODO LIST ////////////////////////////////////////////////////////////////////////////////////////////
// (BS)  Add Anakhi Lifepaths (Settings: Desert, Ghetto; Subsettings: Cannibal)
// (CHN) Revise changeling age pools, lifepath years and resources and all that
// (N/A) Uhh i forgot what i was gonna write here
//	dwarf - > starting greed checklist now lists reduction from Virtuous trait
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var debug = false;
var current_game;

document.addEventListener("DOMContentLoaded", function () {
	current_game = new game();
	current_character = new character();

	current_game.updateLeftMenu();
});

function getDataByID(id, category) {
	let id_parts = id.split("->");
	let id_type = id_parts[0];
	let id_name = "";
	let id_life = "";
	if (id_parts.length > 1) { id_name = id_parts[1]; }
	if (id_parts.length > 2) { id_life = id_parts[2]; }

	if (category == "stock") {
		return db_stocks[id_type];
	}
	else if (category == "setting") {
		return db_stocks[id_type].settings[id_name];
	}
	else if (category == "lifepath") {
		let lifepaths_array = db_stocks[id_type].settings[id_name].lifepaths;
		return lifepaths_array[lifepaths_array.findIndex(x => x.name === id_life)];
	}
	else if (category == "skill list") {
		return db_skills[id_type];
	}
	else if (category == "skill") {
		let skills_array = db_skills[id_type].skills;
		return skills_array[skills_array.findIndex(x => x.name === id_name)];
	}
	else if (category == "trait list") {
		return db_traits[id_type];
	}
	else if (category == "trait") {
		let traits_array = db_traits[id_type].traits;
		return traits_array[traits_array.findIndex(x => x.name === id_name)];
	}
}

/* Classes */
class game {
	constructor() {
		this.version = "5.00.00";
		this.title = "Burning Wheel Gold";
		this.game_type = {
			"main": "bwg",
			"mods": [],
			"extr": []
		};
		this.current_revealer = "";
	}

	checkValidity(id_array) {
		if (id_array.length > 0) {
			for (let i in id_array) {
				let n = id_array[i];
				if (this.game_type["main"].indexOf(n) > -1 ||
					this.game_type["mods"].indexOf(n) > -1 ||
					this.game_type["extr"].indexOf(n) > -1) {
					return true;
				}
			}
		}
		return false;
	}

	createBoxLink(link) {
		return (" onmouseenter='current_game.showInfoBox(this, \"" + escape(link) + "\")' onmouseleave='current_game.hideInfoBox()'");
	}

	updateLeftMenu() {
		document.title = this.title;

		document.getElementById("settings").innerHTML = "<div id='stocks'></div><div id='references'></div>";
		document.getElementById("stocks").innerHTML = "";

		for (let stock_name in db_stocks) {
			let stock = getDataByID(stock_name, "stock");
			if (this.checkValidity(stock.allowed)) {
				// Check if the stock has settings, or subsettings
				let a, b = "";
				if (stock.hasSetting) { a = "<span class='Setting'> Settings: </span>"; }
				if (stock.hasSubsetting) { b += "<span class='Subsetting'> Subsettings: </span>" }

				// Add stock names and the Setting/Subsetting fields
				let name_mini = stock.name.split(" ");
				document.getElementById("stocks").innerHTML += "<div class=" + name_mini[0] + "><h2>" + stock.name + "</h2>" + a + b + "</div>";

				// next setting :: is, valid, same type --> add ", "

				// first pass, check how many settings and subsettings this stock has
				let stock_setting_num = 0;
				let stock_subsetting_num = 0;

				for (let setting_name in stock.settings) {
					let setting = stock.settings[setting_name];
					// We only add settings that are valid because we won't be displaying other ones, so no comma is needed
					if (this.checkValidity(setting.allowed)) {
						if (setting.type == "Setting") { stock_setting_num++; }
						else if (setting.type == "Subsetting") { stock_subsetting_num++; }
					}
				}

				// Second pass, we keep track of how many settings we have added and add settings and commas accordingly
				// These start from 1 because we always add the "first" element
				let stock_setting_added_num = 1;
				let stock_subsetting_added_num = 1;

				for (let setting_name in stock.settings) {
					let setting = stock.settings[setting_name];
					if (this.checkValidity(setting.allowed)) {

						// Basic html string
						let setting_string = "<span class='settingLink' onclick='current_game.showSettingContent(\"" + stock.name + "->" + setting.name + "\")'>" + setting.name + "</span>";

						// Add comma and set the variable for next element for the next iteration
						if (setting.type == "Setting" && stock_setting_added_num < stock_setting_num) { setting_string += ", "; stock_setting_added_num++; }
						else if (setting.type == "Subsetting" && stock_subsetting_added_num < stock_subsetting_num) { setting_string += ", "; stock_subsetting_added_num++; }

						// Add all these to the document
						document.querySelector("#stocks > ." + name_mini[0] + " > ." + setting.type).innerHTML += setting_string;
					}
				}
			}
		}

		// Always add lists at the end
		document.getElementById("references").innerHTML = "<h2>Reference</h2>Lists: "
			+ "<span class='listLink' onclick='current_game.showListContent(\"skillList\")'>Skills</span>, "
			+ "<span class='listLink' onclick='current_game.showListContent(\"traitList\")'>Traits</span>";

	}

	hideInfoBox() {
		document.getElementById("infoBox").style.display = "none";
	}

	showInfoBox(box, data_id) {
		// Get Position values for the element that is being hovered
		let offset_left = box.getBoundingClientRect().left;
		let offset_width = box.getBoundingClientRect().width;
		let offset_top = box.getBoundingClientRect().top;

		let client_width = document.documentElement.clientWidth;
		let infobox_element = document.getElementById("infoBox");
		let infobox_width = 400;

		// Vertical Position
		let infobox_y = offset_top - 8;
		let infobox_x;

		// Horizontal Position
		if (client_width - offset_left - offset_width - 10 > infobox_width) {
			infobox_x = offset_left + offset_width + 0;
		}
		else {
			infobox_x = offset_left - infobox_width - 8;
		}

		// Set the box and empty it
		infobox_element.innerHTML = "";
		infobox_element.style.display = "block";
		infobox_element.style.left = infobox_x + "px";
		infobox_element.style.top = infobox_y + "px";

		let target_class = box.getAttribute("class").split(" ")[0];

		// Print values into the box
		if (target_class == "skill") {
			let actual_data = getDataByID(data_id, "skill");

			let restriction_string;
			if (actual_data.restriction != "N/A") { restriction_string = "<br>" + actual_data.restriction; }
			else { restriction_string = ""; }

			let magical_string;
			if (actual_data.magical == 1) { magical_string = "<br>Magical Skill"; }
			else { magical_string = ""; }

			let training_string;
			if (actual_data.training == 1) { training_string = "<br>Training Skill"; }
			else { training_string = ""; }

			let description_string;
			if (actual_data.desc.length > 0) { description_string = actual_data.desc + "<br><br>"; }
			else if (actual_data.desc.length == 0 && actual_data.type == "Wise") {
				description_string = "A wise is a skill through which a character can call upon the knowledge of various details of the game world—knowledge of “who’s who” or “what’s what” for the areas encompassed by his wises. For the most part, wises are fairly self-explanatory—their name says it all. Some of the more bizarre examples have detailed descriptions in the individual lifepath sections. The following are the general skill obstacles applicable to all wises.<br><br>";
			}
			else { description_string = ""; }

			infobox_element.innerHTML = "<h4>" + actual_data.name + "</h4>"
				+ "<div id='infoBoxContent'>"
				+ description_string
				+ "Root: " + actual_data.root + "<br>"
				+ "Type: " + actual_data.type + "<br>"
				+ "Tools: " + actual_data.tools + "<br>"
				+ restriction_string
				+ magical_string
				+ training_string
				+ "</div>"
		}
		else if (target_class == "trait") {
			let actual_data = getDataByID(data_id, "trait");

			let description_string;
			if (actual_data.desc.length > 0) { description_string = actual_data.desc + "<br><br>"; }
			else { description_string = ""; }

			let cost_string;
			if (actual_data.cost > 0) { cost_string = "Cost: " + actual_data.cost + "<br>"; }
			else { cost_string = ""; }

			infobox_element.innerHTML = "<h4>" + actual_data.name + "</h4>"
				+ "<div id='infoBoxContent'>"
				+ description_string
				+ cost_string
				+ "Type: " + actual_data.type + "<br>"
				+ "Stock: " + actual_data.stock
				+ "</div>"
		}
	}

	showSettingContent(lead, char = false) {
		this.current_revealer = lead;

		let setting_data = getDataByID(lead, "setting");

		let a = "<div id='contentTop'>"
			+ "<div id='innerTitle'>" + setting_data.name + " " + setting_data.type + "</div>"
			+ "<div id='lifepathTopTitles'>"
			+ "<span class='lifepathName'>Lifepath</span>"
			+ "<span class='lifepathYears'>Time</span>"
			+ "<span class='lifepathResources'>Res</span>"
			+ "<span class='lifepathStats'>Stat</span>"
			+ "<span class='lifepathLeadsTop'>Leads</span>"
			+ "</div>"
			+ "</div>";


		for (let lifepath_index in setting_data.lifepaths) {
			let lifepath_data = setting_data.lifepaths[lifepath_index];

			if (this.checkValidity(lifepath_data.allowed)) {
				// Stat String
				let lp_stats;
				if (lifepath_data.eitherPool > 0) {  // Any Positive
					lp_stats = "+" + lifepath_data.eitherPool + " M/P"
				}
				else if (lifepath_data.eitherPool < 0) {  // Any Negative
					lp_stats = lifepath_data.eitherPool + " M/P"
				}
				else if (lifepath_data.mentalPool > 0 && lifepath_data.physicalPool > 0) { // Both Positive
					lp_stats = "+" + lifepath_data.mentalPool + " M,P";
				}
				else if (lifepath_data.mentalPool < 0 && lifepath_data.physicalPool < 0) { // Both Negative
					lp_stats = lifepath_data.mentalPool + " M,P";
				}
				else if (lifepath_data.mentalPool > 0 && lifepath_data.physicalPool == 0) { // Only Mental Positive
					lp_stats = "+" + lifepath_data.mentalPool + " M";
				}
				else if (lifepath_data.mentalPool < 0 && lifepath_data.physicalPool == 0) {  // Only Mental Negative
					lp_stats = lifepath_data.mentalPool + " M";
				}
				else if (lifepath_data.mentalPool == 0 && lifepath_data.physicalPool > 0) {  // Only Physical Positive
					lp_stats = "+" + lifepath_data.physicalPool + " P";
				}
				else if (lifepath_data.mentalPool == 0 && lifepath_data.physicalPool < 0) {  // Only Physical Negative
					lp_stats = lifepath_data.physicalPool + " P";
				}
				else if (lifepath_data.mentalPool < 0 && lifepath_data.physicalPool > 0) {  // Mental Neg, Physical Pos
					lp_stats = lifepath_data.mentalPool + " M, +" + lifepath_data.physicalPool + " P";
				}
				else if (lifepath_data.mentalPool > 0 && lifepath_data.physicalPool < 0) {  // Mental Pos, Physical Neg
					lp_stats = "+" + lifepath_data.physicalPool + " M, " + lifepath_data.mentalPool + " P";
				}
				else if (lifepath_data.mentalPool == 0 && lifepath_data.physicalPool == 0) {   // None
					lp_stats = "—";
				}
				else { lp_stats = "something is really wrong here"; }

				// Output Skill Points string
				let lp_skill_points;
				let general_points;
				let lifepath_points;
				if (lifepath_data.generalSkillPool > 0) {
					let generalString = "<span class='skill'" + this.createBoxLink("Any General->General") + ">General</span>";
					if (lifepath_data.generalSkillPool > 1) {
						general_points = lifepath_data.generalSkillPool + " pts: " + generalString + "; ";
					}
					else if (lifepath_data.generalSkillPool == 1) {
						general_points = "1 pt: " + generalString + "; ";
					}
				}
				else { general_points = ""; }
				if (lifepath_data.skillPool > 1) {
					lifepath_points = lifepath_data.skillPool + " pts:";
				}
				else if (lifepath_data.skillPool == 1) {
					lifepath_points = "1 pt:";
				}
				else { lifepath_points = ""; }
				lp_skill_points = general_points + lifepath_points;

				// Output Trait Points string
				let lp_trait_points;
				if (lifepath_data.traitPool > 1) {
					if (typeof (lifepath_data.traits) !== "undefined" && lifepath_data.traits.length > 0) { lp_trait_points = lifepath_data.traitPool + " pts:" }
					else { lp_trait_points = lifepath_data.traitPool + " pts: -" }
				}
				else if (lifepath_data.traitPool == 1) {
					if (typeof (lifepath_data.traits) !== "undefined" && lifepath_data.traits.length > 0) { lp_trait_points = lifepath_data.traitPool + " pt:" }
					else { lp_trait_points = lifepath_data.traitPool + " pt: -" }
				}
				else if (lifepath_data.traitPool == 0) { lp_trait_points = "" }

				// Check if there is lp requirements
				let lifepath_requirements;
				if (lifepath_data.requirements.length > 0) {
					lifepath_requirements = "<div id='lifepathRequirements'>Requirements: " + lifepath_data.requirements + "</div>";
				}
				else {
					lifepath_requirements = "";
				}

				// Construct Skills list
				let lp_skills_list = "";
				if (typeof (lifepath_data.skills) !== "undefined") { lp_skills_list = this.makeArrayValuesString(lifepath_data.skills, "skill"); }

				// Construct Traits list
				let lp_traits_list = "";
				if (typeof (lifepath_data.traits) !== "undefined") { lp_traits_list = this.makeArrayValuesString(lifepath_data.traits, "trait"); }

				// Construct Leads list
				let lp_lead_list = "";
				if (typeof (lifepath_data.leads) !== "undefined") {
					for (var i = 0; i < lifepath_data.leads.length; i++) {
						if (this.checkValidity(getDataByID(lifepath_data.leads[i], "setting").allowed)) {
							if (i > 0 && this.checkValidity(getDataByID(lifepath_data.leads[i - 1], "setting").allowed)) {
								lp_lead_list += (", ");
							}

							let a = lifepath_data.leads[i].split("->");
							let lead_stock_name = a[0];
							let lead_setting_name = a[1];
							lp_lead_list += ("<span class='lead' onclick='current_game.showSettingContent(\"" + lead_stock_name + "->" + lead_setting_name + "\")'>" + lead_setting_name + "</span>");
						}
					}
				}

				let add_remove_icons = "<span class='addLP' onclick='current_character.addLifepath(this)' name='" + stock_name + "->" + setting_name + "->" + lifepath_data.name + "'></span>";
				if (char) { add_remove_icons = "<span class='removeLP'></span>"; }

				a += "<div class='lifepathBox'>"
					+ "<div id='lifepathTop'>"
					+ add_remove_icons
					+ "<span class='lifepathName'>" + lifepath_data.name + "</span>"
					+ "<span class='lifepathYears'>" + lifepath_data.years + "</span>"
					+ "<span class='lifepathResources'>" + lifepath_data.resources + "</span>"
					+ "<span class='lifepathStats'>" + lp_stats + "</span>"
					+ "<span class='lifepathLeads'>" + lp_lead_list + "</span>"
					+ "</div>"
					+ "<div id='lifepathSkills'>Skills: " + lp_skill_points + " " + lp_skills_list + "</div>"
					+ "<div id='lifepathTraits'>Traits: " + lp_trait_points + " " + lp_traits_list + "</div>"
					+ lifepath_requirements
					+ "</div>";
			}
		}

		document.getElementById("content").innerHTML = a;
	}

	showListContent(list_type) {
		let title = "";
		if (list_type == "skillList") { title = "Skills List"; this.current_revealer = "skillList"; }
		else if (list_type == "traitList") { title = "Traits List"; this.current_revealer = "traitList"; }

		document.getElementById("content").innerHTML = "<div id='contentTop'><div id='innerTitle'>" + title + "</div>"
			+ "<div id='listSearch'>Search: <input type='text' id='search'"
			+ "onchange='current_game.filterList()' onkeyup='current_game.filterList()'"
			+ "/><span class='info'></span></div></div>";

		// for skills
		if (list_type == "skillList") {
			for (let list_name in db_skills) {
				let list = getDataByID(list_name, "skill list");

				if (this.checkValidity(list.allowed)) {
					document.getElementById("content").innerHTML += "<div class='smallTitle' onclick='current_game.switchNextElement(this)'>" + list.name + "</div> <ul id='List' class='" + list_name + "'></ul>";

					let a = "";
					for (let skill_index in list.skills) {
						let skill = list.skills[skill_index];
						if (this.checkValidity(skill.allowed) && !skill.noList) {
							a += "<li><span class='skill listEntry'"
								+ this.createBoxLink(list.name + "->" + skill.name)
								+ " data-type='" + skill.type + "'"
								+ " data-root='" + skill.root + "'"
								+ ">" + skill.name + "</span></li>";
						}
					}
					document.querySelector("#content > [class='" + list_name + "']").innerHTML += a;
				}
			}
		}
		else if (list_type == "traitList") {
			for (let list_name in db_traits) {
				let list = getDataByID(list_name, "tra,t list");

				if (this.checkValidity(list.allowed)) {
					document.getElementById("content").innerHTML += "<div class='smallTitle' onclick='current_game.switchNextElement(this)'>" + list.name + "</div> <ul id='List' class='" + list_name + "'></ul>";

					let a = "";
					for (let trait_index in list.traits) {
						let trait = list.traits[trait_index];
						if (this.checkValidity(trait.allowed)) {
							a += "<li><span class='trait listEntry'"
								+ this.createBoxLink(list.name + "->" + trait.name)
								+ " data-cost='" + trait.cost + "'"
								+ " data-type='" + trait.type + "'"
								+ ">" + trait.name + "</span></li>";
						}
					}
					document.querySelector("#content > [class='" + list_name + "']").innerHTML += a;
				}
			}
		}
	}

	makeArrayValuesString(data_array, type) {
		let stringified_array = "";

		if (data_array[0] != "n/a" && data_array.length == 0) { stringified_array = "—"; }
		else if (data_array[0] != "n/a") {
			for (var i = 0; i < data_array.length; i++) {
				if (i != 0) { stringified_array += (", "); }

				let thing_name = data_array[i].split("->")[1];

				stringified_array += ("<span class=" + type
					+ this.createBoxLink(data_array[i]) + ">"
					+ thing_name + "</span>");
			}
		}
		else {
			stringified_array = "n/a";
		}

		return stringified_array;
	}

	filterList() {
		let search_string = document.getElementById("search").value.split(" ");
		let search_type, search_cost, search_name, search_root;
		for (let i = 0; i < search_string.length; i++) {
			if (search_string[i].indexOf('c:') == 0) { search_cost = search_string[i].slice(2); }
			else if (search_string[i].indexOf('t:') != -1) { search_type = search_string[i].slice(2); }
			else if (search_string[i].indexOf('r:') != -1) { search_root = search_string[i].slice(2); }
			else { search_name = search_string[i]; }
		}

		let li_cc, li_ct, li_ctl, li_cn, li_cnl, li_cr, li_crl;

		document.querySelectorAll(".listEntry").forEach(function (element) {
			element.parentElement.style.display = "inline-block";

			li_ct = element.dataset.type;
			li_ctl = element.dataset.type.toLowerCase();

			if (element.classList.contains("skill")) {
				li_cr = element.dataset.root;
				li_crl = element.dataset.root.toLowerCase();
			}

			if (element.classList.contains("trait")) {
				li_cc = element.dataset.cost;
			}

			li_cn = element.textContent;
			li_cnl = element.textContent.toLowerCase();

			if (search_cost != null && search_cost != "" && search_cost != undefined && search_cost != " " && parseInt(li_cc) != parseInt(search_cost)) {
				element.parentElement.style.display = "none";
			}

			if (search_type != null && search_type != "" && search_type != undefined && search_type != " " && li_ct.indexOf(search_type) == -1 && li_ctl.indexOf(search_type) == -1) {
				element.parentElement.style.display = "none";
			}

			if (search_root != null && search_root != "" && search_root != undefined && search_root != " " && li_cr.indexOf(search_root) == -1 && li_crl.indexOf(search_root) == -1) {
				element.parentElement.style.display = "none";
			}

			if (search_name != null && search_name != "" && search_name != undefined && search_name != " " && li_cn.indexOf(search_name) == -1 && li_cnl.indexOf(search_name) == -1) {
				element.parentElement.style.display = "none";
			}

		});

		document.querySelectorAll(".smallTitle").forEach(function (element) {
			let nodes = element.nextSibling.nextSibling.childNodes;
			element.nextSibling.nextSibling.style.display = "block";
			element.style.display = "none";
			for (let i = 0; i < nodes.length; i++) {
				if (!!(nodes[i].offsetWidth || nodes[i].offsetHeight || nodes[i].getClientRects().length)) {
					element.style.display = "block";
				}
			}
		});
	}

	changeTab(box) {
		document.querySelectorAll(".midTitle").forEach(function (element) { element.classList.remove("chosenTab"); });
		document.querySelectorAll("#explorerWrapper, #chroniclerWrapper, #burnerWrapper, #adjusterWrapper, #practicerWrapper, #observerWrapper").forEach(function (element) {
			element.style.display = "none";
		});

		box.classList.add("chosenTab");
		document.querySelector("#" + box.getAttribute("name") + "Wrapper").style.display = "block";
	}

	switchTypes(box, type) {
		if (type == "main") {
			let setting_selection_elements = document.getElementsByClassName("settingSelect");
			for (let i = 0; i < setting_selection_elements.length; i++) { setting_selection_elements[i].classList.remove("added"); }
			box.classList.add("added");
			this.game_type.main = box.getAttribute("name");
		}
		else {
			if (box.classList.contains("added")) {
				box.classList.remove("added");
				if (type == "mods") {
					let index = this.game_type.mods.indexOf(box.getAttribute("name"));
					this.game_type.mods.splice(index, 1);
				}
				if (type == "extr") {
					let index = this.game_type.extr.indexOf(box.getAttribute("name"));
					this.game_type.extr.splice(index, 1);
				}
			}
			else {
				box.classList.add("added");
				if (type == "mods") {
					this.game_type.mods.push(box.getAttribute("name"));
				}
				if (type == "extr") {
					this.game_type.extr.push(box.getAttribute("name"));
				}
			}
		}
		this.reloadCurrentRevealer();
		this.updateLeftMenu();
	}

	reloadCurrentRevealer() {
		document.getElementById("content").innerHTML = "";

		if (this.current_revealer.length > 0) {
			if (this.current_revealer == "skillList" || this.current_revealer == "traitList") {
				this.showListContent(this.current_revealer);
			}
			else {
				if (this.checkValidity(getDataByID(this.current_revealer, "setting").allowed)) {
					this.showSettingContent(this.current_revealer);
				}
			}
		}
	}

	switchNextElement(box) {
		let a = window.getComputedStyle(box.nextSibling.nextSibling, null).getPropertyValue("display");
		if (a == "none") { box.nextSibling.nextSibling.style.display = "block"; }
		else { box.nextSibling.nextSibling.style.display = "none"; }
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
		this.potential_emotional_name = [];
		this.checkedQuestions = [];
	}

	// START BASIC METHODS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	reset() { }
	download() { }

	// START LIFEPATH METHODS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	addLifepath(object) {
		this.chosenLifepaths.push(getDataByID(object.getAttribute("name"), "lifepath"));
		this.refreshData();
		this.showData();
	}

	removeLifepath(object) {
		this.chosenLifepaths.splice(this.chosenLifepaths.indexOf(object.getAttribute("name"), 1));
		this.refreshData();
		this.showData();
	}

	// START REFRESHDATA METHODS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	refreshData() {
		this.refreshBasics();
		this.refreshSkills();
		/*this.refreshTraits();

		this.refreshAttributes();
		this.refreshQuestionAnswers();
		this.refreshSkillBaseValues();

		this.refreshPointsLeft();

		this.setStore();
		this.showData();*/
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
			let stockAgeArray = getDataByID(this.stock, "stock").agepool;
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
			for (var i = 0; i < this.chosenLifepaths.length; i++) {
				let lp = this.chosenLifepaths[i];

				let lpCount = 1;
				for (var c = 0; c < i; c++) { if (this.chosenLifepaths[c] == lp) { lpCount++; } }

				if (lpCount == 1 && "skills" in lp) {
					for (var sk = 0; sk < lp.skills.length; sk++) {
						if (lp.skills[sk] != "—" && lp.skills[sk] != "*" && lp.skills[sk].split("->")[1] != "Appropriate Weapons") {
							let s = getDataByID(lp.skills[sk], "skill");

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
				else if (lpCount == 2 && "skills" in lp) {
					if (lp.skills.length > 1) {
						let s = getDataByID(lp.skills[1], "skill");
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
			for (var i = 0; i < this.chosenLifepaths.length; i++) {
				let lp = this.chosenLifepaths[i];
				let lpCount = 1;
				for (var c = 0; c < i; c++) { if (this.chosenLifepaths[c] == lp) { lpCount++; } }

				if (lpCount == 1 && "traits" in lp) {
					for (var tr = 0; tr < lp.traits.length; tr++) {
						if (lp.traits[tr] != "—" && lp.traits[tr] != "*") {
							let t = getDataByID(lp.traits[tr], "trait");

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
				else if (lpCount == 2 && "traits" in lp) {
					if (lp.traits.length > 1) {
						let t = getDataByID(lp.traits[1], "trait");
						t.dataCode = lp.traits[tr];
						this.traits[t.name].mandatory = true;
					}
				}
			}
		}

		let commonTraits = {};
		if (this.stock != "Man" && this.stock != "n/a") {
			let ctListIndex = this.stock + " Common";

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

	refreshPoolsLeft() {
		this.pools["Resources"].left = this.pools["Resources"].base - this.pools["Resources"].spent;

		this.pools["Mental"].left = this.pools["Either"].transferedToMental + this.pools["Mental"].base - this.pools["Mental"].spent;
		this.pools["Physical"].left = this.pools["Either"].transferedToPhysical + this.pools["Physical"].base - this.pools["Physical"].spent;
		this.pools["Either"].left = this.pools["Either"].base - this.pools["Either"].transferedToMental - this.pools["Either"].transferedToPhysical;

		this.pools["General"].left = this.pools["General"].base - this.pools["General"].spentToOpen - this.pools["General"].spentToAdvance - this.pools["General"].transferedToSkill;
		this.pools["Skill"].left = this.pools["Skill"].base - this.pools["Skill"].spentToOpen - this.pools["Skill"].spentToAdvance + this.pools["General"].transferedToSkill;

		this.pools["Trait"].left = this.pools["Trait"].base - this.pools["Trait"].spent;
	}

	// START SHOWDATA METHODS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	showData() {
		;
		this.showCharacterBasics();
		this.showCharacterQuestions();
	}

	showCharacterBasics() {
		document.querySelector("#sheetStock > .data").innerHTML = this.stock;
		document.querySelector("#sheetAge > .data").innerHTML = this.age;
		document.querySelector("#sheetRP > .data").innerHTML = this.pools["Resources"].base;

		document.getElementById("charImg").style.background = "url(./inc/img_wheel.png) no-repeat";
		if (this.stock != "n/a") {
			document.getElementById("charImg").style.background = "url(./inc/img_" + this.stock.split(" ")[0] + ".png) no-repeat";
		}
	}

	showCharacterQuestions() {
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
	}

	// TODO FIND A PLACE MISC
	checkPotentialEmotionals() {
		this.potential_emotional_name = [];

		if (current_game.gameType == "bsn") {
			for (var key in this.traits) {
				if (this.traits[key].name == "Empty Faith" && this.traits[key].opened) { this.potential_emotional_name.push("Dead Faith"); }
				if (this.traits[key].name == "Corrupted" && this.traits[key].opened) { this.potential_emotional_name.push("Corruption"); }
				if (this.traits[key].name == "Favored" && this.traits[key].opened) { this.potential_emotional_name.push("Favored"); }
			}
			// TODO: These should be tied to a trait like others
			if (this.stock == "Dwarf") { this.potential_emotional_name.push("Path"); }
			if (this.stock == "Anakhi") { this.potential_emotional_name.push("Hatred"); }
		}
		else {
			for (var key in this.traits) {
				if (this.traits[key].name == "Corrupted" && this.traits[key].opened) { this.potential_emotional_name.push("Corruption"); }
				if (this.traits[key].name == "Faithful" && this.traits[key].opened) { this.potential_emotional_name.push("Faith"); }
				if (this.traits[key].name == "Faith in Dead Gods" && this.traits[key].opened) { this.potential_emotional_name.push("Dead Faith"); }
				if (this.traits[key].name == "Greed" && this.traits[key].opened) { this.potential_emotional_name.push("Greed"); }
				if (this.traits[key].name == "Grief" && this.traits[key].opened) { this.potential_emotional_name.push("Grief"); }
				if (this.traits[key].name == "Restlessness" && this.traits[key].opened) { this.potential_emotional_name.push("Restlessness"); }
				if (this.traits[key].name == "Spite" && this.traits[key].opened) { this.potential_emotional_name.push("Spite"); }
				if (this.traits[key].name == "Visionary Faith" && this.traits[key].opened) { this.potential_emotional_name.push("Visionary Faith"); }
				if (this.traits[key].name == "Void Embrace" && this.traits[key].opened) { this.potential_emotional_name.push("Void Embrace"); }
			}
			if (this.stock == "Orc") { this.potential_emotional_name.push("Hatred"); }
			if (this.stock == "Great Wolf") { this.potential_emotional_name.push("Ancestral Taint"); }
		}
	}

	// START OLD METHODS ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	old_showData() {
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
	}

}