export const MainTheme: pg.theme.Palette = {
	background: {
		surface: "rgb(24, 24, 24)",
		sidebar: "rgb(36, 36, 48)",
		element: "rgb(48, 48, 48)",
		subelement: "rgb(64, 64, 64)",
		input: "rgb(80, 80, 80)"
	},
	text: {
		main: "rgb(210, 210, 210)",
		hint: "rgb(180, 180, 180)",
		link: "rgb(170, 190, 240)"
	},
	border: {
		soft: "1px solid rgb(64, 64, 64)",
		medium: "1px solid rgb(80, 80, 80)",
		hard: "1px solid rgb(96, 96, 96)"
	},
	status: {
		success: "rgb(66, 142, 51)",
		warning: "rgb(92, 99, 51)",
		error: "rgb(142, 66, 51)"
	},
	brightness: {
		darkened: "filter: brightness(60%);",
		normal: "filter: brightness(100%);",
		hovered: "filter: brightness(120%) sepia(20%);",
		selected: "filter: brightness(140%);"
	}
};
