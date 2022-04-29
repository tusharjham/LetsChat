import {
  Box,
  Button,
  FormControl,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import "./style.css";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/get-all-messages/${selectedChat._id}`,
        config
      );
      setMessage(data);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error",
        description: "Unable to load Chat messages",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };
  const sendMessage = async (e) => {
    if (e.code === "Enter" && newMessage) {
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/send-message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setNewMessage("");
        setMessage([...message, data]);
      } catch (err) {
        toast({
          title: "Error",
          description: err.response.message,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    }
  };
  const typeHandler = (e) => {
    setNewMessage(e.target.value);
  };
  useEffect(() => {
    fetchMessages();
  }, [selectedChat, fetchAgain]);
  return (
    <>
      {selectedChat ? (
        <>
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
                {
                  <ProfileModal
                    user={getSenderFull(user, selectedChat.users)}
                  />
                }
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            d={"flex"}
            flexDir={"column"}
            justifyContent={"flex-end"}
            p={3}
            bg={"#E8E8E8"}
            w={"100%"}
            h={"100%"}
            borderRadius={"lg"}
            overflowY={"scroll"}
          >
            {loading ? (
              <Spinner h={20} w={20} alignSelf={"center"} margin={"auto"} />
            ) : (
              <>
                <div className="messages">
                  <ScrollableChat message={message} />
                </div>
              </>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              <Input
                variant={"filled"}
                placeholder={"Enter a message"}
                onChange={typeHandler}
                focusBorderColor={"red.700"}
                bg={"#eaeaea"}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
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
