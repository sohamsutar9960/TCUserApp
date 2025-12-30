import { useState } from "react";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import { useNavigate } from "react-router-dom";
import CustomTile from "../../../../atoms/common/tileComponent";

const SiemensAdminTile = () => {
  const [tileTitle] = useState("Siemens Admin");
  const navigate = useNavigate();
  const handleTileClick = () => {
    navigate("siemensAdminTiles");
  };
  return (
    <CustomTile
      name={tileTitle}
      icon={<ManageAccountsIcon fontSize="large" />}
      onClick={handleTileClick}
    />
  );
};

export default SiemensAdminTile;
