import React from "react";
import NestedMenuAppBar from "./Appbar";
import { Outlet } from "react-router-dom";

const HomePage = () => {
  return (
    <>
      <Outlet />
    </>
  );
};

export default HomePage;
