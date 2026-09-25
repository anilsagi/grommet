import React, { useContext, useState } from "react";
import {
  Box,
  Button,
  FormField,
  Grid,
  Heading,
  Layer,
  ResponsiveContext,
  Select,
  Text,
  TextInput,
  ThemeContext,
} from "grommet";
import { Close, Moon, Sun } from "grommet-icons";
import { tokens } from "../../theme";
import "./ThemeDemo.css";

const colorSamples = [
  { name: "brand", purpose: "Primary actions and identity", text: "Brand action" },
  { name: "accent", purpose: "Emphasis and supporting actions", text: "Accent signal" },
  { name: "success", purpose: "Positive status", text: "Success" },
  { name: "warning", purpose: "Attention needed", text: "Warning" },
  { name: "error", purpose: "Errors and destructive states", text: "Error" },
  { name: "background", purpose: "Application canvas", text: "Background" },
  { name: "text-strong", purpose: "Primary readable content", text: "Readable text" },
];

const spacingSamples = ["xsmall", "small", "medium", "large", "xlarge"];
const spacingGaps = ["small", "medium", "large"];

const displayThemeValue = (value) => {
  if (typeof value === "string") return value;
  return value ? JSON.stringify(value) : "Not defined";
};

const DemoSection = ({ eyebrow, title, description, children }) => (
  <Box className="theme-demo__section" pad="large" gap="medium">
    <Box gap="xsmall">
      <Text size="small" color="brand" weight="bold">{eyebrow}</Text>
      <Heading level={2} margin="none" color="text-strong">{title}</Heading>
      <Text color="text-weak">{description}</Text>
    </Box>
    {children}
  </Box>
);

const ThemeOverview = () => (
  <DemoSection
    eyebrow="01 / FOUNDATION"
    title="Theme overview"
    description="Grommet resolves visual decisions from the theme down to each component."
  >
    <Box direction="row" align="center" gap="small" wrap>
      {["Grommet", "Theme", "Design tokens", "Global styles", "Component themes", "Components"].map((item, index) => (
        <React.Fragment key={item}>
          <Box background={index === 0 ? "brand" : "background"} pad={{ horizontal: "small", vertical: "xsmall" }} round="small">
            <Text color={index === 0 ? "white" : "text-strong"} weight="bold">{item}</Text>
          </Box>
          {index < 5 && <Text color="accent">-&gt;</Text>}
        </React.Fragment>
      ))}
    </Box>
  </DemoSection>
);

const ColorsDemo = () => (
  <DemoSection
    eyebrow="02 / COLORS"
    title="Colors"
    description="Named theme colors keep purpose consistent and automatically adapt to light or dark mode."
  >
    <Grid columns={{ count: "fit", size: "medium" }} gap="small">
      {colorSamples.map((sample) => (
        <Box key={sample.name} background={sample.name} className="theme-demo__swatch" pad="small" justify="between">
          <Text color={sample.name === "background" ? "text-strong" : "white"} weight="bold">{sample.name}</Text>
          <Text size="small" color={sample.name === "background" ? "text-weak" : "white"}>{sample.text}</Text>
          <Text size="small" color={sample.name === "background" ? "text-weak" : "white"}>{sample.purpose}</Text>
        </Box>
      ))}
    </Grid>
  </DemoSection>
);

const SpacingDemo = () => (
  <DemoSection
    eyebrow="03 / SPACING"
    title="Spacing scale"
    description="The same edge-size tokens power padding, margins, and layout gaps."
  >
    <Grid columns={{ count: "fit", size: "medium" }} gap="small">
      {spacingSamples.map((space) => (
        <Box key={space} background="background" pad={space} border={{ color: "brand" }}>
          <Box background="brand" pad="small" align="center">
            <Text color="white" weight="bold">pad={space}</Text>
          </Box>
          <Text size="small" margin={{ top: "small" }} color="text-weak">{tokens.spacing[space]}</Text>
        </Box>
      ))}
    </Grid>
    <Box gap="small">
      <Text weight="bold">Gap examples</Text>
      {spacingGaps.map((gap) => (
        <Box key={gap} direction="row" gap={gap} align="center">
          <Box background="accent" pad="small"><Text color="white">A</Text></Box>
          <Box background="brand" pad="small"><Text color="white">gap={gap}</Text></Box>
          <Box background="accent" pad="small"><Text color="white">B</Text></Box>
        </Box>
      ))}
    </Box>
  </DemoSection>
);

