import { create } from "zustand";
import api from "../utils/api.js";

export const useMapStore = create((set, get) => ({
  map: null,
  setMap: (map) => set({ map }),
  
  //Location = { name , lat, lon}
  pickupLocation: null,
  setPickupLocation: (location) => set({ pickupLocation: location }),
  
  dropLocation: null,
  setDropLocation: (location) => set({ dropLocation: location }),

  pickupSuggestions: [],
  setPickupSuggestions: (pickupSuggestions) => set({ pickupSuggestions }),
  isLoadingPickupSuggestions: false,
  setIsLoadingPickupSuggestions: (isLoading) => set({ isLoadingPickupSuggestions: isLoading }),

  getPickupSuggestions: async (query) => {
    get().setIsLoadingDropSuggestions(true);
    try {
      console.log(query);
      const res = await api.post("/v1/api/map/get-suggestions", { query });
      if(!res.data) {
        return [];
      }
      get().setPickupSuggestions(res.data);
      console.log(res.data);
      return res.data;
    }
    catch(error) {
      console.error(error);
      return [];
    }
    finally {
      get().setIsLoadingPickupSuggestions(false);
    }
  },

  testMap : async () => {
    try {
      const response = await api.get("/v1/api/map");
      console.log("happy: ", response);
      return response.data;
    }
    catch(error) {
      console.error(error);
    }
  },

  dropSuggestions: [],
  setDropSuggestions: (dropSuggestions) => set({ dropSuggestions }),
  isLoadingDropSuggestions: false,
  setIsLoadingDropSuggestions: (isLoading) => set({ isLoadingDropSuggestions: isLoading }),
  getDropSuggestions: async (query) => {
    get().setIsLoadingDropSuggestions(true);
    try {
      console.log(query);
      const res = await api.post("/v1/api/map/get-suggestions", { query });
      if(!res.data) {
        return [];
      }
      get().setDropSuggestions(res.data);
      console.log(res.data);
      return res.data;
    }
    catch(error) {
      console.error(error);
      return [];
    }
    finally {
      get().setIsLoadingDropSuggestions(false);
    }
  }
}))