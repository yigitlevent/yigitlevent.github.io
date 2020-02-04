document.addEventListener('DOMContentLoaded', () => {
	begin();
	createControls();
	setMarkers();
});

var map;
var currentDistrict = "Central City";
var districts = {
	"Central City": [-95.37000102894808, 29.74935969587223],
	//"Old Town": [-71.39544984983132, 41.824329513864],
	//"Southern Suburbs": [-82.86700751070038, 42.569926168113426],
	//"Industrial District": [-90.05039784977666, 35.02930443695975],
};
var markers = {
	"Oldest Church": {
		district: "Central City", type: "church", pos: [-95.33228469673423, 29.743529232835343], text: "Lorem ipsum"
	},
	"Marionette International Airport": {
		district: "Central City", type: "airport", pos: [-95.4007260410444, 29.718686064465757], text: "Lorem ipsum"
	},
	"St. Thomas Park": {
		district: "Central City", type: "park", pos: [-95.38692738291732, 29.76509226681364], text: "Lorem ipsum"
	},
	"Black Industries HQ": {
		district: "Central City", type: "city-hall", pos: [-95.36218178934273, 29.750957023832328], text: "Lorem ipsum"
	},
	"St. Laurent Cemetery": {
		district: "Central City", type: "cemetery", pos: [-95.3459913638067, 29.74927982880584], text: "Lorem ipsum"
	},
	"Central Courthouse": {
		district: "Central City", type: "courthouse", pos: [-95.35969803087967, 29.753352968049356], text: "Lorem ipsum"
	},
	"Central Police Station": {
		district: "Central City", type: "police", pos: [-95.36420559253473, 29.737538677988496], text: "Lorem ipsum"
	},
	"Qayyum Mosque": {
		district: "Central City", type: "mosque", pos: [-95.37956809858274, 29.750957023832328], text: "Lorem ipsum"
	},
	"Central Synagogue": {
		district: "Central City", type: "synagogue", pos: [-95.35500648711637, 29.74840128687923], text: "Lorem ipsum"
	},
	"St. Gabriel Cathedral": {
		district: "Central City", type: "church", pos: [-95.35491449606225, 29.75662733252598], text: "Lorem ipsum"
	},
	"St. Gabriel Cemetery": {
		district: "Central City", type: "cemetery", pos: [-95.35592639765848, 29.75790510427872], text: "Lorem ipsum"
	},
	"Café Auveil": {
		district: "Central City", type: "cafe", pos: [-95.34019592739354, 29.757505802355922], text: "Lorem ipsum"
	},
	"Café Riverside": {
		district: "Central City", type: "cafe", pos: [-95.33872407052671, 29.75550926887817], text: "Lorem ipsum"
	},
	"Club Moon": {
		district: "Central City", type: "night-club", pos: [-95.32501740345376, 29.75838426448547], text: "Lorem ipsum"
	},
	"Nextclub": {
		district: "Central City", type: "night-club", pos: [-95.33780415998507, 29.741612294218143], text: "Lorem ipsum"
	},
	"Central Bank": {
		district: "Central City", type: "bank", pos: [-95.35675431714601, 29.746005224311958], text: "Lorem ipsum"
	},
	"Central Hospital": {
		district: "Central City", type: "hospital", pos: [-95.34893507754084, 29.753912013459498], text: "Lorem ipsum"
	},
	"City Hall": {
		district: "Central City", type: "local-government", pos: [-95.3579502008505, 29.752155003099006], text: "Lorem ipsum"
	},
	"Arkham State University": {
		district: "Central City", type: "university", pos: [-95.39115897140957, 29.759262718915394], text: "Lorem ipsum"
	},
	"Miskatonic University": {
		district: "Central City", type: "university", pos: [-95.36199780723449, 29.72188167199438], text: "Lorem ipsum"
	},
	"Riverpark": {
		district: "Central City", type: "park", pos: [-95.33743619576812, 29.75990159002673], text: "Lorem ipsum"
	},
	"Museum of Modern Art": {
		district: "Central City", type: "art-gallery", pos: [-95.35160281811164, 29.740414188974498], text: "Lorem ipsum"
	},
	"Grand Museum": {
		district: "Central City", type: "museum", pos: [-95.3759804474698, 29.736899664351625], text: "Lorem ipsum"
	},
	"Suncity Entertainment Area": {
		district: "Central City", type: "amusement-park", pos: [-95.33486044625094, 29.756946776991285], text: "Lorem ipsum"
	},
	"Central Fire Department": {
		district: "Central City", type: "fire-station", pos: [-95.3546385228999, 29.742411023095514], text: "Lorem ipsum"
	},
	"Your Home 1": {
		district: "Central City", type: "postal-code", pos: [-95.33706823155116, 29.765651246736198], text: "Lorem ipsum"
	},
	"Your Home 2": {
		district: "Central City", type: "postal-code", pos: [-95.34764720278226, 29.734103931820513], text: "Lorem ipsum"
	},
	"Your Home 3": {
		district: "Central City", type: "postal-code", pos: [-95.36503351202226, 29.733624655562963], text: "Lorem ipsum"
	},
	"Kingsdown Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.35960603982555, 29.749998630110227], text: "Lorem ipsum"
	},
	"West Lehan Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.3672412973225, 29.740573937167312], text: "Lorem ipsum"
	},
	"Bosworth Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.38352371391262, 29.731068476847867], text: "Lorem ipsum"
	},
	"Rettman Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.41102903911265, 29.73210693230598], text: "Lorem ipsum"
	},
	"Vicarroad Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.40182993369427, 29.750318095702013], text: "Lorem ipsum"
	},
	"Birkwood Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.37174885897757, 29.75566899301994], text: "Lorem ipsum"
	},
	"Parkland Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.33670026733469, 29.75503009492553], text: "Lorem ipsum"
	},
	"Wildcrest Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.35905409350036, 29.757505802355922], text: "Lorem ipsum"
	},
	"Park Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.32566134083304, 29.748081815178224], text: "Lorem ipsum"
	},
	"Airport Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.39695440782275, 29.718606172973566], text: "Lorem ipsum"
	},
	"Algonquian Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.35031494335354, 29.733624655562963], text: "Lorem ipsum"
	},
	"Hillard Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.32768514402505, 29.730828831753755], text: "Lorem ipsum"
	},
	"Boulevard Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.30349149677562, 29.741212927394628], text: "Lorem ipsum"
	},
	"Court Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.37358868006085, 29.76700875642085], text: "Lorem ipsum"
	},
	"West Bremer Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.3625497535592, 29.77922551572607], text: "Lorem ipsum"
	},
	"Northeast Eden Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.33476845519682, 29.7736363336563], text: "Lorem ipsum"
	},
	"South Sperling Subway Station": {
		district: "Central City", type: "subway-station", pos: [-95.40698143272864, 29.77092147552476], text: "Lorem ipsum"
	},
	"Rockaway Police Station": {
		district: "Central City", type: "police", pos: [-95.38766331135075, 29.73594113626197], text: "Lorem ipsum"
	},
	"Northern Mosslane Police Station": {
		district: "Central City", type: "police", pos: [-95.35362662130365, 29.776031735599105], text: "Lorem ipsum"
	},
	"Rockaway Fire Department": {
		district: "Central City", type: "fire-station", pos: [-95.38453561550838, 29.739455694473136], text: "Lorem ipsum"
	},
	"Eastern City Heights Park": {
		district: "Central City", type: "park", pos: [-95.43347485633242, 29.76133903513569], text: "Lorem ipsum"
	},
	"Restaurant Pompey": {
		district: "Central City", type: "restaurant", pos: [-95.3380801331474, 29.75135635184479], text: "Lorem ipsum"
	},
	"Terminal Bar": {
		district: "Central City", type: "bar", pos: [-95.35721427241708, 29.761898035998186], text: "Lorem ipsum"
	},
	"The High Bar": {
		district: "Central City", type: "bar", pos: [-95.3487510954321, 29.744567559285073], text: "Lorem ipsum"
	},
	"Los Primos": {
		district: "Central City", type: "bar", pos: [-95.37634841168627, 29.766529637455776], text: "Lorem ipsum"
	},
	"Zephyr Lounge": {
		district: "Central City", type: "bar", pos: [-95.36144586090933, 29.75886342240203], text: "Lorem ipsum"
	},
	
};
var currentMarkers = [];

