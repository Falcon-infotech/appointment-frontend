import * as React from 'react';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';

interface Batch {
  id: string;          // Batch ID
  batchName: string;
  courseName: string;
  instructorName: string;
  batchStart: string;
  batchEnd: string;
  scheduledBy: string;
}

function createBatch(
  id: string,
  batchName: string,
  courseName: string,
  instructorName: string,
  batchStart: string,
  batchEnd: string,
  scheduledBy: string
): Batch {
  return {
    id,
    batchName,
    courseName,
    instructorName,
    batchStart,
    batchEnd,
    scheduledBy,
  };
}

// Sample rows (replace with API data later)
// const rows: Batch[] = [
//   createBatch("BAT001", "Morning Web Development", "Full Stack Web Development", "John Smith", "2024-02-01", "2024-04-01", "Admin"),
//   createBatch("BAT002", "Evening Data Science", "Data Science Fundamentals", "Sarah Johnson", "2024-02-15", "2024-04-15", "Admin"),
//   createBatch("BAT003", "Weekend Mobile Dev", "Mobile App Development", "Michael Chen", "2024-03-01", "2024-05-01", "Coordinator"),
//   createBatch("BAT004", "Afternoon UI/UX", "UI/UX Design", "Emily Brown", "2024-03-15", "2024-05-15", "Admin"),
//   createBatch("BAT005", "Evening Cloud Computing", "AWS Fundamentals", "David Wilson", "2024-04-01", "2024-06-01", "Coordinator"),
// ];

type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: string }, b: { [key in Key]: string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface HeadCell {
  id: keyof Batch;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  { id: 'id', numeric: false, label: 'Batch ID' },
  { id: 'batchName', numeric: false, label: 'Batch Name' },
  { id: 'courseName', numeric: false, label: 'Course Name' },
  { id: 'instructorName', numeric: false, label: 'Instructor Name' },
  { id: 'batchStart', numeric: false, label: 'Batch Start' },
  { id: 'batchEnd', numeric: false, label: 'Batch End' },
  { id: 'scheduledBy', numeric: false, label: 'Scheduled By' },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Batch) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler =
    (property: keyof Batch) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all batches' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

interface EnhancedTableToolbarProps {
  numSelected: number;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={[
        { pl: { sm: 2 }, pr: { xs: 1, sm: 1 } },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography sx={{ flex: '1 1 100%' }} color="inherit" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography sx={{ flex: '1 1 100%' }} variant="h6" id="tableTitle">
          Recent Batches
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

export default function EnhancedTable({ data }: any) {
  const [order, setOrder] = React.useState<Order>("asc");
  const [orderBy, setOrderBy] = React.useState<keyof Batch>("id");
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const isLoading = !data || data.length === 0;

  const rows: Batch[] = React.useMemo(() => {
    if (!data) return [];
    return data.map((item: any) =>
      createBatch(
        item.code, 
        item.courseId?.name || "N/A",
        item.courseId?.description || "N/A",
        item.inspectorId?.name || "N/A",
        item.fromDate
          ? new Date(item.fromDate).toLocaleDateString("en-US")
          : "N/A",
        item.toDate
          ? new Date(item.toDate).toLocaleDateString("en-US")
          : "N/A",
        item.scheduledBy || "N/A"
      )
    );
  }, [data]);

  const visibleRows = React.useMemo(
    () =>
      [...rows]
        .sort(getComparator(order, orderBy))
        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, rows]
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          {isLoading ? (
            // 🔹 Loading skeleton
            <Box sx={{ p: 3, textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Loading batches...
              </Typography>
            </Box>
          ) : (
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="small"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={(e) => {
                  if (e.target.checked) {
                    setSelected(rows.map((n) => n.id));
                  } else {
                    setSelected([]);
                  }
                }}
                onRequestSort={(event, property) => {
                  const isAsc = orderBy === property && order === "asc";
                  setOrder(isAsc ? "desc" : "asc");
                  setOrderBy(property);
                }}
                rowCount={rows.length}
              />
              <TableBody>
                {visibleRows.map((row, index) => {
                  const isItemSelected = selected.includes(row.id);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => {
                        const selectedIndex = selected.indexOf(row.id);
                        let newSelected: readonly string[] = [];

                        if (selectedIndex === -1) {
                          newSelected = newSelected.concat(selected, row.id);
                        } else if (selectedIndex === 0) {
                          newSelected = newSelected.concat(selected.slice(1));
                        } else if (selectedIndex === selected.length - 1) {
                          newSelected = newSelected.concat(
                            selected.slice(0, -1)
                          );
                        } else if (selectedIndex > 0) {
                          newSelected = newSelected.concat(
                            selected.slice(0, selectedIndex),
                            selected.slice(selectedIndex + 1)
                          );
                        }
                        setSelected(newSelected);
                      }}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: "pointer" }}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          color="primary"
                          checked={isItemSelected}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell>{row.batchName}</TableCell>
                      <TableCell>{row.courseName}</TableCell>
                      <TableCell>{row.instructorName}</TableCell>
                      <TableCell>{row.batchStart}</TableCell>
                      <TableCell>{row.batchEnd}</TableCell>
                      <TableCell>{row.scheduledBy}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        {!isLoading && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(event, newPage) => setPage(newPage)}
            onRowsPerPageChange={(event) => {
              setRowsPerPage(parseInt(event.target.value, 10));
              setPage(0);
            }}
          />
        )}
      </Paper>
    </Box>
  );
}

