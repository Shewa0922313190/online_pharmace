import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './markup/components/Header';
import Login from './markup/components/Login';
import RegisterPage from './markup/components/RegisterPage';
import Footer from './markup/components/Footer';

function App() {
 

  return (
       <>
         
        <Header />
        <main >
          <Outlet />
        </main>
        <Footer />
     
    </> )
}

export default App
