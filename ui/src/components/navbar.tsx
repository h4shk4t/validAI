import { Link, useNavigate } from "react-router-dom";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useNavbarStore } from "@/lib/stores/navbar-store";
import { Button } from "./ui/button";
import { BotMessageSquare, Code } from "lucide-react";

const NavBar = () => {
  const { navItems, activeIndex, setActiveIndex } = useNavbarStore();
  const navigate = useNavigate();

  return (
    <>
      {/* <div className="mx-auto h-screen pt-4 w-[80vw] 2xl:w-[72vw] max-w-[1400px]"> */}
      <header className="flex items-center justify-between bg-background py-2 shadow-sm">
        <div className="flex items-center">
          <Link
            to="/marketplace"
            className="flex items-center w-56 justify-center"
          >
            <img src="/lookout.png" width={120} alt="" />{" "}
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "px-4 py-2 rounded-full cursor-pointer",
                  activeIndex === index
                    ? "border-b-2 border-r bg-accent/20 text-white"
                    : "text-muted-foreground"
                )}
                onClick={() => {
                  setActiveIndex(index);
                  navigate(item.link);
                }}
              >
                {item.name}
              </div>
            ))}
            {activeIndex === 1 && (
              <motion.div
                className="border-l flex flex-row gap-2 px-2 z-0"
                initial={{ x: "-10%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{ duration: 0.5, type: "spring", damping: 20 }}
              >
                <Button size={"iconSm"} variant={'outline'} className="rounded-full">
                  <Code size={16} />
                </Button>
                <Button size={"iconSm"} variant={'outline'} className="rounded-full">
                  <BotMessageSquare size={16} />
                </Button>
              </motion.div>
            )}
          </nav>
        </div>

        <DynamicWidget />
      </header>
      {/* </div> */}
    </>
  );
};

export default NavBar;
