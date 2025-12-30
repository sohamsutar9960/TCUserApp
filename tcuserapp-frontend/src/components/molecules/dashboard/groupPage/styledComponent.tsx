import {
  Box,
  Button,
  Grid,
  Icon,
  RadioGroup,
  Select,
  TableCell,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";

export const StyledDataTableCell = styled(TableCell)({
  paddingTop: 6,
  paddingBottom: 6,
  paddingLeft: 10,
  borderBottom: 10,
  border: "1px solid #ccc",
  textAlign: "left",
});

export const StyledGroupDataTableCell = styled(TableCell)({
  paddingTop: 6,
  paddingBottom: 6,
  paddingLeft: 10,
  borderBottom: 10,
  border: "1px solid #ccc",
  textAlign: "left",
  wordBreak: "break-word",
});

export const StyledOuterBox = styled(Box)({
  backgroundColor: "#ffffff",
  padding: "22px 19px 0px 17px",
});

export const StyledHeaderBox = styled(Box)({
  backgroundColor: "#dfdede",
  padding: "8px ",
  margin: "-51px",
  fontSize: "17px",
  fontFamily: "sans-serif",
  border: "1px solid #ccc",
  fontWeight: "600",
});

export const StyledOpenSearchBox = styled(Box)({
  backgroundColor: "#ffffff",
  margin: "77px 0px 0px 0px",
  border: "1px solid #cccccc",
  boxShadow:
    "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 5px rgb(0 0 0 / 10%);",
  borderBottom: "0px",
  borderRadius: "6px",
  padding: "11px 39px 0px 19px",
});

export const StyledOpenSearchGrid = styled(Grid)({});

export const StyledCommonGrid = styled(Grid)({
  marginTop: "20px",
});
export const StyledButtonGrid = styled(Grid)({
  marginTop: "30px",
});

export const StyledRefreshButton = styled(Button)({
  border: "1px solid #006487",
});

export const StyledSearchButton = styled(Button)({
  marginLeft: "10px",
  marginRight: "0px",
  padding: 4,
  backgroundColor: "#006487",
  lineHeight: "1.35",
  minWidth: "54px",
});
export const StyledViewButton = styled(Button)({
  marginLeft: "10px",
  marginRight: "0px",
  padding: 4,
  backgroundColor: "#006487",
  lineHeight: "1.35",
  minWidth: "54px",
});

export const StyledSearchIcon = styled(Icon)({
  color: "white",
  padding: "1.5px 0px 1.5px 0px",
  fontSize: "1.3rem",
});
export const StyledViewIcon = styled(Icon)({
  color: "white",
  padding: "1.5px 0px 1.5px 0px",
  fontSize: "1.3rem",
});
export const StyledAddButton = styled(Button)({
  marginLeft: "0px",
  marginRight: "0px",
  padding: 3,
  backgroundColor: "#006487",
  border: "1px solid #006487",
  lineHeight: "1.35",
  minWidth: "54px",
});
export const StyledAddIcon = styled(Icon)({
  color: "white",
  padding: "1.5px 0px 1.5px 0px",
  fontSize: "1.3rem",
});

export const StyledImportButton = styled(Button)({
  marginLeft: "0px",
  marginRight: "0px",
  padding: 0,
  backgroundColor: "#fff",
  border: "1px solid #006487",
  lineHeight: "1.35",
  minWidth: "54px",
  "&:hover": {
    backgroundColor: "#006487",
  },
});

export const StyledImportIcon = styled(Icon)({
  color: "#006487",
  padding: "5px 0px 5px 0px",
  fontSize: "1.3rem",
  "&:hover": {
    color: "white",
  },
});

export const StyledEditButton = styled(Button)<{ disabled?: boolean }>(
  ({ disabled }) => ({
    padding: "2px 16px",
    border: disabled ? "1px solid #b2aeae" : "1px solid #a55818",
    backgroundColor: disabled ? "transparent" : "#dec0a7",
    color: disabled ? "#b2aeae" : "#d90404",
    lineHeight: "1.35",
    minWidth: "54px",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: disabled ? "transparent" : "#dec0a7",
      border: disabled ? "1px solid #b2aeae" : "1px solid #a55818",
      color: disabled ? "#b2aeae" : "#d90404",
    },
  }),
);

