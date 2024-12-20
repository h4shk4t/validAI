import { create } from "zustand";

interface TokenStore {
  token: string;
  username: string;
  setToken: (token: string) => void;
  setUsername: (username: string) => void;
}

const useTokenStore = create<TokenStore>((set) => ({
  token: localStorage.getItem("token") || "",
  username: "",
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  setUsername: (username) => set({ username }),
}));

export default useTokenStore;
