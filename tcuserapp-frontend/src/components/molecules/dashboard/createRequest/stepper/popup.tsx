import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  IconButton,
  Box,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import groupService from "../../../../../services/groupService";

interface PopupProps {
  onClose: () => void;
  systemIds: number;
  tcUsersIds: string;
  onSearchResult: (data: any[]) => void;
}

const Popup: React.FC<PopupProps> = ({
  onClose,
  systemIds,
  tcUsersIds,
  onSearchResult,
}) => {
  const [templateUser, setTemplateUser] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [searchData, setSearchData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchTemplateUser = async () => {
      try {
        setLoading(true);
        const response = await groupService.getTemplateUser(
          systemIds,
          tcUsersIds.toLowerCase(),
        );
        setSearchData(response.data);

        if (response.data.personName) {
          const personName = response.data.personName;
          setTemplateUser(personName);
        } else {
          setTemplateUser(null);
          setError("No data found");
        }
      } catch (error) {
        console.error("Failed to fetch template user:", error);
        setError("No data found");
      } finally {
        setLoading(false);
      }
    };

    fetchTemplateUser();
  }, [systemIds, tcUsersIds]);

  const sendData = () => {
    onSearchResult(searchData);
    onClose();
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      PaperProps={{
        style: {
          display: "flex",
          justifyContent: "center",
          minWidth: "30%",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      {!loading ? (
        <Box>
          <DialogTitle
            sx={{
              backgroundColor: "#006487",
              color: "white",
              display: "flex",
              alignItems: "center",
              fontSize: "1rem",
              position: "relative",
              padding: "8px",
              borderBottom: "1px solid #ddd",
            }}
          >
            {error ? "Error" : "Please Confirm Template User"}
            <IconButton
              aria-label="close"
              sx={{
                position: "absolute",
                right: "8px",
                top: "2px",
                color: "inherit",
              }}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography
              sx={{
                color: "#006487",
                padding: "2px 8px",
                borderRadius: "4px",
                fontFamily:
                  '"Segoe UI", "Selawik", "Open Sans", Arial, sans-serif',
                fontSize: "1rem",
                marginBottom: "16px",
              }}
            >
              {error ? <h3>No data found</h3> : <h3>{templateUser}</h3>}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ padding: "11px" }}>
            {error ? (
              <Button
                onClick={onClose}
                variant="contained"
                sx={{
                  backgroundColor: "#00a000",
                  color: "white",
                  textTransform: "none",
                  fontFamily:
                    '"Segoe UI", "Selawik", "Open Sans", Arial, sans-serif',
                  "&:hover": {
                    backgroundColor: "#008000",
                  },
                }}
              >
                OK
              </Button>
            ) : (
              <>
                <Button
                  onClick={onClose}
                  variant="contained"
                  sx={{
                    backgroundColor: "red",
                    color: "white",
                    textTransform: "none",
                    fontFamily:
                      '"Segoe UI", "Selawik", "Open Sans", Arial, sans-serif',
                    "&:hover": {
                      backgroundColor: "#cc0000",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={sendData}
                  variant="contained"
                  sx={{
                    backgroundColor: "#00a000",
                    color: "white",
                    textTransform: "none",
                    fontFamily:
                      '"Segoe UI", "Selawik", "Open Sans", Arial, sans-serif',
                    "&:hover": {
                      backgroundColor: "#008000",
                    },
                  }}
                >
                  Create Role
                </Button>
              </>
            )}
          </DialogActions>
        </Box>
      ) : (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
    </Dialog>
  );
};

export default Popup;
