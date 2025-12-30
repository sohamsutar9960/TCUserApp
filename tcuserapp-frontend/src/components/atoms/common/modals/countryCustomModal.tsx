import { Backdrop, Box, Button, Fade, Modal, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { Country } from "../../../../models/countryModel";
import {
  StyledClearIcon,
  StyledInnerModalBox,
  StyledTextFieldModal,
  StyledTypographyModal,
} from "../../../molecules/dashboard/groupPage/styledComponent";

interface Props {
  open: boolean;
  onClose: () => void;
  operation: string;
  handleAddNewItem: (countryData: Country) => void;
  handleEditItem: (editedItem: Country) => void;
  editItem: Country | null;
  handleDeleteItem: (serviceId: number | undefined) => void;
}

const CountryCustomModal = (props: Props) => {
  const {
    open,
    onClose,
    operation,
    handleAddNewItem,
    editItem,
    handleEditItem,
    handleDeleteItem,
  } = props;

  const [countryData, setCountryData] = useState<Country>({
    countryId: 0,
    countryCode: "",
    countryName: "",
  });
  const isSaveButtonDisabled =
    !countryData.countryCode || !countryData.countryName;
  const addClearInputField = (countryData: any) => {
    handleAddNewItem(countryData);
    setCountryData({
      countryId: 0,
      countryCode: "",
      countryName: "",
    });
  };

  useEffect(() => {
    if (editItem) {
      setCountryData({
        countryId: editItem.countryId ?? 0,
        countryCode: editItem.countryCode ?? "",
        countryName: editItem.countryName ?? "",
      });
    } else {
      setCountryData({
        countryId: 0,
        countryCode: "",
        countryName: "",
      });
    }
  }, [editItem]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCountryData({
      ...countryData,
      [name]: value,
    });
  };

  const handleCancel = () => {
    if (operation === "add") {
      setCountryData({
        countryId: 0,
        countryCode: "",
        countryName: "",
      });
    } else if (operation === "edit" && editItem) {
      setCountryData({
        countryId: editItem.countryId ?? 0,
        countryCode: editItem.countryCode ?? "",
        countryName: editItem.countryName ?? "",
      });
    } else if (operation === "delete" && editItem) {
      setCountryData({
        countryId: editItem.countryId ?? 0,
        countryCode: editItem.countryCode ?? "",
        countryName: editItem.countryName ?? "",
      });
    }
    onClose();
  };

  const handleSaveOrDelete = () => {
    if (operation === "add") {
      addClearInputField(countryData);
    } else if (operation === "edit" && editItem) {
      handleEditItem({ ...countryData });
    } else if (operation === "delete" && editItem) {
      handleDeleteItem(editItem.countryId);
    }
    onClose();
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: operation === "delete" ? 500 : 600,
    bgcolor: "background.paper",
    border: "none",
    boxShadow: 24,
    overflowY: "auto",
    overflowX: "hidden",
    maxHeight: "95vh",
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
              {operation === "add"
                ? "Add Country"
                : operation === "edit"
                  ? "Edit Country"
                  : "Confirmation"}
            </Typography>
            <StyledClearIcon onClick={handleCancel}>
              <ClearIcon />
            </StyledClearIcon>
          </Box>
          {operation === "delete" ? (
            <Box sx={{ padding: 2, pb: 3 }}>
              <Typography sx={{ fontSize: "15px", mb: 1 }}>
                Are you sure you want to delete this?
              </Typography>
            </Box>
          ) : (
            <>
              <StyledInnerModalBox sx={{ padding: 2 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", mb: 1 }}
                >
                  Country Code <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={countryData.countryCode}
                  variant="outlined"
                  type="text"
                  name="countryCode"
                  onChange={handleInputChange}
                />
              </StyledInnerModalBox>
              <StyledInnerModalBox sx={{ padding: 2 }}>
                <StyledTypographyModal
                  sx={{ fontSize: "15px", fontWeight: "bold", mb: 1 }}
                >
                  Country Name <span style={{ color: "red" }}>*</span>
                </StyledTypographyModal>
                <StyledTextFieldModal
                  fullWidth
                  value={countryData.countryName}
                  variant="outlined"
                  type="text"
                  name="countryName"
                  onChange={handleInputChange}
                />
              </StyledInnerModalBox>
            </>
          )}
          <Box
            sx={{
              backgroundColor: "#f5f7fa",
              p: 1.5,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              size="small"
              sx={{ mr: 1, color: "#2b7985", borderColor: "#2b7985" }}
              variant="outlined"
              onClick={handleCancel}
            >
              <ClearIcon fontSize="small" sx={{ pr: 0.5, color: "#2b7985" }} />
              Cancel
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{
                backgroundColor: "#2b7985",
                display: "flex",
                alignItems: "center",
              }}
              onClick={handleSaveOrDelete}
              disabled={isSaveButtonDisabled && operation !== "delete"}
            >
              {operation === "delete" ? (
                <DeleteIcon fontSize="small" sx={{ color: "white", pr: 0.5 }} />
              ) : (
                <DoneIcon fontSize="small" sx={{ color: "white", pr: 0.5 }} />
              )}
              {operation === "add"
                ? "Save"
                : operation === "edit"
                  ? "Save"
                  : "Ok"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default CountryCustomModal;
