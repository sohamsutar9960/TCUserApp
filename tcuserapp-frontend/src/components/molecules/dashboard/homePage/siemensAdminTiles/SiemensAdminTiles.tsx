import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CustomTile from "../../../../atoms/common/tileComponent";
import { nestedRoutes } from "../../../../../routes/izAdminRoutes";

const SiemensAdminTiles = () => {
  const navigate = useNavigate();

  const handleTileClick = (to: string) => {
    navigate(`/home/siemensAdminTiles/${to}`, { replace: true });
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
      {nestedRoutes?.map((admin, index) => (
        <CustomTile
          key={admin?.to + index}
          name={admin?.title}
          icon={admin?.icon}
          onClick={() => handleTileClick(admin?.to)}
        />
      ))}
    </Box>
  );
};

export default SiemensAdminTiles;
