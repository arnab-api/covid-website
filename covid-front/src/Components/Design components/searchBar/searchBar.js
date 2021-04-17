import React,{useContext} from 'react';
import { withStyles } from '@material-ui/core/styles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {Districts} from '../district.data';
import { DistrictDataContext } from '../../../App';


const CssTextField = withStyles({
  root: {
    '& label': {
      color:'rgba(255,255,255,0.5)',
    },
    '& label.Mui-focused': {
      color: '#fafafa',
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: '#fafafa',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#fafafa',
      },
      '&:hover fieldset': {
        borderColor: '#fafafa',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#fff',
      },
      '& .MuiOutlinedInput-input':{
        color: '#fafafa'
      },
      '& .MuiIconButton-label':{
        color:'#fafafa'
      },
    },
  },
})(TextField);


export default function CustomizedInputs({
  dist_2_id, 
  area, setArea,
  updateCharts, updateCharts__For
}) {

  const [districtData, setDistrictData] = useContext(DistrictDataContext);

  // console.log("from search bar", dist_2_id)
  let district_names = []
  for(var dist in dist_2_id){
    district_names.push(dist);
  }

  return (
    <div style={{ width: 400 }}>
      <Autocomplete
        id="search-district"
        value={area}
        onChange={(event, newValue) => {
          console.log(" !!>> ", newValue, dist_2_id[newValue])
          if(newValue != null) {
            console.log("updating charts for ", newValue)
            setArea(newValue)
            updateCharts__For(newValue)
          }
          else {
            console.log("updating charts for whole Bangladesh")
            setArea("")
            updateCharts()
          }
          // let newDistricData = {...districtData};
          // newDistricData.NAME_3 = newValue;
          // setDistrictData(newDistricData);
        }}

        options={district_names}
        getOptionLabel={(option) => option}
        renderInput={(params) => (
          <CssTextField
          {...params}
            label="Search Districts"
            variant="outlined"
            id="district name"
            size='small'
          />
        )}
      />
    </div>
  );
}
