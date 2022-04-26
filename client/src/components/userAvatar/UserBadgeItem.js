import { Badge, Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      colorScheme={"green"}
      fontSize={{ base: "14.5px", md: "16px" }}
      mb={1}
      mr={"2.3%"}
      position={"relative"}
      d="flex"
    >
      {user.name}
      <span
        onClick={handleFunction}
        className="userbadgeitem"
        style={{
          position: "absolute",
          top: "-35%",
          right: "-15%",
          cursor: "pointer",
          zIndex: "20",
        }}
      >
        <i className="fa-solid fa-circle-xmark"></i>
      </span>
    </Badge>
  );
};

export default UserBadgeItem;
