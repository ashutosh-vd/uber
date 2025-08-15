import { Routes, Route } from "react-router-dom";

import CaptainHomePage from "./pages/CaptainHomePage.jsx"
import EntryPage from "./pages/EntryPage.jsx"
import UserHomePage from "./pages/UserHomePage.jsx"
import UserLoginPage from "./pages/UserLoginPage.jsx"
import UserSignUpPage from "./pages/UserSignUpPage.jsx"
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

function App() {
  return (
  <div>
    <Navbar />
    <Routes>
      <Route path='/' element={<EntryPage />} />
      <Route path='/signup' element={<UserSignUpPage />} />
      <Route path='/login' element={<UserLoginPage />} />
      <Route path='/captain' element={<CaptainHomePage />} />
      <Route path='/user' element={<UserHomePage />} />
    </Routes>
    <Footer />
  </div>
  )
}

export default App
