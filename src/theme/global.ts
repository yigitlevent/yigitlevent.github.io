import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
	@font-face {
        font-family: "NotoSansR";
        src: url("/fonts/NotoSans-Regular.ttf");
		font-display: block;
    };

	@font-face {
        font-family: "NotoSansI";
        src: url("/fonts/NotoSans-Italic.ttf");
		font-display: block;
    };
	
	@font-face {
        font-family: "Staatliches";
        src: url("/fonts/Staatliches-Regular.ttf");
		font-display: block;
    };

	* {
		box-sizing: border-box;
		tab-size: 4;

		font-size: 0.99em;

		font-family: "NotoSansR";
		color: ${(props: pg.theme.StyleProps) => props.theme.text.main};
	}

	html {
		height: 100vh;
		width: 100vw;
	}

	body, 
	#root {
		height: 100%;
		width: 100%;
	}

	html,
	body,
	#root {
		background: ${(props: pg.theme.StyleProps) => props.theme.background.surface};
		margin: 0;
		padding: 0;
		overflow: hidden;
	}

	a {
		color: ${(props: pg.theme.StyleProps) => props.theme.text.link};
		text-decoration: none;

		&:hover {
			${(props: pg.theme.StyleProps) => props.theme.brightness.hovered}
		}

		&:visited {
			color: ${(props: pg.theme.StyleProps) => props.theme.text.link};
			text-decoration: none;
		}
	}

	i {
		font-family: "NotoSansRI";
	}

	p {
		margin: 2px 6px 10px;
		line-height: 1.5;
		text-indent: 10px;
		text-align: justify;
		text-align-last: left;
	}
`;
