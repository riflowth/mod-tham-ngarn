import { PencilAltIcon, TrashIcon } from "@heroicons/react/outline";
import { Machine } from "@models/Machine";
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
import moment from "moment";
import Router from "next/router";
import * as React from "react";
import Swal from "sweetalert2";

type ApiResponse = {
  data: MaintenanceLog[];
};

function Row(props: { row: Machine }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);
  const [maintenanceLog, setMaintenanceLog] = React.useState<MaintenanceLog[]>(
    []
  );
  const [valided, setValided] = React.useState(false);
  React.useEffect(() => {
    if (maintenanceLog) {
      setValided(true);
    }
  }, [maintenanceLog]);

  const checkStatus = (status: string) => {
    if (status === "SUCCESS") {
      return "bg-green-500";
    } else if (status === "PENDING") {
      return "bg-yellow-500";
    } else if (status === "FAILED") {
      return "bg-red-500";
    } else {
      return "bg-blue-300";
    }
  };

  const getMaintenanceLog = async (machineId: number) => {
    if (!open) {
      try {
        const response = await fetch.get<ApiResponse>(
          `maintenance/machine/${machineId}`
        );
        setMaintenanceLog(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
  };
  const deleteMachine = async (machineId: number) => {
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
          .delete(`/machine/${machineId}`)
          .then(() => {
            Swal.fire("Deleted!", "Your file has been deleted.", "success");
            Router.reload();
          })
          .catch((error: any) =>
            Swal.fire("Failed", error.response.data.message, "error")
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire("Cancelled", "Your imaginary file is safe :)", "error");
      }
    });
  };
  return (
    <React.Fragment>
      <TableRow style={{ width: "auto" }}>
        <TableCell style={{ width: 160, color: "white" }}>
          {row.machineId}
        </TableCell>
        <TableCell style={{ width: 160, color: "white" }}>{row.name}</TableCell>
        <TableCell style={{ width: 160, color: "white" }}>
          {row.zoneId}
        </TableCell>
        <TableCell style={{ width: 160, color: "white" }}>
          {row.serial}
        </TableCell>
        <TableCell style={{ width: 160, color: "white" }}>
          {row.manufacturer}
        </TableCell>

        <TableCell>
          <div className="flex flex-row space-x-4">
            <button className="w-10 h-10 p-2 text-purple-500 bg-transparent rounded-md ring-1 ring-violet-500 hover:bg-violet-500 hover:text-white">
              <PencilAltIcon />
            </button>
            <button
              className="w-10 h-10 p-2 text-red-500 bg-transparent rounded-md ring-1 ring-red-500 hover:bg-red-500 hover:text-white"
              onClick={() => deleteMachine(row.machineId)}
            >
              <TrashIcon />
            </button>
          </div>
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              getMaintenanceLog(row.machineId);
              setOpen(!open);
            }}
            style={{ color: "rgb(161, 161, 170)" }}
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
                    <TableCell style={{ color: "white" }}>
                      MaintenanceId
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      MaintainerId
                    </TableCell>
                    <TableCell style={{ color: "white" }}>
                      MaintenanceDate
                    </TableCell>
                    <TableCell style={{ color: "white" }}>Reason</TableCell>
                    <TableCell style={{ color: "white" }}>ReporterId</TableCell>
                    <TableCell style={{ color: "white" }}>
                      ReporterDate
                    </TableCell>
                    <TableCell style={{ color: "white" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {valided ? (
                    maintenanceLog.map((log) => {
                      const bgStatus = checkStatus(log.status);
                      return (
                        <TableRow key={log.maintenanceId}>
                          <TableCell>{log.maintenanceId}</TableCell>
                          <TableCell>
                            {log.maintainerId
                              ? log.maintainerId
                              : "no maintainer"}
                          </TableCell>
                          <TableCell>
                            {moment(log.maintenanceDate).format(
                              "ddd D MMM YYYY"
                            )}
                          </TableCell>
                          <TableCell>{log.reason}</TableCell>
                          <TableCell>{log.reporterId}</TableCell>

                          <TableCell>
                            {moment(log.reportDate).format("ddd D MMM YYYY")}
                          </TableCell>

                          <TableCell className={`${bgStatus}`}>
                            {log.status}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <div>No maintenanceLog naja</div>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export const MachineItems = ({ rows }: { rows: Array<Machine> }) => {
  const rowElements = rows.map((row, i) => {
    return <Row key={i} row={row} />;
  });
  return <>{rowElements}</>;
};
