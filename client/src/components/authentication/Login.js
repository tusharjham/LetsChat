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
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setShow(!show);
  };
  const guestUser = () => {
    setEmail("guest@guest.com");
    setPassword("1234");
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Fill all the fields",
        status: "warning",
        duration: 3300,
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
        "/api/user-login",
        { email, password },
        config
      );
      toast({
        title: "Login Succesful",
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setLoading(false);
      localStorage.setItem("user-info", JSON.stringify(data));
      navigate("/chats");
    } catch (err) {
      toast({
        title: "Error",
        description: err.toString(),
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  return (
    <VStack spacing={"5px"}>
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
      <Button
        style={{ marginTop: 20, marginBottom: 0 }}
        bg="red.700"
        color="whiteAlpha.900"
        w="90%"
        colorScheme={"red"}
        isLoading={loading}
        onClick={submitHandler}
      >
        Login
      </Button>
      <Button
        style={{ marginBottom: 15 }}
        color="whiteAlpha.900"
        w="90%"
        colorScheme={"blue"}
        onClick={guestUser}
      >
        Guest User Credentials
      </Button>
    </VStack>
  );
};

export default Login;
