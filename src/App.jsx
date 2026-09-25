import React, { lazy, Suspense, useRef, useState } from "react";

import {
  grommet,
  Accordion,
  AccordionPanel,
  Box,
  Button,
  Grommet,
  Nav,
  Text,
} from "grommet";

import { deepMerge } from "grommet/utils";
import {
  CircleInformation,
  Configure,
  DocumentImage,
  DocumentText,
  FormCalendar,
  FormRefresh,
  Launch,
  Menu,
  More,
  StatusGood,
  Table,
  TextAlignLeft,
  Analytics,
} from "grommet-icons";

import { BoxProto } from "./components/Box";
import { CheckBoxProto } from "@/components/CheckBox";
import Comments from "@/components/Comments";

import StepOne from "./components/wizard/Steps/StepOne";

import { WizardContext, WizardHeader, StepFooter } from "./components/wizard";
import WizardModal from "@/components/wizard/WizardModal";
import { OnHeader } from "@/components/Nav";
import ButtonsAndActions from "@/components/ButtonsAndActions";
import FeedbackStatus from "@/components/FeedbackStatus";
import DateDemo from "@/components/date/DateDemo";
import FormInputsDemo from "@/components/FormInputsDemo";
import Infinitescroll from "@/components/Infinitescroll";
import ThemeDemo from "@/components/theme/ThemeDemo";
import TypographyContent from "@/components/TypographyContent";
import Iconsimages from "@/components/Iconsimages";
import Datadisplay from "@/components/Datadisplay";
import SectionCards, { AssetsDemo } from "@/components/sectionCards";
import Overlay from "@/components/Overlay";
import { darkTheme, lightTheme } from "./theme";

const Charts = lazy(() => import("@/components/Charts"));

const publicFile = "/demo.txt";

const theme = deepMerge(lightTheme, {
  global: {
    colors: {
      "my-text-color": "",
      "another-color": "rgb(34, 139, 230)",
    },
  },
});

const ColorBox = (props) => (
  <Box
    direction="row"
    margin="small"
    round="small"
    pad="small"
    align="start"
    gap="small"
    {...props}
  />
);

const SidebarButton = ({ label, icon, onClick, collapsed }) => (
  <Button plain onClick={onClick} a11yTitle={`Open ${label}`}>
    {({ hover }) => (
      <Box
        background={hover ? "teal" : "brand"}
        pad={{ horizontal: "medium", vertical: "small" }}
        direction="row"
        align="center"
        gap="small"
        fill="horizontal"
      >
        <Box width="24px" align="center" justify="center" flex={{ shrink: 0 }}>
          {icon}
        </Box>

        {!collapsed && (
          <Text color="white" weight="bold" flex={{ grow: 1 }}>
            {label}
          </Text>
        )}
      </Box>
    )}
  </Button>
);

