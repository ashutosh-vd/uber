import React from 'react'

const OnRide = ({captain="Captain1", customer="Customer1"}) => {
  return (
    <div>
      <h1>On Ride</h1>
      <h2>Customer: {customer}</h2>
      <h2>Captain: {captain}</h2>
    </div>
  )
}

export default OnRide