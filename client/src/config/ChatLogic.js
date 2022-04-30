export const getSender = (loggedUser, users) => {
  return loggedUser._id === users[0]._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  return loggedUser._id === users[0]._id ? users[1] : users[0];
};

// It is used to add other users avatar only before login user message
export const isSameSender = (message, m, i, userId) => {
  return (
    i < message.length - 1 &&
    (message[i + 1].sender._id !== m.sender._id ||
      message[i + 1].sender._id === undefined) &&
    message[i].sender._id !== userId
  );
};

// It is used to add other users avatar if he has last message in chat
export const isLastMessage = (message, i, userId) => {
  return (
    i === message.length - 1 &&
    message[message.length - 1].sender._id !== userId &&
    message[message.length - 1].sender._id
  );
};

export const isSameSenderMargin = (messages, m, i, userId) => {
  // This loop is used for margin of other user's message which doesn't show its avatar
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  // This loop is used for margin of other user's message which show its avatar
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  // This is for login user chat margin
  else return "auto";
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
