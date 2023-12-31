import { create } from 'zustand'

const useStore = create((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn })),
  userID : '',
  setUserID :(id) => set(() => ({ userID: id  })),
  userData : null,
  setUserData :(data) => set(() => ({ userData: data  })),
  propertyData : null,
  setPropertyData :(data) => set(() => ({ propertyData: data  })),
  profileStats : null,
  setProfileStats :(data) => set(() => ({ profileStats: data })),
}))

export default useStore;