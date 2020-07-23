document.addEventListener('DOMContentLoaded', () => {

	/* 
	0) Choose to be Sleeper, Aware or Enlightened
	1) Choose an Archetype
	2) Choose an Occupation or invent one
	3) Choose a Dark Secret
	4) Choose two Disadvantages
		4a) Get Mandatory Disadvantages, and choose one
	5) Choose three Advantages
		5a) Enlightened choose three Abilities instead
			5aa) If there are mandatory ones, choose two instead
	5.5) Only Enlightened - Choose two Limitations
	6) Assign Attribute modifiers
		6a) Enlightenened characters use different modifiers (+3, +1, +0) and (+4, +3, +2, +1, +0, −1, −2)
	7) Choose Looks
	8) Choose a Name
	8.5) Choose an allied power and a hostile power
	9) Choose Relations with PCs and NPCs (0, +1, +2)
	*/

	pronounChanged();
	typeChanged();
	archetypeChanged();
});

var char = {
	pronoun1: "He",
	pronoun2: "Him",
	pronoun3: "His",
	type: "Awake",
	archetype: "",
	occupation: ""
}

var archetypes = {
	"the Sleeper": {
		"Type": "Sleeper",
		"Distractions": [
			"Dating services", "Discussion forums", "Exercise and fitness", "Fashion", "Interior decorating", "Online games", "Pornography", "Reality television", "Shopping", "Social media/Apps", "TV-series", "a distraction of your design"
		],
		"Looks": {
			"Clothes": [
				"mainstream", "hipster", "proper", "athletic wear", "jeans", "suit", "trendy", "bohemian", "gangsta", "anonymous", "all black", "nerdy", "chic", "handsome", "provocative", "flattering", "normcore", "alternative"
			],
			"Face": [
				"cute", "tired", "forced smile", "rosy", "hard", "doughy", "swollen", "emaciated", "pale", "non-expressive", "pretty", "masculine", "soft", "grim", "long", "round", "square", "bearded", "tanned"
			],
			"Eyes": [
				"avoidant", "large", "contemptuous", "flirtatious", "cheerful", "innocent", "intense", "drowsy", "dominant", "demanding", "dark", "bright", "confused", "bored"
			],
			"Body": [
				"thin", "muscular", "chubby", "skinny", "tall", "short", "big", "heavy-set", "lean", "strong", "hearty", "bent over", "straight-backed", "bouncy", "serene", "expressive", "frantic", "jittery", "gray"
			]
		},
		"Relations PC": [
			"One of the characters is an associate from work.",
			"One of the characters is a lover or a friend. (+1 with each other)",
			"One of the characters is connected to your Dark Secret.",
			"You secretly follow the character on Instagram, their blog, or similar social media. (+1)",
			"One of the characters has something you’re jealous of."
		],
	},
	"the Academic": {
		"Type": "Awake",
		"Occupations": [
			"Professor", "Student", "Ph.D. candidate", "Teacher", "Public servant", "Advisor", "Politician", "Author", "Television show host", "Aristocrat", "Researcher", "Psychologist", "Archaeologist", "Dilettante", "Antiquarian"
		],
		"Dark Secrets": [
			"Forbidden Knowledge", "Guardian", "Occult Experience", "Returned from the Other Side", "Strange Disappearance"
		],
		"Disadvantages": [
			"Nightmares", "Obsession", "Phobia", "Repressed Memories", "Rationalist", "Stalker"
		],
		"Advantages": [
			"Academic Network", "Authority", "Elite Education", "Collector", "Data Retrieval", "Expert", "Occult Studies", "Elite Sport"
		],
		"Looks": {
			"Clothes": [
				"tweed", "carefree", "ill-fitting", "mottled", "proper", "suit", "casual", "nerdy", "old-fashioned"
			],
			"Face": [
				"childish", "round", "ravaged", "tired", "pale", "square", "disproportionate", "narrow", "beaky", "ugly", "handsome", "aged", "bearded"
			],
			"Eyes": [
				"skeptical", "arrogant", "analytical", "disinterested", "curious", "shy", "intelligent", "distracted", "authoritarian", "glasses-framed", "tired"
			],
			"Body": [
				"Thin", "chubby", "tall", "wispy", "bent", "weak", "athletic", "out of shape", "slow", "angular", "rigid", "impaired", "large bellied", "fat", "short", "compact", "hairy"
			]
		},
		"Relations PC": [
			"One of the characters studied at the same campus as you, and you became good friends. (+1)",
			"One of the characters is your relative. (0)",
			"One of the characters met you at a seminar. (0)",
			"You hired one of the characters as an assistant for a research project. (0)",
			"One of the characters is your lover. (+1 or +2)"
		],
	},
	"the Agent": {
		"Type": "Awake",
		"Occupations": [
			"Open-source officer", "Case officer", "Counterterrorism analyst", "Analytic methodologist", "Special agent", "Security professional", "Operations officer", "Collection management officer", "Handler", "Infiltrator", "Spy", "Sleeper agent"
		],
		"Dark Secrets": [
			"Forbidden Knowledge", "Guardian", "Occult Experience", " Strange Disappearance", "Victim of Medical Experiments"
		],
		"Disadvantages": [
			"Lost Identity", "Nightmares", "Obsession", "Rival", "Stalker", "Wanted"
		],
		"Advantages": [
			"Moles", "Burglar", "Analyst", "Explosives Expert", "Tracer", "Quick Thinker", "Field Agent", "Endure Trauma"
		],
		"Looks": {
			"Clothes": [
				"suit", "everyday wear", "military uniform", "camo", "trenchcoat", "streetwear", "practical"
			],
			"Face": [
				"scarred", "inconspicuous", "innocent", "grim", "one-eyed", "expressionless", "tense", "wrinkled", "stern", "smiling", "chomping", "squarejawed", "handsome"
			],
			"Eyes": [
				"penetrating", "kind", "hardened", "avoidant", "piercing", "suspicious", "curious", "indifferent", "intelligent", "guilt-laden", "empty"
			],
			"Body": [
				"in shape", "chubby", "large", "emaciated", "flexible", "hard", "sinewy", "average", "right", "short", "quick", "feline", "curled", "mutilated", "scarred", "trembling"
			]
		},
		"Relations PC": [
			"has been your informant for several years. (+1)",
			"'s compromising past is known to you. (0)",
			"is an old friend of yours. (+1)",
			"is your lover. (They take +2, you choose your own)",
			"is your colleague. (+1)",
		],
	},
	"the Artist": {
		"Type": "Awake",
		"Occupations": [
			"Author", "Dancer", "Actor", "Painter", "Videographer", "Photographer", "Designer", "Model", "Musician", "Singer", "Personal trainer", "Cosmetologist", "Television Host", "Director", "Reporter", "Blogger"
		],
		"Dark Secrets": [
			"Curse", "Heir", "Mental Illness", "Pact with Dark Forces", "Victim of Crime"
		],
		"Disadvantages": [
			"Cursed", "Depression", "Drug Addict", "Nightmares", "Schizophrenia", "Victim of Passion"
		],
		"Advantages": [
			"Artistic Talent", "Fascination", "Notorious", "Observant", "Body Awareness", "Enhanced Awareness", "Forbidden Inspiration", "Snake Charmer"
		],
		"Looks": {
			"Clothes": [
				"new age", "gothic", "metal", "peacockish", "designer", "bohemian", "worn", "normcore"
			],
			"Face": [
				"haggard", "cute", "pretty", "captivating", "beautiful", "ascetic", "tired", "expressive"
			],
			"Eyes": [
				"easy", "cheerful", "crystal clear", "magnetic", "profound", "burned out", "hypnotizing", "passionate"
			],
			"Body": [
				"cute", "agile", "robust", "emaciated", "sexy", "lanky", "sensual", "warped", "graceful", "voluptuous"
			]
		},
		"Relations PC": [
			"One of the characters is involved in your art. (+1)",
			"One of the characters is your lover. (+1)",
			"One of the characters hurt you.",
			"One of the characters is infatuated with you. (They take +2)",
			"One of the characters commissioned a work of art from you. (They take +1)"
		],
	},
	"the Avenger": {
		"Type": "Awake",
		"Occupations": [
			"Homemaker", "Police Officer", "Panhandler", "Unemployed", "Student", "Criminal", "Conspiracy theorist", "Refugee", "Prison escapee", "Prize fighter", "Widow(er)", "Washed-up celebrity", "Failed businessperson", "Science experiment on the run"
		],
		"Dark Secrets": [
			"Guardian", "Returned from the Other Side", "Strange Disappearance", "Victim of Crime", "Victim of Medical Experiments"
		],
		"Disadvantages Mandatory": [
			"Oath of Revenge"
		],
		"Disadvantages": [
			"Mental Compulsion", "Nightmares", "Schizophrenia", "Stalker", "Wanted"
		],
		"Advantages": [
			"Animal Speaker", "Instinct", "Enhanced Awareness", "Intimidating", "Survival Instinct", "Code of Honor", "Eye for an Eye", "Rage"
		],
		"Looks": {
			"Clothes": [
				"leather", "survival", "filthy", "mismatched", "coat-covered", "casual", "worn"
			],
			"Face": [
				"haggard", "sharp", "neotenic", "scarred", "bony", "thin", "mutilated", "dour"
			],
			"Eyes": [
				"ruthless", "frosty", "indifferent", "desolate", "sorrow-filled", "tired", "mad", "dark"
			],
			"Body": [
				"robust", "deformed", "plump", "mutilated", "slender", "animalistic", "bony", "emaciated", "willowy", "massive", "strong", "youthful"
			]
		},
		"Relations PC": [
			"You have entrusted one of the characters with a secret, which could put you away in prison if revealed.",
			"One of the characters tried to get you to forget your oath of revenge. They get +1",
			"One of the characters tried to help you fulfill your oath of revenge. (+1)",
			"One of the characters has ties to the target of your revenge.",
			"One of the characters is connected to your past life somehow."
		],
	},
	"the Broken": {
		"Type": "Awake",
		"Occupations": [
			"Homeless", "Escaped mental patient", "Street peddler", "Street performer", "Fence", "Thief", "Police", "Drug dealer", "Addict", "Street artist", "Freelance journalist", "Tattoo artist", "Abuse survivor", "Normal person in the wrong place at the wrong time"
		],
		"Dark Secrets": [
			"Forbidden Knowledge", "Mental Illness", "Occult Experience", "Returned from the Other Side", "Victim of Medical Experiments"
		],
		"Disadvantages Mandatory": [
			"Broken"
		],
		"Disadvantages": [
			"Drug Addict", "Involuntary Medium", "Obsessive Compulsion", "Schizophrenia", "Stalker"
		],
		"Advantages": [
			"Street Contacts", "Intuitive", "Daredevil", "Contagious Insanity", "Enhanced Awareness", "Magical Intuition", "Sixth Sense", "Wayfinder"
		],
		"Looks": {
			"Clothes": [
				"hobo", "streetwear", "ripped suit", "strange", "ragged and worn", "alternative", "casual", "kinky", "formal", "amulets and fetishes", "dirty"
			],
			"Face": [
				"haggard", "tattooed", "bony", "wild beard and long hair", "grimacing", "cheerful", "sorrowful", "dirty", "scarred", "apprehensive"
			],
			"Eyes": [
				"obscured", "staring", "desolate", "deranged", "frightened", "anxious", "furious", "unfocused", "fearless", "darting", "intense", "carefree"
			],
			"Body": [
				"jerky", "crouching", "feral", "skinny", "large", "tattooed", "scarred", "hairy", "misshapen", "obese", "tall and gangly", "dirty", "unsteady"
			]
		},
		"Relations PC": [
			"One of the characters is trying to get you back on your feet again. (+1 with each other)",
			"One of the characters was with you when you were broken. (+1)",
			"One of the characters is your closest friend. (+2)",
			"One of the characters was the reason you were broken. (+1)",
			"You are angry with one of the characters. (+1)"
		],
	},
	"the Careerist": {
		"Type": "Awake",
		"Occupations": [
			"Lawyer", "Businessman", "Office worker", "Director", "CEO", "Consultant", "Bureaucrat", "Politician", "Jet setter", "Yuppie", "Salesman", "Trainee", "Aristocrat"
		],
		"Dark Secrets": [
			"Curse", "Guilty of Crime", "Occult Experience", "Pact with Dark Powers", "Responsible for Medical Experiments"
		],
		"Disadvantages": [
			"Cursed", "Greedy", "Haunted", "Liar", "Rationalist", "Rival"
		],
		"Advantages": [
			"Awe-inspiring ", "Influential Friends", "Network of Contacts", "Notorious", "Daredevil", "Puppeteer", "At Any Cost", "Opportunist"
		],
		"Looks": {
			"Clothes": [
				"cheap suit", "tailored suit", "chinos and shirt", "latest fashion", "casual", "polo and khakis", "expensive"
			],
			"Face": [
				"pretty", "sharp", "round and sweaty", "dominant", "chiseled", "ruthless", "beautiful", "boring", "flat"
			],
			"Eyes": [
				"attentive", "penetrating", "ruthless", "weary", "cunning", "sharp", "warm", "authoritarian"
			],
			"Body": [
				"slim", "sexy", "lanky", "chubby", "big", "small", "in shape", "thin", "voluptuous"
			]
		},
		"Relations PC": [
			"One of the characters assisted you with removing a company rival. (+1)",
			"One of the characters opposes your business ventures.",
			"One of the characters knows your Dark Secret.",
			"One of the characters also works for your boss.",
			"You are in love with one of the characters. (+2)"
		],
	},
	"the Criminal": {
		"Type": "Awake",
		"Occupations": [
			"Thief", "Robber", "Dealer", "Gang member", "Homeless", "Prize fighter", "Corrupt cop", "Enforcer", "Club owner", "Extortionist", "Hitman", "Face of the operation", "Getaway driver", "Con artist", "Mobster", "Dealer", "Muscle for hire"
		],
		"Dark Secrets": [
			"Family Secret", "Forbidden Knowledge", "Guilty of Crime", "Occult Experience", "Victim of Crime"
		],
		"Disadvantages": [
			"Bad Reputation", "Drug Addict", "Harassed", "Nemesis", "Sexual Neurosis", "Wanted"
		],
		"Advantages": [
			"Streetwise", "Burglar", "Escape Artist", "Sixth Sense", "Deadly Stare", "Enforcer", "Gang Leader", "Streetfighter"
		],
		"Looks": {
			"Clothes": [
				"streetwear", "suit", "biker", "gangsta", "casual", "tracksuit", "exclusively-cut", "worn"
			],
			"Face": [
				"hard", "handsome", "scarred", "battered", "dishonest", "cruel"
			],
			"Eyes": [
				"grim", "calculating", "ruthless", "cold", "mad", "piggish", "dark", "suspicious"
			],
			"Body": [
				"muscular", "lanky", "enormous", "top-heavy", "graceful", "truncated", "maimed", "broken", "plump", "stocky", "wiry"
			]
		},
		"Relations PC": [
			"One of the characters hid you from the police or others who were after you. (+1)",
			"One of the characters knows you’ve committed a terrible crime.",
			"One of the characters is indebted to you.",
			"One of the characters is connected to one of your rivals.",
			"One of the characters knew you from before your criminal dealings. (+1)"
		],
	},
	"the Cursed": {
		"Type": "Awake",
		"Occupations": [
			"Occultist", "Cult escapee", "Police officer", "CEO", "Detective", "Military Officer", "Gangster", "Politician", "Disability collector", "Amateur magician", "Celebrity", "Jailbird", "Businessman", "Playboy", "Refugee", "Researcher", "Internet celebrity"
		],
		"Dark Secrets": [
			"Chosen", "Curse", "Occult Experience", "Pact with Dark Powers", "Returned from the Other Side"
		],
		"Disadvantages Mandatory": [
			"Condemned"
		],
		"Disadvantages": [
			"Drug Addict", "Greedy", "Haunted", "Nightmares", "Stalker"
		],
		"Advantages": [
			"Occult Studies", "Bound", "Magical Intuition", "Death Drive", "Ruthless", "Desperate", "Sealed fate", "To the Last Breath"
		],
		"Looks": {
			"Clothes": [
				"brand name", "unique", "tailored suit", "unconcerned", "trenchcoat and suit", "heavy metal", "designer", "tattered and stained", "uniform", "all black", "foreign", "business casual", "blood-soaked"
			],
			"Face": [
				"haggard", "emaciated", "sharp", "model", "tanned", "smiling", "scarred", "branded", "fleshy", "pale", "flushed", "masculine", "sorrowful", "sickly"
			],
			"Eyes": [
				"desperate", "devious", "hard", "surrendered", "fearless", "burned", "intimidated", "beautiful", "shades", "dark", "tired", "stubborn", "hopeful"
			],
			"Body": [
				"sickly", "well-trained", "tanned", "taut", "shaky", "trembling", "weak", "attractive", "muscular", "slender", "corpulent", "curvy", "crippled", "cowering", "towering", "straight-backed", "dejected "
			]
		},
		"Relations PC": [
			"One of the characters knows the fate awaiting you. (+1)",
			"One of the characters inadvertently caused your fate to befall you. (+1)",
			"You utilized your prior success to help one of the other characters. (+1)",
			"One of the characters is assisting you in avoiding your fate. (+2 with each other)",
			"One of the characters is standing in your way, preventing you from avoiding your fate. Determine how together."
		],
	},
	"the Deciever": {
		"Type": "Awake",
		"Occupations": [
			"Model", "Between jobs", "Catfisher", "Lover", "Escort", "Heir(ess)", "Jetsetter", "Party animal", "Secretary", "Party planner", "Marriage swindler", "Con artist", "Gigolo", "Scammer", "Thief", "Snitch", "Pornstar"
		],
		"Dark Secrets": [
			"Heir", "Mental Illness", "Occult Experience", "Pact with Dark Powers", "Victim of Crime"
		],
		"Disadvantages": [
			"Cursed", "Greedy", "Liar", "Nemesis", "Sexual Neurosis", "Wanted"
		],
		"Advantages": [
			"Erotic", "Impostor", "Seducer", "Backstab", "Eye for Detail", "Intuitive", "Grudge", "Manipulative"
		],
		"Looks": {
			"Clothes": [
				"tight-fitting", "designer", "sexy", "revealing", "bohemian", "stylish", "trendy", "proper", "peacockish", "exclusively-cut", "distressed", "attention-grabbing"
			],
			"Face": [
				"elfin", "handsome", "neotenic", "youthful", "chiseled", "defined", "soft", "round", "gorgeous", "innocent", "dignified", "cheerful"
			],
			"Eyes": [
				"mischievous", "twinkling", "intense", "vulnerable", "innocent", "pretty", "understanding", "friendly", "large", "penetrating", "warm"
			],
			"Body": [
				"slim", "sexy", "masculine", "curvy", "towering", "sensual", "voluptuous", "petite", "toned", "youthful", "hearty", "tall", "short", "thin", "wiry"
			]
		},
		"Relations PC": [
			"One of the characters helped you kill one of your many enemies. (+1)",
			"One of the characters knows one of your victims.",
			"One of the characters met you during a rare moment when you were your true self.",
			"One of the characters is your current victim. (They get +2)",
			"One of the characters is attracted to you. (They get +1)"
		],
	},
	"the Descendant": {
		"Type": "Awake",
		"Occupations": [
			"Antiquarian", "Aristocrat", "Author", "Homeless", "Tattoo artist", "Occultist", "Sect escapee", "Preacher", "Heir", "Unemployed", "Office worker", "Craftsman", "Forester"
		],
		"Dark Secrets": [
			"Chosen", "Family Secret", "Heir", "Occult Experience", "Pact with Dark Powers"
		],
		"Disadvantages": [
			"Cursed", "Haunted", "Nightmares", "Phobia", "Repressed Memories", "Stalker"
		],
		"Advantages": [
			"Influential Friends", "Intuitive", "Occult Library", "Artifact", "Bound", "Enhanced Awareness", "Inner Power", "Watchers"
		],
		"Looks": {
			"Clothes": [
				"old fashioned", "casual", "ragged and worn", "tailored suit", "layer upon layer", "odd", "black"
			],
			"Face": [
				"childish", "sharp", "sorrowful", "scarred", "dishonest", "sickly", "pretty", "pronounced", "tense", "round"
			],
			"Eyes": [
				"tired", "indifferent", "anxious", "intense", "suspicious", "fearless", "innocent", "restless", "cunning", "sad"
			],
			"Body": [
				"weak", "strong", "bony", "small", "sickly", "slender", "athletic", "big", "spindly", "hunched", "stiff", "lean"
			]
		},
		"Relations PC": [
			"One of the characters grew up alongside you. (+2 to each other)",
			"One of the characters has seen what is hunting you. (+1)",
			"You are secretly in love with one of the characters. (+2)",
			"One of the characters is your contact person.",
			"One of the characters is intertwined with your dark secrets. (+1)"
		],
	},
	"the Detective": {
		"Type": "Awake",
		"Occupations": [
			"Beat cop", "Private eye", "Lawyer", "Investigator", "Security guard", "Investigative journalist", "Intelligence officer", "Detective", "Medium", "Hacker", "Cryptologist", "Conspiracy theorist"
		],
		"Dark Secrets": [
			"Forbidden Knowledge", "Guilty of Crime", "Occult Experience", "Returned from the Other Side", "Strange Disappearance"
		],
		"Disadvantages": [
			"Drug Addict", "Infirm", "Nightmares", "Repressed Memories", "Stalker"
		],
		"Advantages": [
			"Fast Talk", "Interrogator", "Instinct", "Read a Crowd", "Shadow", "Crime Scene Investigator", "Dreamer", "Enhanced Awareness"
		],
		"Looks": {
			"Clothes": [
				"suit", "tweed", "trendy", "casual", "severe", "business", "shabby"
			],
			"Face": [
				"friendly", "sharp", "round", "sweaty", "innocent", "determined", "tired"
			],
			"Eyes": [
				"empathic", "indifferent", "squinty", "sharp", "suspicious", "warm", "concerned"
			],
			"Body": [
				"spindly", "fat", "wiry", "stout", "stocky", "muscled"
			]
		},
		"Relations PC": [
			"One of the characters saved you from a dangerous situation. (+1)",
			"One of the characters tricked you into protecting someone you were investigating.",
			"You helped one of the characters solve a mystery. (They take +1)",
			"One of the characters is your coworker. (+1 with each other)",
			"One of the characters is your informant. (+1)"
		],
	},
	"the Doll": {
		"Type": "Awake",
		"Occupations": [
			"Child beauty contestant", "Model", "Stripper", "Trophy wife", "Gigolo", "Actor", "Escaped experiment", "High school prom queen", "Vlogger", "Reality TV celebrity", "Pornstar", "Escort", "Abuse survivor", "Imprisoned innocent", "Trafficking victim"
		],
		"Dark Secrets": [
			"Chosen", "Guilty of Crime", "Occult Experience", "Victim of Crime", "Victim of Medical Experiments"
		],
		"Disadvantages Mandatory": [
			"Object of Desire"
		],
		"Disadvantages": [
			"Harassed", "Owned", "Phobia", "Sexual Neurosis", "Stalker"
		],
		"Advantages": [
			"Perpetual Victim", "Backstab", "Ice cold", "Sneak", "Divine", "Magnetic Attraction", "Endure Trauma", "Gritted Teeth"
		],
		"Looks": {
			"Clothes": [
				"revealing", "frilly and fluffy", "sexy", "strange", "trendy", "impractical", "spectacular", "gothic", "ornate", "bohemian", "bright", "innocent", "ripped", "sharp"
			],
			"Face": [
				"pretty", "smiling", "sad", "childish", "black and blue", "chiseled", "reassuring", "made-up", "androgynous", "happy"
			],
			"Eyes": [
				"innocent", "beautiful", "spellbinding", "multicolored", "frightened", "purple", "pale", "sapphire blue", "emerald green", "yellow-gold", "hungry", "dispassionate", "large", "veiled", "devastated", "flirtatious"
			],
			"Body": [
				"frail", "attractive", "small", "graceful", "petite", "curvaceous", "athletic", "dignified", "lean and fit", "slender", "willowy", "androgynous", "tall"
			]
		},
		"Relations PC": [
			"One of the characters is in love with you. (They take +2)",
			"One of the characters has taken care of you. (+1 with each other)",
			"You are secretly in love with one of the characters. (+2)",
			"One of the characters liberated you. (+1 with each other)",
			"One of the characters is jealous of you."
		],
	},
	"the Drifter": {
		"Type": "Awake",
		"Occupations": [
			"Homeless", "Vagabond", "Runaway", "In witness protection", "Draft dodger", "Small-time crook", "Backpacker", "Refugee", "Prison escapee", "Traveling salesman", "Courier", "Day laborer", "Outsider"
		],
		"Dark Secrets": [
			"Curse", "Family Secret", "Mental Illness", "Returned from the Other Side", "Rootless"
		],
		"Disadvantages": [
			"Cursed", "Harassed", "Haunted", "Schizophrenia", "Stalker", "Wanted"
		],
		"Advantages": [
			"Street Contacts", "Driver", "Improviser", "Character Actor", "Vigilant", "Wanderer", "Artifact", "Enhanced Awareness"
		],
		"Looks": {
			"Clothes": [
				"worn", "odd", "biker", "ripped", "practical", "street", "wilderness survival", "layer upon layer", "wrong season", "cheap suit", "hobo"
			],
			"Face": [
				"ravaged", "innocent", "weathered", "pronounced", "filthy", "friendly", "tough", "tattooed", "scarred", "memorable"
			],
			"Eyes": [
				"cloudy", "tired", "restless", "blind", "one-eyed", "bloodshot", "tense", "suspicious", "fearful", "cheerful", "sarcastic", "intelligent"
			],
			"Body": [
				"wiry", "bony", "hobbled", "fast", "dirty", "scarred", "big", "small", "slim", "androgynous", "tall", "disproportionate", "laid back", "tense", "malformed", "twisted", "tattooed", "animalistic"
			]
		},
		"Relations PC": [
			"One of the characters lets you stay with them sometimes. (+1)",
			"One of the characters got you out of a bind. (+1)",
			"One of the characters is an old friend. (+2)",
			"One of the characters is someone you know in the underworld.",
			"One of the characters gives you occasional jobs."
		],
	},
	"the Fixer": {
		"Type": "Awake",
		"Occupations": [
			"Mafia boss", "Business person", "Real estate agent", "Dealer", "Restaurateur", "Club owner", "Fence", "Loan shark", "Bookie", "Advisor", "Extortionist", "Criminal", "Consigliere"
		],
		"Dark Secrets": [
			"Forbidden Knowledge", "Guilty of Crime", "Heir", "Pact with Dark Powers", "Victim of Crime"
		],
		"Disadvantages": [
			"Competitor", "Cursed", "Greedy", "Jealousy", "Liar", "Stalker"
		],
		"Advantages": [
			"Forked Tongue", "Streetwise", "Ace Up the Sleeve", "Backstab", "Boss", "Extortionist", "Sixth Sense", "Worldly"
		],
		"Looks": {
			"Clothes": [
				"suit", "street", "leather", "casual", "bizarre", "luxury", "sportswear"
			],
			"Face": [
				"pleasant", "good-looking", "attractive", "bony", "smashed", "innocent", "meaty", "open"
			],
			"Eyes": [
				"cheerful", "calculating", "cold", "servile", "cunning", "tough", "confused", "evaluating"
			],
			"Body": [
				"broad", "athletic", "skinny", "sensual", "skipped leg day", "tall and wiry", "stocky"
			]
		},
		"Relations PC": [
			"One of the characters endured a beating to get you out of a bind. (+1)",
			"One of the characters caused a problem for which they let you take the blame.",
			"One of the characters is indebted to you.",
			"One of the characters works for you.",
			"One of the characters is a business contact."
		],
	},
	"the Occultist": {
		"Type": "Awake",
		"Occupations": [
			"Antiquarian", "Medium", "Exorcist", "Linguist", "Unemployed", "Theologian", "Professor", "Morgue employee", "Teenager", "Student", "Bureaucrat", "Disability collector", "Librarian", "Recent convert", "Thelemic"
		],
		"Dark Secrets": [
			"Forbidden Knowledge", "Guardian", "Occult Experience", "Pact with Dark Powers", "Visitations"
		],
		"Disadvantages": [
			"Guilt", "Haunted", "Involuntary Medium", "Nightmares", "Repressed Memories", "Stalker"
		],
		"Advantages": [
			"Crafty", "Occult Library", "Dabbler in the Occult", "Dreamer", "Enhanced Awareness", "Exorcist", "Magical Intuition", "Thirst for Knowledge"
		],
		"Looks": {
			"Clothes": [
				"all black", "suit and trenchcoat", "hippie", "occult symbolism", "casual", "spiritual", "flashy", "shimmery", "tattered", "new age", "peculiar", "discreet", "spectacular"
			],
			"Face": [
				"big bushy beard", "long black hair and pale skin", "bony", "disfigured", "worn", "pretty", "tense", "pallid", "indifferent", "scornful", "bored", "wrinkled", "aged"
			],
			"Eyes": [
				"hollow", "lucid", "mad", "piercing", "arresting", "interrogating", "distant", "tired", "defeated", "power-hungry", "sad"
			],
			"Body": [
				"emaciated", "scarred", "broken", "towering", "trembling", "tattooed", "burned", "wispy", "hunched", "lanky", "obese", "stiff", "inviting"
			]
		},
		"Relations PC": [
			"One of the characters participated in one of your rituals.",
			"One of the characters is related to someone you lost. (+1)",
			"One of the characters is your friend. (+1)",
			"One of the characters assists you with acquiring books, information, and artifacts. (+1)",
			"One of the characters hates you for doing something them, despite your love for them. (+2)"
		],
	},
	"the Prophet": {
		"Type": "Awake",
		"Occupations": [
			"Priest", "Pastor", "Imam", "Rabbi", "Sect leader", "Sect member", "Sect escapee", "Prophet", "Medium", "Witch", "Preacher", "Healer", "Missionary", "Seer", "Cultist", "Idolater", "Iconoclast", "Elder", "Oracle", "Guru"
		],
		"Dark Secrets": [
			"Chosen", "Forbidden Knowledge", "Guardian", "Occult Experience", "Visitations"
		],
		"Disadvantages": [
			"Cursed", "Fanatic", "Harassed", "Involuntary Medium", "Sexual Neurosis", "Stalker"
		],
		"Advantages": [
			"Charismatic Aura", "Cult Leader", "Enhanced Awareness", "Exorcist", "Lay on Hands", "Voice of Insanity", "Divine Champion", "Good Samaritan"
		],
		"Looks": {
			"Clothes": [
				"suit", "clerical robes", "orthodox", "organic materials", "bohemian", "casual", "coat and hat", "street", "strange", "worn"
			],
			"Face": [
				"handsome", "smooth", "attractive", "childlike", "dominant", "narrow", "aristocratic", "open", "ascetic"
			],
			"Eyes": [
				"cheerful", "deep", "mad", "wise", "forgiving", "mesmerizing", "piercing", "passionate"
			],
			"Body": [
				"large", "slender", "thin", "small", "spindly", "sickly", "plump", "firm", "energetic", "voluptuous"
			]
		},
		"Relations PC": [
			"One of the characters shares your faith.",
			"One of the characters saved you. (+1)",
			"One of the characters denied your god.",
			"You saved one of the other character’s immortal soul. (+1)",
			"One of the characters is your lover. (+1)"
		],
	},
	"the Ronin": {
		"Type": "Awake",
		"Occupations": [
			"Contract killer", "Hitman", "Special agent", "Special ops", "Military experiment", "Sniper", "Spree killer"
		],
		"Dark Secrets": [
			"Curse", "Guardian", "Occult Experience", "Victim of Medical Experiments", "Visitations"
		],
		"Disadvantages": [
			"Cursed", "Haunted", "Marked", "Nemesis", "Nightmares", "Wanted"
		],
		"Advantages": [
			"Weapon Master", "Chameleon", "Exit Strategy", "Manhunter", "Sixth Sense", "Lightning Fast", "Sniper", "Jaded"
		],
		"Looks": {
			"Clothes": [
				"suit", "discreet", "black", "worn", "concealing", "extravagant", "fashionable", "practical"
			],
			"Face": [
				"emaciated", "expressionless", "mundane", "friendly", "scarred", "tough", "pretty", "smooth"
			],
			"Eyes": [
				"grim", "appraising", "cool", "obscured", "melancholy", "merciless", "challenging"
			],
			"Body": [
				"graceful", "athletic", "small", "scarred", "strong", "massive", "wiry", "emaciated", "toned", "battered"
			]
		},
		"Relations PC": [
			"One of the characters knows who you really are. (+1 with each other)",
			"One of the characters knows you under one of your aliases.",
			"One of the characters knows your deepest fear.",
			"One of the characters owes their life to you. (They take +1)",
			"You harbor a secret passion for one of the character’s partner. (+2)"
		],
	},
	"the Scientist": {
		"Type": "Awake",
		"Occupations": [
			"Doctor", "Psychologist", "Surgeon", "Inventor", "Engineer", "Technician", "Therapist", "Physicist"
		],
		"Dark Secrets": [
			"Forbidden Knowledge", "Mental Illness", "Responsible for Medical Experiments", "Returned from the Other Side", "Victim of Medical Experiments"
		],
		"Disadvantages": [
			"Bad Reputation", "Experiment Gone Wrong", "Fanatic", "Mental Compulsion", "Repressed Memories", "Wanted"
		],
		"Advantages": [
			"Battlefield Medicine", "Inventor", "Scientist", "Enhanced Awareness", "Genius", "Implanted Messages", "Arcane Researcher", "Workaholic"
		],
		"Looks": {
			"Clothes": [
				"suit", "worn and dirty", "casual", "practical", "coat and hat", "peculiar", "lab coat", "stained", "neat", "durable"
			],
			"Face": [
				"worn", "square", "scarred", "bony", "round and sweaty", "pronounced", "exhausted", "ravaged", "serious"
			],
			"Eyes": [
				"calculating", "dead", "squinting", "burning", "mad", "confused", "commanding"
			],
			"Body": [
				"frail", "angular", "stocky", "overweight", "emaciated", "skinny", "slender", "tall", "hunched", "strange"
			]
		},
		"Relations PC": [
			"One of the characters received help from you. They take +1",
			"One of the characters assisted you with an experiment, which went terribly wrong.",
			"One of the characters knows details of your dreams.",
			"One of the characters volunteered for one of your experiments. (+1)",
			"One of the characters is involved in your research."
		],
	},
	"the Seeker": {
		"Type": "Awake",
		"Occupations": [
			"Student", "Unemployed", "Blogger", "Hacker", "Activist", "Academic", "Researcher", "Parapsychologist", "Author", "Journalist", "Thief", "Medium", "Conspiracy Theorist"
		],
		"Dark Secrets": [
			"Family Secret", "Forbidden Knowledge", "Guardian", "Occult Experience", "Strange Disappearance"
		],
		"Disadvantages": [
			"Cursed", "Haunted", "Nightmares", "Repressed Memories", "Stalker", "Wanted"
		],
		"Advantages": [
			"Parkour", "Access the Dark Net", "Keen-eyed", "Hacker", "Prepared", "Enhanced Awareness", "Stubborn", "Endure Trauma"
		],
		"Looks": {
			"Clothes": [
				"nerdy", "second-hand", "leather", "alternative", "casual", "durable", "smelly", "comfortable", "stained", "ripped"
			],
			"Face": [
				"wrinkled", "lively", "cute", "neotenic", "pale", "grim", "smashed", "innocent"
			],
			"Eyes": [
				"clear", "hard", "tired", "bloodshot", "doubtful", "curious", "avoidant", "suspicious", "evaluating"
			],
			"Body": [
				"lanky", "sinewy", "robust", "fragile", "hefty", "deformed", "wispy", "chubby", "bent", "short", "youthful"
			]
		},
		"Relations PC": [
			"You entrusted one of the characters with a secret, which could put you away in prison.",
			"One of the characters helped you with your investigations. (+1)",
			"You look up to one of the characters. (+1)",
			"One of the characters saved your life. (+1)",
			"You have discovered one of the characters in the act of something criminal, obscene, or extremely shameful.",
			"You befriended one of the characters in the process of assisting them with some supernatural trouble. (They take +1)"
		],
	},
	"the Veteran": {
		"Type": "Awake",
		"Occupations": [
			"Special agent", "Military soldier", "Street soldier", "Mercenary", "MMA fighter", "Military officer", "Security guard", "Body guard", "Hitman", "War refugee", "Military police", "Retiree", "Homeless vet"
		],
		"Dark Secrets": [
			"Guilty of Crime", "Returned from the Other Side", "Victim of Crime", "Victim of Medical Experiments", "Visitations"
		],
		"Disadvantages": [
			"Drug Addict", "Haunted", "Nightmares", "Phobia", "Repressed Memories", "Stalker"
		],
		"Advantages": [
			"Hunter", "Instinct", "Survivalist", "Voice of Pain", "Martial Arts Expert", "Officer", "Dead shot", "Hardened"
		],
		"Looks": {
			"Clothes": [
				"street", "athletic wear", "blood-stained", "casual", "camo", "uniform", "practical"
			],
			"Face": [
				"hard", "coarse", "scarred", "weathered", "fragile", "harsh", "disfigured"
			],
			"Eyes": [
				"hardened", "dead", "desolate", "burning", "sorrowful", "angry", "commanding"
			],
			"Body": [
				"compact", "hardy", "scarred", "huge", "hefty", "limber", "tall", "muscular", "sinewy", "strong", "brutalized"
			]
		},
		"Relations PC": [
			"One of the characters assisted you when you were in need. (+1)",
			"One of the characters abandoned you when you needed them most.",
			"One of the characters followed you into battle. (+1 with each other)",
			"One of the characters listened to your war stories.",
			"One of the characters has seen you lose control."
		],
	},
	"the Abomination": {
		"Type": "Enlightened",
		"Occupations": [
			"homeless", "soldier", "mental hospital patient", "prize fighter", "escaped experiment", "mad scientist", "occultist", "hunter", "criminal", "freak", "murderer", "war veteran"
		],
		"Dark Secrets": [
			"Curse", "Family Secret", "Occult Experience", "Pact with Dark Powers", "Victim of Medical", "Experiments"
		],
		"Disadvantages": [
			"Creator", "Curse", "Jealousy", "Nemesis", "Schizophrenia", "Stalker"
		],
		"Abilities": [
			"Dark Vision", "Immunity", "Invulnerability", "Memories of Past Lives", "Natural Weapons", "Quick", "Regenerate", "Unnaturally Strong"
		],
		"Limitations": [
			"Cannibalism", "Hunting Instincts", "Inhuman Appearance", "Sensitivity", "Uncontrolled", "Shapeshifting"
		],
		"Looks": {
			"Clothes": [
				"worn and dirty", "blood-stained", "leather and fur", "athletic wear", "street", "ill-fitting"
			],
			"Face": [
				"worn", "hard", "disfigured", "ugly", "bearded", "grim", "captivating", "mutilated"
			],
			"Eyes": [
				"angry", "burning", "mad", "desolate", "sorrowful", "curious", "empty", "suspicious"
			],
			"Body": [
				"massive", "deformed", "sinewy", "fast", "hunched", "strange", "scarred", "muscular", "tall"
			]
		},
		"Relations PC": [
			"One of the characters knows you from when you were still human. (+1)",
			"You have accidentally harmed one of the other characters.",
			"One of the characters has seen your true nature.",
			"You are secretly in love with one of the characters. (+2)",
			"One of the characters trusts you to remain in control. (They take +1)"
		],
	},
	"the Death Magician": {
		"Type": "Enlightened",
		"Occupations": [
			"Voodoo priest", "mortician", "bookseller", "nobleman", "Quimbanda priest", "sadhu", "history professor", "high school student", "teacher", "occultist", "medium", "unemployed", "antiquarian"
		],
		"Dark Secrets": [
			"Curse", "Forbidden Knowledge", "Guardian", "Occult Experience", "Pact with Dark Powers"
		],
		"Disadvantages": [
			"Bad Reputation", "Branded", "Curse", "Nemesis", "Nightmares", "Marked", "Stalker"
		],
		"Abilities Mandatory": [
			"Initiate"
		],
		"Abilities": [
			"Adept", "A Second Chance", "Dark Aura", "Experienced", "Improviser", "Journeyman", "Master", "Talisman"
		],
		"Limitations": [
			"Field of Expertise"
		],
		"Looks": {
			"Clothes": [
				"old-fashioned", "worn", "casual", "strange", "expensive", "black"
			],
			"Face": [
				"ravaged", "tired", "guilt-laden", "tense", "beautiful", "dour", "flat", "pale"
			],
			"Eyes": [
				"arrogant", "cheerful", "ruthless", "fearless", "weary", "desperate", "youthful", "smiling"
			],
			"Body": [
				"large", "bony", "slender", "sickly", "towering", "stocky", "dignified", "frail"
			]
		},
		"Relations PC": [
			"One of the characters is your ally. (+1)",
			"One of the characters has gotten in trouble because of you.",
			"One of the characters has asked for your help with something concerning death.",
			"One of the characters fears you.",
			"One of the characters is your enemy."
		],
	},
	"the Disciple": {
		"Type": "Enlightened",
		"Occupations": [
			"Politician", "sect leader", "company CEO", "aristocrat", "gang leader", "mafia boss", "occultist", "video blogger", "advisor", "bishop", "researcher", "police", "high school queen", "celebrity", "jetsetter", "businessman", "homeless", "retiree", "bureaucrat"
		],
		"Dark Secrets": [
			"Chosen", "Guardian", "Guilty of Crime", "Occult Experience", "Pact with Dark Powers"
		],
		"Disadvantages": [
			"Curse", "Fanatic", "Greedy", "Nemesis", "Protégé", "Stalker"
		],
		"Abilities": [
			"Divine Strength", "Experienced", "Manipulate the Illusion", "Master of Rites", "Opener of Ways", "Summoner", "Templars", "Unyielding"
		],
		"Limitations": [
			"Bound to Higher Power"
		],
		"Looks": {
			"Clothes": [
				"spectacular", "suit", "clerical robes", "odd", "strange", "occult symbolism", "spiritual", "proper"
			],
			"Face": [
				"reassuring", "pronounced", "innocent", "dominant", "indifferent", "aged", "challenging"
			],
			"Eyes": [
				"veiled", "intelligent", "calculating", "evaluating", "passionate", "arresting", "power-hungry"
			],
			"Body": [
				"dignified", "tense", "big", "spindly", "broken", "scarred", "graceful", "fragile"
			]
		},
		"Relations PC": [
			"One of the characters is your ally. (+1)",
			"One of the characters is your Higher Power’s enemy.",
			"One of the characters has accepted your help. (They take +1)",
			"One of the characters despises you.",
			"One of the characters protected something valuable to you. (+1)"
		],
	},
	"the Revenant": {
		"Type": "Enlightened",
		"Occupations": [
			"Con man", "model", "playboy", "actor", "aristocrat", "artist", "club owner", "avenger", "escaped experiment", "musician", "politician", "occultist", "prostitute"
		],
		"Dark Secrets": [
			"Curse", "Occult Experience", "Pact with Dark Powers", "Returned from the Other Side", "Victim of Crime"
		],
		"Disadvantages": [
			"Curse", "Nightmares", "Oath of Revenge", "Persecutors", "Sexual Neurosis", "Stalker"
		],
		"Abilities": [
			"Bewitching", "Commanding Voice", "Ethereal", "Invulnerability", "Memories of Past Lives", "Mind Manipulator", "Telekinesis"
		],
		"Limitations": [
			"Bloodthirst", "Controlled by External Force", "Sensitivity", "Soul thirst", "Symbol Bondage"
		],
		"Looks": {
			"Clothes": [
				"old-fashioned", "kinky", "latest fashion", "revealing", "attention-grabbing", "strange"
			],
			"Face": [
				"pale", "beautiful", "cruel", "sickly", "childish", "dignified", "androgynous", "sad"
			],
			"Eyes": [
				"indifferent", "dark", "intense", "cunning", "mad", "understanding", "concerned"
			],
			"Body": [
				"skinny", "sexy", "trembling", "voluptious", "frail", "malformed", "androgynous", "wispy"
			]
		},
		"Relations PC": [
			"One of the characters is your ally. (+1)",
			"One of the characters had something bad happen to them because of you.",
			"One of the characters asked you for help with something regarding death.",
			"One of the characters fears you.",
			"One of the characters is your enemy."
		],
	}
}

