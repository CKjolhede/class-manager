import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
//import { useType } from "../contexts/TypeContext";
import Login from "./Login";
import Student from "./Student";
import Teacher from "./Teacher";
import Header from "./Header";

function App() {
  const { user, userType } = useAuth();
  //const { userType } = useType();
  console.log(user)
  return (
    <>
        <Header />
        { !user ? (
              <Login /> ):
          userType === "student" ? (
            <Student />
        ) :
          userType === "teacher" ? (
              <Teacher />
            )
      : null }
    </> );
}
export default App;
