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
import MappleToolTip from 'reactjs-mappletooltip';
import ReactTooltip from 'react-tooltip'
import "./WorldPageTable.css"


const columns = [
  { 
    id: 'rank', 
    label: '#', 
    align: 'right',
    // minWidth: 100, 
  },
  { 
    id: 'name', 
    label: 'Name', 
    // minWidth: 170,
    // maxWidth: 170, 
  },
  {
    id: 'risk',
    label: 'Risk',
    // minWidth: 130,
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
    width: '34%',
    borderCollapse: 'separate',
    borderSpacing: '0px 4px'
  },
  container: {
    maxHeight: 500,
  },
  table: {
    borderCollapse: 'separate',
    borderSpacing: '0px 4px'
  },
  tablecell: {
    fontSize: '8pt',
  },
});

// export default function WorldPageTable() {
export const BDPageTable = ({rows, rows__pastweek}) => {
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

  const getPastWeekData = (cur_data) => {
    for(let i = 0; i < rows__pastweek.length; i++){
      if(rows__pastweek[i].name == cur_data.name) return rows__pastweek[i];
    }
    return null;
  }

  const riskCompare = (cur_risk, past_risk) => {
    if(cur_risk == past_risk) return "equal";
    if(cur_risk > past_risk) return "up";
    if(cur_risk < past_risk) return "down"; // green down
  }

  const rankCompare = (cur_rank, past_rank) => {
    if(cur_rank == past_rank) return "equal";
    if(cur_rank > past_rank) return "down";
    if(cur_rank < past_rank) return "up"; // green down
  }

  const riskTooltip = (cur_risk, past_risk) => {
    let ret = `<strong>Risk is going ${riskCompare(cur_risk, past_risk)}</strong><br/>`;
    ret += `Risk 7 days ago was ${past_risk.toFixed(2)}`;
    return ret;
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
              let past_data = getPastWeekData(row)
              // console.log("inside row map function >> ", row, past_data)
              return (
                <TableRow 
                  hover role="checkbox" 
                  tabIndex={-1} 
                  key={row.code}
                  padding='none'
                >
                  {columns.map((column) => {
                    let value = row[column.id];
                    let cmp = riskCompare(row['risk'], past_data['risk'])
                    if(column.id == 'risk'){
                      return (
                        <TableCell className={classes.tablecell}
                          key={column.id} 
                          align={column.align}
                          size='small'
                          padding='none'
                        >
                            {/* {column.format && typeof value === 'number' ? column.format(value) : value} */}
                            {checkValue(value)} &nbsp;
                            <span
                              class="unselectable"
                            >
                            {cmp=='equal' ? ( 
                              <>
                              </>
                            ):(
                                cmp=='up' ? (
                                  <>
                                    <span 
                                      style={{color: 'red'}} 
                                      // data-tip={riskTooltip(row['risk'], past_data['risk'])} 
                                    >
                                      &#9650;
                                    </span>
                                    {/* <ReactTooltip html={true}/> */}
                                  </>
                                ) : (
                                  <>
                                  <span 
                                    style={{color: 'green'}}
                                    // data-tip={riskTooltip(row['risk'], past_data['risk'])} 
                                  >
                                    &#9660;
                                  </span>
                                  {/* <ReactTooltip html={true}/> */}
                                  </>
                                )
                            )
                            }
                            </span>
                        </TableCell>
                      );
                    }
                    else if(column.id == 'name'){
                      return (
                        <TableCell className={classes.tablecell}
                          key={column.id} 
                          align={column.align}
                          padding='none'
                          size='small'
                        >
                          <svg width="8" height="8">
                              <rect width="8" height="8" style={{
                                  fill: my_colorScale(row['risk']),
                                  strokeWidth:1,
                                  stroke: 'rgb(0,0,0)'
                              }}/>
                          </svg>
                          &nbsp;&nbsp;{value[0]+value.substr(1, value.length-1).toLowerCase()}
                        </TableCell>
                      )
                    }
                    else if(column.id == 'rank'){
                      let cmp = rankCompare(row['rank'], past_data['rank'])
                      return (
                        <TableCell className={classes.tablecell}
                          key={column.id} 
                          align={column.align}
                          padding='none'
                          size='small'
                        >
                          
                          {cmp=='equal' ? ( 
                            <span>
                              
                            </span> 
                          ):(
                              cmp=='up' ? (
                                <span style={{color: 'red'}}>
                                  &#9650;
                                </span>
                              ) : (
                                <span style={{color: 'green'}}>
                                  &#9660;
                                </span>
                              )
                          )
                          } &nbsp;
                          {value}
                        </TableCell>
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