// BURNING WHEEL GOLD by github.com/Sifaus
// additional thanks to Samson for helping out with lifepaths, skills and traits
// loosely based on bwlp -well, the design is kinda same but "backend" %99 different
// icons from https://material.io/

///////////////////////////// TODO LIST ////////////////////////////////////////////////////////////////////////////////////////////
// (BS)  Add Anakhi Lifepaths (Settings: Desert, Ghetto; Subsettings: Cannibal)
// (CHN) Revise changeling age pools, lifepath years and resources and all that
//	dwarf - > starting greed checklist now lists reduction from Virtuous trait
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var current_game;
var current_char;

document.addEventListener("DOMContentLoaded", function () {
	current_game = new game();
	current_game.updateAvailableSettings();
	current_game.updateLeftMenu();

	current_char = new char();
});

function getDataByID(id, category) {
	let id_parts = unescape(id).split("->");
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

/*function fDT(stockName, search) {
	let stock = db_stocks[stockName];
	search = search.split(",");
	let out = "";
	for (var i = 0; i < search.length; i++) {
		for (let setting in stock.settings) {
			let lifepaths_array = stock.settings[setting].lifepaths;
			let a = lifepaths_array.findIndex(x => x.name === search[i]);
			if (a > -1) {
				out += ",\"" + stockName + "->"
					+ setting + "->"
					+ lifepaths_array[lifepaths_array.findIndex(x => x.name === search[i])].name + "\"";
			}
		}
	}
	console.log(out);
}*/