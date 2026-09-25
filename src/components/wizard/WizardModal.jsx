import React, { useState } from "react";
import { Box, Button, Text } from "grommet";
import Wizard from "./Wizard";

const WizardModal = ({ renderTrigger }) => {
	const [showWizard, setShowWizard] = useState(false);
	const [reviewedData, setReviewedData] = useState(null);

	return (
		<>
			{renderTrigger ? renderTrigger(() => setShowWizard(true)) : (
				<Button
					primary
					label="Launch Wizard"
					onClick={() => setShowWizard(true)}
				/>
			)}

			{reviewedData && (
				<Box
					as="section"
					pad="medium"
					margin="medium"
					border={{ color: "brand", size: "small" }}
					align="start"
					gap="small"
				>
					<Text weight="bold" size="large">Completed wizard data</Text>
					<Text>First name: {reviewedData.firstName}</Text>
					<Text>Last name: {reviewedData.lastName || "Not provided"}</Text>
					<Text>Email: {reviewedData.email}</Text>
					<Text>Radio: {reviewedData.radio}</Text>
					<Text>Project name: {reviewedData.projectName}</Text>
					<Text>Environment: {reviewedData.environment}</Text>
				</Box>
			)}

			{showWizard && (
				<Wizard
					showWizard={showWizard}
					setShowWizard={setShowWizard}
					onComplete={setReviewedData}
				/>
			)}
		</>
	);
};

export default WizardModal;