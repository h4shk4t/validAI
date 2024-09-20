import Brand from "./brand";
import HomeFolder from "./home-folder";

const Header = () => {
  return (
    <div className="border-b flex flex-row items-center h-10">
      <Brand />
      <HomeFolder />
    </div>
  );
};

export default Header;
