import styled, { ThemeProvider } from "styled-components";
import { darkTheme } from "./utils/Themes";
import Navbar from "./components/Navbar";
import { BrowserRouter } from "react-router-dom";
import Hero from "./components/sections/Hero";
import Skills from "./components/sections/Skills";
import StarCanvas from "./components/canvas/Stars";
import { AnimatePresence } from "framer-motion";
import Education from "./components/sections/Education";
import Experience from "./components/sections/Experience";
import Projects from "./components/sections/Projects";
import Contact from "./components/sections/Contact";
import Footer from "./components/sections/Footer";
import ProjectDetails from "./components/lightbox/ProjectDetails";
import { useEffect, useState } from "react";
import { Bounce, ToastContainer } from "react-toastify";
import ArrowUp from "@mui/icons-material/ArrowUpwardRounded";
import { isBrowser } from "react-device-detect";
import "react-toastify/dist/ReactToastify.css";

const Body = styled.div`
	background-color: ${({ theme }) => theme.bg};
	width: 100%;
	overflow-x: hidden;
	position: relative;
`;

const Wrapper = styled.div`
	padding-bottom: 100px;
	background: linear-gradient(
			38.73deg,
			rgba(204, 0, 187, 0.15) 0%,
			rgba(201, 32, 184, 0) 50%
		),
		linear-gradient(
			141.27deg,
			rgba(0, 70, 209, 0) 50%,
			rgba(0, 70, 209, 0.15) 100%
		);
	width: 100%;
	clip-path: polygon(0 0, 100% 0, 100% 100%, 30% 98%, 0 100%);
`;

const ScrollTopButton = styled.button`
	position: fixed;
	right: 30px;
	bottom: 30px;
	padding: 15px;
	z-index: 999;
	cursor: pointer;
	transition: all 0.6s ease-in-out;
	display: flex;
	border-radius: 50px;
	border: 2px solid ${({ theme }) => theme.primary};
	color: ${({ theme }) => theme.primary};
	background: transparent;
	opacity: ${({ $visible }) => ($visible ? 1 : 0)};
	visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
	& > svg {
		scale: 1.2;
	}
	&:hover {
		color: ${({ theme }) => theme.text_primary};
		background: ${({ theme }) => theme.primary};
	}
	@media (max-width: 768px) {
		right: 20px;
		bottom: 20px;
		padding: 10px;
		& > svg {
			scale: 1.1;
		}
	}
	@media (max-width: 425px) {
		right: 10px;
		bottom: 10px;
		padding: 5px;
		& > svg {
			scale: 1;
		}
	}
`;

function App() {
	const [openModal, setOpenModal] = useState({ state: false, project: null });
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		const handleScrollButtonVisiblity = () => {
			setShowButton(window.scrollY > 600);
		};

		window.addEventListener("scroll", handleScrollButtonVisiblity);

		return () => {
			window.removeEventListener("scroll", handleScrollButtonVisiblity);
		};
	}, []);

	const handleScrollToTop = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<ThemeProvider theme={darkTheme}>
			<BrowserRouter>
				<ToastContainer
					position="top-center"
					theme="colored"
					transition={Bounce}
					closeOnClick
				/>
				<Navbar />
				<Body>
					{isBrowser && <StarCanvas />}
					<AnimatePresence>
						<div>
							<Hero />
							<Wrapper>
								<Skills />
								<Experience />
							</Wrapper>
							<Projects
								openModal={openModal}
								setOpenModal={setOpenModal}
							/>
							<Wrapper>
								<Education />
								<Contact />
							</Wrapper>
							<Footer />
							{openModal.state && (
								<ProjectDetails
									openModal={openModal}
									setOpenModal={setOpenModal}
								/>
							)}
						</div>
					</AnimatePresence>
				</Body>
				<ScrollTopButton
					$visible={showButton}
					onClick={handleScrollToTop}
				>
					<ArrowUp />
				</ScrollTopButton>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
