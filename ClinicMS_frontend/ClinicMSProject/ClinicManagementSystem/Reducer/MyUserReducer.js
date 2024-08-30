const MyUserReducer = (currenState, action) => {
  switch (action.type) {
    case "login":
      return action.payload;
    case "logout":
      return null;
  }
  return currenState;
};
export default MyUserReducer;
