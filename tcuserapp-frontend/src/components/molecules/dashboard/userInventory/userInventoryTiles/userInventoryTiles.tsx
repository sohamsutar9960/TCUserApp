import { Box } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";
import CustomTile from "../../../../atoms/common/tileComponent";
import { userInventoryNestedRoutes } from "../../../../../routes/izAdminRoutes";

const UserInventoryTiles = () => {
  const [isDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const handleTileClick = (to: string) => {
    navigate(`/home/siemensAdminTiles/userInventory/${to}`, { replace: true });
  };

  const tileFlexBasis = isDrawerOpen
    ? "1 0 calc(25% - 8px)"
    : "1 0 calc(33.33% - 4px)";

  return (
    <Box sx={{ display: "flex" }}>
      {userInventoryNestedRoutes.map((user, index) => (
        <CustomTile
          key={user.to + index}
          name={user.title}
          icon={user.icon}
          onClick={() => handleTileClick(user.to)}
          tileFlexBasis={tileFlexBasis}
        />
      ))}
    </Box>
  );
};

export default UserInventoryTiles;
