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
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
import UserListItem from "../userAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();
  const toast = useToast();

  const handleDelete = async (user1) => {
    if (selectedChat.groupAdmin._id != user._id) {
      toast({
        title: "Note",
        description: "Only Admins can remove user",
        status: "warning",
        duration: 1000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (user1._id === user._id) {
      toast({
        title: "Note",
        description: "Try Leave Group",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "bottom",
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
      const { data } = await axios.put(
        "/api/chat/remove-from-group",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response.data,
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
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
  const handleAddUser = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        description: "Only Admins can add new members to the group",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        description: "User is already in the group",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.put(
        "/api/chat/add-to-group",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response.data,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
    }
  };
  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        description: "Enter New Group name to rename it",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.put(
        "/api/chat/rename-group",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response.data,
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setGroupChatName("");
      setRenameLoading(false);
    }
  };
  const leaveGroup = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/chat/remove-from-group",
        { chatId: selectedChat._id, userId: user._id },
        config
      );
      setSelectedChat();
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (err) {
      toast({
        title: "Error",
        description: err.response.data,
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "bottom",
      });
    }
    onClose();
  };

  return (
    <>
      <Button d={{ base: "flex" }} onClick={onOpen}>
        <i className="fa-solid fa-eye"></i>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            d={"flex"}
            justifyContent={"center"}
            fontSize={"30px"}
            fontFamily={"heading"}
          >
            {selectedChat.chatName.toUpperCase()}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box d={"flex"} flexDir={"row"} flexWrap={"wrap"}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleDelete(u)}
                />
              ))}
            </Box>
            <FormControl mt={2} d={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant={"solid"}
                onClick={handleRename}
                colorScheme={"teal"}
                isLoading={renameLoading}
                ml={1}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add Users to Group"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
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
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" mr={3} mt={2} onClick={leaveGroup}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
