import { useState } from "react";
import {
  Anchor,
  Avatar,
  Box,
  Button,
  Grid,
  Heading,
  Image,
  Layer,
  Paragraph,
  ResponsiveContext,
  Text,
} from "grommet";
import {
  Add,
  Bookmark,
  Close,
  Edit,
  Favorite,
  FormRefresh,
  FormNext,
  Home,
  More,
  Share,
  Trash,
  UserSettings,
} from "grommet-icons";
import previewImage from "../assets/hero.png";

const iconSamples = [
  { label: "Home", IconComponent: Home },
  { label: "Add", IconComponent: Add },
  { label: "Bookmark", IconComponent: Bookmark },
  { label: "Favorite", IconComponent: Favorite },
  { label: "Share", IconComponent: Share },
];

const SectionHeading = ({ number, title, description }) => (
  <Box gap="xsmall">
    <Text size="small" color="brand" weight="bold">
      {number}
    </Text>
    <Heading level={2} margin="none">
      {title}
    </Heading>
    <Paragraph margin="none" color="dark-3">
      {description}
    </Paragraph>
  </Box>
);

const Iconsimages = ({ onClose }) => {
  const [selectedIcon, setSelectedIcon] = useState("Add");
  const [imageOpen, setImageOpen] = useState(false);

  return (
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
                Iconsimages
              </Heading>
              <Paragraph margin="none" color="dark-3">
                Combine meaningful icons, clear labels, profile context, and image previews without crowding the interface.
              </Paragraph>
            </Box>
            <Button
              icon={<Close />}
              onClick={onClose}
              a11yTitle="Close icons and images demo"
            />
          </Box>

          <Box background="light-1" pad="medium" gap="medium" round="small">
            <SectionHeading
              number="01 / ICON-BASED ACTION TOOLBAR"
              title="Keep actions easy to scan"
              description="Icon-only buttons are useful for compact toolbars when each action has a clear accessible title."
            />
            <Box direction="row" align="center" gap="small" wrap>
              <Button icon={<Add />} a11yTitle="Add item" onClick={() => setSelectedIcon("Add")} />
              <Button icon={<Edit />} a11yTitle="Edit item" onClick={() => setSelectedIcon("Edit")} />
              <Button icon={<Bookmark />} a11yTitle="Bookmark item" onClick={() => setSelectedIcon("Bookmark")} />
              <Button icon={<More />} a11yTitle="More actions" onClick={() => setSelectedIcon("More")} />
              <Text color="dark-3">Selected action: {selectedIcon}</Text>
            </Box>
          </Box>

          <Box background="light-1" pad="medium" gap="medium" round="small">
            <SectionHeading
              number="02 / ICONS COLLECTION"
              title="Use a consistent icon language"
              description="Each Grommet icon receives the same size, color, and accessible title so the collection stays visually consistent."
            />
            <Grid columns={{ count: "fit", size: "small" }} gap="small">
              {iconSamples.map(({ label, IconComponent }) => (
                <Box key={label} background="background" border={{ color: "light-4" }} pad="medium" gap="small" align="center">
                  <IconComponent size="large" color="brand" a11yTitle={`${label} icon`} />
                  <Text weight="bold">{label}</Text>
                </Box>
              ))}
              <Box background="background" border={{ color: "light-4" }} pad="medium" gap="small" align="center">
                <FormRefresh color="plain" size="xlarge" />
                <Text weight="bold">FormRefresh plain xlarge</Text>
              </Box>
              <Box background="background" border={{ color: "light-4" }} pad="medium" gap="small" align="center">
                <FormRefresh size="large" />
                <Text weight="bold">FormRefresh large</Text>
              </Box>
              <Box background="background" border={{ color: "light-4" }} pad="medium" gap="small" align="center">
                <FormRefresh color="brand" />
                <Text weight="bold">FormRefresh brand</Text>
              </Box>
              <Box background="background" border={{ color: "light-4" }} pad="medium" gap="small" align="center">
                <FormRefresh />
                <Text weight="bold">FormRefresh default</Text>
              </Box>
            </Grid>
          </Box>

          <ResponsiveContext.Consumer>
            {(size) => (
              <Grid columns={size === "small" || size === "xsmall" ? "100%" : ["1fr", "1fr"]} gap="large">
                <Box background="light-1" pad="medium" gap="medium" round="small">
                  <SectionHeading
                    number="03 / USER AVATAR"
                    title="Build a profile component"
                    description="Avatar gives identity a compact visual anchor while text supplies the details."
                  />
                  <Box direction="row" align="center" gap="medium" wrap>
                    <Avatar size="large" background="brand" src={previewImage} />
                    <Box gap="xxsmall">
                      <Heading level={3} margin="none">Maya Chen</Heading>
                      <Text color="dark-3">Product designer</Text>
                      <Anchor href="https://v2.grommet.io/avatar" target="_blank" rel="noreferrer" label="View Avatar docs" icon={<UserSettings />} />
                    </Box>
                  </Box>
                </Box>

                <Box background="light-1" pad="medium" gap="medium" round="small">
                  <SectionHeading
                    number="04 / IMAGE PREVIEW"
                    title="Show a focused image preview"
                    description="Image keeps the preview contained and responsive, with a clear action to open the larger view."
                  />
                  <Box background="background" pad="small" gap="small">
                    <Image src={previewImage} fit="contain" aspect="3:2" alt="Abstract Vite project artwork" />
                    <Button label="Open image preview" icon={<FormNext />} onClick={() => setImageOpen(true)} />
                  </Box>
                </Box>
              </Grid>
            )}
          </ResponsiveContext.Consumer>

          <Box background="light-1" pad="medium" gap="medium" round="small">
            <SectionHeading
              number="05 / ICON + TEXT ACTIONS"
              title="Pair icons with explicit commands"
              description="Use an icon and text together when the action benefits from immediate recognition and a visible verb."
            />
            <Box direction="row" gap="small" wrap>
              <Button primary label="Share project" icon={<Share />} onClick={() => setSelectedIcon("Share project")} />
              <Button label="Save bookmark" icon={<Bookmark />} onClick={() => setSelectedIcon("Save bookmark")} />
              <Button color="status-critical" label="Delete draft" icon={<Trash />} onClick={() => setSelectedIcon("Delete draft")} />
            </Box>
            <Text size="small" color="dark-3">Last action: {selectedIcon}</Text>
          </Box>
        </Box>
      </Box>

      {imageOpen && (
        <Layer modal onEsc={() => setImageOpen(false)} onClickOutside={() => setImageOpen(false)}>
          <Box pad="medium" gap="small" width={{ max: "large" }}>
            <Box direction="row" justify="between" align="center">
              <Heading level={3} margin="none">Image preview</Heading>
              <Button icon={<Close />} a11yTitle="Close image preview" onClick={() => setImageOpen(false)} />
            </Box>
            <Image src={previewImage} fit="contain" alt="Abstract Vite project artwork, enlarged" />
          </Box>
        </Layer>
      )}
    </Layer>
  );
};

export default Iconsimages;
