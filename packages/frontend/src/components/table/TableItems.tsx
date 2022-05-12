import { Disclosure, Transition } from '@headlessui/react';
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
import MyDialog from "@components/MyDiaLog";
import axios, { AxiosResponse } from "axios";
import { TableColumms } from '@components/table/TableColumns';

type TableItemsProp = {
  rows: Array<Object>,
};

export const TableItems = ({ rows }: TableItemsProp) => {
  const rowElements = rows.map((row, i) => (
    <TableRow key={row.staffid}>
      <TableCell style={{ width: 160 }}>{row.staffid}</TableCell>
      <TableCell style={{ width: 160 }}>{row.firstname}</TableCell>
      <TableCell style={{ width: 160 }}>{row.lastname}</TableCell>
      <TableCell style={{ width: 160 }}>{row.zoneid}</TableCell>
      <TableCell style={{ width: 160 }}>{row.branchid}</TableCell>
      <TableCell style={{ width: 160 }}>{row.telno}</TableCell>
      <div className="space-x-3">
        <button className="p-2 font-semibold bg-green-400 rounded-md">
          Edit
        </button>
        <button className="p-2 font-semibold bg-red-400 rounded-md">
          Delete
        </button>
        <div>
          <MyDialog />
        </div>
      </div>
    </TableRow>
  ))
  return (
    <>
      {rowElements}
    </>
  );
}

