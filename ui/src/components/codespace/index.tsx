import DevArea from "./dev-area";
import StatusBar from "./status-bar";

const CodeSpace = () => {
  return (
    <div className="w-full h-screen flex flex-col">
      <DevArea />
      <StatusBar />
    </div>
  );
};

export default CodeSpace;
