import { MachinePartsModal } from "@components/machinepart/MachinePartModal";
import { MyDialog } from "@components/MyDiaLog";
import {
  ExternalLinkIcon,
  PencilAltIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { MachinePart } from "@models/MachinePart";
import { MaintenancePart } from "@models/MaintenancePart";
import { Order } from "@models/Order";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { TableHead } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import fetch from "@utils/Fetch";
import moment from "moment";
import Router from "next/router";
import * as React from "react";
import Swal from "sweetalert2";

function Row(props: { row: MachinePart }) {
  const { row } = props;
  const [isClick, setIsClick] = React.useState(false);

  const openModal = () => setIsClick(true);
  const closeModal = () => setIsClick(false);
  const handleOrderStatus = () => {
    Swal.fire("Error", "Not implemented yet", "error");
  };

  return (
    <React.Fragment>
      <TableRow style={{ width: "auto" }}>
        <TableCell
          style={{ width: 160, color: "white" }}
          className="text-white"
        >
          {row.partId}
        </TableCell>
        <TableCell
          style={{ width: 160, color: "white" }}
          className="text-white"
        >
          {row.machineId}
        </TableCell>

        <TableCell
          style={{ width: 160, color: "white" }}
          className="text-white"
        >
          {row.partName}
        </TableCell>
        <TableCell
          style={{ width: 160, color: "white" }}
          className="text-white"
        >
          {row.status}
        </TableCell>
        <TableCell
          style={{ width: 160, color: "white" }}
          className="text-white"
        >
          <div className="space-x-4">
            <button
              className="w-10 h-10 p-2 text-purple-500 bg-transparent rounded-md ring-1 ring-violet-500 hover:bg-violet-500 hover:text-white"
              onClick={openModal}
            >
              <PencilAltIcon />
            </button>
          </div>
        </TableCell>

        <TableCell></TableCell>
      </TableRow>
      <MyDialog<MachinePart>
        isModalOpen={isClick}
        close={closeModal}
        action={"edit"}
        current={row}
      >
        <MachinePartsModal />
      </MyDialog>
    </React.Fragment>
  );
}

export const MachinePartItems = ({ rows }: { rows: Array<MachinePart> }) => {
  const rowElements = rows.map((row, i) => {
    return <Row key={i} row={row} />;
  });
  return <>{rowElements}</>;
};
