# Wizard Guide

This guide explains the wizard in `src/components/wizard` as it exists in this project. It is written as a demo companion: start with the data flow, then follow one click through the code.

## 1. Component Map

```text
App.jsx
  |
  | owns showWizard and opens the wizard
  v
Wizard.jsx
  |-- owns activeIndex, formValues, valid, showCancellation
  |-- defines steps and validation rules
  |-- provides WizardContext
  |
  |-- WizardHeader.jsx  (previous and cancel actions)
  |-- StepContent.jsx   (current step, Grommet Form, validation)
  |     |-- StepHeader.jsx
  |     |-- steps[activeIndex].inputs
  |             |-- StepOne.jsx
  |             |-- StepTwo.jsx
  |             |-- review JSX
  |
  |-- StepFooter.jsx    (Next or Finish submit button)
  |-- CancellationLayer.jsx (No, stay / Yes, exit)
```

The wizard uses one state owner. Child components do not create a second copy of the form state. They read the state or update it through `WizardContext`.

## 2. Opening The Wizard

`App.jsx` owns the visibility state:

```jsx
const [showWizard, setShowWizard] = useState(false);

<Button
  primary
  label="Launch Wizard"
  onClick={() => setShowWizard(true)}
/>

<Wizard showWizard={showWizard} setShowWizard={setShowWizard} />
```

When `showWizard` is `false`, `Wizard.jsx` returns `null`. When it is `true`, it renders a fullscreen Grommet `Layer`.

```jsx
if (!showWizard) return null;
```

The fullscreen layer is the modal boundary. Escape and outside clicks do not immediately discard data; they open the cancellation confirmation.

## 3. State Owned By `Wizard.jsx`

`Wizard.jsx` owns the state that controls the whole flow:

| State | Meaning |
| --- | --- |
| `activeIndex` | Zero-based current step index: `0`, `1`, or `2`. |
| `formValues` | All values collected across every step. |
| `valid` | Whether the current validation pass found no errors. |
| `showCancellation` | Whether the confirmation layer is visible. |
| `ref` | Reference used by `StepContent` for the scrollable content area. |

The initial data shape is defined once in `defaultFormValues`:

```js
const defaultFormValues = {
  firstName: "",
  lastName: "",
  email: "",
  radio: "",
  projectName: "",
  environment: "",
};
```

This shape is important. Every input name should correspond to a property in this object. When adding a field, add it to both the default object and the relevant step component.

## 4. Steps Are Data

The `steps` array is the wizard's configuration:

```jsx
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
    inputs: <ReviewContent />,
  },
];
```

The active step is selected by index:

```jsx
steps[activeIndex].inputs
```

This is why `activeIndex` is the central navigation value. Changing it changes the title, description, fields, and footer label at the same time.

The current steps are:

1. **Personal details**: first name, last name, email, and a radio choice.
2. **Project setup**: project name and environment.
3. **Review**: read-only summary of every stored value.

## 5. Sharing State Through Context

`WizardContext` is created in `WizardContext.jsx`:

```jsx
export const WizardContext = React.createContext({});
```

`Wizard.jsx` creates the provider value and wraps the wizard children:

```jsx
<WizardContext.Provider value={wizardContextValue}>
  ...wizard components...
</WizardContext.Provider>
```

The provider shares both values and state setters:

```js
const wizardContextValue = {
  activeIndex,
  activeStep: activeIndex + 1,
  formValues,
  setFormValues,
  setActiveIndex,
  setValid,
  steps,
  validateStep,
  resetWizard,
  id: "my-wizard",
  ref,
  width: { width: "large", max: "large" },
};
```

A consumer reads only what it needs:

```jsx
const { activeIndex, steps, setActiveIndex } = useContext(WizardContext);
```

This avoids prop drilling. For example, `WizardHeader` does not receive `activeIndex` as a prop. It reads it from context and can move back with `setActiveIndex(activeIndex - 1)`.

## 6. How A Field Value Travels

Use `firstName` as the example:

1. `StepOne.jsx` renders `<TextInput name="firstName" />`.
2. The input is inside the Grommet `<Form>` rendered by `StepContent.jsx`.
3. Grommet produces a new form value object when the input changes.
4. `StepContent` receives it in `onChange`.
5. `onChange={nextValue => setFormValues(nextValue)}` stores it in `Wizard.jsx` state.
6. React re-renders the provider with the updated `formValues`.
7. The review step reads that same state and displays the value.

The `name` attribute is the connection between a field and the matching `formValues` property. Missing or mismatched names are a common cause of values not being stored or validation messages not clearing.

## 7. How Next Works

The footer button is outside the `<Form>`, so it is linked to the form by matching IDs:

```jsx
<Form id={`${id}-form`}>

<Button
  form={`${id}-form`}
  type="submit"
/>
```

When the user clicks **Next**:

