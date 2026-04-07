import {createBrowserRouter} from "react-router-dom";
import App from "../App";
import Home from "../markup/pages/public/Home";
import Login from "../markup/components/Login";
import Register from "../markup/components/RegisterPage";
import ProductCatalogPage from "../markup/pages/public/ProductCatalogPage";
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
        
              },
               {
            path: "/Product",
            element: <ProductCatalogPage/> ,
        
              }
      ]
       
 }

    ]);

  export default router;