const TypographyDemo = () => (
  <DemoSection
    eyebrow="04 / TYPE"
    title="Typography"
    description="Heading levels, weights, size, family, and line height come from the theme."
  >
    <Box gap="small">
      <Heading level={1} margin="none" color="text-strong">Heading level 1</Heading>
      <Heading level={2} margin="none" color="text-strong">Heading level 2</Heading>
      <Heading level={3} margin="none" color="text-strong">Heading level 3</Heading>
      <Text>Normal body text uses the global font and line height.</Text>
      <Text size="small" color="text-weak">Small supporting text remains legible without competing with the heading.</Text>
      <Text weight="bold" color="brand">Strong text uses the shared emphasis style.</Text>
      <Text className="theme-demo__value">{tokens.typography.family}</Text>
    </Box>
  </DemoSection>
);

const BreakpointsDemo = () => {
  const size = useContext(ResponsiveContext);
  const columns = size === "small" || size === "xsmall" ? "100%" : { count: size === "medium" ? 2 : 3, size: "flex" };
  return (
    <DemoSection
      eyebrow="05 / RESPONSIVE"
      title="Responsive breakpoints"
      description="ResponsiveContext updates this layout as the viewport changes, without a reload."
    >
      <Box background="brand" pad="medium" round="small" gap="xsmall">
        <Text size="small" color="white">CURRENT BREAKPOINT</Text>
        <Heading level={2} margin="none" color="white">{size}</Heading>
      </Box>
      <Grid columns={columns} gap="small">
        {["Content column", "Control column", "Detail column"].map((label) => (
          <Box key={label} background="background" pad="medium" border={{ color: "border" }}>
            <Text weight="bold">{label}</Text>
            <Text size="small" color="text-weak">Reflows at the current breakpoint.</Text>
          </Box>
        ))}
      </Grid>
    </DemoSection>
  );
};

const ComponentThemeDemo = () => {
  const [value, setValue] = useState("");
  const [choice, setChoice] = useState("Designer");
  return (
    <DemoSection
      eyebrow="06 / COMPONENT THEMES"
      title="Consistent component overrides"
      description="These normal Grommet controls inherit radius, padding, focus, labels, and typography from the theme."
    >
      <Box direction="row" gap="small" wrap>
        <Button primary label="Primary button" onClick={() => alert("The themed primary button was clicked.")} />
        <Button label="Secondary button" onClick={() => alert("The themed secondary button was clicked.")} />
      </Box>
      <Grid columns={{ count: "fit", size: "medium" }} gap="medium">
        <FormField label="Themed text input">
          <TextInput
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Try: Design system notes"
          />
          <Text size="small" color="text-weak">Enter any text, such as “Design system notes”.</Text>
          <Box background="background" border={{ color: "brand" }} pad="small" gap="xxsmall">
            <Text size="small" color="text-weak">LIVE VALUE</Text>
            <Text weight="bold">{value || "Nothing entered yet"}</Text>
          </Box>
        </FormField>
        <FormField label="Themed select">
          <Select options={["Designer", "Developer", "Manager"]} value={choice} onChange={({ option }) => setChoice(option)} />
          <Text size="small" color="text-weak">Choose a role to see the themed dropdown state.</Text>
          <Box background="background" border={{ color: "accent" }} pad="small" gap="xxsmall">
            <Text size="small" color="text-weak">SELECTED ROLE</Text>
            <Text weight="bold">{choice}</Text>
          </Box>
        </FormField>
      </Grid>
    </DemoSection>
  );
};