1. The browser submits the Grommet form.
2. Grommet runs field validation.
3. If the form is invalid, Grommet displays field errors and does not continue to the successful submit path.
4. `onValidate` focuses the first invalid field and updates `valid`.
5. If the form is valid, `StepContent.handleSubmit` receives the submitted value.
6. `validateStep(activeIndex, nextValues)` applies the wizard-level rule for the current step.
7. The submitted values are stored with `setFormValues(nextValues)`.
8. If this is not the last step, `setActiveIndex(activeIndex + 1)` displays the next step.

The two validation layers are intentional:

- **Grommet field validation** displays field-level errors and handles required fields.
- **`validateStep`** is the wizard-level guard that decides whether navigation is allowed.

The second check protects navigation even if a field-level rule is changed or a value comes from another source.

## 8. Validation Rules

The current wizard-level rules are in `Wizard.jsx`:

```js
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
```

### Step 1

Required:

- `firstName`
- `email`
- `radio`

Optional:

- `lastName`

### Step 2

Required:

- `projectName`
- `environment`

The `FormField` and its child input should both have compatible names:

```jsx
<FormField label="First name" name="firstName" required>
  <TextInput name="firstName" />
</FormField>
```

The `name` on `FormField` lets Grommet associate the message with the field. The `name` on the input lets the form store and validate the value.

## 9. Why Errors Clear

`StepContent.onValidate` receives the latest Grommet validation result. It collects both errors and informational messages:

```js
const errors = validationResults?.errors || {};
const infos = validationResults?.infos || {};
const names = [
  ...Object.keys(errors),
  ...Object.keys(infos),
];
```

If a field is invalid, the first matching input is focused. Then `valid` is updated based on whether `names` is empty.

The form has a step-specific React key:

```jsx
key={`${id}-form-${activeIndex}`}
```

That gives each step a fresh Grommet form instance while the parent `formValues` state survives. It prevents validation state from step 1 leaking into step 2.

When debugging a warning that does not disappear, check these items in order:

1. Does the input have a `name`?
2. Does the `FormField` have the same `name`?
3. Does that name exist in `defaultFormValues`?
4. Does `onChange` produce the expected property in `formValues`?
5. Does `onValidate` report the name under `errors` or `infos`?
6. Does `validateStep` return `true` for the current values?

## 10. Previous, Cancel, And Finish

### Previous

`WizardHeader` only renders Previous after the first step:

```jsx
{activeStep > 1 && (
  <Button onClick={() => setActiveIndex(activeIndex - 1)} />
)}
```

Going back does not erase values. The same `formValues` object is reused when the earlier step is rendered again.

### Cancel

The header calls `onCancel`, which sets `showCancellation` to `true`. The same confirmation is opened by Escape and outside clicks.

- **No, stay** closes only the confirmation layer.
- **Yes, exit** calls `resetWizard`.

`resetWizard` clears the form, returns to step 1, clears validity, and closes the wizard:

```js
const resetWizard = () => {
  setFormValues(defaultFormValues);
  setActiveIndex(0);
  setValid(false);
  setShowWizard(false);
};
```

### Finish

On the review step, the footer label becomes **Finish wizard**. A valid submit calls `handleSubmit`, which currently calls `resetWizard`. Replace that callback with an API request or success notification when the wizard is connected to a backend.

## 11. Debugging Demo

Set breakpoints in this order:

1. `StepOne.jsx`: confirm field names and input changes.
2. `StepContent.jsx` `onChange`: inspect the complete `nextValue` object.
3. `StepContent.jsx` `onValidate`: inspect `errors`, `infos`, and `names`.
4. `StepContent.jsx` `handleSubmit`: inspect `value`, `activeIndex`, and `isStepValid`.
5. `Wizard.jsx` `validateStep`: confirm the expected rule receives the expected data.
6. `WizardHeader.jsx`: inspect Previous navigation.
7. `Wizard.jsx` `resetWizard`: inspect cancellation and Finish behavior.

Useful temporary logs:

```js
console.log("form change", nextValue);
console.log("validation", { errors, infos, names });
console.log("submit", { activeIndex, nextValues, isStepValid });
```

Remove temporary logs after the demo.

## 12. Running The Correct Project

The Vite project is in `F:\vite\my-app`, not `F:\vite`.

```powershell
cd F:\vite\my-app
npm install
npm run dev
```

For a production check:

```powershell
cd F:\vite\my-app
npm run build
```

Running `npm run build` from `F:\vite` can fail because that directory is the workspace parent and does not contain this app's `package.json`.

## 13. Extension Pattern

To add another step:

1. Create `src/components/wizard/Steps/StepThree.jsx`.
2. Add its fields to `defaultFormValues`.
3. Give each `FormField` and input matching `name` values.
4. Add the component to the `steps` array.
5. Add its rule to `validateStep`.
6. Add its values to the review summary.
7. Keep the component free of duplicate form state; let `StepContent` and context own it.

That pattern keeps navigation, validation, persistence, and review synchronized.
