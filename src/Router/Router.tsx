import { Route, Routes } from "react-router-dom";
import LoginPage from "../components/pages/LoginPage/LoginPage";
import RegisterPage from "../components/pages/RegisterPage/RegisterPage";
import PrivateRoute from "./PrivateRoute";
import UserTable from "../components/pages/UserPage/UserTable";
import UserPage from "../components/pages/UserPage/UserPage";
import authorities from "../config/Authorities";
import HomePage from "../components/pages/HomePage/HomePage";
import Profile from "../components/pages/ProfilePage/Profile";

/**
 * Router component renders a route switch with all available pages
 */

const Router = () => {
  //const { checkRole } = useContext(ActiveUserContext);

  /** navigate to different "home"-locations depending on Role the user have */

  return (
    <Routes>
      <Route path={"/"} element={<HomePage />} />
      <Route path={"/login"} element={<LoginPage />} />
      <Route path={"/register"} element={<RegisterPage />} />
      <Route path={"/profile"} element={<Profile />} />
      <Route path={"/user/profile/:userId"} element={<Profile />} />

      <Route
        path={"/users"}
        element={<PrivateRoute requiredAuths={[]} element={<UserTable />} />}
      />
      <Route
        path="/useredit"
        element={
          <PrivateRoute
            requiredAuths={[
              authorities.USER_DEACTIVATE,
              authorities.USER_CREATE,
            ]}
            element={<UserPage />}
          ></PrivateRoute>
        }
      />
      <Route
        path="/useredit/:userId"
        element={
          <PrivateRoute
            requiredAuths={[authorities.USER_MODIFY]}
            element={<UserPage />}
          ></PrivateRoute>
        }
      />

      <Route path="/unauthorized" element={<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#4A4343', color: '#fff', fontSize: '1.5rem'}}>Unauthorized Access - Admin Only</div>} />
      <Route path="*" element={<div>Not Found</div>} />
    </Routes>
  );
};

export default Router;
