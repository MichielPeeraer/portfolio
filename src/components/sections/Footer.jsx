import React from "react";
import styled from "styled-components";
import { bio, languages } from "../../data/Constants";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useTranslation } from "react-i18next";

const FooterContainer = styled.div`
	width: 100%;
	padding: 2rem 0;
	display: flex;
	justify-content: center;
	position: relative;
	z-index: 1;
`;

const FooterWrapper = styled.div`
	width: 100%;
	max-width: 1200px;
	display: flex;
	flex-direction: column;
	gap: 14px;
	align-items: center;
	padding: 1rem;
	color: ${({ theme }) => theme.text_primary};
`;

const Logo = styled.div`
	font-weight: 600;
	font-size: 20px;
	color: ${({ theme }) => theme.primary};
`;

const Nav = styled.nav`
	width: 100%;
	max-width: 800px;
	margin-top: 0.5rem;
	display: flex;
	flex-direction: row;
	gap: 2rem;
	justify-content: center;
	@media (max-width: 768px) {
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		text-align: center;
		font-size: 12px;
	}
`;

const NavLink = styled.a`
	color: ${({ theme }) => theme.text_primary};
	text-decoration: none;
	font-size: 1.2rem;
	transition: color 0.2s ease-in-out;
	&:hover {
		color: ${({ theme }) => theme.primary};
	}
	@media (max-width: 768px) {
		font-size: 1rem;
	}
`;

const SocialMediaIcons = styled.div`
	display: flex;
	margin-top: 1rem;
`;

const SocialMediaIcon = styled.a`
	display: inline-block;
	margin: 0 1rem;
	font-size: 1.5rem;
	color: ${({ theme }) => theme.text_primary};
	transition: color 0.2s ease-in-out;
	&:hover {
		color: ${({ theme }) => theme.primary};
	}
`;

const Copyright = styled.p`
	margin-top: 1.5rem;
	font-size: 0.9rem;
	color: ${({ theme }) => theme.soft2};
	text-align: center;
`;

const LanguageSwitcher = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Language = styled.button`
	font-size: 1.2rem;
	transition: color 0.2s ease-in-out;
	color: ${({ theme }) => theme.text_primary};
	background: none;
	border: none;
	padding: 0 10px;
	cursor: pointer;
	&:hover {
		color: ${({ theme }) => theme.primary};
	}
	@media (max-width: 768px) {
		font-size: 1rem;
	}
	${({ $active, theme }) =>
		$active &&
		`
        color:  ${theme.primary};
    `}
`;

const Divider = styled.span`
	height: 2px;
	width: 8px;
	background: ${({ theme }) => theme.text_primary};
`;

const Footer = () => {
	const { t, i18n } = useTranslation();
	const changeLang = (lang) => {
		i18n.changeLanguage(lang);
	};

	return (
		<FooterContainer>
			<FooterWrapper>
				<Logo>{bio.name}</Logo>
				<Nav>
					<NavLink href="#About">About</NavLink>
					<NavLink href="#Skills">Skills</NavLink>
					<NavLink href="#Experience">Experience</NavLink>
					<NavLink href="#Projects">Projects</NavLink>
					<NavLink href="#Education">Education</NavLink>
				</Nav>
				<SocialMediaIcons>
					<SocialMediaIcon
						href={bio.linkedin}
						target="display"
						aria-label="Go to my LinkedIn account"
					>
						<LinkedInIcon />
					</SocialMediaIcon>
					<SocialMediaIcon
						href={bio.github}
						target="display"
						aria-label="Go to my GitHub account"
					>
						<GitHubIcon />
					</SocialMediaIcon>
					<SocialMediaIcon
						href={bio.facebook}
						target="display"
						aria-label="Go to my Facebook account"
					>
						<FacebookIcon />
					</SocialMediaIcon>
				</SocialMediaIcons>
				<LanguageSwitcher>
					{languages.map((lang, index) => (
						<React.Fragment key={`lang-${lang}`}>
							<Language
								$active={lang === i18n.language}
								onClick={() => changeLang(lang)}
							>
								{lang.toUpperCase()}
							</Language>
							{index !== languages.length - 1 && <Divider />}
						</React.Fragment>
					))}
				</LanguageSwitcher>
				<Copyright>
					&copy; {new Date().getFullYear()} {bio.name}
				</Copyright>
			</FooterWrapper>
		</FooterContainer>
	);
};

export default Footer;
