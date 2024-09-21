import { create } from "zustand";

interface TokenStore {
  token: string;
  setToken: (token: string) => void;
}

const useTokenStore = create<TokenStore>((set) => ({
  token: "",
  setToken: (token) => set({ token }),
}));

export default useTokenStore;
