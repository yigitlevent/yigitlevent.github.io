import { useState } from "react";
import styled, { ThemeProvider } from "styled-components";

import { GlobalStyle } from "../theme/global";
import { MainTheme } from "../theme/_palette";

import { Sidebar } from "./app/Sidebar";
import { About } from "./app/About";
import { Projects } from "./app/Projects";

const Wrapper = styled.div`
	width: 600px;
	height: 100%;
	max-width: 100%;
	max-height: 100%;

	padding: 0;
	margin: 0 auto;
`;

const InnerWrapper = styled.div`
	width: 100%;
	max-width: 100%;
	max-height: 100%;

	margin: 5px auto;
	padding: 1px;

	display: grid;
	grid-template-columns: 120px 1fr;
	grid-template-rows: 1fr;

	background: ${(props: pg.theme.StyleProps) => props.theme.background.element};
`;

export function App(): JSX.Element {
	const [page, setPage] = useState<"about" | "projects">("about");

	return (
		<ThemeProvider theme={MainTheme}>
			<GlobalStyle />
			<Wrapper>
				<InnerWrapper>
					<Sidebar setPage={setPage} />
					{(page === "about") ? <About /> : null}
					{(page === "projects") ? <Projects /> : null}
				</InnerWrapper>
			</Wrapper>
		</ThemeProvider>
	);
}