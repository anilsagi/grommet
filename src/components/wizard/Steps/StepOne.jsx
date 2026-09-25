import React from "react";
import {
  Box,
  FormField,
  TextInput,
  RadioButtonGroup,
  Grid,
} from "grommet";

const StepOne = () => {
  return (
    <Box>
      <Grid
        columns={["1fr", "1fr"]}
        gap="large"
      >
        {/* LEFT SIDE */}
        <Box gap="small">
          <FormField label="First name" name="firstName" required>
            <TextInput
              name="firstName"
              placeholder="Jane"
            />
          </FormField>

          <FormField label="Last name" name="lastName">
            <TextInput
              name="lastName"
              placeholder="Smith"
            />
          </FormField>

          <FormField label="Email" name="email" required>
            <TextInput
              name="email"
              placeholder="jane.smith@hpe.com"
            />
          </FormField>
        </Box>

        {/* RIGHT SIDE */}
        <Box>
          <FormField label="RadioButtonGroup" name="radio" required>
            <RadioButtonGroup
              name="radio"
              options={[
                "Radio button 1",
                "Radio button 2",
              ]}
            />
          </FormField>
        </Box>
      </Grid>
    </Box>
  );
};

export default StepOne;