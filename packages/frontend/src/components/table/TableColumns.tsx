import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { TableHead } from "@mui/material";

type TableColumnsProp = {
  names: Array<string>;
};

export const TableColumms = ({ names }: TableColumnsProp) => {
  const nameElements = names.map((name: string, i: number): React.ReactNode => {
    return (
      <TableCell style={{ color: 'white' }} key={i}>
        {name}
      </TableCell>
    );
  });

  return (
    <>
      <TableHead className="">
        <TableRow className="">{nameElements}</TableRow>
      </TableHead>
    </>
  );
};
