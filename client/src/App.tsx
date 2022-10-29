import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Error from "./components/Error";
import ProtectedRoutes from "./ProtectedRoutes";
import Spinner from "./components/shared/Spinner";
import { useAppState } from "./components/shared/AppProvider";

import { loadUser } from "./redux/auth/action";
import SideMenu from "./components/SideMenu";

import "./App.css";
import Employees from "./components/Employee";
import Add from "./components/Employee/Add";

interface AuthProps {
  loading?: boolean;
  error?: any;
  auth?: any;
  user?: object;
  authenticated?: boolean;
}

function App() {
  const { loading, error, authenticated, user }: AuthProps = useSelector(
    (state: AuthProps) => state.auth
  );

  const [state, dispatch]: any = useAppState();

  const disPatch = useDispatch();

  useEffect(() => {
    if (user) {
      dispatch({ type: "load_user", payload: user });
    }
  }, [user]);

  // useEffect(() => {
  //   !authenticated && disPatch(loadUser());
  // }, []);

  return (
    <div className="App">
      {!loading ? (
        <>
          <Router>
            <SideMenu>
              <Routes>
                <Route path="/" element={<ProtectedRoutes isAdmin={false} />}>
                  <Route path="/home" element={<Dashboard />} />
                </Route>
                <Route
                  path="/admin"
                  element={<ProtectedRoutes isAdmin={true} />}
                >
                  <Route path="/admin/employees" element={<Employees />} />
                  <Route path="/admin/employees/add" element={<Add />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Error />} />
              </Routes>
            </SideMenu>
          </Router>
        </>
      ) : (
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
          className="one-spinner"
        />
      )}
    </div>
  );
}

export default App;
