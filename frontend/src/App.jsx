import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";


const App = () => {

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="">
      <Navbar setSearchTerm={setSearchTerm} />
      <Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </div>
  )
}

export default App
