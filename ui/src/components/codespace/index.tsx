import TopBar from "./top-bar";
import DevArea from "./dev-area";
import StatusBar from "./status-bar";

const CodeSpace = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      <TopBar />
      <DevArea />
      <StatusBar />
    </div>
  );
};

export default CodeSpace;
