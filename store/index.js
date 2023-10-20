import { create } from 'zustand'

const useStore = create((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn) => set(() => ({ isLoggedIn })),
  userID : '',
  setUserID :(id) => set(() => ({ userID: id  })),
  userData : null,
  setUserData :(data) => set(() => ({ userData: data  })),
}))

export default useStore;