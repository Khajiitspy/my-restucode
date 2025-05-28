//From Petro's version. Not used anywhere.

/////////////////////
//
//  This code is not used anywhere
//
/////////////////////

import { create } from "zustand";

export const useAuthStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => {
        localStorage.removeItem("jwt");
        set({ user: null });
    },
}));