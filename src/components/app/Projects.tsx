import styled from "styled-components";

import { Title, Subtitle } from "../shared/Title";

const Wrapper = styled.div`
	margin: 0 10px;
`;

export function Projects(): JSX.Element {
	return (
		<Wrapper>
			<Title>Projects</Title>
			

			<Subtitle>Linguistics</Subtitle>

			<p>WIP</p>

			<Subtitle>Burning Wheel Gold Revised</Subtitle>

			<a href="./bwgr-distillation">BWGR Distillation</a>
			<p>create and manage spells</p>

			<a href="./bwgr-lifepaths">BWGR Lifepaths</a>
			<p>an app to explore lifepaths</p>

			<a href="./bwgr-factioncards">BWGR Faction Cards</a>
			<p>create and manage faction cards</p>

			<a href="./bwgr-magicwheel">BWGR Magic Wheel</a>
			<p>spin the magic wheel</p>

			<a href="./bwgr-unitcards">BWGR Unit Cards</a>
			<p>create and manage unit cards</p>

			<Subtitle>Kult</Subtitle>

			<p>WIP</p>
		</Wrapper>
	);
}