export const StyledEditIcon = styled(Icon)<{ disabled?: boolean }>(
  ({ disabled }) => ({
    color: disabled ? "#b2aeae" : "#e56800",
    padding: "3px 0px 3px 0px",
    fontSize: "1.3rem",
  }),
);

export const StyledDeleteButton = styled(Button)<{ disabled?: boolean }>(
  ({ disabled }) => ({
    padding: "2px 16px",
    border: disabled ? "1px solid #b2aeae" : "1px solid #a55818",
    backgroundColor: disabled ? "transparent" : "#ffbbbb",
    color: disabled ? "#b2aeae" : "#d90404",
    lineHeight: "1.35",
    minWidth: "54px",
    "&:hover": {
      backgroundColor: disabled ? "transparent" : "#ffbbbb",
      border: disabled ? "1px solid #b2aeae" : "1px solid #a55818",
      color: disabled ? "#b2aeae" : "#d90404",
    },
  }),
);

export const StyledDeleteIcon = styled(Icon)<{ disabled?: boolean }>(
  ({ disabled }) => ({
    color: disabled ? "#b2aeae" : "#d90404",
    padding: "3px 0px 3px 0px",
    fontSize: "1.3rem",
    // "&:hover": {
    //   color: disabled ? "#b2aeae" : "#ffffff",
    // },
  }),
);

export const StyledTableHeadRow = styled(TableRow)({
  backgroundColor: "#006487",
});

export const TablePaginationCell = styled(TableCell)({
  backgroundColor: "white",
  borderBottom: 0,
  padding: "0px 16px",
});
export const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  borderBottom: 0,
  float: "right",
  fontFamily: "sans-serif",
}));

export const StyledHeadTableCell = styled(TableCell)({
  padding: "0px 11px 0px 11px",
  marginLeft: 7,
  borderBottom: "none",
  textAlign: "left",
  color: "white",
  width: "12% !important",
  fontWeight: 500,
  fontSize: "14px",
  border: "2px solid #cccccc",
});
export const TablePaginationRow = styled(TableRow)({
  borderBottom: "none",
});

export const StyledTableRow = styled(TableRow)({
  padding: 0,
  "&:nth-of-type(even)": {
    backgroundColor: "#f2f2f2",
  },
  "&:hover": {
    backgroundColor: "#ddd",
  },
});

export const StyledTypography = styled(Typography)({
  padding: "0px 16px",
});

export const StyledTextField = styled(TextField)({
  padding: "8.5px 14px",
  marginRight: "5px",
  "& .MuiOutlinedInput-input": {
    padding: "8.5px 14px",
  },
});
export const StyledTypographyModal = styled(Typography)({
  fontSize: "14px",
});
export const StyledTextFieldModal = styled(TextField)({
  padding: "0px 0px",

  "& .MuiOutlinedInput-input": {
    padding: "4.5px 14px",
  },
});

export const StyledRadioButton = styled(RadioGroup)({
  padding: "0px",
  marginLeft: "0px",
});

export const StyledToolbar = styled(Toolbar)({
  minHeight: "45px",
});

export const StyledClearIcon = styled(Icon)({
  color: "white",
  padding: " 5px 11px",
  cursor: "pointer",
});

export const StyledInnerModalBox = styled(Box)({
  margin: "0px 17px",
});

export const StyledisRootBox = styled(Box)({
  padding: "5px",
});

export const StyledDropdownModalInput = styled(Select)({
  padding: "3.5px 14px",
  "& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
    padding: "0px",
  },
});
export const StyledSecondGrid = styled(Grid)`
  box-sizing: border-box;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  width: 100%;
  -webkit-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
  margin-top: -26px;
  width: calc(100% + 12px);
  margin-left: 0px;
  margin-bootom: 10px;
  padding-bottom: 13px;
  margin-top: -40px;
`;
export const StyledSecondGridTypography = styled(Typography)({
  padding: "-1px 16Spx",

  lineHeight: "2.5",
});
export const StyledDropdownSecondGridInput = styled(Select)({
  padding: "3.5px 0px",
  "& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
    padding: "4px 14px",
  },
});

export const StyledRefreshGrid = styled(Grid)({
  marginTop: "16px",
});

export const StyledBox = styled(Box)({
  width: "100%",
  overflow: "auto",
  margin: "17px !important",
});

export const StyledDropdownGridInput = styled(Select)({
  padding: "3.5px 14px",
  margin: "8px 12px",
  "& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input": {
    padding: "5px 14px",
  },
});
