import { DynamicWidget, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { useNavigate } from "react-router-dom";

const Dynamic = () => {
  const isLoggedIn = useIsLoggedIn();
  const navigate = useNavigate();

  if (isLoggedIn) {
    navigate("/dashboard");
  }
  return <DynamicWidget />;
};

export default Dynamic;
