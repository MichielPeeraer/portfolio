import React, { useRef } from "react";
import styled, { useTheme } from "styled-components";
import emailjs from "@emailjs/browser";
import EarthCanvas from "../canvas/Earth";
import { descriptions } from "../../data/Constants";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import "yup-phone-lite";
import ReCAPTCHA from "react-google-recaptcha";

const Container = styled.div`
	display: flex;
	justify-content: center;
	gap: 12px;
	z-index: 1;
	align-items: center;
	@media (max-width: 960px) {
		padding: 0px;
	}
`;

const Wrapper = styled.div`
	position: relative;
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-direction: column;
	width: 100%;
	max-width: 1350px;
	padding: 0px 0px 80px 0px;
	gap: 12px;
	@media (max-width: 960px) {
		flex-direction: column;
	}
`;

const Title = styled.div`
	font-size: 52px;
	text-align: center;
	font-weight: 600;
	margin-top: 20px;
	color: ${({ theme }) => theme.text_primary};
	@media (max-width: 768px) {
		margin-top: 12px;
		font-size: 32px;
	}
`;

const Desc = styled.div`
	font-size: 18px;
	text-align: center;
	max-width: 600px;
	color: ${({ theme }) => theme.text_secondary};
	@media (max-width: 768px) {
		margin-top: 12px;
		font-size: 16px;
	}
`;

const ContactForm = styled(Form)`
	width: 95%;
	max-width: 600px;
	display: flex;
	flex-direction: column;
	background-color: rgba(17, 25, 40, 0.83);
	border: 1px solid rgba(255, 255, 255, 0.125);
	padding: 32px;
	border-radius: 12px;
	box-shadow: rgba(23, 92, 230, 0.1) 0px 4px 24px;
	margin-top: 28px;
	gap: 12px;
`;

const ContactTitle = styled.div`
	font-size: 28px;
	margin-bottom: 6px;
	font-weight: 600;
	color: ${({ theme }) => theme.text_primary};
`;

const ContactInput = styled(Field)`
	flex: 1;
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.text_secondary + 50};
	outline: none;
	font-size: 18px;
	color: ${({ theme }) => theme.text_primary};
	border-radius: 12px;
	padding: 12px 16px;
	&:focus {
		border: 1px solid ${({ theme }) => theme.primary};
	}
`;

const ErrorMessageStyled = styled(ErrorMessage)`
	color: #ff4500;
`;

const ContactInputMessage = styled(Field)`
	flex: 1;
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.text_secondary + 50};
	outline: none;
	font-size: 18px;
	color: ${({ theme }) => theme.text_primary};
	border-radius: 12px;
	padding: 12px 16px;
	resize: none;
	&:focus {
		border: 1px solid ${({ theme }) => theme.primary};
	}
`;

const RecaptchaContainer = styled.div`
	@media (max-width: 389px) {
		transform: scale(0.78);
		transform-origin: 0;
	}
`;

const ContactButton = styled.button`
	width: 100%;
	text-decoration: none;
	text-align: center;
	background: hsla(271, 100%, 50%, 1);
	background: linear-gradient(
		225deg,
		hsla(271, 100%, 50%, 1) 0%,
		hsla(294, 100%, 50%, 1) 100%
	);
	background: -moz-linear-gradient(
		225deg,
		hsla(271, 100%, 50%, 1) 0%,
		hsla(294, 100%, 50%, 1) 100%
	);
	background: -webkit-linear-gradient(
		225deg,
		hsla(271, 100%, 50%, 1) 0%,
		hsla(294, 100%, 50%, 1) 100%
	);
	padding: 13px 16px;
	margin-top: 2px;
	border-radius: 12px;
	border: none;
	color: ${({ theme }) => theme.text_primary};
	font-size: 18px;
	font-weight: 600;
	&:hover {
		cursor: pointer;
	}
`;

const SubmittingMessage = styled.div`
	display: flex;
	justify-content: center;
	& > div {
		padding-right: 10px;
	}
`;

const initialValues = {
	user_email: "",
	user_name: "",
	user_phone: "",
	user_company: "",
	subject: "",
	message: "",
};

const validationSchema = Yup.object().shape({
	user_email: Yup.string().email("* Invalid email").required("* Required"),
	user_name: Yup.string()
		.matches(/^[a-zA-Z\s]+$/, "* Name cannot contain numbers")
		.required("* Required"),
	user_phone: Yup.string()
		.phone("BE", "* Invalid phone number")
		.required("* Required"),
	user_company: Yup.string().required("* Required"),
	subject: Yup.string().required("* Required"),
	message: Yup.string().required("* Required"),
});

const Contact = () => {
	const theme = useTheme();
	const refCaptcha = useRef();
	const handleSubmit = async (values, { setSubmitting, resetForm }) => {
		try {
			const token = refCaptcha.current.getValue();
			const params = {
				...values,
				"g-recaptcha-response": token,
			};
			await emailjs.send(
				process.env.REACT_APP_EMAILJS_SERVICE,
				process.env.REACT_APP_EMAILJS_TEMPLATE,
				params,
				process.env.REACT_APP_EMAILJS_KEY
			);
			toast.success("Form submitted successfully!");
			resetForm();
			refCaptcha.current.reset();
		} catch (error) {
			toast.error("Form submission failed. Please try again later.");
			toast.error("Error " + error.status + ": " + error.text);
		}
		setSubmitting(false);
	};
	return (
		<Container>
			<Wrapper>
				<EarthCanvas />
				<Title>Contact</Title>
				<Desc>{descriptions.contact}</Desc>
				<Formik
					initialValues={initialValues}
					validationSchema={validationSchema}
					onSubmit={handleSubmit}
				>
					{(formikProps) => (
						<ContactForm>
							<ContactTitle>Email Me 🚀</ContactTitle>
							<ContactInput
								placeholder="Name *"
								name="user_name"
							/>
							<ErrorMessageStyled
								name="user_name"
								component="div"
							/>
							<ContactInput
								placeholder="Email *"
								name="user_email"
							/>
							<ErrorMessageStyled
								name="user_email"
								component="div"
							/>
							<ContactInput
								placeholder="Phone *"
								name="user_phone"
							/>
							<ErrorMessageStyled
								name="user_phone"
								component="div"
							/>
							<ContactInput
								placeholder="Company *"
								name="user_company"
							/>
							<ErrorMessageStyled
								name="user_company"
								component="div"
							/>
							<ContactInput
								placeholder="Subject *"
								name="subject"
							/>
							<ErrorMessageStyled
								name="subject"
								component="div"
							/>
							<ContactInputMessage
								component="textarea"
								placeholder="Message *"
								name="message"
								rows={10}
							/>
							<ErrorMessageStyled
								name="message"
								component="div"
							/>
							<RecaptchaContainer>
								<ReCAPTCHA
									hl="en"
									theme="dark"
									ref={refCaptcha}
									sitekey={process.env.REACT_APP_CAPTCHA_KEY}
								/>
							</RecaptchaContainer>
							<ContactButton
								type="submit"
								disabled={formikProps.isSubmitting}
							>
								{formikProps.isSubmitting ? (
									<SubmittingMessage>
										<Oval
											visible={true}
											height="25"
											width="25"
											color={theme.text_primary}
											secondaryColor={theme.bg}
											ariaLabel="oval-loading"
											strokeWidth={5}
											wrapperStyle={{}}
											wrapperClass=""
										/>
										Submitting...
									</SubmittingMessage>
								) : (
									"Send"
								)}
							</ContactButton>
						</ContactForm>
					)}
				</Formik>
			</Wrapper>
		</Container>
	);
};

export default Contact;
