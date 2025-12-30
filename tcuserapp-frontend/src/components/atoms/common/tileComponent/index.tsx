import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import Tile from "../interfaces";
import { IconButton } from "@mui/material";
import "./tileComponent.scss";

const CustomTile = (props: Tile) => {
  const { name, icon, onClick } = props;
  return (
    <Card
      className="tile"
      sx={{
        flex: "1 0 280px",
        maxWidth: 300,
        minHeight: 160,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: "8px",
      }}
      elevation={4}
      onClick={onClick}
    >
      <IconButton className="tileIcon">{icon}</IconButton>
      <Typography className="title" component="h6">
        {name}
      </Typography>
    </Card>
  );
};

export default CustomTile;
