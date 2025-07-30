import NavBar from "./components/NavBar";
import Connection from "./components/Connection";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Body from "./components/Body";
import Signup from "./components/Signup";
import { ToastContainer } from "react-toastify";
import { createBrowserRouter, Outlet } from "react-router-dom";


function App() {
  return (
    <>
      <NavBar/>
        <Outlet/>
      <Footer/>
     <ToastContainer/>
    </>
  );
}

const appRouter = createBrowserRouter([
    {
       path : "/",
       element : <App/>,
       children : [
          {
            path : "/",
            element : <Body/> 
          },
          {
            path : "/login",
            element : <Login/>
          },
          {
            path : "/signup",
            element : <Signup/>
          },
          {
            path : "/connection",
            element : <Connection/>
          }
       ]
    }
])

export default appRouter;
