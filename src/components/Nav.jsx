import React from 'react';

import { Avatar, Anchor, Box, Header, Nav, Grommet, grommet } from 'grommet';
import grommetIcon from '../utilities/assets/grommetIcon.JPG';

const items = [
  { label: 'Vitest', href: 'https://vitest.dev/' },
  { label: 'Miragejs', href: 'https://miragejs.com/' },
  { label: 'MSW', href: 'https://mswjs.io/' },
  { label: 'REACT', href: 'https://react.dev/' },
];

const OnHeaderNav = () => (
  <Grommet theme={grommet}>
  <Header background="brand" pad="small" fill="horizontal">
    <Box direction="row" align="center" gap="small">
      <Avatar src={grommetIcon} />
      <Anchor color="white" href="https://v2.grommet.io/">
        Grommet
      </Anchor>
    </Box>
    <Nav full direction="row">
      {items.map((item) => (
        <Anchor
          href={item.href}
          label={item.label}
          color="white"
          key={item.label}
          target="_blank"
          rel="noreferrer"
        />
      ))}
    </Nav>
  </Header>
  </Grommet>
);

export const OnHeader = () => <OnHeaderNav />;
OnHeader.storyName = 'On Header';

export default {
  title: 'Controls/Nav/On Header',
};