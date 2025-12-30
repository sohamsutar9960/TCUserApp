import * as React from "react";
import {
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  SelectChangeEvent,
  Box,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import { useState, useEffect } from "react";
import TcService from "../../../../../services/UserService";
import Service from "../../../../../models/ServiceModel";
import { SystemResponse } from "../../systemPage";
import TcSystem from "../../../../../services/SystemService";
import { StyledDropdownModalInput } from "../../groupPage/styledComponent";

interface SystemSelectionProps {
  selectedSystem: string;
  selectedSystemName: string;
  setSelectedSystem: (value: string) => void;
  setSelectedSystemName: (value: any) => void;
  selectedService: string;
  setSelectedService: (value: string) => void;
  updateUserRequest: (
    data: Partial<{
      system: { systemId: number; systemName: any };
      service: { serviceId: number };
    }>,
  ) => void;
  dataChange: (value1: string, value2: string, value3: string) => void;
}

const SystemSelection = (props: SystemSelectionProps) => {
  const {
    selectedSystem,
    selectedSystemName,
    setSelectedSystem,
    setSelectedSystemName,
    selectedService,
    setSelectedService,
    updateUserRequest,
    dataChange,
  } = props;

  const [serviceData, setServiceData] = useState<Service[]>([]);
  const [systemData, setSystemData] = useState<SystemResponse[]>([]);
  const [validationMessage, setValidationMessage] = useState("");
  const [loading, setLoading] = useState<boolean>(true);

  const getServiceData = async () => {
    setLoading(true);
    try {
      const response = await TcService.findAllServices();
      if (response && response.data) {
        setServiceData(response.data);
        if (response.data.length > 0) {
          const firstService = response.data[0];
          setSelectedService(String(firstService.serviceId));
          getSystemsByServiceID(firstService.serviceId);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const getSystemsByServiceID = async (serviceId: number) => {
    setLoading(true);
    try {
      const response = await TcSystem.findSystemByID(serviceId);
      if (response && response.data) {
        setSystemData(response.data);
        if (response.data.length > 0) {
          setSelectedSystem(String(response.data[0].systemId));
          setSelectedSystemName(response.data[0].systemName);
          updateUserRequest({
            service: { serviceId },
            system: {
              systemId: response.data[0].systemId,
              systemName: response.data[0].systemName,
            },
          });
        } else {
          setSelectedSystem("");
          setSelectedSystemName("");
          setValidationMessage("Please select a system.");
        }
      }
    } catch (error) {
      console.error("Error fetching systems:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getServiceData();
  }, []);

  useEffect(() => {
    if (selectedService) {
      getSystemsByServiceID(Number(selectedService));
    }
  }, [selectedService]);

  useEffect(() => {
    dataChange(selectedService, selectedSystem, selectedSystemName);
  }, [selectedService, selectedSystem, selectedSystemName]);

  const handleInputSystemChange = (e: SelectChangeEvent<number>) => {
    const systemId =
      typeof e.target.value === "string"
        ? parseInt(e.target.value)
        : e.target.value;

    const selectedSystemObj = systemData.find(
      (system) => system.systemId === systemId,
    );

    const systemName = selectedSystemObj ? selectedSystemObj.systemName : "";

    setSelectedSystem(String(systemId));
    setSelectedSystemName(systemName);

    setValidationMessage("");

    updateUserRequest({
      system: { systemId, systemName },
    });
  };

  const handleInputServiceChange = (e: SelectChangeEvent<number>) => {
    const serviceId =
      typeof e.target.value === "string"
        ? parseInt(e.target.value)
        : e.target.value;

    setSelectedService(String(serviceId));
    setSelectedSystem("");
    getSystemsByServiceID(serviceId);
  };

  return (
    <TableContainer component={Paper} sx={{ margin: "auto" }}>
      <Table>
        <TableHead>
          <TableRow className="tablerow" sx={{ backgroundColor: "#006487" }}>
            <TableCell
              sx={{
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
                padding: "4px",
                fontSize: "14px",
              }}
              colSpan={2}
            >
              System Selection
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : (
            <TableRow>
              <TableCell style={{ width: "50%", padding: "10px" }}>
                <Box sx={{ padding: 1.5 }}>
                  <Typography
                    sx={{ fontSize: "12px", fontWeight: "bold", pb: 0.3 }}
                  >
                    Service <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <StyledDropdownModalInput
                    fullWidth
                    value={Number(selectedService)}
                    variant="outlined"
                    name="systemName"
                    //@ts-ignore
                    onChange={handleInputServiceChange}
                    sx={{ fontSize: "12px", padding: "10px", height: "30px" }}
                  >
                    {Array.isArray(serviceData) &&
                      serviceData.map((service) => (
                        <MenuItem
                          key={service.serviceId}
                          value={service.serviceId}
                          sx={{ fontSize: "12px" }}
                        >
                          {service.serviceName}
                        </MenuItem>
                      ))}
                  </StyledDropdownModalInput>
                </Box>
              </TableCell>
              <TableCell style={{ width: "50%", padding: "10px" }}>
                <Box sx={{ padding: 1.5 }}>
                  <Typography
                    sx={{ fontSize: "12px", fontWeight: "bold", pb: 0.3 }}
                  >
                    System <span style={{ color: "red" }}>*</span>
                  </Typography>
                  <StyledDropdownModalInput
                    fullWidth
                    value={Number(selectedSystem)}
                    variant="outlined"
                    name="systemName"
                    //@ts-ignore
                    onChange={handleInputSystemChange}
                    sx={{ fontSize: "12px", padding: "10px", height: "30px" }}
                  >
                    {Array.isArray(systemData) &&
                      systemData.map((system) => (
                        <MenuItem
                          key={system.systemId}
                          value={system.systemId}
                          sx={{ fontSize: "12px" }}
                        >
                          {system.systemName}
                        </MenuItem>
                      ))}
                  </StyledDropdownModalInput>
                  {validationMessage && (
                    <Typography
                      color="error"
                      variant="body2"
                      sx={{ fontSize: "12px" }}
                    >
                      {validationMessage}
                    </Typography>
                  )}
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SystemSelection;
