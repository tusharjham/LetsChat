import { Box, Button, Text } from "@chakra-ui/react";
import React from "react";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  return (
    <>
      {selectedChat ? (
        <Text
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          pl={4}
          mt={"10px"}
          w="100%"
          fontFamily={"Work Sans"}
          d="flex"
          justifyContent={{ base: "space-between" }}
          alignItems="center"
        >
          <Button
            d={{ base: "flex", md: "none" }}
            onClick={() => setSelectedChat()}
            fontSize={"28px"}
          >
            <i className="fa-solid fa-circle-arrow-left"></i>
          </Button>
          {!selectedChat.isGroupChat ? (
            <>
              {getSender(user, selectedChat.users)}
              {<ProfileModal user={getSenderFull(user, selectedChat.users)} />}
            </>
          ) : (
            <>{selectedChat.chatName.toUpperCase()}</>
          )}
        </Text>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
