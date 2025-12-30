import * as React from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import PersonIcon from "@mui/icons-material/Person";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Button from "@mui/material/Button";
import { Box, CircularProgress } from "@mui/material";
import AdditionalInfo from "./stepper/additionalInfo";
import CostManager from "./stepper/costManager";
import RequestType from "./stepper/requestType";
import RoleSelection from "./stepper/roleSelection";
import SystemSelection from "./stepper/systemSelection";
import UserSelection from "./stepper/userSelection";
import SummarizeIcon from "@mui/icons-material/Summarize";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";
import SettingsIcon from "@mui/icons-material/Settings";
import Summary from "./stepper/summary";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import { RequestObject } from "../../../../models/stepperModel";
import DefaultWarningPopup from "./stepper/defaultWarningPopup";
import TcUserRequest from "../../../../services/createRequestService";
import { useNavigate } from "react-router";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(95deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage:
        "linear-gradient(95deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled("div")<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor:
    theme.palette.mode === "dark" ? theme.palette.grey[700] : "#ccc",
  zIndex: 1,
  color: "#fff",
  width: 50,
  height: 50,
  display: "flex",
  borderRadius: "50%",
  justifyContent: "center",
  alignItems: "center",
  ...(ownerState.active && {
    backgroundImage:
      "linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
    boxShadow: "0 4px 10px 0 rgba(0,0,0,.25)",
  }),
  ...(ownerState.completed && {
    backgroundImage:
      "linear-gradient(136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)",
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    0: <SettingsIcon />,
    1: <SettingsIcon />,
    2: <PersonIcon />,
    3: <AccountBalanceWalletOutlinedIcon />,
    4: <WorkOutlineIcon />,
    5: <PersonSearchIcon />,
    6: <InfoOutlinedIcon />,
    7: <SummarizeIcon />,
  };

  return (
    <ColorlibStepIconRoot
      ownerState={{ completed, active }}
      className={className}
    >
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = [
  "System Selection",
  "User Selection",
  "Request Type",
  "Cost Manager",
  "Role Selection",
  "Additional Info",
  "Summary",
];

export default function StepperComponent() {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedSystem, setSelectedSystem] = useState("");
  const [selectedSystemName, setSelectedSystemName] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [stateName, setStateName] = useState("");
  const [isAllFieldDone, setisAllFieldDone] = useState(false);
  const [systemId, setSystemId] = useState<number | null>(null);
  const [modiFied, setModified] = useState(false);
  const [warningOpen, setWarningOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [allPageData, setallPageData] = useState<RequestObject>({
    service: {
      serviceId: 0,
    },
    system: {
      systemId: 0,
      systemName: "",
    },
    userRequestSelf: {},
    userRequestForAnother: {
      DisplayName: null,
      gid: null,
    },
    commentsForApprover: "",
    userRequest_TypeOfRequest: "New_User_Account",
    userHistory: {
      neverLock: false,
      tcAccountType: "",
      gid: "",
      tcCreated: false,
    },
    accountDeactivate: null,
    costManagerSelf: {
      DisplayName: "",
      gid: "",
    },
    costManagerForAnother: {
      DisplayName: "",
      gid: "",
    },
    assignedRoles: [],
    volume: {
      volumeId: 0,
      volumeName: "",
    },
    country: {
      countryId: 0,
      countryCode: "",
    },
    defaultGroup: "",
    ipClearance: "",
    tcOSUserName: "",
    neverLock: false,
    requestLicensingLevel: "Author",
  });

  const getStateName = (stateName: string) => {
    setStateName(stateName);
  };

  const [userRequest, setUserRequest] = useState({
    system: { systemId: 0, systemName: "" },
    service: { serviceId: 0 },
    user: { userId: "" },
    user1: {},
    user2: {},
    gid: "",
    requestType: "",
    requestType1: {
      selectedOption: "",
      selectedUser: "",
      selectedUser1: "",
      reasonForRequest: "",
      userOptions: "",
      userStatusMessage: "",
    },
    costManager: {},
    costManager1: {},
    costManager2: {},
    roleSelection: [],
    additionalInfo: {
      selectedVolumeName: "",
      ipClearance: "",
      licensingLevel: "",
      groupList: "",
      selectedCountry: "",
    },
    summary: {},
  });

  const updateUserRequestStatus = (status: string) => {
    setUserRequest((prevUserRequest) => ({
      ...prevUserRequest,
      status, // Update the status or any other property of userRequest
    }));
  };

  React.useEffect(() => {
    if (
      ((userRequest?.additionalInfo?.selectedVolumeName &&
        userRequest?.additionalInfo?.ipClearance) ||
        userRequest?.additionalInfo?.licensingLevel) &&
      userRequest?.additionalInfo?.groupList &&
      userRequest?.additionalInfo?.selectedCountry
    ) {
      setisAllFieldDone(true);
    } else {
      setisAllFieldDone(false);
    }
  }, [userRequest?.additionalInfo]);

  const handleNext = () => {
    setIsLoading(true);

    setTimeout(() => {
      if (activeStep === 5) {
        // Check if all roles for the default group have been deleted
        const allDefaultGroupRolesDeleted = userRequest.roleSelection.some(
          (role: any) => {
            return (
              role.groupNamePath === allPageData.defaultGroup &&
              role.isDeleted === true
            );
          },
        );

        if (allDefaultGroupRolesDeleted) {
          setWarningOpen(true);
          setIsLoading(false);
          return;
        }
      }
      setIsLoading(false);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, 5000);
  };

  const handleBack = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }, 2000);
  };

  const updateUserRequest = (data: Partial<typeof userRequest>) => {
    setUserRequest((prevRequest) => ({
      ...prevRequest,
      ...data,
    }));
  };
  const dataChange = (val1: any, val2: any, val3: any) => {
    setUserRequest({
      ...userRequest,
      service: { serviceId: val1 },
      system: { systemId: val2, systemName: val3 },
    });

    setallPageData({
      ...allPageData,
      service: { serviceId: val1 },
      system: { systemId: val2, systemName: val3 },
    });

    setSystemId(val2);
  };
  const isEmpty = (obj: object): boolean => {
    return JSON.stringify(obj) === "{}";
  };
  const dataChangeForUserSelection = (val1: any, val2: any) => {
    setUserRequest({
      ...userRequest,
      user1: val1,
      user2: val2,
    });
    if (isEmpty(val1)) {
      setallPageData({
        ...allPageData,
        userRequestSelf: null,
        userRequestForAnother: {
          DisplayName: val2?.DisplayName,
          gid: val2?.GID,
        },
      });
    } else {
      setallPageData({
        ...allPageData,
        userRequestSelf: {
          DisplayName: val1?.DisplayName,
          gid: val1?.GID,
        },
        userRequestForAnother: null,
      });
    }
  };

  const dataChangeForRequestType = (data: any) => {
    setUserRequest({
      ...userRequest,
      requestType1: {
        selectedOption: data?.selectedOption,
        selectedUser: data?.selectedUser,
        selectedUser1: data?.selectedUser1,
        reasonForRequest: data?.reasonForRequest,
        userOptions: data?.userOptions,
        userStatusMessage: data?.userStatusMessage,
      },
    });

    const tcUser =
      data?.selectedUser1?.length === 0
        ? data?.selectedUser
        : data?.selectedUser1;
    const userRequestForAnother = allPageData.userRequestForAnother;
    const gid = userRequestForAnother
      ? userRequestForAnother
      : allPageData.userRequestSelf || "";

    if (data?.selectedOption === "New_User_Account") {
      let uniqueTcUserId = allPageData?.userRequestForAnother?.gid
        ? allPageData?.userRequestForAnother?.gid
        : allPageData?.userRequestSelf?.gid;
      setallPageData({
        ...allPageData,
        userRequest_TypeOfRequest:
          data?.selectedOption || allPageData?.userRequest_TypeOfRequest,
        commentsForApprover: data?.reasonForRequest,
        userHistory: {
          ...allPageData.userHistory,
          tcUserId: uniqueTcUserId?.toLowerCase(),
          // systemName: allPageData?.system?.systemName,
          requestStatus: "Request_Created",
          userStatus: "active",
          // neverLock: allPageData?.neverLock,
          tcAccountType: "Normal_User",
          gid: uniqueTcUserId,
          userHistoryId: null,
          tcCreated: false,
        },
      });
    } else {
      setallPageData({
        ...allPageData,
        userRequest_TypeOfRequest:
          data?.selectedOption || allPageData?.userRequest_TypeOfRequest,
        commentsForApprover: data?.reasonForRequest,
        userHistory: {
          ...allPageData.userHistory,
          userHistoryId: data?.userOptions[0]?.userHistoryId,
          tcUserId: tcUser,
          // neverLock: allPageData?.neverLock,
          tcAccountType: data?.userOptions[0]?.tcAccountType,
          gid: data?.userOptions[0]?.gid,
          tcCreated: data?.userOptions[0]?.tcCreated,
        },
      });
    }
  };
  const dataChangeForCostManager = (cost1: any, cost2: any) => {
    setUserRequest({
      ...userRequest,
      costManager1: cost1,
      costManager2: cost2,
    });
    if (isEmpty(cost1)) {
      setallPageData({
        ...allPageData,
        costManagerSelf: null,
        costManagerForAnother: {
          DisplayName: cost2?.DisplayName,
          gid: cost2?.GID,
        },
      });
    } else {
      setallPageData({
        ...allPageData,
        costManagerSelf: {
          DisplayName: cost1?.DisplayName,
          gid: cost1?.GID,
        },
        costManagerForAnother: null,
      });
    }
  };

  const dataChangeForRoleSelection = (
    roleSelectionData: any,
    defaultValue: any,
    isModified: any,
  ) => {
    setUserRequest({
      ...userRequest,
      roleSelection: roleSelectionData,
    });
    setModified(isModified);
    const formattedRoles = roleSelectionData.map((role: any) => ({
      roleName: role?.roleName,
      isAssigned: role?.isAssigned,
      groupNamePath: role?.groupNamePath,
      groupName: role?.groupName,
      systemName: role?.systemName,
      assignedRole_Status: role?.assignedRole_Status,
      deleted: role?.isDeleted,
    }));
    setallPageData({
      ...allPageData,
      assignedRoles: formattedRoles,
      defaultGroup: defaultValue?.defaultGroup,
      ipClearance: defaultValue?.ipClerance,
      tcOSUserName: defaultValue?.osUserName,
      requestLicensingLevel: defaultValue?.licensingLevel,
      volume: {
        volumeName: defaultValue?.defaultVolume,
        volumeId: allPageData?.volume?.volumeId,
      },
      country: {
        countryId: defaultValue?.country,
        countryCode: defaultValue?.country,
      },
    });
  };

  const dataChangeForadditionalInfo = (additionalInfo: any) => {
    setUserRequest({
      ...userRequest,
      additionalInfo: additionalInfo,
    });
    setallPageData({
      ...allPageData,
      volume: {
        volumeName: additionalInfo?.selectedVolumeId,
        volumeId: additionalInfo?.volumeIds,
      },
      country: {
        countryId: additionalInfo?.countryId,
        countryCode: additionalInfo?.countryCode,
      },
      defaultGroup: additionalInfo?.groupList,
      ipClearance: additionalInfo?.ipClearance,
      tcOSUserName: additionalInfo?.osUser,
      neverLock: additionalInfo?.neverLockerChecked,
      requestLicensingLevel: additionalInfo?.licensingLevel,
      userHistory: {
        ...allPageData.userHistory,
        neverLock: additionalInfo?.neverLockerChecked,
      },
    });
  };

  const dataChangeForSummary = (summaryData: any) => {
    setUserRequest({
      ...userRequest,
      summary: summaryData,
    });
  };
  const handleStepClick = (step: number) => {
    if (step <= activeStep) {
      setUserRequest((prevRequest) => {
        const updatedRequest = { ...prevRequest };

        // Clear data for steps after the clicked step
        if (step < 0) {
          updatedRequest.service = { serviceId: 0 };
          updatedRequest.system = { systemId: 0, systemName: "" };
        }
        if (step < 1) {
          updatedRequest.user1 = {};
          updatedRequest.user2 = {};
        }
        if (step < 2) {
          updatedRequest.requestType1 = {
            selectedOption: "",
            selectedUser: "",
            selectedUser1: "",
            reasonForRequest: "",
            userOptions: "",
            userStatusMessage: "",
          };
        }
        if (step < 3) {
          updatedRequest.costManager1 = {};
          updatedRequest.costManager2 = {};
        }
        if (step < 4) {
          updatedRequest.roleSelection = [];
        }
        if (step < 5) {
          updatedRequest.additionalInfo = {
            selectedVolumeName: "",
            ipClearance: "",
            licensingLevel: "",
            groupList: "",
            selectedCountry: "",
          };
        }
        if (step < 6) {
          updatedRequest.summary = {};
        }

        return updatedRequest;
      });

      setActiveStep(step);
    }
  };

  const navigate = useNavigate();

  const handleApplyForAccount = async () => {
    try {
      const response = await TcUserRequest.createUserRequest(allPageData);
      alert("Request Created");
      navigate("/home");
    } catch (error) {
      console.error("Error creating user request:", error);
    }
  };
  return (
    <Box>
      <Stack sx={{ width: "100%" }}>
        <Box sx={{ p: 2 }}>
          <Stepper
            alternativeLabel
            activeStep={activeStep}
            connector={<ColorlibConnector />}
          >
            {steps.map((label, index) => (
              <Step
                key={label}
                onClick={() => handleStepClick(index)}
                sx={{ cursor: "pointer" }}
              >
                <StepLabel StepIconComponent={ColorlibStepIcon}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Box
          sx={{
            marginRight: "1% !important",
            marginLeft: "1% !important",
            marginTop: "5px",
            padding: "1px",
            maxWidth: "100%",
          }}
        >
          {
            <>
              {isLoading && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 999,
                  }}
                >
                  <CircularProgress />
                </div>
              )}
            </>
          }
          {activeStep === 0 && (
            <SystemSelection
              selectedSystem={selectedSystem}
              selectedSystemName={selectedSystemName}
              setSelectedSystemName={setSelectedSystemName}
              setSelectedSystem={setSelectedSystem}
              selectedService={selectedService}
              setSelectedService={setSelectedService}
              updateUserRequest={updateUserRequest}
              dataChange={dataChange}
            />
          )}
          {activeStep === 1 && (
            <UserSelection
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              updateUserRequest={updateUserRequest}
              handleNext={handleNext}
              getStateName={getStateName}
              dataChangeForUserSelection={dataChangeForUserSelection}
              userRequest={userRequest}
            />
          )}
          {activeStep === 2 && (
            <RequestType
              handleNext={handleNext}
              userRequest={userRequest}
              dataChangeForRequestType={dataChangeForRequestType}
              updateUserRequestStatus={updateUserRequestStatus}
            />
          )}
          {activeStep === 3 && (
            <CostManager
              selectedUser={selectedUser}
              setSelectedUser={setSelectedUser}
              updateUserRequest={updateUserRequest}
              handleNext={handleNext}
              allPageData={allPageData}
              userRequest={userRequest}
              dataChangeForCostManager={dataChangeForCostManager}
            />
          )}
          {activeStep === 4 && (
            <RoleSelection
              updateUserRequest={updateUserRequest}
              dataChangeForRoleSelection={dataChangeForRoleSelection}
              userRequest={userRequest}
              allPageData={allPageData}
            />
          )}
          {activeStep === 5 && (
            <AdditionalInfo
              allPageData={allPageData}
              systemId={systemId ?? 0}
              userRequest={userRequest}
              dataChangeForadditionalInfo={dataChangeForadditionalInfo}
            />
          )}

          {activeStep === 6 && (
            <Summary
              userRequest={userRequest}
              allPageData={allPageData}
              dataChangeForSummary={dataChangeForSummary}
            />
          )}
        </Box>
      </Stack>

      <Box
        sx={{
          display: "flex",
          justifyContent: activeStep === 0 ? "flex-end" : "space-between", // Align Next button to the right if on the first step
          backgroundColor: "#f6f2f2",
          position: "fixed",
          bottom: 0,
          width: "100%",
          left: 0,
          right: 0,
          padding: "7px 60px",
        }}
      >
        {activeStep !== 0 && (
          <Button
            variant="contained"
            onClick={handleBack}
            sx={{
              padding: "3px 8px",
              fontSize: "0.7rem",
              minWidth: "100px",
              marginLeft: "25px",
            }}
          >
            <KeyboardDoubleArrowLeftIcon fontSize="small" />
            Back
          </Button>
        )}

        {activeStep === steps.length - 1 ? (
          <Button
            variant="contained"
            sx={{
              padding: "3px 8px",
              fontSize: "0.7rem",
              minWidth: "100px",
              marginRight: "95px",
            }}
            onClick={handleApplyForAccount}
          >
            Apply for Account &gt;&gt;
          </Button>
        ) : activeStep !== 1 && activeStep !== 2 && activeStep !== 3 ? (
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              padding: "3px 8px",
              fontSize: "0.7rem",
              minWidth: "100px",
              marginRight: activeStep === 0 ? "95px" : "95px",
            }}
            disabled={
              (activeStep === 0 && !selectedSystem) ||
              (activeStep === 4 && !modiFied) ||
              (activeStep === 5 && !isAllFieldDone)
            }
          >
            Next
            <KeyboardDoubleArrowRightIcon fontSize="small" />
          </Button>
        ) : null}
      </Box>

      {warningOpen && (
        <DefaultWarningPopup
          open={warningOpen}
          onClose={() => setWarningOpen(false)}
          defaultGroupName={allPageData?.defaultGroup}
        />
      )}
    </Box>
  );
}
