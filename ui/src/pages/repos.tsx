import axios from "axios";
import { useEffect, useState } from "react";
import useTokenStore from "@/lib/stores/token";

const Repos = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = useTokenStore((s) => s.token);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get("https://api.github.com/user/repos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRepos(response.data);
        setLoading(false); 
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchRepos();
  }, [token]);

  return (
    <div>
      <h1>Repos</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {repos.map((repo) => (
            <li key={repo?.name}>{repo?.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Repos;