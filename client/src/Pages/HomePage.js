import React from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
const HomePage = () => {
  return (
    <Container maxW={"xl"} boxSizing="border-box">
      <Box
        d="flex"
        justifyContent="center"
        bg="red.700"
        p={3}
        w="100%"
        m="30px 0px 15px 0"
        borderWidth="1px"
        borderRadius="lg"
        fontSize="5xl"
        fontFamily="Bebas Neue"
        color="whiteAlpha.800"
      >
        Let's Chat
      </Box>
      <Box w="100%" borderRadius="lg" borderWidth="1px" bg="white">
        <Tabs
          isFitted
          size="md"
          variant="enclosed"
          colorScheme="whiteAlpha.800"
        >
          <TabList>
            <Tab>Login</Tab>
            <Tab>SignUp</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default HomePage;
