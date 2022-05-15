import { ExternalLinkIcon, PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { MaintenanceLog } from "@models/MaintenanceLog";
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
import Router from "next/router";
import * as React from "react";
import Swal from "sweetalert2";
import moment from 'moment';
import { MyDialog } from '@components/MyDiaLog';
import { MaintenanceLogModal } from '@components/maintenancelog/MaintenanceLogModal';
import { ClassUtils } from '@utils/CommonUtils';

function Row(props: { row: MaintenanceLog }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [isClick, setIsClick] = React.useState(false);

  const openModal = () => setIsClick(true);
  const closeModal = () => setIsClick(false);

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
          .delete(`/maintenance/${maintenanceId}`)
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
      <TableRow style={{ width: "auto" }}>
        <TableCell style={{ width: 160, color: 'white' }}>
          {row.maintenanceId}
        </TableCell>
        <TableCell style={{ width: 160, color: 'white' }}>
          {row.machineId}
        </TableCell>
        <TableCell style={{ width: 160, color: 'white' }}>
          <div className={ClassUtils.concat(
            row.status === 'SUCCESS' ? 'bg-green-700' : '',
            row.status === 'PENDING' ? 'bg-violet-700' : '',
            row.status === 'FAILED' ? 'bg-red-700' : '',
            row.status === 'OPENED' ? 'border border-violet-600 text-violet-300' : '',
            "rounded-md text-xs text-center"
          )}>
            {row.status}
          </div>
        </TableCell>
        <TableCell style={{ width: 160, color: 'white' }}>
          {row.reporterId}
        </TableCell>
        <TableCell style={{ width: 160, color: 'white' }}>
          {moment(row.reportDate).format('ddd D MMM YYYY')}
        </TableCell>
        <TableCell style={{ width: 160, color: 'white' }}>
          {moment(row.maintenanceDate).format('ddd D MMM YYYY')}
        </TableCell>

        <TableCell>
          <div className="flex flex-row space-x-4">
            <button
              className="w-10 h-10 p-2 text-teal-500 bg-transparent rounded-md ring-1 ring-teal-500 hover:bg-teal-500 hover:text-white"
              onClick={() => Router.push(`/maintenance/${row.maintenanceId}`)}
            >
              <ExternalLinkIcon />
            </button>
            <button className="w-10 h-10 p-2 text-purple-500 bg-transparent rounded-md ring-1 ring-violet-500 hover:bg-violet-500 hover:text-white" onClick={openModal}>
              <PencilAltIcon />
            </button>
            <button
              className="w-10 h-10 p-2 text-red-500 bg-transparent rounded-md ring-1 ring-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => deleteMaintenance(row.maintenanceId)}
            >
              <TrashIcon />
            </button>
          </div>
        </TableCell>
      </TableRow>
      <MyDialog<MaintenanceLog> isModalOpen={isClick} close={closeModal} action={'edit'} current={row} >
        <MaintenanceLogModal />
      </MyDialog>
    </React.Fragment>
  );
}

export const MaintenanceLogItems = ({
  rows,
}: {
  rows: Array<MaintenanceLog>;
}) => {
  const rowElements = rows.map((row, i) => {
    return <Row key={i} row={row} />;
  });
  return <>{rowElements}</>;
};
