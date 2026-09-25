import React from "react";
import { Box, FormField, Select, TextInput } from "grommet";

const StepTwo = () => (
  <Box gap="medium">
    <FormField label="Project name" name="projectName" required>
      <TextInput
        name="projectName"
        placeholder="My project"
        validate={{
          regexp: /^\S.*$/,
          message: "Enter a project name.",
        }}
      />
    </FormField>

    <FormField label="Environment" name="environment" required>
      <Select
        name="environment"
        options={["Development", "Staging", "Production"]}
        placeholder="Select an environment"
      />
    </FormField>
  </Box>
);

export default StepTwo;
