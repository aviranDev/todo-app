import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import userService from "./services/userService";
import TodoList from "./components/TodoList";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import Logout from "./components/Logout";
import ProtectedRoute from "./lib/protectedRoute";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(userService.getCurrentUser());
  }, []);
  console.log(user);
  return (
    <div className="App">
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<TodoList user={user} />} />
          {user && <Route path="/signup" element={<Navigate to="/" />} />}
          {user && <Route path="/signin" element={<Navigate to="/" />} />}
        </Route>

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;
