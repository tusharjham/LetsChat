import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../userAvatar/UserListItem";
import { getSender } from "../../config/ChatLogic";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";

const SideDrawer = () => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const logout = () => {
    localStorage.removeItem("user-info");
    navigate("/");
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/all-users?search=${search}`,
        config
      );
      setSearchResult(data);
      setLoading(false);
    } catch {
      setLoading(false);
      toast({
        title: "Error",
        description: "Nothing found",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  const accessChat = async (userId) => {
    if (!search) {
      toast({
        title: "Please enter something in search",
        status: "warning",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/access-chat",
        { userId },
        config
      );
      if (!chats.find((c) => c._id === data._id)) {
        setChats([data, ...chats]);
      }
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (err) {
      setLoadingChat(false);
      toast({
        title: "Chat cannot be found",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-left",
      });
    }
  };

  return (
    <div>
      <Box
        w={"100%"}
        backgroundColor="red.700"
        d={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        p={"5px 10px 5px 10px"}
      >
        <Tooltip
          label="Search Users to Chat"
          hasArrow
          placement="bottom-end"
          bg={"black"}
        >
          <Button
            bg="red.700"
            color="whiteAlpha.900"
            colorScheme={"blackAlpha"}
            onClick={onOpen}
          >
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text
              d={{ base: "none", md: "flex" }}
              ml={{ base: "20px", md: "10px" }}
            >
              {" Search User"}
            </Text>
          </Button>
        </Tooltip>
        <Text
          fontSize={"2xl"}
          marginInlineStart={{ base: "5%", sm: "0" }}
          fontFamily="inherit"
          color="whiteAlpha.800"
          fontWeight={"bold"}
        >
          LET'S CHAT
        </Text>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Menu>
            <MenuButton fontSize={"20px"} p={1} mr={"10px"}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
                style={{ width: "120%", position: "absolute", left: "40%" }}
              />
              <i className="fa-solid fa-bell"></i>
            </MenuButton>
            <MenuList>
              {!notification.length && "No new Messages"}
              {notification?.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(
                      notification.filter((n) => n.chat._id !== notif.chat._id)
                    );
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New messages in ${notif.chat.chatName}`
                    : `New message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              as={Button}
              bg={"red.800"}
              colorScheme={"blackAlpha"}
              color={"whiteAlpha.900"}
            >
              <Avatar
                size={"sm"}
                mr={"5px"}
                cursor="pointer"
                name={user.name}
                src={user.pic}
                border={"2px solid black"}
              />
              <i
                className="fa-solid fa-chevron-down"
                style={{ marginTop: "25%" }}
              ></i>
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </ProfileModal>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton colorScheme={"blackAlpha"} mt={"2.8%"} />
          <DrawerHeader>Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" p={0}>
              <Input
                placeholder="Search User"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                mr={2}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            <Box mt={1}>
              {loading ? (
                <ChatLoading />
              ) : (
                searchResult.map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                  />
                ))
              )}
            </Box>
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default SideDrawer;
