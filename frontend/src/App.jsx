import { Route, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Favourites from "./pages/Favourites";
import { UserRecipe } from "./pages/UserRecipe";
import UserProtectedWrapper from "./components/UserProtectedWrapper";
import Alert from "./components/Alert";
import { hideToast } from "./store/toastSlice";

const App = () => {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.toast);
  const [latestRecipe, setLatestRecipe] = useState(null);

  return (
    <div className="">
      <Navbar onRecipeAdded={setLatestRecipe} />
      {toast?.isOpen && (
        <Alert
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => dispatch(hideToast())}
        />
      )}
      <Routes>
        <Route path="/" element={<Home newRecipe={latestRecipe} />} />
        <Route
          path="/favourites"
          element={
            <UserProtectedWrapper>
              <Favourites />
            </UserProtectedWrapper>
          }
        />
        <Route
          path="/user-recipes"
          element={
            <UserProtectedWrapper>
              <UserRecipe />
            </UserProtectedWrapper>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
