import React from "react";
import {
  Anchor,
  Box,
  Button,
  Grid,
  Heading,
  Layer,
  Markdown,
  Paragraph,
  ResponsiveContext,
  Text,
} from "grommet";
import { Close, Launch } from "grommet-icons";

const PageHeading = ({ eyebrow, title, description }) => (
  <Box gap="xsmall">
    <Text size="small" color="brand" weight="bold">
      {eyebrow}
    </Text>
    <Heading level={2} margin="none">
      {title}
    </Heading>
    <Paragraph margin="none" color="dark-3">
      {description}
    </Paragraph>
  </Box>
);

const StatusLabel = ({ label, color, description }) => (
  <Box
    background="light-1"
    border={{ color: "light-4" }}
    pad="small"
    gap="xsmall"
    round="small"
  >
    <Box direction="row" align="center" gap="small" wrap>
      <Box background={color} pad={{ horizontal: "small", vertical: "xsmall" }} round="xsmall">
        <Text color="white" size="small" weight="bold">
          {label}
        </Text>
      </Box>
      <Text weight="bold">Reusable status label</Text>
    </Box>
    <Text size="small" color="dark-3">
      {description}
    </Text>
  </Box>
);

const TypographyContent = ({ onClose }) => (
  <Layer full onEsc={onClose} onClickOutside={onClose} responsive>
    <Box fill background="background" overflow="auto">
      <Box
        width={{ max: "xlarge" }}
        fill="horizontal"
        alignSelf="center"
        pad={{ horizontal: "large", vertical: "medium" }}
        gap="large"
        flex={{ grow: 0, shrink: 0 }}
      >
        <Box direction="row" justify="between" align="start" gap="medium">
          <Box gap="xsmall">
            <Text size="small" color="brand" weight="bold">
              GROMMET COMPONENTS
            </Text>
            <Heading level={1} margin="none">
              Typography &amp; content
            </Heading>
            <Paragraph margin="none" color="dark-3">
              A practical type system for readable interfaces, clear status, and content that adapts to every screen.
            </Paragraph>
          </Box>
          <Button
            icon={<Close />}
            onClick={onClose}
            a11yTitle="Close typography and content demo"
          />
        </Box>

        <Box background="light-1" pad="medium" gap="medium" round="small">
          <PageHeading
            eyebrow="01 / PROJECT TYPOGRAPHY"
            title="Recreate project typography"
            description="Use a small set of deliberate type roles so hierarchy stays consistent across the product."
          />
          <Box gap="small">
            <Heading level={3} margin="none">A clear page title</Heading>
            <Heading level={4} margin="none">A useful section heading</Heading>
            <Text size="large" weight="bold">A strong lead sets the context.</Text>
            <Text color="dark-3">Body copy should be comfortable to scan, with enough line height for longer reading.</Text>
            <Text size="small" color="dark-3">Supporting text carries metadata without taking over the page.</Text>
          </Box>
        </Box>

        <Box background="light-1" pad="medium" gap="medium" round="small">
          <PageHeading
            eyebrow="02 / REUSABLE HEADINGS"
            title="Build reusable page headings"
            description="The same heading pattern can introduce a settings view, a dashboard section, or a focused workflow."
          />
          <Grid columns={{ count: "fit", size: "medium" }} gap="medium">
            {["Account settings", "Project activity", "Release notes"].map((title, index) => (
              <Box key={title} background="background" border={{ color: "light-4" }} pad="medium" gap="xsmall">
                <Text size="small" color="brand" weight="bold">0{index + 1} / VIEW</Text>
                <Heading level={3} margin="none">{title}</Heading>
                <Text size="small" color="dark-3">A repeatable heading block keeps the next action obvious.</Text>
              </Box>
            ))}
          </Grid>
        </Box>

        <Box background="light-1" pad="medium" gap="medium" round="small">
          <PageHeading
            eyebrow="03 / STATUS PATTERNS"
            title="Create status and label patterns"
            description="Short labels make state visible at a glance while the supporting sentence explains what to do next."
          />
          <Grid columns={{ count: "fit", size: "medium" }} gap="small">
            <StatusLabel label="READY" color="status-ok" description="Everything is prepared for the next step." />
            <StatusLabel label="REVIEW" color="status-warning" description="A teammate should check this before publishing." />
            <StatusLabel label="BLOCKED" color="status-critical" description="Resolve the outstanding issue to continue." />
          </Grid>
        </Box>

        <Box background="light-1" pad="medium" gap="medium" round="small">
          <PageHeading
            eyebrow="04 / LONG-FORM CONTENT"
            title="Handle responsive, long-form content"
            description="Paragraphs and Markdown can carry real product guidance while the layout remains readable on narrow screens."
          />
          <ResponsiveContext.Consumer>
            {(size) => (
              <Grid columns={size === "small" || size === "xsmall" ? "100%" : ["1fr", "1fr"]} gap="large">
                <Box gap="small">
                  <Heading level={3} margin="none">Writing with room to breathe</Heading>
                  <Paragraph margin="none">
                    Good content gives readers a clear route through a complex idea. Start with the outcome, group related details, and use short paragraphs so the eye can find its place again. On smaller screens, this column becomes a single readable stream instead of squeezing two ideas side by side.
                  </Paragraph>
                  <Anchor href="https://v2.grommet.io/paragraph" target="_blank" rel="noreferrer" label="Read the Paragraph docs" icon={<Launch />} />
                </Box>
                <Box background="background" pad="medium" gap="small" border={{ color: "light-4" }}>
                  <Text weight="bold">Markdown preview</Text>
                  <Markdown>
                    {`### Release checklist\n\n- Confirm the owner\n- Review the **status label**\n- Share the [launch notes](https://v2.grommet.io/markdown)\n\n> Keep guidance close to the decision it supports.`}
                  </Markdown>
                </Box>
              </Grid>
            )}
          </ResponsiveContext.Consumer>
        </Box>
      </Box>
    </Box>
  </Layer>
);

export default TypographyContent;
