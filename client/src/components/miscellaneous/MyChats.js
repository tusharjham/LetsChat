import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box, Button, Stack, Text, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import { getSender } from "../../config/ChatLogic";

const MyChats = () => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("api/chat/fetch-chat", config);
      setChats(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load the chats",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    }
  };
  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("user-info")));
    fetchChats();
  }, []);

  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir="column"
      w={{ base: "100%", md: "40%", lg: "28%" }}
      bg={"whitesmoke"}
      height="100%"
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        fontSize={{ base: "20px", md: "25px", lg: "25px" }}
        pt={3}
        pl={3}
        pr={2}
        w="100%"
        d="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        My Chats
        <Button d="flex">+ New Group Chat</Button>
      </Box>
      <Box
        d="flex"
        flexDir={"column"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        h={"100%"}
        w={"100%"}
        overflowY={"hidden"}
      >
        {chats ? (
          <Stack overflowY={"scroll"} mt={2}>
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "red.700" : "#f1f1ee"}
                color={selectedChat === chat ? "whiteAlpha.800" : "black"}
                px={3}
                py={2}
                borderRadius={"lg"}
                key={chat._id}
                fontFamily={"sans-serif"}
              >
                <Text>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
