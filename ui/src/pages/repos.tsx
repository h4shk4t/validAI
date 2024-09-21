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
        setRepos(response.data)
        setLoading(false); 
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchRepos();
    console.log(repos[0]);
  }, [token]);

  return (
    <div className="h-screen w-[60vw] mx-auto pt-4">
      <h1 className="text-4xl">Hi, @vrag99 :)</h1>
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