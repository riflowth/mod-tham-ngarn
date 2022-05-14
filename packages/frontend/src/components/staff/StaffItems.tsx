import { Disclosure, Transition } from "@headlessui/react";
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { TableHead } from "@mui/material";
import { MyDialog } from "@components/MyDiaLog";
import axios, { AxiosResponse } from "axios";
import { TableColumms } from "@components/table/TableColumns";
import { Entity } from "@models/Entity";
import { Staff } from "@models/Staff";
import { ChevronDoubleRightIcon } from "@heroicons/react/solid";
import { ChevronDoubleDownIcon } from "@heroicons/react/solid";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";

function Row(props: { row: Staff }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell style={{ width: 160 }}>{row.staffId}</TableCell>
        <TableCell style={{ width: 160 }}>
          {row.fullName.split(" ")[0]}
        </TableCell>
        <TableCell style={{ width: 160 }}>
          {row.fullName.split(" ")[1]}
        </TableCell>
        <TableCell style={{ width: 160 }}>{row.branchId}</TableCell>
        <TableCell style={{ width: 160 }}>{row.zoneId}</TableCell>
        <TableCell style={{ width: 160 }}>{row.position}</TableCell>

        <div className="space-x-3">
          <button className="p-2 font-semibold bg-green-400 rounded-md">
            Edit
          </button>
          <button className="p-2 font-semibold bg-red-400 rounded-md">
            Delete
          </button>
        </div>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{/* เนิ้อหา */}</TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export const StaffItems = ({ rows }: { rows: Array<Staff> }) => {
  const [open, setOpen] = React.useState(false);
  const rowElements = rows.map((row, i) => <Row key={i} row={row} />);
  return <>{rowElements}</>;
};
