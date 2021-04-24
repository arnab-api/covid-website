import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

const columns = [
  { 
    id: 'rank', 
    label: '#', 
    // minWidth: 170,
    // maxWidth: 170, 
  },
  { 
    id: 'name', 
    label: 'Name', 
    minWidth: 170,
    // maxWidth: 170, 
  },
  {
    id: 'risk',
    label: 'Risk Value',
    // minWidth: 170,
    // width: 170,
    align: 'right',
    format: (value) => value.toFixed(2),
  },
];

const COLOR_BUCKET_tooltip = [
  'rgb(84, 180, 95, 1)',   // trivial
  'rgb(236, 212, 36, 1)',
  'rgb(248, 140, 81, 1)',   // Accelerated spread
  'rgb(192, 26, 39, 1)',   // Tipping point
]
const bins = [1, 9, 24]
const DEFAULT_COLOR = '#EEE';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 550,
  },
});

// export default function WorldPageTable() {
export const WorldPageTable = ({rows}) => {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rows.length);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const my_colorScale = (value) => {
      // console.log("---> ", value)
      let bucket = COLOR_BUCKET_tooltip
      if(value == -1) return DEFAULT_COLOR;
      if(value < bins[0]) return bucket[0];
      if(value < bins[1]) return bucket[1];
      if(value < bins[2]) return bucket[2];
      return bucket[3];
  }

  const checkValue = (value) => {
    if(value == -1) return "N/A";
    return value.toFixed(2)
  }

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {columns.map((column) => {
                    let value = row[column.id];
                    if(column.id == 'risk'){
                      return (
                        <TableCell key={column.id} align={column.align}>
                            {/* {column.format && typeof value === 'number' ? column.format(value) : value} */}
                            {checkValue(value)}
                        </TableCell>
                      );
                    }
                    else if(column.id == 'name'){
                      return (
                        <TableCell key={column.id} align={column.align}>
                          <svg width="15" height="15">
                              <rect width="20" height="20" style={{
                                  fill: my_colorScale(row['risk']),
                                  strokeWidth:1,
                                  stroke: 'rgb(0,0,0)'
                              }}/>
                          </svg>
                          <strong>&nbsp;&nbsp;{value}</strong>
                        </TableCell>
                      )
                    }
                    else{
                      return (
                        <TableCell key={column.id} align={column.align}>{value}</TableCell>
                      )
                    }
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {/* <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      /> */}
    </Paper>
  );
}