const ThemeContextDemo = () => {
  const theme = useContext(ThemeContext);
  const colors = theme.global?.colors || {};
  return (
    <DemoSection
      eyebrow="07 / THEME CONTEXT"
      title="ThemeContext"
      description="This section reads the active theme through useContext(ThemeContext), rather than importing a theme object."
    >
      <Grid columns={{ count: "fit", size: "medium" }} gap="small">
        {[
          ["Mode", theme.dark ? "Dark" : "Light"],
          ["Brand color", colors.brand],
          ["Background", colors.background],
          ["Text color", colors["text-strong"]],
          ["Font family", theme.global?.font?.family],
        ].map(([label, value]) => (
          <Box key={label} className="theme-demo__token" background="background" pad="small" gap="xsmall">
            <Text size="small" color="text-weak">{label}</Text>
            <Text className="theme-demo__value" weight="bold">{displayThemeValue(value)}</Text>
          </Box>
        ))}
      </Grid>
    </DemoSection>
  );
};

const GlobalStylesDemo = () => {
  return (
    <DemoSection
      eyebrow="08 / GLOBAL STYLES"
      title="Global styles"
      description="Global colors, font, spacing, and focus settings create a shared baseline for every Grommet component."
    >
      <Box gap="medium">
        <Button primary label="Global primary action" onClick={() => alert("Global button styling is active.")} />
        <Text color="text-weak">The button inherits global colors, typography, spacing, and focus styling from the active Grommet theme.</Text>
      </Box>
    </DemoSection>
  );
};

const TokensDemo = () => (
  <DemoSection
    eyebrow="09 / REUSABLE TOKENS"
    title="Design tokens"
    description="The source values behind this demo live in one reusable token module."
  >
    <Grid columns={{ count: "fit", size: "medium" }} gap="small">
      {[
        ["Spacing", Object.entries(tokens.spacing).map(([key, value]) => `${key}: ${value}`).join(" | ")],
        ["Radius", Object.entries(tokens.radius).map(([key, value]) => `${key}: ${value}`).join(" | ")],
        ["Breakpoints", Object.entries(tokens.breakpoints).map(([key, value]) => `${key}: ${value}px`).join(" | ")],
      ].map(([label, value]) => (
        <Box key={label} background="background" pad="small" gap="xsmall">
          <Text weight="bold" color="brand">{label}</Text>
          <Text size="small" className="theme-demo__value">{value}</Text>
        </Box>
      ))}
    </Grid>
  </DemoSection>
);

const ThemeDemo = ({ isDark, onToggle, onClose }) => (
  <Layer full onEsc={onClose} responsive>
    <Box className="theme-demo" fill background="background" overflow="auto">
      <Box className="theme-demo__hero" pad={{ horizontal: "large", vertical: "medium" }} gap="large">
        <Box className="theme-demo__hero-top" direction="row" align="start" justify="between" gap="medium">
          <Box gap="xsmall">
            <Text size="small" color="white" weight="bold">GROMMET / THEME LAB</Text>
            <Heading level={1} margin="none" color="white">Theme &amp; styling</Heading>
            <Text>Explore the system behind a consistent Grommet interface.</Text>
          </Box>
          <Button className="theme-demo__close" icon={<Close />} onClick={onClose} a11yTitle="Close theme and styling demo" />
        </Box>
        <Box className="theme-demo__hero-controls" direction="row" align="center" justify="between" gap="medium" wrap>
          <Box direction="row" align="center" gap="small">
            {isDark ? <Moon color="white" /> : <Sun color="white" />}
            <Text color="white" weight="bold">Current theme: {isDark ? "Dark" : "Light"}</Text>
          </Box>
          <Button
            label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            onClick={onToggle}
            reverse
            color="white"
            icon={isDark ? <Sun /> : <Moon />}
          />
        </Box>
      </Box>
      <Box className="theme-demo__content" pad={{ horizontal: "large", vertical: "large" }} gap="large">
        <ThemeOverview />
        <ColorsDemo />
        <SpacingDemo />
        <TypographyDemo />
        <BreakpointsDemo />
        {/* Temporarily hidden for the demo walkthrough. */}
        {/* <ComponentThemeDemo /> */}
        <ThemeContextDemo />
        <GlobalStylesDemo />
        <TokensDemo />
      </Box>
    </Box>
  </Layer>
);

export default ThemeDemo;
