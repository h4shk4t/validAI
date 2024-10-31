import Brand from "./brand";
import HomeFolder from "./home-folder";

const Header = () => {
  return (
    <div className="border-b flex flex-row items-center h-10">
      <div className="w-12 px-2 h-full border-r" />
      <HomeFolder />
    </div>
  );
};

export default Header;
