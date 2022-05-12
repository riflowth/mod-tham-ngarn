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

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;
  const [data, setData] = React.useState<AxiosResponse | null | void>(null);
  React.useEffect(() => {
    axios
      .get("https://localhost:4000/api/staff/")
      .then((res) => {
        setData(res);
        console.log(data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

function createData(
  staffid: number,
  firstname: string,
  lastname: string,
  zoneid: number,
  branchid: number,
  telno: string
) {
  return { staffid, firstname, lastname, zoneid, branchid, telno };
}

const rows = [
  createData(1, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(2, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(3, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(4, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(5, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(6, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(7, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(8, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(9, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(10, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(11, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(12, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
  createData(13, "Eeieiza", "hahaluvluv", 2, 3, "xxxx-xxx-xxx"),
].sort((a, b) => (a.staffid < b.staffid ? -1 : 1));

export function TableTest() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="h-full">
      <div>
        <TableContainer component={Paper} className="mx-auto ">
          <Table aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>StaffId</TableCell>
                <TableCell>FirstName</TableCell>
                <TableCell>LastName</TableCell>
                <TableCell>ZoneId</TableCell>
                <TableCell>BranchId</TableCell>
                <TableCell>Tel-no</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row) => (
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
              ))}{" "}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="flex items-end justify-center w-full bg-white">
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
          colSpan={3}
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              "aria-label": "rows per page",
            },
            native: true,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </div>
    </div>
  );
}
