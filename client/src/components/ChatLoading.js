import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

const ChatLoading = () => {
  return (
    <div>
      <Stack mt={4}>
        <Skeleton height={"30px"} />
        <Skeleton height={"30px"} />
        <Skeleton height={"30px"} />
        <Skeleton height={"30px"} />
        <Skeleton height={"30px"} />
      </Stack>
    </div>
  );
};

export default ChatLoading;
