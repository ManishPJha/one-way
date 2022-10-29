import React, { FC, createContext, useContext, useReducer } from "react";

const context: any = createContext("Default Value");

interface defaultProps {
  children: JSX.Element | JSX.Element[] | string | string[];
}

const initState = {
  loading: true,
  mode: "light",
  user: []
}

const reducer = (state= initState, action: any) => {
  switch (action.type) {
    case "loading":
      return { ...state, loading: action.payload };
    case "mode":
      return { ...state, mode: action.payload };
    case "load_user":
      return { ...state, user: action.payload };
    default:
      return state;
  }
};

const AppProvider = (props: defaultProps) => {
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <context.Provider value={[state, dispatch]}>
      {props.children}
    </context.Provider>
  );
};

export default AppProvider;
export const useAppState = () => useContext(context);