const App = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [themeOpen, setThemeOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const loadMessage = async () => {
    const module = await import("./utils/lazyMessage.js");
    setMessage(module.lazyMessage);
  };

  const handleThemeToggle = () => {
    const nextTheme = isDark ? "Light" : "Dark";
    console.log(`Theme switched to ${nextTheme} mode`);
    setIsDark((current) => !current);
  };

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    radio: "",
  });

  const [valid, setValid] = useState(false);
  const [open, setOpen] = useState(false);
  const [buttonsActionsOpen, setButtonsActionsOpen] = useState(false);
  const [feedbackStatusOpen, setFeedbackStatusOpen] = useState(false);
  const [typographyContentOpen, setTypographyContentOpen] = useState(false);
  const [iconsimagesOpen, setIconsimagesOpen] = useState(false);
  const [datadisplayOpen, setDatadisplayOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [chartsOpen, setChartsOpen] = useState(false);

  const ref = useRef();

  const steps = [
    {
      title: "Step 1 title",
      description:
        "Step one description. Keep each step simple and in chunks easy enough to fit on a single page.",
    },
    {
      title: "Step 2 title",
      description:
        "Step two description. Keep each step simple and in chunks easy enough to fit on a single page.",
    },
    {
      title: "Review",
      description: "Review your information before finishing.",
    },
  ];

  const wizardContextValue = {
    activeIndex,
    activeStep: activeIndex + 1,
    setActiveIndex,

    steps,

    wizardTitle: "Wizard Title",

    formValues,
    setFormValues,

    valid,
    setValid,

    id: "my-wizard",

    ref,

    width: {
      width: "large",
      max: "large",
    },
  };

  const handleSubmit = (event) => {
    event?.preventDefault();

    console.log("Wizard completed");
    console.log("Form values:", formValues);
  };

  return (
    <Grommet theme={isDark ? darkTheme : theme}>
      <OnHeader />

      <Box
        direction="row"
        align="start"
        fill="horizontal"
        gap="none"
        margin="none"
      >
        <Box
          background="brand"
          width={sidebarCollapsed ? "64px" : "280px"}
          pad={{ vertical: "small" }}
          flex={{ shrink: 0 }}
        >
          <Nav aria-label="Demo navigation" gap="xxsmall">
            <Box align="start" pad={{ horizontal: "small", bottom: "medium" }}>
              <Button
                plain
                fill="vertical"
                a11yTitle={
                  sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
                }
                onClick={() => setSidebarCollapsed((current) => !current)}
              >
                {({ hover }) => (
                  <Box
                    background={hover ? "teal" : "brand"}
                    border={{ color: "white", size: "xsmall" }}
                    round="full"
                    pad="xsmall"
                    align="center"
                    justify="center"
                  >
                    <Menu color="white" />
                  </Box>
                )}
              </Button>
            </Box>

            <SidebarButton
              collapsed={sidebarCollapsed}
              label="Themes"
              icon={<Configure color="white" />}
              onClick={() => setThemeOpen(true)}
            />

            <DateDemo
              renderTrigger={(onOpen) => (
                <SidebarButton
                  collapsed={sidebarCollapsed}
                  label="Launch date"
                  icon={<FormCalendar color="white" />}
                  onClick={onOpen}
                />
              )}
            />

            <FormInputsDemo
              renderTrigger={(onOpen) => (
                <SidebarButton
                  collapsed={sidebarCollapsed}
                  label="Form inputs"
                  icon={<DocumentText color="white" />}
                  onClick={onOpen}
                />
              )}
            />

            <Infinitescroll
              renderTrigger={(onOpen) => (
                <SidebarButton
                  collapsed={sidebarCollapsed}
                  label="Infinitescroll"
                  icon={<FormRefresh color="white" />}
                  onClick={onOpen}
                />
              )}
            />

            <SidebarButton
              collapsed={sidebarCollapsed}
              label="Buttons & Actions"
              icon={<More color="white" />}
              onClick={() => setButtonsActionsOpen(true)}
            />

            <SidebarButton
              collapsed={sidebarCollapsed}
              label="Feedback"
              icon={<StatusGood color="white" />}
              onClick={() => setFeedbackStatusOpen(true)}
            />

            <SidebarButton
              collapsed={sidebarCollapsed}
              label="Typography & Content"
              icon={<TextAlignLeft color="white" />}
              onClick={() => setTypographyContentOpen(true)}
            />

            <SidebarButton
              collapsed={sidebarCollapsed}
              label="Iconsimages"
              icon={<DocumentImage color="white" />}
              onClick={() => setIconsimagesOpen(true)}
            />

            <SidebarButton
              collapsed={sidebarCollapsed}
              label="Datadisplay"
              icon={<Table color="white" />}
              onClick={() => setDatadisplayOpen(true)}
            />

            <SidebarButton
              collapsed={sidebarCollapsed}
              label="Charts"
              icon={<Analytics color="white" />}
              onClick={() => setChartsOpen(true)}
            />

            <SidebarButton
              collapsed={sidebarCollapsed}
              label="Overlay"
              icon={<Launch color="white" />}
              onClick={() => setOverlayOpen(true)}
            />

            <WizardModal
              renderTrigger={(onOpen) => (
                <SidebarButton
                  collapsed={sidebarCollapsed}
                  label="Launch Wizard"
                  icon={<Launch color="white" />}
                  onClick={onOpen}
                />
              )}
            />
          </Nav>
        </Box>

        <Box
          flex
          margin="none"
          pad={{ vertical: "small", horizontal: "none" }}
          gap="medium"
        >
          {themeOpen && (
            <ThemeDemo
              isDark={isDark}
              onToggle={handleThemeToggle}
              onClose={() => setThemeOpen(false)}
            />
          )}

          <Box
            align="start"
            gap="small"
            pad="medium"
            background="light-2"
            fill="horizontal"
          >
            <Text weight="bold">Dynamic import demo</Text>

            <Button
              label="Load Message Dynamically"
              a11yTitle="Load the lazy message module"
              onClick={loadMessage}
              primary
            />

            {message && <Text color="status-ok">{message}</Text>}
          </Box>

          <SectionCards />
          <AssetsDemo />

          <Accordion multiple>
            <AccordionPanel label="Layout and box examples">
              <Box pad="medium">
                <BoxProto />
              </Box>
            </AccordionPanel>

            <AccordionPanel label="Checkbox examples">
              <Box pad="medium">
                <CheckBoxProto />
              </Box>
            </AccordionPanel>

            <AccordionPanel label="Comments data table">
              <Box pad="medium">
                <Comments />
              </Box>
            </AccordionPanel>
          </Accordion>

          {buttonsActionsOpen && (
            <ButtonsAndActions onClose={() => setButtonsActionsOpen(false)} />
          )}

          {feedbackStatusOpen && (
            <FeedbackStatus onClose={() => setFeedbackStatusOpen(false)} />
          )}

          {typographyContentOpen && (
            <TypographyContent
              onClose={() => setTypographyContentOpen(false)}
            />
          )}

          {iconsimagesOpen && (
            <Iconsimages onClose={() => setIconsimagesOpen(false)} />
          )}

          {datadisplayOpen && (
            <Datadisplay onClose={() => setDatadisplayOpen(false)} />
          )}

          {overlayOpen && (
            <Overlay onClose={() => setOverlayOpen(false)} />
          )}

          {chartsOpen && (
            <Suspense fallback={<Text>Loading charts...</Text>}>
              <Charts onClose={() => setChartsOpen(false)} />
            </Suspense>
          )}
        </Box>
      </Box>
    </Grommet>
  );
};

export default App;