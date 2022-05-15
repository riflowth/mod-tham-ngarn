import { ExternalLinkIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { Bill } from "@models/Bill";
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

function Row(props: { row: Bill }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const deleteBill = async (billId: number) => {
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
          .delete(`/bill/${billId}`)
          .then(() => {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            Router.reload();
          })
          .catch((error: any) => Swal.fire("Failed", error.response.data.message, "error"));
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
      }
    });
  };
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <div className="relative w-10 h-10 overflow-hidden rounded-full bg-zinc-500">
            <Image
              src={`https://avatars.dicebear.com/api/micah/${row.orderBy}.svg`}
              alt=""
              layout="fill"
              objectFit="cover"
            />
          </div>
        </TableCell>
        <TableCell style={{ width: 160, color: 'white' }}>
          {row.billId}
        </TableCell>
        <TableCell style={{ width: 160, color: 'white' }}>
          {row.storeName}
        </TableCell>
        <TableCell style={{ width: 160, color: 'white' }}>
          {row.orderBy}
        </TableCell>

        <TableCell>
          <div className="flex flex-row space-x-2">
          <button
              className="w-10 h-10 p-2 text-teal-500 bg-transparent rounded-md ring-1 ring-teal-500 hover:bg-teal-500 hover:text-white"
              onClick={() => Router.push(`/bill/${row.billId}`)}
            >
              <ExternalLinkIcon />
            </button>
            <button className="w-10 h-10 p-2 text-purple-500 bg-transparent rounded-md ring-1 ring-violet-500 hover:bg-violet-500 hover:text-white">
              <PencilAltIcon />
            </button>
            <button
              className="w-10 h-10 p-2 text-red-500 bg-transparent rounded-md ring-1 ring-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => deleteBill(row.billId)}
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
            style={{ color: 'rgb(161, 161, 170)' }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow className="w-full bg-zinc-500">
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography className="text-white" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ color: 'white' }}>Date</TableCell>
                    <TableCell style={{ color: 'white' }}>Customer</TableCell>
                    <TableCell style={{ color: 'white' }}>Amount</TableCell>
                    <TableCell style={{ color: 'white' }}>
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

export const BillItems = ({ rows }: { rows: Array<Bill> }) => {
  const rowElements = rows.map((row, i) => {
    return <Row key={i} row={row} />;
  });
  return <>{rowElements}</>;
};
