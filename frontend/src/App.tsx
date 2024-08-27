import { useEffect } from "react";
import Aos from "aos";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";

const App = () => {
  useEffect(() => {
    Aos.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <Routes>
      <Route path="/" Component={Homepage} />
    </Routes>
  );
};

export default App;
