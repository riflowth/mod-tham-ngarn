import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { Staff } from "@models/Staff";
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
import Image from "next/image";
import Router from "next/router";
import * as React from "react";
import Swal from "sweetalert2";
import { MyDialog } from "@components/MyDiaLog";
import { StaffModal } from "@components/staff/StaffModal";

function Row(props: { row: Staff }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [isClick, setIsClick] = React.useState(false);

  const openModal = () => setIsClick(true);
  const closeModal = () => setIsClick(false);

  const deleteStaff = async (staffId: number) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await fetch.delete(`/staff/${staffId}`);
        Swal.fire("Deleted!", "Your file has been deleted.", "success");
        Router.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
      }
    });
  };

  return (
    <React.Fragment>
      <TableRow style={{ width: "auto" }}>
        <TableCell>
          <div className="relative w-10 h-10 overflow-hidden rounded-full bg-zinc-500">
            <Image
              src={`https://avatars.dicebear.com/api/micah/${row.staffId}.svg`}
              alt=""
              layout="fill"
              objectFit="cover"
            />
          </div>
        </TableCell>
        <TableCell style={{ width: 160, color: "white" }}>
          {row.staffId}
        </TableCell>
        <TableCell style={{ width: 160, color: "white" }}>
          {row.fullName.split(" ")[0]}
        </TableCell>
        <TableCell style={{ width: 160, color: "white" }}>
          {row.fullName.split(" ")[1]}
        </TableCell>
        <TableCell style={{ width: 160, color: "white" }}>
          {row.branchId}
        </TableCell>
        <TableCell style={{ width: 160, color: "white" }}>
          {row.zoneId}
        </TableCell>
        <TableCell style={{ width: 160, color: "white" }}>
          {row.position}
        </TableCell>

        <TableCell>
          <div className="flex flex-row space-x-4">
            <button
              className="w-10 h-10 p-2 text-purple-400 bg-transparent rounded-md ring-1 ring-violet-500 hover:bg-violet-500 hover:text-white"
              onClick={openModal}
            >
              <PencilAltIcon />
            </button>
            <button
              className="w-10 h-10 p-2 text-red-500 bg-transparent rounded-md ring-1 ring-red-500 hover:bg-red-500 hover:text-white text-zinc"
              onClick={() => deleteStaff(row.staffId)}
            >
              <TrashIcon />
            </button>
          </div>
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
