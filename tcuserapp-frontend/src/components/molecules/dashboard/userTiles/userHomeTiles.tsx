import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import CustomTile from "../../../atoms/common/tileComponent";
import { nestedRoutes } from "../../../../routes/izUserRoutes";

const UserHomeTiles = () => {
  const navigate = useNavigate();
  const handleTileClick = (to: string) => {
    navigate(`/home/${to}`, { replace: true });
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 1,
        padding: 0,
      }}
    >
      {nestedRoutes?.map((user, index) => (
        <CustomTile
          key={user?.to + index}
          name={user?.title}
          icon={user?.icon}
          onClick={() => handleTileClick(user?.to)}
        />
      ))}
    </Box>
  );
};

export default UserHomeTiles;
