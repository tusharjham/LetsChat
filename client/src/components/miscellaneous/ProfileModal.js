import { ViewIcon } from "@chakra-ui/icons";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <Button onClick={onOpen}>
          <i className="fa-solid fa-eye"></i>
        </Button>
      )}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        style={{ overflow: "none" }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader d={"flex"} justifyContent={"center"} fontSize={"2.5rem"}>
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Image
              boxSize={"250px"}
              borderRadius={"full"}
              src={user.pic}
              alt={user.name}
            />
            <Text fontSize={"22px"} mt={2}>
              <b>Email:</b>
              {user.email}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blackAlpha"
              bg={"grey"}
              mb={2}
              onClick={onClose}
              size={"md"}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
