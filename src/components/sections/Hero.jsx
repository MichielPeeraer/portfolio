import React from "react";
import styled from "styled-components";
import { bio } from "../../data/Constants";
import Typewriter from "typewriter-effect";
import HeroImg from "../../assets/images/HeroImage.webp";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import {
	headContainerAnimation,
	headContentAnimation,
	headTextAnimation,
} from "../../utils/Motion";
import StarCanvas from "../canvas/Stars";
import { isBrowser } from "react-device-detect";
import { useTranslation } from "react-i18next";

const Container = styled.div`
	display: flex;
	justify-content: center;
	position: relative;
	padding: 80px 30px;
	z-index: 1;
	color: ${({ theme }) => theme.text_primary};

	@media (max-width: 1024px) {
		padding: 66px 16px;
	}

	@media (max-width: 640px) {
		padding: 32px 16px;
	}
`;

const Wrapper = styled.div`
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	max-width: 1100px;

	@media (max-width: 1024px) {
		flex-direction: column;
	}
`;

const LeftContainer = styled.div`
	width: 100%;
	order: 1;

	@media (max-width: 1024px) {
		margin-bottom: 30px;
		order: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
`;

const RightContainer = styled.div`
	width: 100%;
	order: 2;
	display: flex;
	justify-content: flex-end;

	@media (max-width: 1024px) {
		margin-bottom: 80px;
		order: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	@media (max-width: 640px) {
		margin-bottom: 30px;
	}
`;

const Title = styled.div`
	font-weight: 700;
	font-size: 50px;
	line-height: 68px;

	@media (max-width: 1024px) {
		text-align: center;
		font-size: 40px;
		line-height: 48px;
		margin-bottom: 8px;
	}
`;

const SubTitle = styled.div`
	font-weight: 600;
	font-size: 30px;
	display: flex;
	gap: 12px;
	line-height: 68px;

	@media (max-width: 1024px) {
		text-align: center;
		font-size: 22px;
		line-height: 48px;
		margin-bottom: 16px;
	}

	@media (max-width: 425px) {
		flex-direction: column;
		gap: 0;
		margin-bottom: 24px;
		& > div {
			line-height: 24px;
		}
	}
`;

const Span = styled.div`
	color: ${({ theme }) => theme.primary};
`;

const Desc = styled.div`
	font-size: 20px;
	line-height: 32px;
	margin-bottom: 42px;
	color: ${({ theme }) => theme.text_primary + 95};

	@media (max-width: 1024px) {
		text-align: center;
		font-size: 16px;
		line-height: 32px;
	}
`;

const DownloadButton = styled.a`
    color: inherit;
    appearance: button;
    text-decoration: none;
    width: 100%;
    max-width: 300px;
    text-align: center;
    padding: 16px 0;
    border-radius: 50px;
    font-weight: 600;
    font-size: 20px;
    box-shadow: 20px 20px 60px #1f2634, -20px -20px 60px #1f2634;
    background: hsla(271, 100%, 50%, 1);
    background: linear-gradient(
        225deg,
        hsla(271, 100%, 50%, 1) 0%,
        hsla(294, 100%, 50%, 1) 100%
    );

    &:hover {
        transform: scale(1.05);
        transition: all 0.4s ease-in-out;
        box-shadow:  20px 20px 60px #1f2634,
        filter: brightness(1);
    }    
    
    @media (max-width: 640px) {
        padding: 12px 0;
        font-size: 18px;
    } 
    
`;

const Img = styled.img`
	border-radius: 50%;
	width: 100%;
	height: 100%;
	max-width: 400px;
	max-height: 400px;
	border: 2px solid ${({ theme }) => theme.primary};

	@media (max-width: 640px) {
		max-width: 280px;
		max-height: 280px;
	}
`;

const Hero = () => {
	const { t, i18n } = useTranslation();
	const downloadLink =
		process.env.PUBLIC_URL + "/locales/" + i18n.language + bio.cv;

	return (
		<Container id="about">
			{isBrowser && <StarCanvas />}
			<motion.div {...headContainerAnimation}>
				<Wrapper>
					<LeftContainer>
						<motion.div {...headTextAnimation}>
							<Title>
								{t("hero.title")} <br /> {bio.name}
							</Title>
							<SubTitle>
								{t("hero.subtitle")}
								<Span>
									<Typewriter
										options={{
											strings: bio.roles,
											autoStart: true,
											loop: true,
										}}
									/>
								</Span>
							</SubTitle>
						</motion.div>

						<motion.div {...headContentAnimation}>
							<Desc>{t("hero.desc")}</Desc>
						</motion.div>

						<DownloadButton href={downloadLink} download>
							{t("hero.download")}
						</DownloadButton>
					</LeftContainer>
					<RightContainer>
						<motion.div {...headContentAnimation}>
							{isBrowser ? (
								<Tilt>
									<Img src={HeroImg} alt={bio.name} />
								</Tilt>
							) : (
								<Img src={HeroImg} alt={bio.name} />
							)}
						</motion.div>
					</RightContainer>
				</Wrapper>
			</motion.div>
		</Container>
	);
};

export default Hero;
