import React, { useEffect, useState } from 'react';
import './TableMap.css'

export const TableMap = ({
    past,
    present,
    future
}) => {
  const [tableData, setTableData] = useState([])

  const COLOR_BUCKET = [
    'rgb(84, 180, 95, 1)',   // trivial
    'rgb(236, 212, 36, 1)',
    'rgb(248, 140, 81, 1)',   // Accelerated spread
    'rgb(192, 26, 39, 1)',   // Tipping point
];
const bins = [1, 9, 24];
const my_colorScale = (value) => {
    // console.log("---> ", value)
    if(value < bins[0]) return COLOR_BUCKET[0];
    if(value < bins[1]) return COLOR_BUCKET[1];
    if(value < bins[2]) return COLOR_BUCKET[2];
    return COLOR_BUCKET[3];
}

  // useEffect(() => {
  //   setTableData([])
  // }, [])
  useEffect(() => {
      fetch('/api/heat_map_combined').then(response => {
          if (response.ok) {
              return response.json()
          }
      }).then(data => {
          setTableData(data)
      })
  }, []);

  return (
    <div className='tableContainer'>
      {/* <h1>Forecasting SERS-CoV-2 in Bangladesh</h1> */}
      <table>
        <thead>
          <tr>
            <th>District</th>
            <th>Past ({past})</th>
            <th>Present ({present})</th>
            <th>Future ({future})</th>
          </tr>
        </thead>
        <tbody>
          {
            tableData.map((rowData, i) => (
              <tr key={i}>
                <td>{rowData['district']}</td>  
                <td><span style={{'background-color': my_colorScale(rowData[past]), 'color': my_colorScale(rowData[past]), 'class': 'unselectable'}}>__</span> {rowData[past].toFixed(2)}</td>
                <td><span style={{'background-color': my_colorScale(rowData[present]), 'color': my_colorScale(rowData[present]), 'class': 'unselectable'}}>__</span> {rowData[present].toFixed(2)}</td>
                <td><span style={{'background-color': my_colorScale(rowData[future]), 'color': my_colorScale(rowData[future]), 'class': 'unselectable'}}>__</span> {rowData[future].toFixed(2)}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};
