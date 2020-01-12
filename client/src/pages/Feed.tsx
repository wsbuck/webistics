import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from '../redux/types';

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

function Feed() {
  const endpoint = useSelector((state: RootState) => state.feed.endpoint);
  const token = useSelector((state: RootState) => state.auth.token);
  const [views, setViews] = useState([]);

  useEffect(() => {
    // const endpoint: string = process.env.REACT_APP_ANALYTICS_ENDPOINT || 'none';
    console.log(endpoint);
    fetch(endpoint + '/analytics', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.length > 0) {
          setViews(data)
        }
      }).catch(console.error);
  }, [endpoint, token]);

  return (
    <table>
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
        {views && views.map((view: IView) => (
          <tr key={view.id}>
            <td>{view.ipAddress}</td>
            <td>{view.org}</td>
            <td>{view.city}</td>
            <td>{view.longitude}</td>
            <td>{view.latitude}</td>
            <td>{new Date(view.date).toDateString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Feed;
