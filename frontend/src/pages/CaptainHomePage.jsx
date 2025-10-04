/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore.js";
import { Navigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";
import OnRide from "../components/OnRide.jsx";
import VehicleRoute from "../components/VehicleRoute.jsx";
import { useRideStore } from "../stores/useRideStore.js";

const CaptainHomePage = () => {
  const { isLoggedIn, isCaptain, checkAuth} = useUserStore();
  const { getRideRequestsAll, assignCaptainClient, isCheckingOtp } = useRideStore();

  const [otp, setOtp] = useState("");
  const [requests, setRequests] = useState([]);
  const [activeRide, setActiveRide] = useState(null);
  const [acceptedRide, setAcceptedRide] = useState(null);
  const [rideCancelledCustomerSide, setRideCancelledCustomerSide] = useState("");
  const [isRiding, setIsRiding] = useState(false);
  const [pickupObj, setPickupObj] = useState(null);
  const [dropObj, setDropObj] = useState(null);


  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if(acceptedRide) {
      setRequests([acceptedRide]);
      return;
    }
    const fetchRideRequests = async () => {
      try {
        const data = await getRideRequestsAll();
        const newRequests = data.map((req) => {
          return {
            id: req._id,
            pickup: req.pickup,
            drop: req.drop,
            createdAt: req.createdAt,
            rejected: requests.some((origReq) => origReq.id === req._id && origReq.rejected === true),
          }
        });
        setRequests(newRequests);
      }
      catch (error) {
        console.error(error);
      }
    };

    fetchRideRequests();
  }, [acceptedRide, getRideRequestsAll]);

  if (!isLoggedIn || !isCaptain) {
    return <Navigate to={"/login"} />;
  }

  const FitBounds = ({ pickup, drop }) => {
    const map = useMap();

    useEffect(() => {
      if (pickup && drop) {
        const bounds = [
          [pickup.lat, pickup.lon],
          [drop.lat, drop.lon],
        ];
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [pickup, drop, map]);

    return null;
  };

  const checkOtpAndStartRide = async (otp, rideId) => {
    const captainAssignment = await assignCaptainClient(otp, rideId);

    setIsRiding(captainAssignment);
    if(!captainAssignment) {
      return alert("invalid otp");
    }
  };

  const handleShow = (e, req) => {
    setActiveRide(req);
    setPickupObj(req.pickup);
    setDropObj(req.drop);
    // console.log(pickupObj, dropObj);
  }
  const handleAccept = (e, req) => {
    e.stopPropagation();
    setActiveRide(req);
    setAcceptedRide(req);
    handleShow(e, req);
  };

  const handleReject = (e, id) => {
    e.stopPropagation();
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="relative w-screen h-[calc(100vh-96px)] overflow-hidden flex">
      {/* Background gradient animation */}
      <motion.div
        initial={{ backgroundPosition: "0% 0%" }}
        className="absolute inset-0 bg-gradient-to-br from-green-200 to-blue-200 z-0"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Map */}
      <MapContainer
        className="absolute inset-0 z-10 h-full w-[100vw]"
        center={[12.9716, 77.5946]} // default: Bengaluru
        zoom={12}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* If a ride is active, show pickup and drop */}
        {activeRide && (
          <>
            <Marker position={[activeRide.pickup.lat, activeRide.pickup.lon]}>
              <Popup>Pickup: {activeRide.pickup.name}</Popup>
            </Marker>
            <Marker position={[activeRide.drop.lat, activeRide.drop.lon]}>
              <Popup>Drop: {activeRide.drop.name}</Popup>
            </Marker>
            <FitBounds pickup={activeRide.pickup} drop={activeRide.drop} />
            <VehicleRoute pickupObj={pickupObj} dropObj={dropObj} />
          </>
        )}
      </MapContainer>

      {/* Requests Panel */}
      <div className="relative z-20 ml-auto w-1/3 h-full bg-white shadow-2xl p-6 overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">Ride Requests</h2>
        {requests.reduce((acc, req) => acc + !req.rejected, 0) === 0 && (
          <p className="text-gray-500">No pending requests</p>
        )}
        <ul className="space-y-4">
          {!acceptedRide && [...requests].reverse().map((req) => !req.rejected && (
            <li
              key={req.id}
              className="border rounded-lg p-4 shadow-sm bg-gray-50"
              onClick={(e) => handleShow(e,req)}
            >
              <p className="font-semibold text-lg">Request #{req.id}</p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Pickup:</span> {req.pickup.name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Drop:</span> {req.drop.name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Requested At: </span> 
                {req.createdAt?.split("T")[0] + ", " + req.createdAt?.split("T")[1].slice(0, -1)}
              </p>
              <div className="flex gap-3 mt-3">
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  onClick={(e) => {handleAccept(e, req)}}
                >
                  Accept
                </button>
                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  onClick={(e) => handleReject(e, req.id)}
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
          {acceptedRide && (
            <li className="border rounded-lg p-4 shadow-sm bg-gray-50">
              <p className="font-semibold text-lg">Request #{acceptedRide.id}</p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Pickup:</span> {acceptedRide.pickup.name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Drop:</span> {acceptedRide.drop.name}
              </p>
              {!rideCancelledCustomerSide && !isRiding && acceptedRide && (
                <div className="flex gap-3 mt-3">
                  <input type="text" 
                    placeholder="Enter OTP"
                    className="border rounded-lg p-2 w-full"
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <button 
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    disabled={isCheckingOtp}
                    onClick={() => checkOtpAndStartRide(otp, acceptedRide.id)}
                  >
                    {isCheckingOtp ? "Checking OTP..." : "Confirm Start Ride"}
                  </button>
                </div>
              )}
              {isRiding && (
                <div>
                  <OnRide props={{captain: acceptedRide.captain, customer: acceptedRide.customer}}/>
                </div>
              )}
              {/* Add more details here of customer TODO */}
            </li>
          )}
          {acceptedRide && rideCancelledCustomerSide && (
            <li className="border rounded-lg p-4 shadow-sm bg-red-50">
              <p className="font-semibold text-lg">Request #{acceptedRide.id}</p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Pickup:</span> {acceptedRide.pickup.name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Drop:</span> {acceptedRide.drop.name}
              </p>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Reason:</span> {rideCancelledCustomerSide}
              </p>
              <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => {
                  setRideCancelledCustomerSide("")
                  setAcceptedRide(null)
                }}
              >
                return
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CaptainHomePage;