function begin() {
	mapboxgl.accessToken = "pk.eyJ1Ijoic2lmYXVzIiwiYSI6ImNrNXc3eHhjMjBsajUzbXBvNnFsNnJqdnAifQ.uNPep4IGoA7jm5uytd4T8g";
	map = new mapboxgl.Map({
		container: "map",
		style: "mapbox://styles/sifaus/ck5w870qy773r1ismbv1fa3na",
		center: [-95.37000102894808, 29.74935969587223],
		zoom: 12.9,
		antialias: true,
		dragPan: false,
		scrollZoom: false,
		keyboard: false,
		dragRotate: false,
		doubleClickZoom: false
	});
	map.on("dblclick", function (e) {
		let text = e.lngLat.lng + ", " + e.lngLat.lat;
		const el = document.createElement("textarea");
		el.value = text;
		document.body.appendChild(el);
		el.select();
		document.execCommand("copy");
		document.body.removeChild(el);
	});
	//map.on("dblclick", function (e) { clearMarkers(); });
}

function createControls() {
	let el = document.getElementById("controls");
	el.innerHTML = "";
	for (let district in districts) { el.innerHTML += "<div class='control' onclick='changeDistrict(this);' name=\"" + district + "\">" + district + "</div>"; }
}

function setMarkers() {
	for (let marker in markers) {
		if (markers[marker].district == currentDistrict) {
			let e = document.createElement("div");
			e.id = marker;
			e.classList.add(markers[marker].type);
			e.title = marker;
			e.style.backgroundImage = "url(../assets/markers/" + markers[marker].type + ".svg)";
			currentMarkers.push(
				new mapboxgl.Marker(e)
					.setLngLat(markers[marker].pos)
					//.setPopup(new mapboxgl.Popup({ offset: 25 }).setText(markers[marker].text))
					.addTo(map)
			);
		}
	}
}

function clearMarkers() {
	for (let i = 0; i < currentMarkers.length; i++) { currentMarkers[i].remove(); }
	currentMarkers = [];
}

function changeDistrict(obj) {
	console.log(obj.getAttribute("name"))
	console.log(districts[obj.getAttribute("name")])

	clearMarkers();
	currentDistrict = obj.getAttribute("name");
	map.setCenter(districts[obj.getAttribute("name")]);
	setMarkers();
}
