import InitializeCodebase from "@/components/apps/initialize-codebase";
import NavBar from "@/components/navbar";
import { useCodespaceStore } from "@/lib/stores/codespace-store";
import { useNavbarStore } from "@/lib/stores/navbar-store";

const Apps = () => {
  const { hasOnboarded } = useCodespaceStore();
  const { activeAppIndex, apps } = useNavbarStore();
  const ActiveApp = apps[activeAppIndex]?.component || null;
  return (
    <div className="flex flex-col w-full h-screen">
      <NavBar />
      <div className="flex-1">
        {!hasOnboarded ? <InitializeCodebase /> : <ActiveApp />}
      </div>
    </div>
  );
};

export default Apps;
