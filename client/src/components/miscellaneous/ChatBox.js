import React from "react";
import { ChatState } from "../../Context/ChatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";
const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <Box
      d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      flexDir={"column"}
      alignItems={"center"}
      w={{ base: "100%", md: "60%", lg: "71%" }}
      bg={"whitesmoke"}
      height="100%"
      borderRadius={"lg"}
      borderWidth={"1px"}
      ml={1}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
