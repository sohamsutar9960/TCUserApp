import React, { useState } from "react";
import { Backdrop, Box, CircularProgress } from "@mui/material";
import ActivateDeactivateCustomModal from "../../../../atoms/common/modals/ActivateDeactivateCustomModal";
import ActivateDeactivateTable from "./ActivateDeactivateTable";
import TcUserInventoryService from "../../../../../services/userInventoryService";

const ActivateDeactivateUser: React.FC = () => {
  const [open, setOpen] = useState(true); // Initially true to open the modal on load
  const [showTable, setShowTable] = useState(false);
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [systemId, setSystemId] = useState<number | null>(null);

  const handleClose = () => {
    setOpen(false);
    setSuccessMessage(null);
  };

  const handleProceed = async (systemId: number) => {
    setLoading(true);
    setSystemId(systemId);
    setOpen(false);

    try {
      const response =
        await TcUserInventoryService.getAllTcUserBySelect(systemId);
      setUserData(response?.data);
    } catch (error) {
      console.error("Error fetching User:", error);
    } finally {
      setLoading(false);
    }

    setShowTable(true);
  };

  const handleActionButton = async (
    systemId: number,
    UserId: string,
    status: number,
  ) => {
    try {
      await TcUserInventoryService.changeUserInventoryStatus(
        systemId,
        UserId,
        status,
      );
      handleProceed(systemId);
      {
        status === 0
          ? setSuccessMessage("User Activated Successfully")
          : setSuccessMessage("User Deactivated Successfully");
      }
    } catch (error) {
      console.error("Error fetching systems:", error);
    }
  };

  return (
    <Box>
      <ActivateDeactivateCustomModal
        open={open}
        onClose={handleClose}
        operation="add"
        handleProceed={handleProceed}
      />
      {loading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box>
          {showTable && systemId !== null && (
            <ActivateDeactivateTable
              onClose={handleClose}
              userData={userData}
              systemId={systemId}
              handleActionButton={handleActionButton}
              successMessage={successMessage}
            />
          )}
        </Box>
      )}
    </Box>
  );
};

export default ActivateDeactivateUser;
