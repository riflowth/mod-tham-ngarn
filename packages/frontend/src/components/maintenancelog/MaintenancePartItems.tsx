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
import { MaintenanceLog } from "@models/MaintenanceLog";
import { ChevronDoubleRightIcon } from "@heroicons/react/solid";
import { ChevronDoubleDownIcon } from "@heroicons/react/solid";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { MaintenancePart } from "@models/MaintenancePart";
import Swal from "sweetalert2";
import fetch from "@utils/Fetch";
import Router from "next/router";

function Row(props: { row: MaintenancePart }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const deleteMaintenance = async (maintenanceId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch
          .delete(`/maintenance/${maintenanceId}/part`)
          .then(() => {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            Router.reload();
          })
          .catch((error: any) => Swal.fire("Failed", error, "error"));
      }
    });
  };
  return (
    <React.Fragment>
      <TableRow style={{ width: "auto" }}>
        <TableCell style={{ width: 160 }} className="text-white">
          {row.maintenanceId}
        </TableCell>
        <TableCell style={{ width: 160 }} className="text-white">
          {row.partId}
        </TableCell>
        <TableCell style={{ width: 160 }} className="text-white">
          {row.type}
        </TableCell>
        <TableCell style={{ width: 160 }} className="text-white">
          {row.status}
        </TableCell>
        <TableCell style={{ width: 160 }} className="text-white">
          {row.orderId}
        </TableCell>

        <TableCell>
          <div className="flex justify-around">
            <button className="w-10 h-10 p-2 text-purple-500 bg-transparent rounded-md ring-1 ring-violet-500 hover:bg-violet-500 hover:text-white">
              <PencilAltIcon />
            </button>
            <button
              className="w-10 h-10 p-2 text-purple-500 bg-transparent rounded-md ring-1 ring-violet-500 hover:bg-violet-500 hover:text-white"
              onClick={() => deleteMaintenance(row.maintenanceId)}
            >
              <TrashIcon />
            </button>
          </div>
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className="text-white bg-violet-700 hover:bg-violet-400"
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className="w-full bg-gray-800">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography className="text-white" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell className="text-white">Date</TableCell>
                    <TableCell className="text-white">Customer</TableCell>
                    <TableCell className="text-white">Amount</TableCell>
                    <TableCell className="text-white">
                      Total price ($)
                    </TableCell>
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

export const MaintenancePartItems = ({
  rows,
}: {
  rows: Array<MaintenancePart>;
}) => {
  const rowElements = rows.map((row, i) => {
    return <Row key={i} row={row} />;
  });
  return <>{rowElements}</>;
};