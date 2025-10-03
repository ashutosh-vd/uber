import React, { useEffect, useState } from 'react'
import { useMapStore } from '../stores/useMapStore.js';
import { Polyline } from 'react-leaflet';

const VehicleRoute = ({pickupObj = null, dropObj = null}) => {
  const [leafletCoords, setLeafletCoords] = useState([]);
  const { getRoutes } = useMapStore();

  useEffect(() => {
    const fetchRoute = async () => {
      if(pickupObj && dropObj) {
        try {
          const data = await getRoutes(pickupObj.lat, pickupObj.lon, dropObj.lat, dropObj.lon);
          const arr = data[0]?.geometry?.coordinates.map(([lon, lat]) => [lat, lon]);
          setLeafletCoords(arr || []);
        }
        catch(error) {
          console.error(error);
        }
      }
    }
    fetchRoute();
  }, [pickupObj, dropObj, getRoutes]);
  return (
    <div>
      <Polyline positions={leafletCoords} color="blue" weight={4} />
    </div>
  )
}

export default VehicleRoute