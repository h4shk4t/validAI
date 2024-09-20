import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return <Button onClick={() => navigate("/code")}>Go to editor</Button>;
};

export default HomePage;
