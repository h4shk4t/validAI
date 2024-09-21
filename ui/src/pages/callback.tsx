import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import axios from "axios";
import useTokenStore from "@/lib/stores/token";

const backend = import.meta.env.VITE_BACKEND_URI;

const Callback = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");
  const setToken = useTokenStore((s) => s.setToken);
  const token = useTokenStore((s) => s.token);
  console.log("token", token);
  useEffect(() => {
    const fetchAccessToken = async () => {
      if (code) {
        try {
          const response = await axios.post(`${backend}/token`, {
            code,
          });
          const accessToken = response?.data?.access_token;
          if (accessToken) {
            setToken(accessToken);
            navigate("/dynamic");
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchAccessToken();
  }, [code, navigate, setToken]);
  return (
    <div>
      <Button onClick={() => navigate("/dashboard")}>Go to dashboard</Button>
    </div>
  );
};

export default Callback;