var darksecrets = {

}

var advantages = {

}

var disadvantages = {
	"Bad Reputation": {
		"desc": "GENDERPRONOUN1 is hated by the public for something GENDERPRONOUN1lc is accused of."
	},
	"Broken": {
		"desc": "GENDERPRONOUN3 Stability can never increase beyond Distressed.",
	},
	"Competitor": {
		"desc": "GENDERPRONOUN1 has a competitor in the criminal underworld.",
	},
	"Condemned": {
		"desc": "GENDERPRONOUN3 fate is sealed and GENDERPRONOUN3lc Time is ticking down.",
	},
	"Cursed": {
		"desc": "GENDERPRONOUN1 is afflicted by a curse.",
	},
	"Depression": {
		"desc": "GENDERPRONOUN1 is struggling with depression.",
	},
	"Drug Addict": {
		"desc": "GENDERPRONOUN1 ia addicted to hard drugs. "
	},
	"Experiment Gone Wrong": {
		"desc": "GENDERPRONOUN1 carried out an experiment that went terribly wrong.",
	},
	"Fanatic": {
		"desc": "GENDERPRONOUN1 is a fervent adherent of an ideology.",
	},
	"Greedy": {
		"desc": "GENDERPRONOUN1 is driven by an unquenchable desire for money and wealth.",
	},
	"Guilt": {
		"desc": "GENDERPRONOUN1 carry heavy guilt for GENDERPRONOUN3lc past sins.",
	},
	"Harassed": {
		"desc": "GENDERPRONOUN1 is part of a harassed minority group.",
	},
	"Haunted": {
		"desc": "GENDERPRONOUN1 is haunted by supernatural forces.",
	},
	"Infirm": {
		"desc": "GENDERPRONOUN1 suffer from a dangerous physical disease or condition.",
	},
	"Involuntary Medium": {
		"desc": "GENDERPRONOUN1 is an open vessel for spirits and demonic entities.",
	},
	"Jealousy": {
		"desc": "GENDERPRONOUN1 want someone else’s life for GENDERPRONOUN2lcself.",
	},
	"Liar": {
		"desc": "GENDERPRONOUN1 is a compulsive liar.",
	},
	"Lost Identity": {
		"desc": "GENDERPRONOUN1 has a repressed true identity that resurfaces sometimes.",
	},
	"Marked": {
		"desc": "GENDERPRONOUN1 is marked by darkness.",
	},
	"Mental Compulsion": {
		"desc": "GENDERPRONOUN1 is a mental compulsion.",
	},
	"Nemesis": {
		"desc": "GENDERPRONOUN1 has made an enemy who does everything in their power to take revenge on GENDERPRONOUN1lc.",
	},
	"Nightmares": {
		"desc": "GENDERPRONOUN1 suffer from recurring nightmares.",
	},
	"Oath of Revenge": {
		"desc": "GENDERPRONOUN1 is obsessed of taking revenge on someone or an organization.",
	},
	"Object of Desire": {
		"desc": "GENDERPRONOUN1 ignite unhealthy desires in others.",
	},
	"Obsession": {
		"desc": "GENDERPRONOUN1 is obsessed by a conspiracy or supernatural phenomenon.",
	},
	"Owned": {
		"desc": "GENDERPRONOUN1 has fled from someone who kept GENDERPRONOUN1lc as his private property.",
	},
	"Phobia": {
		"desc": "GENDERPRONOUN1 harbour an overpowering fear of something.",
	},
	"Rationalist": {
		"desc": "GENDERPRONOUN3 mind refuses to acknowledge anything except things confirmed by modern science.",
	},
	"Repressed Memories": {
		"desc": "GENDERPRONOUN1 has repressed an unpleasant event.",
	},
	"Rival": {
		"desc": "GENDERPRONOUN1 has an ambitious rival, who will do anything to be in GENDERPRONOUN3lc shoes.",
	},
	"Schizophrenia": {
		"desc": "GENDERPRONOUN1 struggle with psychosis and hallucinations.",
	},
	"Sexual Neurosis": {
		"desc": "GENDERPRONOUN3 sexuality is a destructive, controlling force in GENDERPRONOUN3lc life.",
	},
	"Stalker": {
		"desc": "GENDERPRONOUN1 is hunted by a faceless enemy.",
	},
	"Victim of Passion": {
		"desc": "GENDERPRONOUN1 has an overwhelming passion for someone or something.",
	},
	"Wanted": {
		"desc": "GENDERPRONOUN1 is wanted by the authorities.",
	},
}

