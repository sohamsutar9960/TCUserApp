import { useState, useEffect } from "react";
import {
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Grid,
  Typography,
} from "@mui/material";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import UserSelectionHistory from "../../../../../services/useSelectionServices";
import "./requestType.scss";
import { StyledDropdownModalInput } from "../../groupPage/styledComponent";
import TcUserInventoryService from "../../../../../services/userInventoryService";
import RequestTypeUserActivationModal from "../../../../atoms/common/modals/RequestTypeUserActivationModal";

interface RequestTypeProps {
  handleNext: () => void;
  userRequest: any;
  dataChangeForRequestType: (requestData: any) => void;
  updateUserRequestStatus: (status: string) => void;
}

const RequestType = ({
  handleNext,
  userRequest,
  dataChangeForRequestType,
}: RequestTypeProps) => {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [reasonForRequest, setReasonForRequest] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedUser1, setSelectedUser1] = useState<string>("");
  const [reactivated, setReactivated] = useState(false);
  const [reactivated1, setReactivated1] = useState(false);
  const [userOptions, setUserOptions] = useState<
    {
      status: any;
      gid: string;
      value: string;
      label: string;
      tcAccountType: string;
      systemName: string;
      tcCreated: boolean;
      userHistoryId: string;
    }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isButtonBlinking, setIsButtonBlinking] = useState(false);
  const [userStatusMessage, setUserStatusMessage] = useState<string>("");
  const [tcUser, setTcUser] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (userRequest) {
      setReasonForRequest(userRequest.requestType1.reasonForRequest);
      setSelectedOption(userRequest.requestType1.selectedOption);
      setSelectedUser(userRequest.requestType1.selectedUser);
      setSelectedUser1(userRequest.requestType1.selectedUser1);
      handleUserChange(userRequest.requestType1.selectedUser as string);
      setUserStatusMessage(userRequest.requestType1.userStatusMessage);
    }
  }, []);

  useEffect(() => {
    if (reasonForRequest.trim()) {
      setIsButtonBlinking(true);
    } else {
      setIsButtonBlinking(false);
    }
  }, [reasonForRequest]);
  useEffect(() => {
    if (userOptions.length === 1) {
      // Auto-select the radio button if there's only one option
      setSelectedOption("Change_Existing_Account");
      // Auto-select the user if there's only one option
      setSelectedUser(userOptions[0].value);
      setUserStatusMessage(
        `Selected user is ${userOptions[0].tcAccountType}. This user is ${userOptions[0].status}`,
      );
      setStatusColor(userOptions[0].status === "active" ? "green" : "red");
    } else if (userOptions.length === 0) {
      // If no user options, select the default "New User Account" radio button
      setSelectedOption("New_User_Account");
      // Auto-select the "New User Account" radio button
      setSelectedUser("New_User_Account");
    }
  }, [userOptions]);

  useEffect(() => {
    if (userRequest) {
      let selectData =
        userRequest?.user2?.GID === undefined || userRequest?.user2?.GID === ""
          ? userRequest?.user1?.GID
          : userRequest?.user2?.GID;

      const systemName = userRequest?.system?.systemName || "";

      UserSelectionHistory.getUserHistoryByGidAndSystem(selectData, systemName)
        .then((response: { data: any }) => {
          const user = response.data;
          const users = [
            {
              gid: user[0]?.gid,
              value: user[0]?.tcUserId,
              label: user[0]?.tcUserId,
              status: user[0]?.userStatus,
              tcAccountType: user[0]?.tcAccountType,
              systemName: user[0]?.systemName,
              tcCreated: user[0]?.tcCreated,
              userHistoryId: user[0]?.userHistoryId,
            },
          ];
          setUserOptions(users);
          setReactivated(false);
          if (users.length > 1) {
            setTcUser(`Create New BU_Admin "${response?.data?.systemName}"`);
          } else {
            setTcUser("Normal User");
          }
        })
        .catch((error: any) => {
          if (error.response && error.response.status === 401) {
            setUserOptions([]);
            setTcUser("Normal User");
          } else {
          }
        });
    }
  }, [reactivated1]);

  useEffect(() => {
    var data = {
      selectedOption: selectedOption,
      selectedUser:
        selectedUser === ""
          ? userRequest.requestType1.selectedUser
          : selectedUser,
      selectedUser1: selectedUser1,
      reasonForRequest: reasonForRequest,
      userOptions: userOptions,
      userStatusMessage: userStatusMessage,
      tcCreated: userOptions[0]?.tcCreated,
    };
    dataChangeForRequestType(data);
  }, [
    selectedOption,
    selectedUser,
    selectedUser1,
    reasonForRequest,
    userOptions,
    userStatusMessage,
  ]);

  const handleNextForRequest = () => {
    if (!reasonForRequest.trim()) {
      setErrorMessage("Reason for request is required");
      return;
    }
    handleNext();
    const nextOption = selectedOption === "" ? "createNew" : selectedOption;
    setErrorMessage("");
  };

  const [statusColor, setStatusColor] = useState("");

  const handleUserChange = (value: string) => {
    setSelectedUser(value);
    const user = userOptions.find((option) => option.value === value);
    if (user) {
      setUserStatusMessage(
        `Selected user is ${user.tcAccountType}. This user is ${user.status}`,
      );
      setStatusColor(user.status === "active" ? "green" : "red");
    } else {
      setUserStatusMessage("");
      setStatusColor("");
    }
  };

  const radioOption = (e: any) => {
    setSelectedOption(e.target.value);
    setUserStatusMessage(
      `Selected user is ${userOptions[0].tcAccountType}. This user is ${userOptions[0].status}`,
    );
    setStatusColor(userOptions[0].status === "active" ? "green" : "red");
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
      setReactivated1(true);
      setIsPopupOpen(true);
    } catch (error) {
      console.error("Error fetching systems:", error);
    }
  };

  const systemId = userRequest.system.systemId;
  const userId = selectedUser;
  const status = 0;
  return (
    <>
      <TableContainer
        component={Paper}
        sx={{ margin: "auto", marginTop: "20px" }}
      >
        <Table>
          <TableHead>
            <TableRow
              className="tablerow"
              sx={{ backgroundColor: "#006487", height: "30px" }}
            >
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  padding: "4px",
                  fontSize: "0.9rem", // Reduced font size
                }}
                colSpan={2}
              >
                Create or Modify Account
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} style={{ textAlign: "left" }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={3}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        aria-label="option"
                        name="option"
                        value={selectedOption}
                        onChange={(e) => {
                          setSelectedOption(e.target.value);
                          if (userOptions.length === 1) {
                            // Auto-select the radio button if there's only one option
                            setSelectedOption("Change_Existing_Account");
                            // Auto-select the user if there's only one option
                            setSelectedUser(userOptions[0].value);
                            setUserStatusMessage(
                              `Selected user is ${userOptions[0].tcAccountType}. This user is ${userOptions[0].status}`,
                            );
                            setStatusColor(
                              userOptions[0].status === "active"
                                ? "green"
                                : "red",
                            );
                          } else if (userOptions.length === 0) {
                            // If no user options, select the default "New User Account" radio button
                            setSelectedOption("New_User_Account");
                            // Auto-select the "New User Account" radio button
                            setSelectedUser("New_User_Account");
                          }
                        }}
                      >
                        {userOptions.length === 0 ? (
                          <FormControlLabel
                            value={`New_User_Account`}
                            control={<Radio />}
                            label={
                              <span style={{ fontSize: "0.80rem" }}>
                                New User Account {userOptions[0]?.systemName}
                              </span>
                            }
                          />
                        ) : (
                          <>
                            {userOptions.length > 1 && (
                              <FormControlLabel
                                value="Change_Existing_Account"
                                control={<Radio />}
                                label={
                                  <span style={{ fontSize: "0.85rem" }}>
                                    Change Existing Account
                                  </span>
                                }
                              />
                            )}
                            {userOptions.length <= 1 && (
                              <>
                                {/* <FormControlLabel
                                    value={`Create New BU_Admin "${userOptions[0]?.systemName}"`}
                                    control={<Radio />}
                                    label={`Create New  ${userOptions[0]?.systemName}`}
                                  /> */}
                                <FormControlLabel
                                  value="Change_Existing_Account"
                                  control={<Radio />}
                                  label={
                                    <span style={{ fontSize: "0.85rem" }}>
                                      Change Existing Account
                                    </span>
                                  }
                                />
                              </>
                            )}
                          </>
                        )}
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  {selectedOption === "Change_Existing_Account" && (
                    <Grid item xs={3}>
                      <InputLabel
                        style={{
                          position: "relative",
                          marginBottom: "4px",
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "0.80rem", // Reduced font size
                        }}
                      >
                        Select User <span style={{ color: "red" }}> * </span>
                      </InputLabel>
                      <StyledDropdownModalInput
                        labelId="select-user-label"
                        id="select-user"
                        value={selectedUser}
                        onChange={(e) =>
                          handleUserChange(e.target.value as string)
                        }
                        sx={{
                          width: "80%", // Adjusted width to 60%
                          height: "1.5rem", // Adjusted height
                          padding: "0.25rem", // Reduced padding
                          fontSize: "12px",
                        }}
                      >
                        {userOptions.map((option) => (
                          <MenuItem
                            key={option.value}
                            value={option.value}
                            sx={{ fontSize: "0.80rem" }} // Reduced font size
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </StyledDropdownModalInput>

                      {userStatusMessage && (
                        <Typography sx={{ fontSize: "0.80rem" }}>
                          {userStatusMessage.split(" ").map((word, index) =>
                            word.toLowerCase() === "active" ||
                            word.toLowerCase() === "inactive" ? (
                              <span
                                key={index}
                                style={{
                                  color:
                                    word.toLowerCase() === "active"
                                      ? "green"
                                      : "red",
                                }}
                              >
                                {word}
                              </span>
                            ) : (
                              <span key={index}>{word} </span>
                            ),
                          )}
                        </Typography>
                      )}
                    </Grid>
                  )}
                  <Grid
                    item
                    xs={selectedOption === "Change_Existing_Account" ? 5 : 8}
                    sx={{ mt: 3 }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        marginBottom: "4px",
                        fontSize: "0.80rem", // Reduced font size
                        fontWeight: "bold",
                      }}
                    >
                      Reason for request (support for approvers)
                      <Typography component="span" color="error">
                        *
                      </Typography>
                    </Typography>
                    <TextField
                      multiline
                      rows={2}
                      fullWidth
                      variant="outlined"
                      placeholder="Enter reason for request"
                      value={reasonForRequest}
                      onChange={(e) => setReasonForRequest(e.target.value)}
                      error={!reasonForRequest.trim() && errorMessage !== ""}
                      helperText={
                        !reasonForRequest.trim() &&
                        errorMessage && (
                          <span style={{ fontSize: "12px" }}>
                            {errorMessage}
                          </span>
                        )
                      }
                      InputProps={{
                        style: { fontSize: "12px" }, // Set the font size here for the input
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container justifyContent="flex-end">
                      <Button
                        variant="contained"
                        onClick={handleNextForRequest}
                        className={isButtonBlinking ? "blinking-button" : ""}
                        sx={{
                          padding: "3px 8px",
                          fontSize: "0.7rem",
                          minWidth: "100px",
                          marginLeft: "25px",
                        }}
                        disabled={
                          !reasonForRequest.trim() ||
                          !selectedOption ||
                          ((selectedOption === "Change_Existing_Account" ||
                            selectedOption === "New_User_Account") &&
                            !selectedUser)
                        }
                      >
                        Next
                        <KeyboardDoubleArrowRightIcon fontSize="small" />
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <TableContainer
        component={Paper}
        sx={{
          margin: "auto",
          marginTop: "20px",
          display:
            userRequest?.user2?.FirstName &&
            userRequest.user2.FirstName.trim() !== ""
              ? "none"
              : "inline-flex",
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#006487", height: "30px" }}>
              <TableCell
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  cursor: "pointer",
                  padding: "4px",
                  fontSize: "0.9rem",
                }}
                colSpan={2}
              >
                Reactivate Account
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2} style={{ textAlign: "left" }}>
                <Grid container alignItems="center" spacing={1}>
                  <Grid item xs={3}>
                    <FormControl component="fieldset">
                      <RadioGroup
                        aria-label="option"
                        name="option"
                        value={selectedOption}
                        onChange={(e) => radioOption(e)}
                      >
                        <FormControlLabel
                          value="Reactivate"
                          control={<Radio />}
                          label={
                            <span style={{ fontSize: "0.85rem" }}>
                              Reactivate
                            </span>
                          }
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  {selectedOption === "Reactivate" && (
                    <Grid item xs={3}>
                      <InputLabel
                        style={{
                          position: "relative",
                          marginBottom: "4px",
                          fontWeight: "bold",
                          color: "black",
                          fontSize: "0.80rem",
                        }}
                      >
                        Select User <span style={{ color: "red" }}> * </span>
                      </InputLabel>
                      <StyledDropdownModalInput
                        labelId="select-user-label"
                        id="select-user"
                        value={selectedUser}
                        onChange={(e) =>
                          handleUserChange(e.target.value as string)
                        }
                        sx={{
                          width: "80%",
                          height: "1.5rem",
                          padding: "0.25rem",
                          fontSize: "12px",
                        }}
                      >
                        {userOptions.map((option) => (
                          <MenuItem
                            key={option.value}
                            value={option.value}
                            sx={{ fontSize: "12px" }}
                          >
                            {option.label}
                          </MenuItem>
                        ))}
                      </StyledDropdownModalInput>

                      {userStatusMessage && (
                        <Typography sx={{ fontSize: "0.80rem" }}>
                          {userStatusMessage.split(" ").map((word, index) =>
                            word.toLowerCase() === "active" ||
                            word.toLowerCase() === "inactive" ? (
                              <span
                                key={index}
                                style={{
                                  color:
                                    word.toLowerCase() === "active"
                                      ? "green"
                                      : "red",
                                }}
                              >
                                {word}
                              </span>
                            ) : (
                              <span key={index}>{word} </span>
                            ),
                          )}
                        </Typography>
                      )}
                    </Grid>
                  )}
                  {selectedUser && (
                    <Grid item xs={12}>
                      <Grid container justifyContent="flex-end">
                        <Button
                          variant="contained"
                          onClick={() =>
                            handleActionButton(systemId, userId, status)
                          }
                          className={isButtonBlinking ? "blinking-button" : ""}
                          sx={{
                            padding: "3px 12px",
                            fontSize: "0.7rem",
                            minWidth: "100px",
                            marginLeft: "25px",
                          }}
                          disabled={
                            userOptions[0]?.status === "active" ??
                            setReactivated(true)
                          }
                        >
                          Reactivate
                          <KeyboardDoubleArrowRightIcon fontSize="small" />
                        </Button>
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      <RequestTypeUserActivationModal
        isPopupOpen={isPopupOpen}
        handleClosePopup={handleClosePopup}
      />
    </>
  );
};

export default RequestType;
