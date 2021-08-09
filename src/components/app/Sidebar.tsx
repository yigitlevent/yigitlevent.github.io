import styled from "styled-components";

const Wrapper = styled.div`
	background: ${(props: pg.theme.StyleProps) => props.theme.background.sidebar};
`;

const Image = styled.img`
	width: 100px;
	height: 100px;
	margin: 10px;
	border-radius: 100%;
	filter: grayscale(60%);

	&:hover {
		filter: grayscale(10%);
		transition: filter 1s;
	}
`;

const Link = styled.div`
	font-size: 1.1em;
	margin: 0 16px 10px;
	filter: brightness(100%);
	
	&:hover {
		filter: brightness(200%);
		transition: filter 1s;
		cursor: pointer;
	}
`;

export function Sidebar({ setPage }: { setPage: React.Dispatch<React.SetStateAction<"about" | "projects">>; }): JSX.Element {

	return (
		<Wrapper>
			<Image src="./me.jpg" />
			<Link onClick={() => setPage("about")}>About</Link>
			<Link onClick={() => setPage("projects")}>Projects</Link>
		</Wrapper>
	);
};