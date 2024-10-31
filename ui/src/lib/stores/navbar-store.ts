import { ElementType } from "react";
import { create } from "zustand";
import Code from "@/components/apps/code";
import ChatBot from "@/components/apps/chatbot";
import { BotMessageSquare, Code2 } from "lucide-react";

interface NavItem {
  name: string;
  link: string;
}

interface AppItem {
  name: string;
  component: ElementType;
  icon: ElementType;
}

type NavbarStore = {
  navItems: NavItem[];
  apps: AppItem[];
  activeIndex: number;
  activeAppIndex: number;
  setActiveIndex: (index: number) => void;
  setActiveAppIndex: (index: number) => void;
};

export const useNavbarStore = create<NavbarStore>((set) => ({
  navItems: [
    { name: "Marketplace", link: "/marketplace" },
    { name: "Apps", link: "/apps" },
  ],
  apps: [
    { name: "Code", icon: Code2, component: Code },
    { name: "Chat", icon: BotMessageSquare, component: ChatBot },
  ],
  activeIndex: 0,
  activeAppIndex: -1,
  setActiveAppIndex: (index) => set({ activeAppIndex: index }),
  setActiveIndex: (index) => set({ activeIndex: index }),
}));
