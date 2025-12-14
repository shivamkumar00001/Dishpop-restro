import { useEffect, useState } from "react";
import AdminLogin from "./pages/AdminLogin";
import RestaurantList from "./pages/RestaurantList";
import RestaurantMenu from "./pages/RestaurantMenu";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  // RENAMED: now stores restaurant USERNAME
  const [selectedRestaurantUsername, setSelectedRestaurantUsername] = useState(null);

  useEffect(() => {
    setLoggedIn(Boolean(localStorage.getItem("adminToken")));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLoggedIn(false);
    setSelectedRestaurantUsername(null);
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2500}
        closeOnClick
        pauseOnHover
        theme="dark"
        newestOnTop
      />

      {!loggedIn ? (
        <AdminLogin onLogin={() => setLoggedIn(true)} />
      ) : selectedRestaurantUsername ? (
        <RestaurantMenu
          username={selectedRestaurantUsername}   // FIXED
          onBack={() => setSelectedRestaurantUsername(null)}
          onLogout={handleLogout}
        />
      ) : (
        <RestaurantList
          onSelectRestaurant={setSelectedRestaurantUsername} // FIXED
          onLogout={handleLogout}
        />
      )}
    </>
  );
}
