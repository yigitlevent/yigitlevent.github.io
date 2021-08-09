import styled from "styled-components";

import { Title } from "../shared/Title";

const Wrapper = styled.div`
	margin: 0 10px;
	padding: 5px;
`;

export function About(): JSX.Element {
	return (
		<Wrapper>
			<Title>About</Title>
			<p>
				I wouldn't know what to do with myself if I haven't started learning coding back in 2007. Since then, I have coded a lot of projects with bad coding practices, horrible UI, thirteen different flavors of broken functionality, and much more.
			</p>
			<p>
				Nowadays I do freelancing and work on my personal projects using <b>React</b>, <b>Immer</b>, <b>Zustand</b>, and billion other libraries that this god forsaken ecosystem is using. I like it, but don't take my word on it. I like junk food too.
			</p>
			<p>
				I also have experience with <b>MongoDB</b>, <b>PostgreSQL</b>, <b>Supabase</b>, <b>Firebase</b>, <b>ExpressJS</b>, and likes.
			</p>
			<p>
				Another problem I have is <b>C/C++</b>. No matter how much it makes me suffer, I always find reasons to work with it for some reason.
			</p>
			<p>
				Lastly, I also use <b>Python</b>, <b>Photoshop</b>, <b>Illustrator</b>, <b>Indesign</b>, <b>Excel</b>, and <b>Paint</b> whenever the work at hand requires.
			</p>
			<p>
				Thanks.
			</p>
		</Wrapper>
	);
}