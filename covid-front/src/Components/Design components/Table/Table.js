import React, { useEffect, useState } from 'react';
import './Table.css'

const Table = () => {
  const [tableData, setTableData] = useState([{ date: '12/1/21', confirmedCases: 38, recoveredCases: 12, deaths: 0, Rt: 2, DT: 1.9 }])

  // useEffect(() => {
  //   setTableData([])
  // }, [])
  useEffect(() => {
      fetch('/api/rt_forcast_table').then(response => {
          if (response.ok) {
              return response.json()
          }
      }).then(data => {
          setTableData(data)
          console.log(data)
      })
  }, [])

  const checkInvalidForcastData = (data) => {
    return data === undefined
  }


  return (
    <section>
        {
          checkInvalidForcastData(tableData) ? (
            <h1>Forecast Data is not updated</h1>
          ) : (
            <div className='tableContainer'>
              <h1>Forecasting SARS-CoV-2 in Bangladesh</h1>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Confirmed Cases</th>
                    <th>Daily Confirmed</th>
                    <th>Recoverd Cases</th>
                    <th>Daily Recoverd</th>
                    <th>Deaths</th>
                    <th>Daily Deaths</th>
                    <th>Rt</th>
                    <th>DT</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    tableData.map((rowData, i) => (
                      <tr key={i}>
                        <td>{rowData.date}</td>
                        <td>{rowData.confirmedCases}</td>
                        <td>{rowData.confirmedDaily}</td>
                        <td>{rowData.recoveredCases}</td>
                        <td>{rowData.recoveredDaily}</td>
                        <td>{rowData.deaths}</td>
                        <td>{rowData.deathsDaily}</td>
                        <td>{rowData.Rt.toFixed(2)}</td>
                        <td>{rowData.DT.toFixed(2)}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          )
        }

    </section>
  );
};

export default Table;