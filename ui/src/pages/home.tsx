import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate("/code")}>Go to editor</Button>
      <Button
        onClick={() =>
          (window.location.href =
            "https://github.com/login/oauth/authorize?client_id=Ov23liRv0ktKpaw29Jfw&scope=repo,user")
        }
      >
        Sign in with GitHub
      </Button>
    </div>
  );
};

export default HomePage;
