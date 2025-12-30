import React, { useState, useEffect } from "react";
import {
  Box,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableHead,
  FormControl,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Typography,
  TextField,
} from "@mui/material";
import "./additionalInfo.scss";
import TcVolume from "../../../../../services/VolumeService";
import { Country } from "../../../../../models/countryModel";
import TcCountry from "../../../../../services/countryService";
import {
  StyledDropdownModalInput,
  StyledTextFieldModal,
} from "../../groupPage/styledComponent";

interface AdditionalInfoProps {
  selectedGroupName?: string | null;
  userRequest: any;
  allPageData: any;
  dataChangeForadditionalInfo: (data1: any) => void;
  systemId: number;
}

interface Volume {
  volumeId: string;
  volumeName: string;
}

const AdditionalInfo = ({
  userRequest,
  allPageData,
  dataChangeForadditionalInfo,
  systemId,
}: AdditionalInfoProps) => {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [selectedVolumeName, setSelectedVolumeName] = useState<string | null>(
    allPageData?.volume.volumeName ?? null,
  );

  let uniqueOsUser = userRequest?.user2?.GID
    ? userRequest?.user2?.GID
    : userRequest?.user1?.GID;

  const [osUser, setOsUser] = useState(uniqueOsUser);
  const [countries, setCountries] = useState<Country[]>([]);
  const [neverLockerChecked, setNeverLockerChecked] = useState<boolean>(
    userRequest?.additionalInfo?.neverLockerChecked || false,
  );
  const [selectedCountry, setSelectedCountry] = useState<string | undefined>(
    userRequest?.additionalInfo?.selectedCountry,
  );
  const [groupList, setGroupList] = useState<string[]>([]);
  const [group, setGroup] = useState(allPageData?.defaultGroup);
  const [volumeIds, setVolumeIds] = useState(allPageData?.volume.volumeId);
  const [countryCode, setCountryCode] = useState(
    allPageData?.country.countryCode,
  );
  const [additionalInfoData, setAdditionalInfoData] = useState<any>({});

  const [licensingLevel, setLicensingLevel] = useState(
    allPageData?.requestLicensingLevel === undefined
      ? ""
      : allPageData?.requestLicensingLevel === 1 ||
          allPageData?.requestLicensingLevel === "Occasional_Author"
        ? 1
        : 0,
  );

  const [ipClearance, setIpClearance] = useState(allPageData?.ipClearance);

  useEffect(() => {
    fetchVolumes(systemId);
    fetchAllCountries();
  }, [systemId]);

  useEffect(() => {
    const country = countries.find(
      (item) => item.countryName === selectedCountry,
    );
    const countryId = country ? country.countryId : null;
    const countryCodes = country ? country.countryCode : null;
    setCountryCode(countryCodes);
    const selectedVolume = volumes.find(
      (item) => item.volumeName === selectedVolumeName,
    );

    const data = {
      selectedVolumeId: selectedVolumeName,
      selectedVolumeName: selectedVolumeName,
      osUser,
      selectedCountry,
      countryId,
      countryCode: countryCodes,
      groupList: group,
      ipClearance,
      licensingLevel,
      neverLockerChecked,
      volumeIds: volumeIds,
    };
    dataChangeForadditionalInfo(data);
    setAdditionalInfoData(data);
  }, [
    selectedVolumeName,
    osUser,
    ipClearance,
    selectedCountry,
    group,
    licensingLevel,
    neverLockerChecked,
    countryCode,
  ]);

  useEffect(() => {
    if (allPageData) {
      let selectData = userRequest?.user2?.GID
        ? userRequest?.user2?.GID
        : userRequest?.user1?.GID;

      setOsUser(selectData);
    }

    setSelectedVolumeName(allPageData?.volume.volumeName);
    if (userRequest.roleSelection.length > 0) {
      const defaultGroups: string[] = Array.from(
        new Set(
          userRequest.roleSelection.map((role: any) => role.groupNamePath),
        ),
      );
      setGroupList(defaultGroups);
    }

    const country = countries.find(
      (item) =>
        item.countryName === userRequest?.additionalInfo?.selectedCountry,
    );
    const countryCodes = country ? country.countryCode : null;
    setCountryCode(countryCodes);

    setSelectedCountry(userRequest?.additionalInfo?.selectedCountry);
  }, [allPageData]);
  const fetchVolumes = async (systemId: number) => {
    try {
      const response = await TcVolume.findVolumeById(systemId);
      setVolumes(response.data);
      response.data.map((item: any) => {
        if (item.volumeName === allPageData.volume.volumeName) {
          setSelectedVolumeName(item.volumeName);
          setVolumeIds(item.volumeId);
        }
      });
    } catch (error) {
      console.error("Error fetching volumes:", error);
    }
  };

  const fetchAllCountries = async () => {
    try {
      const response = await TcCountry.findAllCountres();
      setCountries(response.data);
      response.data.map((item: any) => {
        if (item.countryCode === allPageData.country.countryId) {
          setSelectedCountry(item.countryName);
        }
      });
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };
  const handleVolumeChange = (e: any) => {
    const volumeName = e.target.value as string;
    const selectedVolume: any = volumes.find(
      (volume: any) => volume.volumeName === volumeName,
    );

    const volumeId = selectedVolume ? selectedVolume?.volumeId : null;
    setSelectedVolumeName(volumeName);
    setVolumeIds(volumeId);
  };

  return (
    <Box className="additionalInfoContainer">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#006487" }}>
              <TableCell
                className="headerCell"
                colSpan={2}
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.75rem",
                  padding: "0.2rem 0.4rem",
                  marginBottom: "0.4rem",
                }}
              >
                Additional Information
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <Box className="contentContainer">
        {/* Left Side */}
        <Box className="leftContainer">
          <Box className="fieldContainer">
            <Typography className="fieldLabel" sx={{ fontSize: "0.75rem" }}>
              Volume <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl fullWidth>
              <StyledDropdownModalInput
                value={selectedVolumeName ?? ""}
                onChange={handleVolumeChange}
                sx={{ fontSize: "12px", padding: "10px", height: "30px" }}
              >
                {volumes.map((volume) => (
                  <MenuItem
                    key={volume.volumeId}
                    value={volume.volumeName}
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {volume.volumeName}
                  </MenuItem>
                ))}
              </StyledDropdownModalInput>
            </FormControl>
          </Box>
          <Box className="fieldContainer">
            <Typography className="fieldLabel" sx={{ fontSize: "0.75rem" }}>
              Default Group <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl fullWidth>
              <StyledDropdownModalInput
                value={group}
                onChange={(e) => setGroup(e.target.value as string)}
                sx={{ fontSize: "12px", padding: "10px", height: "30px" }}
              >
                {groupList.map((glist) => (
                  <MenuItem
                    key={glist}
                    value={glist}
                    sx={{ fontSize: "0.75rem" }}
                  >
                    {glist}
                  </MenuItem>
                ))}
              </StyledDropdownModalInput>
            </FormControl>
          </Box>
          <Box className="fieldContainer">
            <Typography className="fieldLabel">
              OS User <span className="required">*</span>
            </Typography>
            <FormControl fullWidth>
              <TextField
                sx={{
                  fontSize: "12px",
                  padding: "0px 0px 1px 00px",
                  height: "30px",
                  "& .MuiInputBase-input": {
                    fontSize: "12px",
                    padding: "0px 0px 1px 10px",
                    height: "30px",
                  },
                }}
                value={osUser}
                className="textfield-not-allowed"
              />
            </FormControl>
          </Box>

          <Box className="fieldContainer">
            <Typography className="fieldLabel" sx={{ fontSize: "0.75rem" }}>
              Licensing Level <span style={{ color: "red" }}>*</span>
            </Typography>
            <RadioGroup
              row
              value={licensingLevel}
              onChange={(e) => setLicensingLevel(Number(e.target.value))}
              sx={{
                fontSize: "0.75rem",
                gap: "0.5rem",
                alignItems: "center",
                marginBottom: "0.5rem",
              }}
            >
              <FormControlLabel
                value={0}
                control={
                  <Radio
                    sx={{
                      padding: "0.2rem",
                      color: "#006487",
                      "&.Mui-checked": {
                        color: "#004a63",
                      },
                      transform: "scale(0.8)",
                    }}
                  />
                }
                label="Author"
                sx={{
                  fontSize: "0.75rem",
                  margin: "0",
                  color: "#333",
                  fontWeight: "bold",
                }}
              />
              <FormControlLabel
                value={1}
                control={
                  <Radio
                    sx={{
                      padding: "0.2rem",
                      color: "#006487",
                      "&.Mui-checked": {
                        color: "#004a63",
                      },
                      transform: "scale(0.8)",
                    }}
                  />
                }
                label="Occasional Author"
                sx={{
                  fontSize: "0.75rem",
                  margin: "0",
                  color: "#333",
                  fontWeight: "bold",
                }}
              />
            </RadioGroup>
          </Box>
        </Box>
        {/* Right Side */}
        <Box className="rightContainer">
          <Box className="fieldContainer">
            <Typography className="fieldLabel" sx={{ fontSize: "0.75rem" }}>
              Country <span style={{ color: "red" }}>*</span>
            </Typography>
            <Box className="inputContainer">
              <FormControl fullWidth>
                <StyledDropdownModalInput
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value as string)}
                  sx={{ fontSize: "12px", padding: "10px", height: "30px" }}
                >
                  {countries.map((country) => (
                    <MenuItem
                      key={country.countryId}
                      value={String(country.countryName)}
                      sx={{ fontSize: "0.75rem" }}
                    >
                      {country.countryName}
                    </MenuItem>
                  ))}
                </StyledDropdownModalInput>
              </FormControl>
            </Box>
          </Box>
          <Box className="fieldContainer">
            <Typography className="fieldLabel" sx={{ fontSize: "0.75rem" }}>
              IP Clearance <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl fullWidth>
              <StyledDropdownModalInput
                value={ipClearance}
                onChange={(e) => setIpClearance(e.target.value as string)}
                sx={{ fontSize: "12px", padding: "10px", height: "30px" }}
              >
                <MenuItem value="Restricted" sx={{ fontSize: "0.75rem" }}>
                  Restricted
                </MenuItem>
                <MenuItem value="Unrestricted" sx={{ fontSize: "0.75rem" }}>
                  Unrestricted
                </MenuItem>
                <MenuItem value="Confidential" sx={{ fontSize: "0.75rem" }}>
                  Confidential
                </MenuItem>
              </StyledDropdownModalInput>
            </FormControl>
          </Box>
          <Box
            className="fieldContainer"
            sx={{
              display: "flex",
              alignItems: "center",
              marginTop: "1rem",
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={neverLockerChecked}
                  onChange={(e) => setNeverLockerChecked(e.target.checked)}
                  sx={{
                    transform: "scale(0.75)",
                    padding: "0.2rem",
                  }}
                />
              }
              label={
                <Typography className="fieldLabel" sx={{ fontSize: "0.75rem" }}>
                  Never lock
                </Typography>
              }
              sx={{
                marginLeft: "0",
                marginRight: "auto",
              }}
              labelPlacement="start"
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdditionalInfo;
