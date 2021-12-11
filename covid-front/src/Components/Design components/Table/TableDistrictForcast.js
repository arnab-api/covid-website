import React, { useEffect, useState } from 'react';
import styles from './Table.css'

const TableDistrictForcast = ({ area, tableData, setTableData }) => {
  // const [tableData, setTableData] = useState([{ date: '12/1/21', confirmedCases: 38, recoveredCases: 12, deaths: 0, Rt: 2, DT: 1.9 }])

  // useEffect(() => {
  //   setTableData([])
  // }, [])
  // console.log(" >>>>>>>>>>>>>>>>>>> ", area)
  // useEffect(() => {
  //   fetch('/api/forcast_table/' + area).then(response => {
  //     if (response.ok) {
  //       console.log(response.data)
  //       return response.json()
  //     }
  //   }).then(data => {
  //     console.log(" >>>>>>>>>>>>>>>>>>>>>>> ", data)
  //     setTableData(data)
  //   })
  // }, [])

  return (
    <div className='tableContainer'>
      <h1>Forecasting SARS-CoV-2 for {area}</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Confirmed Cases</th>
            <th>Daily Confirmed</th>
            <th>Rt</th>
            <th>DT</th>
          </tr>
        </thead>
        <tbody>
          {
            tableData.map((rowData, i) => (
              <tr key={i}>
                <td>{rowData.day}</td>
                <td>{rowData.confirmed}</td>
                <td>{rowData.confirmedDaily}</td>
                <td>{rowData.rt}</td>
                <td>{rowData.dt}</td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default TableDistrictForcast;