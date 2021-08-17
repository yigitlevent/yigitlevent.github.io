import styled from "styled-components";

import { Title, Subtitle } from "../shared/Title";

const Wrapper = styled.div`
	margin: 0 10px;
	padding: 5px;
`;

export function Projects(): JSX.Element {
	return (
		<Wrapper>
			<Title>Projects</Title>
			

			<Subtitle>Linguistics</Subtitle>

			<p>WIP</p>

			<Subtitle>Roleplaying</Subtitle>

			<a href="./bwgr-tools">BWGR Tools</a>
			<p>a collection of tools for burning wheel gold revised</p>
		</Wrapper>
	);
}