import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import PersonIcon from "@mui/icons-material/Person";
import WorkIcon from "@mui/icons-material/Work";
import SettingsIcon from "@mui/icons-material/Settings";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TopMenuItem from "./TopMenuItem";

const NestedMenuAppBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <TopMenuItem
          label="Master"
          icon={<PersonIcon />}
          subMenuItems={[{ label: "User" }, { label: "Project" }]}
        />
        <TopMenuItem
          label="Trancation"
          icon={<LocalMallIcon />}
          subMenuItems={[{ label: "Voucher" }, { label: "Sale" }]}
        />
        <TopMenuItem
          label="Setting"
          icon={<SettingsIcon />}
          subMenuItems={[{ label: "Config" }]}
        />
      </Toolbar>
    </AppBar>
  );
};


export default NestedMenuAppBar