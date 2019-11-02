class game {
	constructor() {
		this.version = "5.00.00";
		this.title = "Burning Wheel Gold";
		this.game_type = {
			"main": "bwc",
			"mods": ["dregs", "chang", "halfl"],
			"extr": ["bountyhunter", "druid", "masterpigeon", "soldierspy"]
		};
		this.current_revealer = "";
	}

	// Base
	updateAvailableSettings() {
		document.getElementById("settingOptions").innerHTML = "";

		let optionString = "<option value=''></option>";
		for (let stock_name in db_stocks) {
			if (this.checkValidity(getDataByID(stock_name, "stock").allowed)) {
				optionString += "<option value=\"" + stock_name + "\">" + stock_name + "</option>";
			}
		}

		optionString += "<option value='References'>References</option>";

		document.getElementById("settingOptions").innerHTML = optionString;
	}

	updateLeftMenu() {
		document.title = this.title;

		let current_name = document.getElementById("settingOptions").value;

		if (current_name == "References") {
			document.getElementById("explorerWrapper").innerHTML = "<div id='references'><h2>Reference</h2>Lists: "
				+ "<span class='listLink' onclick='current_game.showListContent(\"skillList\")'>Skills</span>, "
				+ "<span class='listLink' onclick='current_game.showListContent(\"traitList\")'>Traits</span></div>";
		}
		else if (current_name == "") { }
		else {
			document.getElementById("explorerWrapper").innerHTML = "<div id='stocks'></div>";
			document.getElementById("stocks").innerHTML = "";

			let stock_name = current_name;
			let stock = getDataByID(stock_name, "stock");

			if (this.checkValidity(stock.allowed)) {
				// Check if the stock has settings, or subsettings
				let a, b = "";
				if (stock.hasSetting) { a = "<div class='Setting'> Settings: </div>"; }
				if (stock.hasSubsetting) { b += "<div class='Subsetting'> Subsettings: </div>" }

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

	}

	// Content
	showSettingContent(lead) {
		this.current_revealer = lead;

		let setting_data = getDataByID(lead, "setting");

		let a = "<div id='contentTop'>"
			+ "<div id='innerTitle'>" + setting_data.name + " " + setting_data.type + "</div>"
			+ "<div id='lifepathTopTitles'>"
			+ "<span class='lifepathName'>Lifepath</span>"
			+ "<span class='lifepathYears'>Time</span>"
			+ "<span class='lifepathResources'>Res</span>"
			+ "<span class='lifepathStats'>Stat</span>"
			+ "<span class='lifepathLeads'>Leads</span>"
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
				let lifepath_requirements = this.requirementStringifier(lifepath_data);

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

				a += "<div class='lifepathBox'>"
					+ "<div id='lifepathTop'>"
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
				let list = getDataByID(list_name, "trait list");

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

	// Search
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

	// InfoBox Related
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
		if (offset_width <= 600) { infobox_element.style.display = "absolute"; }
		else { infobox_element.style.display = "block"; }
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

	// Minor Methods
	requirementsSplitFormat(str) {
		let split = str.split("->");

		let s = split[2];
		if (split[0] == "Skill") { s += " skill"; }
		else if (split[0] == "Trait") { s += " trait"; }

		return s;
	}

	requirementStringifierBasic(lpr, type, eArrS) {
		console.log(lpr)


		let temp_obj = {};
		for (let i = 0; i < lpr[type].length; i++) {
			// [lpname, lpname]
			if (Array.isArray(lpr[type][i])) {
				let s = this.requirementsSplitFormat(lpr[type][i][0]) + " " + eArrS + " " + this.requirementsSplitFormat(lpr[type][i][1]);
				temp_obj[s] = "";
			}
			else {
				let a = lpr[type][i].split("->");
				// #*ANY, #*lpname
				if (a[2].split("*").length > 1) {
					let p = a[2].split("*");
					if (p[1] == "ANY") {
						let s = "";
						if (p[0] > 1) { s += "any " + p[0] + " " + a[1] + " lifepaths"; }
						else { s += "any " + a[1] + " lifepath"; }
						temp_obj[s] = "";
					}
					else {
						let s = "";
						if (p[0] > 1) { s += p[0] + " " + a[1] + " lifepaths"; }
						else { s += a[1] + " lifepath"; }
						temp_obj[s] = "";
					}
				}
				// lpname
				else {
					let s = this.requirementsSplitFormat(lpr[type][i]) + "";
					temp_obj[s] = "";
				}
			}
		}
		let temp_obj_length = Object.keys(temp_obj).length;
		let t_str = "";
		for (let i = 0; i < temp_obj_length; i++) {
			t_str += Object.keys(temp_obj)[i];
			if (i < temp_obj_length - 1) { t_str += ", "; }
			if (i == temp_obj_length - 2) { t_str += type.toLowerCase() + " "; }
		}
		return t_str;
	}

	requirementStringifier(reqObj) {
		let reqStr = "<div id='lifepathRequirements'>";
		if ("requirements" in reqObj) {
			reqStr += "Requirements: <br>";
			let lpr = reqObj.requirements;
			if ("OR" in lpr) {
				reqStr += "Any: " + this.requirementStringifierBasic(lpr, "OR", "and");
			}
			if ("AND" in lpr) {
				if ("OR" in lpr) { reqStr += "<br>" }
				reqStr += "All: " + this.requirementStringifierBasic(lpr, "AND", "or");
			}
			// TODO: NOTAND
			if ("LIMIT" in lpr) {
				if ("OR" in lpr || "AND" in lpr) { reqStr += "<br>" }

				reqStr += "Restrictions: ";
				for (let i = 0; i < lpr.LIMIT.length; i++) {
					let a = lpr.LIMIT[i].split("->");
					if (a[0] == "YEARS") {
						reqStr += "Character must be at least " + a[1] + " years old.";
					}
					else if (a[0] == "GENDER") {
						reqStr += "Character must be " + a[1].toLowerCase() + ".";
					}
					else if (a[0] == "IS") {
						if (a[1] == "UNIQUE") { reqStr += "This lifepath can only be taken once."; }
						else if (a[1].startsWith("LP*")) {
							let b = a[1].slice(3);

							let ending = "";
							if (b.endsWith("1")) { ending = "st" }
							else if (b.endsWith("2")) { ending = "nd" }
							else if (b.endsWith("3")) { ending = "rd" }
							else { ending = "th" }

							reqStr += "This lifepath must be " + b + ending + " lifepath.";
						}
					}
					else if (a[0] == "NOT") {
						if (a[1] == "UNIQUE") { reqStr += "This lifepath cannot only be taken once."; }
						else if (a[1].startsWith("LP*")) {
							let b = a[1].slice(3);

							let ending = "";
							if (b.endsWith("1")) { ending = "st" }
							else if (b.endsWith("2")) { ending = "nd" }
							else if (b.endsWith("3")) { ending = "rd" }
							else { ending = "th" }

							reqStr += "This lifepath cannot be " + b + ending + " lifepath.";
						}
					}
					if (i < lpr.LIMIT.length - 1) { reqStr += " "; }
				}
			}
			if ("TEXT" in lpr) {
				if ("OR" in lpr || "AND" in lpr || "LIMIT" in lpr) { reqStr += "<br>" }
				reqStr += "Notes: " + lpr.TEXT;
			}
		}

		reqStr += "</div>";
		return reqStr;
	}

	changeTab(box) {
		document.querySelectorAll(".midTitle").forEach(function (element) { element.classList.remove("chosenTab"); });
		document.querySelectorAll("#explorerWrapper, #chroniclerWrapper, #burnerWrapper, #adjusterWrapper, #practicerWrapper, #observerWrapper")
			.forEach(function (element) {
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
}
