import { grommet, Box, Grommet, Text } from "grommet";

export const BoxProto = ()=>
    <Box
        direction="row"
        border={{ color: 'brand', size: 'large' }}
        pad="medium"
    >
        <Box pad="small" align="center" a11yTitle="box small" background="dark-3" />
        <Box pad="medium" background="light-3" />
        <Box pad="medium" background="light-3" />

    </Box>
    

