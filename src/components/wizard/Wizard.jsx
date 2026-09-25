import React, { useRef, useState } from "react";
import { Box, Grommet, Layer, Text, grommet } from "grommet";
import { deepMerge } from "grommet/utils";
import StepOne from "./Steps/StepOne";
import StepTwo from "./Steps/StepTwo";
import {
  CancellationLayer,
  StepContent,
  StepFooter,
  WizardContext,
  WizardHeader,
} from "./index";

const defaultFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  radio: "",
  projectName: "",
  environment: "",
};

const wizardTheme = deepMerge(grommet, {
  global: {
    focus: {
      border: {
        color: "focus",
      },
    },
  },
});

const Wizard = ({ showWizard, setShowWizard, onComplete }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [valid, setValid] = useState(false);
  const [showCancellation, setShowCancellation] = useState(false);
  const ref = useRef();

  const steps = [
    {
      title: "Personal details",
      description: "Tell us who this configuration belongs to.",
      inputs: <StepOne />,
    },
    {
      title: "Project setup",
      description: "Choose a project name and the environment to configure.",
      inputs: <StepTwo />,
    },
    {
      title: "Review",
      description: "Review your configuration before finishing the wizard.",
      inputs: (
        <Box gap="small">
          <Text>
            <strong>First name:</strong> {formValues.firstName}
          </Text>
          <Text>
            <strong>Last name:</strong> {formValues.lastName || "Not provided"}
          </Text>
          <Text>
            <strong>Email:</strong> {formValues.email}
          </Text>
          <Text>
            <strong>Radio:</strong> {formValues.radio}
          </Text>
          <Text>
            <strong>Project name:</strong> {formValues.projectName}
          </Text>
          <Text>
            <strong>Environment:</strong> {formValues.environment}
          </Text>
        </Box>
      ),
    },
  ];

  const validateStep = (stepIndex, values) => {
    if (stepIndex === 0) {
      return Boolean(
        values.firstName?.trim() && values.email?.trim() && values.radio,
      );
    }
    if (stepIndex === 1) {
      return Boolean(values.projectName?.trim() && values.environment);
    }
    return true;
  };

  const resetWizard = () => {
    setFormValues(defaultFormValues);
    setActiveIndex(0);
    setValid(false);
    setShowWizard(false);
  };

  const wizardContextValue = {
    activeIndex,
    activeStep: activeIndex + 1,
    defaultFormValues,
    formValues,
    id: "my-wizard",
    ref,
    resetWizard,
    setActiveIndex,
    setFormValues,
    setValid,
    steps,
    validateStep,
    valid,
    wizardTitle: "Wizard Title",
    width: { width: "large", max: "large" },
  };

  const handleSubmit = ({ value }) => {
    onComplete?.(value);
    resetWizard();
  };

  if (!showWizard) return null;

  return (
    <Grommet theme={wizardTheme} full>
      <Layer
        full
        onEsc={() => setShowCancellation(true)}
        onClickOutside={() => setShowCancellation(true)}
      >
        <WizardContext.Provider value={wizardContextValue}>
          <Box fill background="background" flex="grow">
            <WizardHeader
              onCancel={() => setShowCancellation(true)}
              titleId="wizard-title"
              cancelId="wizard-cancel"
              previousId="wizard-previous"
            />
            <StepContent onSubmit={handleSubmit} />
            <StepFooter nextId="wizard-next" />
          </Box>
          {showCancellation && (
            <CancellationLayer onSetOpen={setShowCancellation} />
          )}
        </WizardContext.Provider>
      </Layer>
    </Grommet>
  );
};

export default Wizard;
