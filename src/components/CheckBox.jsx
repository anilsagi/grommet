import React from "react";
import { grommet, CheckBox, Grommet, Text } from "grommet";


export const CheckBoxProto= ()=> {
  const [checked, setChecked] = React.useState(true);

  const checkboxClicked = (event) => {
    const newValue = event.target.checked;

    setChecked(newValue);
    alert(`Checkbox clicked: ${newValue}`);
  };

  return (
  <>
    <CheckBox
      checked={checked}
      label="Click me"
      onChange={(event) => setChecked(event.target.checked)}
      onClick={checkboxClicked}
    />
    <CheckBox
      label="Disabled"
      disabled = {true}
    />
    </>
  );
}