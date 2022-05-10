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
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "../../animations/typing.json";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [message, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const toast = useToast();
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
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
      socket.emit("join chat", selectedChat._id);
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
      socket.emit("stop typing", selectedChat._id);

      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/send-message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        setMessage([...message, data]);
        socket.emit("new message", data);
        setFetchAgain(!fetchAgain);
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
  useEffect(() => {
    fetchMessages();
    setNewMessage("");
    selectedChatCompare = selectedChat;
  }, [selectedChat]);
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("istyping", (data) => {
      if (selectedChatCompare && selectedChatCompare._id === data) {
        setIsTyping(true);
      }
    });
    socket.on("stop typing", () => setIsTyping(false));
  }, []);
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      setFetchAgain(!fetchAgain);
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessage([...message, newMessageRecieved]);
      }
    });
  });
  const typeHandler = (e) => {
    setNewMessage(e.target.value);
    if (e.target.value.length === 0) {
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
      return;
    }
    if (!socketConnected) return;
    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      let latestTime = new Date().getTime();
      var timeDiff = latestTime - lastTypingTime;
      if (timeDiff >= timerLength) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

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
                  <ScrollableChat
                    message={message}
                    selChat={selectedChatCompare}
                  />
                </div>
              </>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping ? (
                <div>
                  <Lottie
                    options={defaultOptions}
                    width={"90px"}
                    style={{
                      marginBottom: 15,
                      marginLeft: 0,
                      height: "30px",
                      // width: "15%",
                    }}
                  />
                </div>
              ) : (
                <></>
              )}
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
