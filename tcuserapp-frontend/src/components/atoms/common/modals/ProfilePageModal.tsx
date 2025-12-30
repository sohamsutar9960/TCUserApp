import {
  Backdrop,
  Box,
  Fade,
  Grid,
  IconButton,
  InputLabel,
  Modal,
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { useAuth } from "../../../auth/AuthProvider/authProvider";

interface Props {
  open: boolean;
  handleClose: () => void;
}

const ProfilePageModal = (props: Props) => {
  const { open, handleClose } = props;
  const { user } = useAuth();
  let firstName = "";
  let lastName = "";
  let gid = "";
  let country = "";
  let department = "";
  let roleName = "";

  if (user?.user) {
    ({ firstName, lastName, gid, country, department, roleName } = user.user);
  }

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box sx={style}>
          <Box
            sx={{
              backgroundColor: "#005f87",
              color: "white",
              p: 0.2,
              pl: 2,
              fontWeight: "bold",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography component="p" fontWeight="bold">
              My Account
            </Typography>
            <IconButton onClick={handleClose}>
              <ClearIcon sx={{ color: "white" }} />
            </IconButton>
          </Box>
          <Grid container spacing={3} p={3}>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ fontWeight: "bold", color: "#444" }}>
                First Name
              </InputLabel>
              <Typography sx={{ fontSize: "1rem", color: "#333" }}>
                {firstName ? firstName : "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ fontWeight: "bold", color: "#444" }}>
                Last Name
              </InputLabel>
              <Typography sx={{ fontSize: "1rem", color: "#333" }}>
                {lastName ? lastName : "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ fontWeight: "bold", color: "#444" }}>
                GID
              </InputLabel>
              <Typography sx={{ fontSize: "1rem", color: "#333" }}>
                {gid ? gid : "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ fontWeight: "bold", color: "#444" }}>
                Country
              </InputLabel>
              <Typography sx={{ fontSize: "1rem", color: "#333" }}>
                {country ? country : "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ fontWeight: "bold", color: "#444" }}>
                Department
              </InputLabel>
              <Typography sx={{ fontSize: "1rem", color: "#333" }}>
                {department ? department : "-"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <InputLabel sx={{ fontWeight: "bold", color: "#444" }}>
                User Role
              </InputLabel>
              <Typography sx={{ fontSize: "1rem", color: "#333" }}>
                {roleName ? roleName : "-"}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Fade>
    </Modal>
  );
};

export default ProfilePageModal;
