import React, { useState } from "react";
import "./Tooltip__color_table.css";
import "./table.css"
import Plot from 'react-plotly.js';


const Tooltip__color_table = (props) => {
  let timeout;
  const [active, setActive] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setActive(true);
    }, props.delay || 5);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setActive(false);
  };

  const tableInfo = [
    {
      'attr_name': 'Zone Definition',
      'red': "Tipping",
      'orange': "Accelerated",
      'yellow': "Community",
      'green': "Trivial" 
    },
    {
      'attr_name': 'Meaning of Color Code',
      'red': "Unchecked Spreading",
      'orange': "Escalating Spreading",
      'yellow': "Potential Spreading",
      'green': "Close to Containment" 
    },
    {
      'attr_name': 'Zoning based on Cases/100K as defined by BSPH',
      'red': "24+",
      'orange': "9-24",
      'yellow': "1-9",
      'green': "less then 1" 
    },
    {
      'attr_name': 'Zoning based on TPR',
      'red': "30% +",
      'orange': "20% - 30%",
      'yellow': "10% - 20%",
      'green': "less then 10%" 
    },
    {
      'attr_name': 'Proposed Zoning based on cases/100K, TPR and Rt',
      'red': "24+",
      'orange': "9-24",
      'yellow': "1-9",
      'green': "less then 1" 
    },
    {
      'attr_name': 'Proposed Interventions',
      'red': "Necessary Stay-at-home",
      'orange': "Maybe Necessary Stay-at-home",
      'yellow': "Testing, Tracking, Isolation, Social-distancing, Masking etc",
      'green': "Testing, Tracking, Isolation" 
    },
  ]

  return (
    <div
      className="Tooltip-Wrapper"
      // When to show the tooltip
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {/* Wrapping */}
      {props.children}
      {active && (
        <div className={`Tooltip-Tip ${props.direction || "top"}`}>
          {/* Content */}
          {props.content}
          {/* <Plot
            data={[
              {
                x: [1, 2, 3],
                y: [2, 6, 3],
                type: 'scatter',
                mode: 'lines+markers',
                marker: {color: 'red'},
              },
              {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
            ]}
            layout={ {width: 320, height: 240, title: 'A Fancy Plot'} }
          /> */}
          
          <table class="tooltip_table">
            <colgroup>
              <col style={{width: "25%"}}/>
              <col class="red_dark" style={{width: "18.75%"}}/>
              <col class="orange_dark" style={{width: "18.75%"}}/>
              <col class="yellow_dark" style={{width: "18.75%"}}/>
              <col class="green_dark" style={{width: "18.75%"}}/>
            </colgroup>
            <thead>
              <tr>
                <th class="tooltip_th">Zone Code</th>
                <th class="tooltip_td_th">Red</th>
                <th class="tooltip_td_th">Orange</th>
                <th class="tooltip_td_th">Yellow</th>
                <th class="tooltip_td_th">Green</th>
              </tr>
            </thead>
          </table>
          <table class="tooltip_table">
            <colgroup>
              <col style={{width: "25%"}}/>
              <col class="red" style={{width: "18.75%"}}/>
              <col class="orange" style={{width: "18.75%"}}/>
              <col class="yellow" style={{width: "18.75%"}}/>
              <col class="green" style={{width: "18.75%"}}/>
            </colgroup>
            <tbody>
              {
                tableInfo.map( (row, i) => (
                  <tr key={i}>
                    <th class="tooltip_th">{row.attr_name}</th>
                    <td class="tooltip_td">{row.red}</td>
                    <td class="tooltip_td">{row.orange}</td>
                    <td class="tooltip_td">{row.yellow}</td>
                    <td class="tooltip_td">{row.green}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Tooltip__color_table;
