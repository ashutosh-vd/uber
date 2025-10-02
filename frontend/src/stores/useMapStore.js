import { create } from "zustand";

export const useMapStore = create((set) => ({
  map: null,
  setMap: (map) => set({ map }),
  
  //Location = { name , lat, lon}
  pickupLocation: null,
  setPickupLocation: (location) => set({ pickupLocation: location }),
  
  dropLocation: null,
  setDropLocation: (location) => set({ dropLocation: location }),
}))