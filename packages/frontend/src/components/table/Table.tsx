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
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
    <div className="w-4/5 h-full p-10 mx-auto ">
      <div className="">
        <TableContainer
          component={Paper}
          className="text-white rounded-t-md bg-zinc-900"
        >
          <Table aria-label="custom pagination table" className="">
            <TableHead>
              <TableRow>
                <TableCell align="center" className="text-white ">
                  StaffId
                </TableCell>
                <TableCell align="center" className="text-white ">
                  FirstName
                </TableCell>
                <TableCell align="center" className="text-white ">
                  LastName
                </TableCell>
                <TableCell align="center" className="text-white ">
                  ZoneId
                </TableCell>
                <TableCell align="center" className="text-white ">
                  BranchId
                </TableCell>
                <TableCell align="center" className="text-white ">
                  Tel-no
                </TableCell>
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
                <TableRow key={row.staffid} className="hover:bg-zinc-800">
                  <TableCell align="center" className="text-white">
                    {row.staffid}
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    {row.firstname}
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    {row.lastname}
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    {row.zoneid}
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    {row.branchid}
                  </TableCell>
                  <TableCell align="center" className="text-white">
                    {row.telno}
                  </TableCell>
                  <TableCell
                    align="center"
                    className="flex justify-center space-x-4 text-white"
                  >
                    <button className="px-4 py-1 font-semibold bg-green-400 rounded-md bg-opacity-80 hover:bg-opacity-100">
                      Edit
                    </button>
                    <button className="px-4 py-1 font-semibold bg-red-400 rounded-md bg-opacity-80 hover:bg-opacity-100">
                      Delete
                    </button>
                    <div>
                      <MyDialog />
                    </div>
                  </TableCell>
                </TableRow>
              ))}{" "}
              {emptyRows > 0 && (
                <TableRow style={{ height: 61 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="flex items-end justify-center text-white bg-white rounded-b-md">
        <TablePagination
          rowsPerPageOptions={[3, 5, 10, { label: "All", value: -1 }]}
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
