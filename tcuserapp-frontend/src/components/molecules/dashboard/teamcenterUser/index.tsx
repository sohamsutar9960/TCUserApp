import React, { useState } from "react";
import { Box } from "@mui/material";
import { TcConfigResponse } from "../../../../models/tcConfigModel";
import TcUserCustomModal from "../../../atoms/common/modals/TcUserCustomModal";
import TeamCenterTable from "./TeamCenterTable"; // Assuming the table component is named TeamCenterTable

const TeamCenterUser: React.FC = () => {
  const [open, setOpen] = useState(true); // Initially true to open the modal on load
  const [showTable, setShowTable] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleProceed = () => {
    setOpen(false);
    setShowTable(true);
  };

  const handleAddNewItem = (tcConfigData: TcConfigResponse) => {
    // Logic to add new item
  };

  const handleEditItem = (editedItem: TcConfigResponse) => {
    // Logic to edit item
  };

  return (
    <Box>
      <TcUserCustomModal
        open={open}
        onClose={handleClose}
        operation="add"
        editItem={null}
        handleAddNewItem={handleAddNewItem}
        handleEditItem={handleEditItem}
        handleProceed={handleProceed}
      />
      {showTable && <TeamCenterTable />} {/* Conditionally render the table */}
    </Box>
  );
};

export default TeamCenterUser;
