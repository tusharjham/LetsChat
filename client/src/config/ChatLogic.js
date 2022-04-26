export const getSender = (loggedUser, users) => {
  return loggedUser === users[0] ? loggedUser.name : users[1].name;
};

export const getSenderFull = (loggedUser, users) => {
  return loggedUser === users[0] ? loggedUser : users[1];
};
