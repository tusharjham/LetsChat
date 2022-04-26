import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats, setSelectedChat } = ChatState();

  const handleSearch = async (query) => {
    if (!query) {
      return;
    }
    try {
      setSearch(query);
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
      setLoading(false);
      setSearchResult(data);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to load the search",
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const handleGroup = (userToAdd) => {
    var userID = selectedUsers?.map((x) => {
      return x._id;
    });

    if (userID?.includes(userToAdd._id)) {
      toast({
        description: "User is already in the list",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (user) => {
    var filtered = selectedUsers.filter((x) => {
      return user._id != x._id;
    });
    setSelectedUsers(filtered);
    console.log("deleted users", selectedUsers);
  };

  const closeButton = () => {
    setSelectedUsers([]);
    setSearchResult();
  };
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        description: "Please fill all fields",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/chat/create-group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setSelectedChat(data);
      onClose();
      toast({
        description: "Group Chat Created",
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    } catch (err) {
      console.log("front", err.response.data);
      toast({
        title: "Error",
        description: err.response.data,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    }
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            d="flex"
            justifyContent={"center"}
            fontSize={"33px"}
            fontFamily="inherit"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton onClick={closeButton} />
          <ModalBody d="flex" flexDir={"column"} alignItems="center">
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users eg: John, Piyush, Jane"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <div style={{ display: "flex", width: "100%", flexWrap: "wrap" }}>
              {selectedUsers?.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </div>
            {loading ? (
              <div>
                <Spinner color="red.600" emptyColor="black" />
              </div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
