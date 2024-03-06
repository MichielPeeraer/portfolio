import React, { useState, useEffect } from "react";
import { Link as LinkR } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { bio } from "../data/Constants";
import { Squash as Hamburger } from "hamburger-react";

const Nav = styled.div`
	background-color: ${({ theme }) => theme.bg};
	height: 80px;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1rem;
	position: sticky;
	top: 0;
	z-index: 10;
	color: white;
`;

const ColorText = styled.div`
	color: ${({ theme }) => theme.primary};
	font-size: 32px;
`;

const NavbarContainer = styled.div`
	width: 100%;
	max-width: 1200px;
	padding: 0 24px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 1rem;
`;

const NavLogo = styled(LinkR)`
	display: flex;
	align-items: center;
	padding: 0 6px;
	font-weight: 500;
	font-size: 18px;
	text-decoration: none;
	color: inherit;
`;

const NavItems = styled.ul`
	display: flex;
	align-items: center;
	gap: 32px;
	padding: 0 6px;
	list-style: none;
	@media screen and (max-width: 900px) {
		display: none;
	}
`;

const NavLink = styled.a`
	color: ${({ theme }) => theme.text_primary};
	font-weight: 500;
	cursor: pointer;
	transition: all 0.2s ease-in-out;
	text-decoration: none;
	&:hover {
		color: ${({ theme }) => theme.primary};
	}
`;

const ButtonContainer = styled.div`
	height: 100%;
	display: flex;
	align-items: center;
	padding: 0 6px;
	@media screen and (max-width: 900px) {
		display: none;
	}
`;

const GithubButton = styled.a`
	border: 1px solid ${({ theme }) => theme.primary};
	color: ${({ theme }) => theme.primary};
	justify-content: center;
	display: flex;
	align-items: center;
	border-radius: 50px;
	cursor: pointer;
	padding: 10px 20px;
	font-size: 16px;
	font-weight: 500;
	transition: all 0.6s ease-in-out;
	text-decoration: none;
	&:hover {
		background: ${({ theme }) => theme.primary};
		color: ${({ theme }) => theme.text_primary};
	}
`;

const MobileIcon = styled.div`
	height: 100%;
	align-items: center;
	color: ${({ theme }) => theme.text_primary};
	display: none;
	&:hover {
		svg {
			cursor: pointer;
		}
	}
	@media screen and (max-width: 900px) {
		display: block;
	}
`;

const MobileMenu = styled(({ isOpen, ...rest }) => <ul {...rest} />)`
	width: 100%;
	display: none;
	flex-direction: column;
	align-items: start;
	gap: 16px;
	padding: 0 6px;
	list-style: none;
	width: 100%;
	padding: 12px 40px 24px 40px;
	background: ${({ theme }) => theme.card_light + 99};
	position: absolute;
	top: 80px;
	right: 0;
	border-radius: 0 0 20px 20px;
	box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	@media screen and (max-width: 900px) {
		display: flex;
	}
`;

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const theme = useTheme();

	const handleResize = () => {
		if (window.innerWidth > 900 && isOpen) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
		// eslint-disable-next-line
	}, [isOpen]);

	return (
		<Nav>
			<NavbarContainer>
				<NavLogo to="/">
					<ColorText>&lt;</ColorText>
					<div style={{ whiteSpace: "nowrap" }}>
						&nbsp;{bio.name}&nbsp;
					</div>
					<div style={{ color: theme.primary }}>/</div>
					<ColorText>&gt;</ColorText>
				</NavLogo>

				<MobileIcon onClick={() => setIsOpen(!isOpen)}>
					<Hamburger size={20} toggled={isOpen} />
				</MobileIcon>

				<NavItems>
					<NavLink href="#About">About</NavLink>
					<NavLink href="#Skills">Skills</NavLink>
					<NavLink href="#Experience">Experience</NavLink>
					<NavLink href="#Projects">Projects</NavLink>
					<NavLink href="#Education">Education</NavLink>
				</NavItems>

				{isOpen && (
					<MobileMenu isOpen={isOpen}>
						<NavLink
							onClick={() => setIsOpen(!isOpen)}
							href="#About"
						>
							About
						</NavLink>
						<NavLink
							onClick={() => setIsOpen(!isOpen)}
							href="#Skills"
						>
							Skills
						</NavLink>
						<NavLink
							onClick={() => setIsOpen(!isOpen)}
							href="#Experience"
						>
							Experience
						</NavLink>
						<NavLink
							onClick={() => setIsOpen(!isOpen)}
							href="#Projects"
						>
							Projects
						</NavLink>
						<NavLink
							onClick={() => setIsOpen(!isOpen)}
							href="#Education"
						>
							Education
						</NavLink>
						<GithubButton
							href={bio.github}
							target="_Blank"
							style={{
								background: theme.primary,
								color: theme.text_primary,
							}}
						>
							Github Profile
						</GithubButton>
					</MobileMenu>
				)}
				<ButtonContainer>
					<GithubButton href={bio.github} target="_Blank">
						Github Profile
					</GithubButton>
				</ButtonContainer>
			</NavbarContainer>
		</Nav>
	);
};

export default Navbar;
