import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const SignUp = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        title: "Fill all the fields",
        status: "warning",
        duration: 7000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Password doesn't match",
        status: "warning",
        duration: 7000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "/api/user-register",
        { name, email, password, pic },
        config
      );
      toast({
        title: "Account Created",
        status: "success",
        duration: 7000,
        isClosable: true,
        position: "top",
      });
      localStorage.setItem("user-info", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (err) {
      setLoading(false);
      toast({
        title: "Error",
        description: err.response.data.message,
        status: "error",
        duration: 7000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please upload your picture",
        status: "error",
        duration: 7000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    if (pics.type == "image/jpeg" || pics.type == "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dhldflba4");
      fetch("https://api.cloudinary.com/v1_1/dhldflba4/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          toast({
            title: err.toString(),
            status: "danger",
            duration: 7000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        });
    } else {
      toast({
        title: "Please select an Image",
        status: "warning",
        duration: 7000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };
  return (
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          placeholder="Enter your name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
          type="text"
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
          <InputRightElement w={"4.1rem"}>
            <Button bg={"transparent"} onClick={handleClick}>
              {show ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
          <InputRightElement w={"4.1rem"}>
            <Button bg={"transparent"} onClick={handleClick}>
              {show ? "hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl>
        <FormLabel>Upload your picture</FormLabel>
        <Input
          type={"file"}
          accept="image/*"
          p={1}
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        style={{ marginTop: 15, marginBottom: 15 }}
        bg="red.700"
        color="whiteAlpha.900"
        w="90%"
        colorScheme={"red"}
        isLoading={loading}
        onClick={submitHandler}
      >
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
