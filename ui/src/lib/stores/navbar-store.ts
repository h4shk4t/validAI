import { create } from "zustand";

interface navItem {
  name: string;
  link: string;
}

type NavbarStore = {
  navItems: navItem[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
};

export const useNavbarStore = create<NavbarStore>((set) => ({
  navItems: [
    { name: "Marketplace", link: "/marketplace" },
    { name: "Apps", link: "/apps" },
  ],
  activeIndex: 0,
  setActiveIndex: (index) => set({ activeIndex: index }),
}));
