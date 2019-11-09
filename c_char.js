class char {
	constructor() {
		// things that are chosen
		this.lifepaths = [];

		// things that are automatically calculated from chosen lifepaths
		this.stock = "n/a";
		this.age = 0.0;

		this.pools = {
			Resources: { base: 0, spent: 0 },
			Either: { base: 0, transferedToMental: 0, transferedToPhysical: 0 },
			Mental: { base: 0, spent: 0 },
			Physical: { base: 0, spent: 0 },
			GeneralSP: { base: 0, spentToOpen: 0, spentToAdvance: 0, transferedToLifepathSP: 0 },
			LifepathSP: { base: 0, spentToOpen: 0, spentToAdvance: 0 },
			Trait: { base: 0, spent: 0 }
		}
		
		this.appropriateWeapons = [];
		this.skills = {};
		this.extraSkills = {};

		this.traits = {};
		this.extraTraits = {};
		this.brutalTraits = {};

		this.potentialEmotionalNames = [];

		// things that are calculated or chosen
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

		this.checkedQuestions = [];
		this.resources = [{ name: "", type: "none", cost: 0, note: "" }];

		this.refreshShownQuestions();
	}

	refresh() {
		this.refreshData();
		this.refreshHTML();
	}

	refreshHTML() {
		let a = "";
		for (let i in this.lifepaths) {
			let lifepath = this.lifepaths[i];
			a += current_game.getLifepath(lifepath["stock"] + "->" + lifepath["setting"], lifepath, 1);
		}
		document.getElementById("char-lp-box").innerHTML = a;
	}

	addLifepath(object) {
		this.lifepaths.push(getDataByID(unescape(object.getAttribute('data-lead')) + "->" + object.innerHTML, "lifepath"));
		this.updateAppropriateWeaponsList();
		this.refresh();
	}

	removeLifepath(object) {
		this.lifepaths.splice(this.lifepaths.findIndex(x => x.name === object.innerHTML), 1);
		this.updateAppropriateWeaponsList();
		this.refresh();
	}

	// basic calculations
	refreshData() {
		this.refreshBasics();

		this.refreshSkills();
		this.refreshTraits();

		this.refreshPotentialEmotionals();
		this.refreshShownQuestions();
	}

	refreshBasics() {
		this.stock = "n/a";
		this.age = 0;
		this.pools["Resources"].base = 0;
		this.pools["Either"].base = 0;
		this.pools["Mental"].base = 0;
		this.pools["Physical"].base = 0;
		this.pools["GeneralSP"].base = 0;
		this.pools["LifepathSP"].base = 0;
		this.pools["Trait"].base = 0;

		if (this.lifepaths.length > 0) {
			this.stock = this.lifepaths[0].stock;

			for (var i = 0; i < this.lifepaths.length; i++) {
				let lp = this.lifepaths[i];

				// we have to keep repeated lifepaths in mind 
				let lpCount = 1;
				for (var c = 0; c < i; c++) { if (this.lifepaths[c] == lp) { lpCount++; } }

				// leads add 1 more years 
				this.age += lp.years;
				if (i != 0 && lp.setting != this.lifepaths[i - 1].setting) { this.age += 1; }

				if (lpCount == 1) {
					this.pools["Resources"].base += parseInt(lp.resources);

					this.pools["Either"].base += parseInt(lp.eitherPool);
					this.pools["Mental"].base += parseInt(lp.mentalPool);
					this.pools["Physical"].base += parseInt(lp.physicalPool);

					this.pools["GeneralSP"].base += parseInt(lp.generalSkillPool);
					this.pools["LifepathSP"].base += parseInt(lp.skillPool);

					this.pools["Trait"].base += parseInt(lp.traitPool);
				}
				else if (lpCount == 2) {
					this.pools["Resources"].base += parseInt(lp.resources);

					this.pools["Either"].base += parseInt(lp.eitherPool);
					this.pools["Mental"].base += parseInt(lp.mentalPool);
					this.pools["Physical"].base += parseInt(lp.physicalPool);

					this.pools["GeneralSP"].base += parseInt(lp.generalSkillPool);
					this.pools["LifepathSP"].base += parseInt(lp.skillPool);

					this.pools["Trait"].base += parseInt(lp.traitPool);
					if (lp.traits.length < 2) { this.pools["Trait"].base -= 1; }
				}
				else if (lpCount == 3) {
					this.pools["Resources"].base += Math.trunc(parseInt(lp.resources) / 2);

					this.pools["LifepathSP"].base += Math.trunc(parseInt(lp.skillPool) / 2);
				}
				else if (lpCount > 3) {
					this.pools["Resources"].base += Math.trunc(parseInt(lp.resources) / 2);
				}
			}

			// Add stock stuff at the end
			let stockPools = [0, 0];
			let stockAgeArray = getDataByID(this.stock, "stock").agePool;
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

		if (this.lifepaths.length > 0) {
			for (var i = 0; i < this.lifepaths.length; i++) {
				let lp = this.lifepaths[i];

				let lpCount = 1;
				for (var c = 0; c < i; c++) { if (this.lifepaths[c] == lp) { lpCount++; } }

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
					if (this.skills[key].opened) { this.pools["GeneralSP"].spentToOpen -= this.skills[key].openCost; }
					this.pools["GeneralSP"].spentToAdvance -= this.skills[key].exponent;
				}
				else {
					if (this.skills[key].opened) { this.pools["LifepathSP"].spentToOpen -= this.skills[key].openCost; }
					this.pools["LifepathSP"].spentToAdvance -= this.skills[key].exponent;
				}

				delete this.skills[key];
			}
		}
	}
	
	refreshTraits() {
		let tempTraitNames = [];

		if (this.lifepaths.length > 0) {
			for (var i = 0; i < this.lifepaths.length; i++) {
				let lp = this.lifepaths[i];
				let lpCount = 1;
				for (var c = 0; c < i; c++) { if (this.lifepaths[c] == lp) { lpCount++; } }

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

	refreshPotentialEmotionals() {
		this.potentialEmotionalNames = [];

		if (current_game.gameType == "bsn") {
			for (var key in this.traits) {
				if (this.traits[key].name == "Empty Faith" && this.traits[key].opened) { this.potentialEmotionalNames.push("Dead Faith"); }
				if (this.traits[key].name == "Corrupted" && this.traits[key].opened) { this.potentialEmotionalNames.push("Corruption"); }
				if (this.traits[key].name == "Favored" && this.traits[key].opened) { this.potentialEmotionalNames.push("Favored"); }
			}
			// TODO: These should be tied to a trait like others
			if (this.stock == "Dwarf") { this.potentialEmotionalNames.push("Path"); }
			if (this.stock == "Anakhi") { this.potentialEmotionalNames.push("Hatred"); }
		}
		else {
			for (var key in this.traits) {
				if (this.traits[key].name == "Corrupted" && this.traits[key].opened) { this.potentialEmotionalNames.push("Corruption"); }
				if (this.traits[key].name == "Faithful" && this.traits[key].opened) { this.potentialEmotionalNames.push("Faith"); }
				if (this.traits[key].name == "Faith in Dead Gods" && this.traits[key].opened) { this.potentialEmotionalNames.push("Dead Faith"); }
				if (this.traits[key].name == "Greed" && this.traits[key].opened) { this.potentialEmotionalNames.push("Greed"); }
				if (this.traits[key].name == "Grief" && this.traits[key].opened) { this.potentialEmotionalNames.push("Grief"); }
				if (this.traits[key].name == "Restlessness" && this.traits[key].opened) { this.potentialEmotionalNames.push("Restlessness"); }
				if (this.traits[key].name == "Spite" && this.traits[key].opened) { this.potentialEmotionalNames.push("Spite"); }
				if (this.traits[key].name == "Visionary Faith" && this.traits[key].opened) { this.potentialEmotionalNames.push("Visionary Faith"); }
				if (this.traits[key].name == "Void Embrace" && this.traits[key].opened) { this.potentialEmotionalNames.push("Void Embrace"); }
			}
			if (this.stock == "Orc") { this.potentialEmotionalNames.push("Hatred"); }
			if (this.stock == "Great Wolf") { this.potentialEmotionalNames.push("Ancestral Taint"); }
		}
	}

	refreshShownQuestions() {
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

	// Other
	updateAppropriateWeaponsList() {
		this.appropriateWeapons = [];
		let weapons = document.querySelectorAll('.weapon');
		for (let i = 0; i < weapons.length; i++) {
			if (weapons[i].childNodes[0].checked) {
				this.appropriateWeapons.push(getDataByID(weapons[i].childNodes[0].value, "skill"));
			}
		}

		this.refresh();
	}

}