import { Avatar, Tooltip, Badge } from "@chakra-ui/react";
import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogic";
import { ChatState } from "../../Context/ChatProvider";
const ScrollableChat = ({ message, selChat }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {message &&
        message.map((m, i) => (
          <div
            style={{
              display: "flex",
              // flexDirection: "row",
              position: "relative",
              alignItems: "center",
            }}
            key={m._id}
          >
            {(isSameSender(message, m, i, user._id) ||
              isLastMessage(message, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#9b2c2c" : "blue"
                }`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                color: "whitesmoke",
                marginLeft: isSameSenderMargin(message, m, i, user._id),
                marginTop: isSameUser(message, m, i) ? 3 : 10,
              }}
            >
              {m.content}
            </span>
            <span>
              {m.sender._id !== user._id && selChat && selChat.isGroupChat && (
                <Badge
                  position={"absolute"}
                  top={"6px"}
                  borderRadius={"lg"}
                  fontSize={"11px"}
                >
                  {m.sender.name}
                </Badge>
              )}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