function pronounChanged() {
	var pronoun = document.getElementById("Pronoun").value;

	if (pronoun == "He") {
		char.pronoun1 = "He";
		char.pronoun2 = "Him";
		char.pronoun3 = "His";
	}
	else if (pronoun == "She") {
		char.pronoun1 = "She";
		char.pronoun2 = "Her";
		char.pronoun3 = "Her";
	}
	else if (pronoun == "They") {
		char.pronoun1 = "They";
		char.pronoun2 = "Them";
		char.pronoun3 = "Their";
	}

	resetPage();
}

function typeChanged() {
	let type = document.getElementById("Type").value;

	let archEl = document.getElementById("Archetype");
	archEl.innerHTML = "";
	archEl.innerHTML += "<option></option>";

	for (let entry in archetypes) {
		if (archetypes[entry].Type == type) {
			archEl.innerHTML += "<option>" + entry + "</option>";
		}
	}

	resetPage();
}

function archetypeChanged() {
	let archetypeData = archetypes[document.getElementById("Archetype").value];

	/*let unformattedText = "";

	if (document.getElementById("Occupation").value != "") {
		unformattedText += "C_PRONOUN1 is W_ARTICLE C_OCCUPATION. ";
	}

	if (document.getElementById("Clothes").value != "" && document.getElementById("Body").value != "") {
		unformattedText += "C_PRONOUN1 likes to wear C_CLOTHES clothes, and has W_ARTICLE C_BODY body. ";
	}

	if (document.getElementById("Eyes").value != "" && document.getElementById("Face").value != "") {
		unformattedText += "C_PRONOUN3 eyes are C_EYES, while C_PRONOUN3_LC face is C_FACE. ";
	}

	if (document.getElementById("DarkSecret").value != "") {
	}
	
	C_PRONOUN1 has a dark secret: C_DARKSECRET. 
	Even though C_PRONOUN1_LC has W_ARTICLE C_DISADVANTAGE1	and C_DISADVANTAGE2,
	C_PRONOUN1_LC also has W_ARTICLE C_ADVANTAGE1, C_ADVANTAGE2, and C_ADVANTAGE3.
	
	*/
	
	let occEl = document.getElementById("Occupation");
	occEl.innerHTML = "";
	occEl.innerHTML += "<option></option>";
	for (let i = 0; i < archetypeData["Occupations"].length; i++) {
		occEl.innerHTML += "<option>" + archetypeData["Occupations"][i] + "</option>";
	}

	let cltEl = document.getElementById("Clothes");
	cltEl.innerHTML = "";
	cltEl.innerHTML += "<option></option>";
	for (let i = 0; i < archetypeData["Looks"]["Clothes"].length; i++) {
		cltEl.innerHTML += "<option>" + archetypeData["Looks"]["Clothes"][i] + "</option>";
	}

	let bdyEl = document.getElementById("Body");
	bdyEl.innerHTML = "";
	bdyEl.innerHTML += "<option></option>";
	for (let i = 0; i < archetypeData["Looks"]["Body"].length; i++) {
		bdyEl.innerHTML += "<option>" + archetypeData["Looks"]["Body"][i] + "</option>";
	}

	let eyeEl = document.getElementById("Eyes");
	eyeEl.innerHTML = "";
	eyeEl.innerHTML += "<option></option>";
	for (let i = 0; i < archetypeData["Looks"]["Eyes"].length; i++) {
		eyeEl.innerHTML += "<option>" + archetypeData["Looks"]["Eyes"][i] + "</option>";
	}

	let fceEl = document.getElementById("Face");
	fceEl.innerHTML = "";
	fceEl.innerHTML += "<option></option>";
	for (let i = 0; i < archetypeData["Looks"]["Face"].length; i++) {
		fceEl.innerHTML += "<option>" + archetypeData["Looks"]["Face"][i] + "</option>";
	}

	let da1El = document.getElementById("Disadvantage1");
	da1El.innerHTML = "";
	da1El.innerHTML += "<option></option>";
	let da2El = document.getElementById("Disadvantage2");
	da2El.innerHTML = "";
	da2El.innerHTML += "<option></option>";
	let disAd = "";
	for (let i = 0; i < archetypeData["Disadvantages"].length; i++) {
		let nn = archetypeData["Disadvantages"][i];
		let disadv = disadvantages[nn]["desc"];
		disadv = disadv.split("GENDERPRONOUN1lc").join(char.pronoun1.toLowerCase());
		disadv = disadv.split("GENDERPRONOUN2lc").join(char.pronoun2.toLowerCase());
		disadv = disadv.split("GENDERPRONOUN3lc").join(char.pronoun3.toLowerCase());
		disadv = disadv.split("GENDERPRONOUN1").join(char.pronoun1);
		disadv = disadv.split("GENDERPRONOUN2").join(char.pronoun2);
		disadv = disadv.split("GENDERPRONOUN3").join(char.pronoun3);
		disAd += "<option>" + disadv + "</option>";
	}
	da1El.innerHTML += disAd;
	da2El.innerHTML += disAd;

	resetPage();
}

function resetPage() {
	let pr1 = document.getElementsByClassName("pronoun1");
	for (let i = 0; i < pr1.length; i++) {
		if (pr1[i].classList.contains("lc")) { pr1[i].innerHTML = char.pronoun1.toLowerCase(); }
		else { pr1[i].innerHTML = char.pronoun1; }
	}

	let pr2 = document.getElementsByClassName("pronoun2");
	for (let i = 0; i < pr2.length; i++) {
		if (pr2[i].classList.contains("lc")) { pr2[i].innerHTML = char.pronoun2.toLowerCase(); }
		else { pr2[i].innerHTML = char.pronoun2; }
	}

	let pr3 = document.getElementsByClassName("pronoun3");
	for (let i = 0; i < pr3.length; i++) {
		if (pr3[i].classList.contains("lc")) { pr3[i].innerHTML = char.pronoun3.toLowerCase(); }
		else { pr3[i].innerHTML = char.pronoun3; }
	}

}

function changeArticle(obj) {
	let sib = obj.previousElementSibling;
	if (['a', 'e', 'i', 'o', 'u'].indexOf(obj.value[0].toLowerCase()) !== -1) { sib.innerHTML = "an" }
	else { sib.innerHTML = "a" }
}