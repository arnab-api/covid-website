import React, { useContext } from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { DistrictDataContext } from '../../../App';

const OptionBar = ({
    area,
    setArea,
    getSucceptiblePopulation
}) => {

  const handleClick = () => {
    setArea("")
    getSucceptiblePopulation()
  }

  return (
    <div style={{ display: 'flex', backgroundColor: '#fff', padding: '1rem', borderRadius: '5px' }}>
      <h2 style={{ cursor: 'pointer' }} onClick={handleClick}>Bangladesh </h2>
      {
        area && <h2 style={{ display: 'flex', alignItems: 'center' }}> <ArrowForwardIosIcon /> {area}</h2>
      }
    </div>
  );
};

export default OptionBar;