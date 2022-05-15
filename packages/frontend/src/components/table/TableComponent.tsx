import { MyDialog } from '@components/MyDiaLog';
import { TableColumms } from "@components/table/TableColumns";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { makeStyles, useTheme } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import fetch from "@utils/Fetch";
import * as React from "react";
import { Entity } from "src/models/Entity";

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

type TableComponentProp = {
  path: string,
  title: string,
  columns: string[],
  children: React.ReactElement[]
};

interface ApiResponse<T extends Entity> {
  data: Array<T>;
}

export const TableComponent = <T,>({
  path,
  title,
  columns,
  children,
}: TableComponentProp) => {
  const [isClick, setIsClick] = React.useState(false)
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(8);
  const [data, setData] = React.useState<T[]>([]);

  const openModal = () => setIsClick(true);
  const closeModal = () => setIsClick(false);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch.get<ApiResponse<T>>(`/${path}`);
        setData(response.data.data);
      } catch (e) {
        console.log(e);
      }
    };

    loadData();
  }, [path]);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;

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
    <div className="w-full">
      <TableContainer
        component={Paper}
        style={{
          backgroundColor: 'rgb(63 63 70)',
          borderTopLeftRadius: '0.375rem',
          borderTopRightRadius: '0.375rem'
        }}
      >
        <div className='flex flex-row justify-between bg-zinc-600 text-white rounded-md p-4'>
          <div className="">
            {title}
          </div>
          <button onClick={openModal} className='bg-violet-600 hover:bg-violet-800 text-white rounded-md text-sm px-2 py-1'>{`Add ${title}`}</button>
        </div>
        <Table aria-label="custom pagination table">
          <TableColumms names={columns} />
          <TableBody className="bg-zinc-700 text-zinc-400">
            {rowsPerPage > 0 ? (
              React.cloneElement(children[0], {
                rows: data.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              })
            ) : (
              React.cloneElement(children[0], { rows: data })
            )}
            {emptyRows > 0 && (
              <TableRow
                style={{ height: 61 * emptyRows }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex items-end justify-center bg-zinc-500 rounded-b-md">
        <TablePagination
          rowsPerPageOptions={[3, 5, 8]}
          colSpan={3}
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          SelectProps={{
            inputProps: {
              "aria-label": "rows per page",
            },
            native: true,
          }}
          style={{
            backgroundColor: 'rgb(113 113 122)',
            borderBottom: 0,
          }}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          ActionsComponent={TablePaginationActions}
        />
      </div>
      <MyDialog<T> isModalOpen={isClick} close={closeModal} action={'add'} >
        {children[1]}
      </MyDialog>
    </div>
  );
};
