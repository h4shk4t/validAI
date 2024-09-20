import Brand from "./brand";
import HomeFolder from "./home-folder";

const Header = () => {
  return (
    <div className="border-b flex flex-row items-center">
      <Brand />
      <HomeFolder />
    </div>
  );
};

export default Header;
