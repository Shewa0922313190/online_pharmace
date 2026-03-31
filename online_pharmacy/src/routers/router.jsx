import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../markup/pages/public/Home";
import Login from "../markup/components/Login";
import Register from "../markup/components/RegisterPage";

const router = createBrowserRouter([
 {
      path: "/",
      element: <App/>,
      children: [
 
             {
            path: "/",
            element: <Home/>,
        
              },
             {
            path: "/login",
            element: <Login/>,
        
              },
             {
            path: "/register",
            element: <Register/>,
        
              }
      ]
       
 }

    ]);

  export default router;