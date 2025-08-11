import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "@/api/axios";
import { AuthContext } from "@/context/AuthContext";

const OAuthSuccess = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { hydrate } = useContext(AuthContext);

  useEffect(() => {
    const token = params.get("accessToken");
    if (!token) {
      navigate("/login?error=missing_token");
      return;
    }
    localStorage.setItem("token", token);
    API.get("/auth/me")
      .then(async () => {
        await hydrate();
        navigate("/trips");
      })
      .catch(() => navigate("/login?error=session_init_failed"));
  }, [params, navigate, hydrate]);

  return null;
};

export default OAuthSuccess; 