/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useUserStore } from '../stores/useUserStore.js'
import { Navigate } from 'react-router-dom';
import { FaCar, FaMotorcycle, FaTaxi } from "react-icons/fa";
import { motion } from "framer-motion";

const UserHomePage = () => {
  const { isLoggedIn, isCaptain } = useUserStore();
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [showVehiclePopup, setShowVehiclePopup] = useState(false);
  const [center, setCenter] = useState([28.6139, 77.2090]);
  const [dropCenter, setDropCenter] = useState([28.6139, 77.2090]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  if(!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }
  if(isCaptain) {
    return <Navigate to={"/captain"} />;
  }

  const historyLocations = [
    {
      name: 'Mahatma Gandhi Road, Tasker Town, Shivajinagar, Bengaluru Central City Corporation, Bengaluru, Bangalore North, Bengaluru Urban, Karnataka, 560001, India',
      lat: 12.9755264,
      lon: 77.6067902
    },
    {
      name: 'Indiranagar, Bengaluru Central City Corporation, Bengaluru, Bangalore East, Bengaluru Urban, Karnataka, 560038, India',
      lat: 12.9732913,
      lon: 77.6404672
    },
    {
      name: 'Koramangala, Bengaluru South City Corporation, Bengaluru, Bangalore South, Bengaluru Urban, Karnataka, 560034, India',
      lat: 12.9357366,
      lon: 77.624081
    },
  ];


  const Recenter = ({ center }) => {
    const map = useMap();

    useEffect(() => {
      if (center) {
        // map.setView(center); // or map.flyTo(center, map.getZoom());
        map.flyTo(center, map.getZoom(), { animate: true, duration: 1.5 });
      }
    }, [center, map]);

    return null;
  };

  // Add this inside your component
  const FitBounds = ({ pickup, drop }) => {
    const map = useMap();

    useEffect(() => {
      if (pickup && drop) {
        const bounds = [
          [pickup.lat, pickup.lon],
          [drop.lat, drop.lon]
        ];
        map.fitBounds(bounds, { padding: [50, 50] }); // padding to avoid edges
      }
    }, [pickup, drop, map]);

    return null;
  };


  const handlePickupSelect = (loc) => {
    setPickup(loc.name);
    setShowVehiclePopup(true);
    setCenter([loc.lat, loc.lon]);
  };
  
  const handleDropSelect = (loc) => {
    setDrop(loc.name);
    setDropCenter([loc.lat, loc.lon]);
    setShowVehiclePopup(true);
  };
  
  const confirmRide = () => {
    setShowVehiclePopup(false);
  }; 

  const vehicles = [
    { name: "Car", icon: <FaCar size={30} />, capacity: 4, price: "₹250" },
    { name: "Moto", icon: <FaMotorcycle size={30} />, capacity: 1, price: "₹80" },
    { name: "Uber Auto", icon: <FaTaxi size={30} />, capacity: 3, price: "₹120" },
  ];

  return (
    <div className="relative w-screen h-[calc(100vh-96px)] overflow-hidden">
      {/* Map animation background */}
      <motion.div
        initial={{ backgroundPosition: "0% 0%" }}
        className="absolute inset-0 bg-gradient-to-br from-blue-200 to-green-200 z-0"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      {/* Map */}
      <MapContainer className="absolute inset-0 z-10 h-full w-[100vw]" center={center} zoom={15} scrollWheelZoom={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Pickup marker */}
        {pickup && (
          <Marker position={center}>
            <Popup>
              {pickup}
            </Popup>
          </Marker>
        )}

        {/* Drop marker */}
        {drop && (
          <Marker position={dropCenter}>
            <Popup>
              {drop}
            </Popup>
          </Marker>
        )}

        {/* Recenter for single location */}
        {pickup && !drop && <Recenter center={center} />}

        {/* Fit bounds if both exist */}
        {pickup && drop && (
          <FitBounds 
            pickup={{ lat: center[0], lon: center[1] }} 
            drop={{ lat: dropCenter[0], lon: dropCenter[1] }} 
          />
        )}
      </MapContainer>
        
      {/* Content overlay */}
      <div className="relative z-10 p-6 w-[400px] bg-white shadow-2xl rounded-2xl mt-10 ml-10">
        <h1 className="text-2xl font-bold mb-4">Book your ride</h1>

        {/* Pickup */}
        <div className="mb-4">
          <label className="block text-gray-700">Pickup Location</label>
          <input
            className="w-full border rounded-lg p-2 mt-1"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="Enter pickup location"
          />

          {/* History suggestions */}
          {!pickup && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Recent Locations:</p>
              <ul className="space-y-1">
                {historyLocations.map((loc) => (
                  <li
                    key={loc.lat + loc.lon}
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => handlePickupSelect(loc)}
                  >
                    {loc.name.slice(0, 32) + "..."}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Drop */}
        <div className="mb-4">
          <label className="block text-gray-700">Drop Location</label>
          <input
            className="w-full border rounded-lg p-2 mt-1"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            placeholder="Enter drop location"
          />
        </div>
        {pickup && !drop && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Recent Locations:</p>
              <ul className="space-y-1">
                {historyLocations.map((loc) => (
                  <li
                    key={"d" + loc.lat + loc.lon}
                    className="cursor-pointer text-blue-600 hover:underline"
                    onClick={() => handleDropSelect(loc)}
                  >
                    {loc.name.slice(0, 32) + "..."}
                  </li>
                ))}
              </ul>
            </div>
          )}
      </div>

      {/* Vehicle selection popup */}
      {showVehiclePopup && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`absolute bottom-10 left-72 -translate-x-1/2 bg-white p-6 rounded-2xl shadow-2xl w-[500px] z-10`}
        >
          <h2 className="text-xl font-semibold mb-4">Select Vehicle</h2>
          <div className="grid grid-cols-3 gap-4">
            {vehicles.map((v) => (
              <button
                key={v.name}
                className={`flex flex-col items-center p-4 border rounded-xl hover:bg-gray-100 ${
                  selectedVehicle?.name === v.name ? "border-3 border-blue-500" : "border-gray-300"
                }`}
                onClick={() => setSelectedVehicle(v)}
              >
                {v.icon}
                <span className="font-medium mt-2">{v.name}</span>
                <span className="text-sm text-gray-600">{v.capacity} people</span>
                <span className="text-green-600 font-semibold">{v.price}</span>
              </button>
            ))}
          </div>
          <button
            className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
            onClick={() => confirmRide()}
            disabled={!selectedVehicle || !pickup || !drop}
          >
            Confirm Ride
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default UserHomePage
