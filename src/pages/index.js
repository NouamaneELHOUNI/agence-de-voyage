import Login from "./auth/login/login";
import ForgetPassword from "./auth/forgetPassword/forgetPassword";
import Dashboard from "./dashboard/index";
import Setting from "./setting/setting";
import NotFound404 from "./error/404";
import Forbidden403 from "@/pages/error/403";
import ServerError500 from "@/pages/error/500";

// Client pages
import Clients from "./clients/clients";
import AddClient from "./clients/add";
import EditClient from "./clients/edit";
import ShowClient from "./clients/show";

// User pages
import Users from "./users/users";
import AddUser from "./users/add";
import EditUser from "./users/edit";
import ShowUser from "./users/show";

export {
  Login,
  ForgetPassword,
  Dashboard,
  Setting,
  NotFound404,
  Forbidden403,
  ServerError500,
  
  // Client pages
  Clients,
  AddClient,
  EditClient,
  ShowClient,
  
  // User pages
  Users,
  AddUser,
  EditUser,
  ShowUser
};
