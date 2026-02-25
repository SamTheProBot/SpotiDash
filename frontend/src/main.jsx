import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import TokenContextProvider from './context/tokenContextProvider';
import UserPlaylistProvider from './context/userPlaylistProvider';
import TimeRangeProvider from './context/timeRange';
import { SpeedInsights } from '@vercel/speed-insights/react';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <SpeedInsights />
    <React.StrictMode>
      <TokenContextProvider>
        <UserPlaylistProvider>
          <TimeRangeProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </TimeRangeProvider>
        </UserPlaylistProvider>
      </TokenContextProvider>
    </React.StrictMode>
  </>
);
