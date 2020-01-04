import React, { useState, useEffect } from 'react';

import LoginButton from './LoginButton';
import '../assets/App.scss';

interface IView {
  city: string;
  org: string;
  ipAddress: string;
  countryCode: string;
  longitude: number;
  latitude: number;
  postal: string;
  id: string;
  date: number;
}

const App: React.FC = () => {
  const [views, setViews] = useState([]);

  useEffect(() => {
    const endpoint:string = process.env.REACT_APP_ANALYTICS_ENDPOINT || 'none';
    console.log(endpoint);
    if (endpoint !== 'none') {
      fetch(endpoint)
        .then(resp => resp.json())
        .then(data => setViews(data))
        .catch(console.error);
    }
  }, []);

  return (
    <>
      <table className="App">
        <thead>
          <tr>
            <th>IP</th>
            <th>Org</th>
            <th>City</th>
            <th>Longitude</th>
            <th>Latitude</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
        {
          views.map((view:IView) => (
              <tr key={view.id}>
                <td>{view.ipAddress}</td>
                <td>{view.org}</td>
                <td>{view.city}</td>
                <td>{view.longitude}</td>
                <td>{view.latitude}</td>
                <td>{new Date(view.date).toDateString()}</td>
              </tr>
          ))
        }
        </tbody>
      </table>
      <LoginButton />
    </>
  );
}

export default App;
