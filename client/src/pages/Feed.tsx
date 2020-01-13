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
        Authorization: `Bearer ${token}`
      }
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.length > 0) {
          setViews(data);
        }
      })
      .catch(console.error);
  }, [endpoint, token]);

  return (
    <div className='feed'>
      {views &&
        views.map((view: IView) => (
          <div className='view' key={view.id}>
            <p>{view.ipAddress}</p>
            <p>{view.org}</p>
            <p>{view.city}</p>
            <p>{view.longitude}</p>
            <p>{view.latitude}</p>
            <p>{new Date(view.date).toDateString()}</p>
          </div>
        ))}
    </div>
  );
}

export default Feed;
