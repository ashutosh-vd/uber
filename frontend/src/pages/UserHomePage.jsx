/* eslint-disable no-unused-vars */
import React, { useState, useEffect, use } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, Polyline} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useUserStore } from '../stores/useUserStore.js'
import { useMapStore } from "../stores/useMapStore.js";
import { Navigate } from 'react-router-dom';
import { FaCar, FaMotorcycle, FaTaxi } from "react-icons/fa";
import { motion } from "framer-motion";
import VehicleRoute from "../components/VehicleRoute.jsx";

const UserHomePage = () => {
  const { isLoggedIn, isCaptain } = useUserStore();
  const { testMap, getPickupSuggestions, isLoadingPickupSuggestions, pickupSuggestions, setPickupSuggestions, dropSuggestions, setDropSuggestions, isLoadingDropSuggestions, getDropSuggestions } = useMapStore();

  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [pickupObj, setPickupObj] = useState(null);
  const [dropObj, setDropObj] = useState(null);
  const [showVehiclePopup, setShowVehiclePopup] = useState(false);
  const [center, setCenter] = useState([28.6139, 77.2090]);
  const [dropCenter, setDropCenter] = useState([28.6139, 77.2090]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const [isRequested, setIsRequested] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [captain, setCaptain] = useState(null);
  
  const [showPickupDropBox, setShowPickupDropBox] = useState(false);
  const [showDropDropBox, setShowDropDropBox] = useState(false);

  useEffect(() => {
    if(isRejected) {
      setIsRequested(false);
      setCaptain(null);
      setShowVehiclePopup(false);
    }
  }, [isRejected]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if(pickup.trim()) {
        try {
          await getPickupSuggestions(pickup);
        }
        catch(error) {
          console.error(error);
          setPickupSuggestions([]);
        }
      }
      else {
        setPickupSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [pickup, getPickupSuggestions, setPickupSuggestions]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if(drop.trim()) {
        try {
          await getDropSuggestions(drop);
        }
        catch(error) {
          console.error(error);
          setDropSuggestions([]);
        }
      }
      else {
        setDropSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [drop, getDropSuggestions, setDropSuggestions]);

  useEffect(() => {
    setShowPickupDropBox(pickup.trim().length > 0 && pickupObj);
  }, [pickup, pickupObj]);
  useEffect(() => {
    setShowDropDropBox(drop.trim().length > 0 && dropObj);
  }, [drop, dropObj]);


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
    setPickupObj(loc || {});
    setCenter([loc.lat, loc.lon]);
  };
  
  const handleDropSelect = (loc) => {
    setDrop(loc.name);
    setDropCenter([loc.lat, loc.lon]);
    setDropObj(loc || {});
    setShowVehiclePopup(true);
  };
  
  const confirmRide = () => {
    setShowVehiclePopup(false);
    setIsRequested(true);
    setCaptain({
      name: "Captain",
      phone: "1234567890",
      vehicle: {
        plate: "ABC123",
        capacity: 4,
        vehicleType: "Car"
      },
    })
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
          <div>
            <FitBounds 
              pickup={{ lat: center[0], lon: center[1] }} 
              drop={{ lat: dropCenter[0], lon: dropCenter[1] }} 
            />
            <VehicleRoute pickupObj={pickupObj} dropObj={dropObj} />
          </div>
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
            onChange={(e) => setPickup(e.target.value) & setShowPickupDropBox(true)}
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
                    className="cursor-pointer text-blue-600 hover:underline text-sm truncate"
                    onClick={() => handlePickupSelect(loc)}
                  >
                    {/* {loc.name.slice(0, 32) + "..."} */}
                    {loc.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Online Suggestion in dropbox */}
          {isLoadingPickupSuggestions && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          )}
          {showPickupDropBox && !isLoadingPickupSuggestions && (
            <div className="w-auto border-2 border-gray-200 relative">
              <div className="flex justify-between w-auto">
                <p className="text-sm text-gray-500">Online Suggestions:</p>
                <p className="text-sm text-gray-500 font-extrabold cursor-pointer"
                onClick={() => setShowPickupDropBox(false)}
                >
                  X
                </p>
              </div>
              <ul className="absolute left-0 right-0 bg-white overflow-y-auto border-2 border-gray-200">
                {pickupSuggestions.map((suggestion) => (
              <li
                  key={suggestion.lat + suggestion.lon}
                  className="px-4 py-2 text-blue-600 hover:underline hover:cursor-pointer"
                  onClick={() => handlePickupSelect(suggestion) & setShowPickupDropBox(false)}
              >
                    {suggestion.name}
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

          {/* History suggestions */}
          {pickup && !drop && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Recent Locations:</p>
              <ul className="space-y-1">
                {historyLocations.map((loc) => (
                  <li
                    key={"d" + loc.lat + loc.lon}
                    className="cursor-pointer text-blue-600 hover:underline truncate text-sm"
                    onClick={() => handleDropSelect(loc)}
                  >
                    {loc.name}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* online suggestions */}
          {isLoadingDropSuggestions && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Loading...</p>
            </div>
          )}
          {showDropDropBox && !isLoadingDropSuggestions && (
            <div className="w-auto border-2 border-gray-200 relative">
              <div className="flex justify-between">
                <p className="text-sm text-gray-500">Online Suggestions:</p>
                <p className="text-sm text-gray-500 font-extrabold select-none cursor-pointer"
                onClick={() => setShowDropDropBox(false)}
                >
                  X
                </p>
              </div>
              <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow my-5 py-2">
                {dropSuggestions.map((suggestion) => (
                  <li
                  key={suggestion.lat + suggestion.lon + "d"}
                  className="px-4 py-2 text-blue-600 hover:underline hover:cursor-pointer"
                  onClick={() => handleDropSelect(suggestion) & setShowDropDropBox(false)}
                  >
                    {suggestion.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
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
            className={`mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full ${!selectedVehicle || !pickup || !drop ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => confirmRide()}
            disabled={!selectedVehicle || !pickup || !drop}
          >
            Confirm Ride
          </button>
        </motion.div>
      )}
      {/* ride request sent message */}
      {isRequested && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute bottom-10 left-64 transform -translate-x-1/2 bg-white p-6 rounded-2xl shadow-2xl z-10"
        >
          <div className="flex flex-row justify-between">
            <h2 className="text-lg font-semibold mb-4">Ride Request Sent</h2>
            {/* loading icon */}
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
          <p className="text-gray-600">Your ride request has been sent successfully.</p>
          
          <button className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" 
          onClick={() => {
            setIsRequested(false);
            setShowVehiclePopup(true);
          }}
          >
            cancel
          </button>
        </motion.div>
      )}
      {/* ride confirmed message */}
      {isAccepted && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute bottom-10 left-64 transform -translate-x-1/2 bg-white p-6 rounded-2xl shadow-2xl z-10"
        >
          <div className="flex flex-row justify-between">
            <h2 className="text-lg font-semibold mb-4">Ride Confirmed</h2>  
            <div className="bg-green-500 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
          </div>
          <p className="text-gray-600">Your ride has been confirmed. captain on the way...</p>
          {/* captain info */}
          {captain && (
            <div className="mt-4">
              <p className="text-gray-600">Captain Name: {captain.name}</p>
              <p className="text-gray-600">Captain Phone: {captain.phone}</p>
              <div>
                <p>Vehicle: {captain.vehicle.vehicleType}</p>
                <p>Capacity: {captain.vehicle.capacity} people</p>
                <p>Plate Number: {captain.vehicle.plate}</p>
              </div>
              <p className="text-gray-600">OTP: {123456}</p>
            </div>
          )}
          <button className="mt-4 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" 
          onClick={() => {
            setIsAccepted(false);
          }}
          >
            cancel
          </button>
        </motion.div>
      )}
      {isRejected && !showVehiclePopup && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="absolute bottom-10 left-64 transform -translate-x-1/2 bg-white p-6 rounded-2xl shadow-2xl z-10"
        >
          <div className="flex flex-row justify-between">
            <h2 className="text-lg font-semibold mb-4">Ride Rejected</h2>  
            <div className="bg-red-500 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-red-900"></div>
          </div>
          <p className="text-gray-600">Your ride has been rejected. Please try again.</p>
          <button className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" 
          onClick={() => {
            setIsRejected(false);
            setShowVehiclePopup(true);
          }}
          >
            continue
          </button>
        </motion.div>
      )}
    </div>
  );
}

export default UserHomePage

