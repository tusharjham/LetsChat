export const getSender = (loggedUser, users) => {
  return loggedUser === users[0] ? loggedUser.name : users[1].name;
};
