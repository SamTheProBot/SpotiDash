import React, { useState } from 'react';
import { TimeRangeContext } from './Context';

const TimeRangeProvider = ({ children }) => {
  const [range, setRange] = useState('short');
  return <TimeRangeContext.Provider value={{ range, setRange }}>{children}</TimeRangeContext.Provider>;
};

export default TimeRangeProvider;
