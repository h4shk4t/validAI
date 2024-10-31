import { Link, useNavigate } from "react-router-dom";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useNavbarStore } from "@/lib/stores/navbar-store";
import { Button } from "./ui/button";
import { BotMessageSquare, Code, Plus } from "lucide-react";

const NavBar = () => {
  const {
    navItems,
    apps,
    activeAppIndex,
    activeIndex,
    setActiveIndex,
    setActiveAppIndex,
  } = useNavbarStore();
  const navigate = useNavigate();

  return (
    <>
      {/* <div className="mx-auto h-screen pt-4 w-[80vw] 2xl:w-[72vw] max-w-[1400px]"> */}
      <header className="flex items-center justify-between bg-background py-2 shadow-sm border-b">
        <div className="flex items-center">
          <Link
            to="#"
            className="flex items-center w-64 justify-center "
          >
            <img src="/lookout.png" width={120} alt="" />{" "}
          </Link>
          <nav className="hidden items-center gap-2 md:flex">
            {navItems.map((item, index) => (
              <div
                key={index}
                className={cn(
                  "text-sm h-10 px-4 tracking-tight rounded-full cursor-pointer box-border flex items-center",
                  activeIndex === index
                    ? "border-b border-r bg-accent/20 text-white"
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
            <AnimatePresence>
              {activeIndex === 1 ? (
                <motion.div
                  className="border-l flex flex-row gap-2 px-2 z-0"
                  initial={{ x: "-10%", opacity: 0 }}
                  animate={{ x: "0%", opacity: 1 }}
                  exit={{ x: "-10%", opacity: 0 }}
                  transition={{ duration: 0.5, type: "spring", damping: 15 }}
                >
                  {apps.map((app, index) => (
                    <Button
                      key={index}
                      size={"iconSm"}
                      variant={activeAppIndex === index ? "default" : "outline"}
                      className="rounded-full"
                      onClick={() => setActiveAppIndex(index)}
                      disabled={activeAppIndex === -1}
                    >
                      <app.icon size={16} />
                    </Button>
                  ))}
                  <Button
                    size={"iconSm"}
                    variant={"ghost"}
                    className="rounded-full text-muted-foreground"
                  >
                    <Plus size={16} />
                  </Button>
                </motion.div>
              ) : (
                ""
              )}
            </AnimatePresence>
          </nav>
        </div>

        <DynamicWidget />
      </header>
      {/* </div> */}
    </>
  );
};

export default NavBar;
