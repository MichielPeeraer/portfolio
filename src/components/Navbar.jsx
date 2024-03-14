import React, { useState, useEffect } from "react";
import { Link as LinkR } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { bio, navlinks } from "../data/Constants";
import { Squash as Hamburger } from "hamburger-react";
import { useTranslation } from "react-i18next";

const Container = styled.div`
	background-color: ${({ theme }) => theme.bg};
	height: 80px;
	display: flex;
	align-items: center;
	justify-content: center;
	position: sticky;
	top: 0;
	z-index: 10;
	color: ${({ theme }) => theme.text_primary};
	box-shadow: 0 0 10px 2px ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
	width: 100%;
	max-width: 1200px;
	padding: 0 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const NavLogo = styled(LinkR)`
	display: flex;
	align-items: center;
	font-weight: 500;
	font-size: 18px;
	text-decoration: none;
	color: inherit;
`;

const ColorText = styled.div`
	color: ${({ theme }) => theme.primary};
	font-size: 32px;
`;

const Slash = styled.div`
	color: ${({ theme }) => theme.primary};
`;

const Name = styled.div`
	padding: 0 4px;
`;

const NavItems = styled.ul`
	display: flex;
	align-items: center;
	gap: 32px;
	list-style-type: none;
	@media screen and (max-width: 900px) {
		display: none;
	}
`;

const NavLink = styled.a`
	color: ${({ theme }) => theme.text_primary};
	font-weight: 500;
	transition: all 0.2s ease-in-out;
	text-decoration: none;
	&:hover {
		color: ${({ theme }) => theme.primary};
	}
`;

const ButtonContainer = styled.div`
	@media screen and (max-width: 900px) {
		display: none;
	}
`;

const GithubButton = styled.a`
	border: 2px solid ${({ theme }) => theme.primary};
	color: ${({ theme }) => theme.primary};
	border-radius: 50px;
	padding: 10px 20px;
	font-weight: 500;
	transition: all 0.6s ease-in-out;
	text-decoration: none;
	&:hover {
		background-color: ${({ theme }) => theme.primary};
		color: ${({ theme }) => theme.text_primary};
	}
`;

const HamburgerContainer = styled.div`
	display: none;
	@media screen and (max-width: 900px) {
		display: block;
	}
`;

const MobileMenu = styled(({ isOpen, ...rest }) => <ul {...rest} />)`
	width: 100%;
	display: none;
	flex-direction: column;
	align-items: flex-start;
	gap: 16px;
	list-style-type: none;
	padding: 12px 40px 24px;
	background-color: ${({ theme }) => theme.bg};
	position: absolute;
	top: 80px;
	right: 0;
	border-radius: 0 0 20px 20px;
	box-shadow: 0 0 10px 2px ${({ theme }) => theme.bg};
	@media screen and (max-width: 900px) {
		display: flex;
	}
`;

const Navbar = () => {
	const [isOpen, setIsOpen] = useState(false);
	const theme = useTheme();
	const { t } = useTranslation();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 900 && isOpen) {
				setIsOpen(false);
			}
		};

		window.addEventListener("resize", handleResize);

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [isOpen]);

	return (
		<Container id="nav">
			<Wrapper>
				<NavLogo to="/">
					<ColorText>&lt;</ColorText>
					<Name>{bio.name}</Name>
					<Slash>/</Slash>
					<ColorText>&gt;</ColorText>
				</NavLogo>

				<HamburgerContainer onClick={() => setIsOpen(!isOpen)}>
					<Hamburger
						size={20}
						toggled={isOpen}
						label="Mobile Menu Icon"
					/>
				</HamburgerContainer>

				<NavItems>
					{navlinks.map((link) => (
						<NavLink key={link} href={`#${link}`}>
							{t(`nav.${link}`)}
						</NavLink>
					))}
				</NavItems>

				{isOpen && (
					<MobileMenu isOpen={isOpen}>
						{navlinks.map((link) => (
							<NavLink
								onClick={() => setIsOpen(!isOpen)}
								key={link}
								href={`#${link}`}
							>
								{t(`nav.${link}`)}
							</NavLink>
						))}

						<GithubButton
							href={bio.github}
							target="_blank"
							rel="noreferrer"
							style={{
								background: theme.primary,
								color: theme.text_primary,
							}}
						>
							{t("nav.github")}
						</GithubButton>
					</MobileMenu>
				)}
				<ButtonContainer>
					<GithubButton
						href={bio.github}
						target="_blank"
						rel="noreferrer"
					>
						{t("nav.github")}
					</GithubButton>
				</ButtonContainer>
			</Wrapper>
		</Container>
	);
};

export default Navbar;
