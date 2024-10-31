import axios from "axios";
import { useEffect, useState } from "react";
import useTokenStore from "@/lib/stores/token";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import { cloneRepo } from "@/lib/api";
import { useCodespaceStore } from "@/lib/stores/codespace-store";
import { useNavigate } from "react-router-dom";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";

const Repos = () => {
  const [repos, setRepos] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>();
  const token = useTokenStore((s) => s.token);
  const [profileLoading, setProfileLoading] = useState(true);
  const [reposLoading, setReposLoading] = useState(true);
  const [openingRepo, setOpeningRepo] = useState<string | null>(null); // Track the repo being opened

  const { setFolderPath } = useCodespaceStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await axios.get("https://api.github.com/user/repos", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRepos(response.data);
        console.log("repo-data,", response.data[0]);
      } catch (error) {
        console.error(error);
      } finally {
        setReposLoading(false);
      }
    };

    fetchRepos();
  }, [token]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserData(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchUserData();
  }, [token]);

  const openEditor = async (user_name: string, repo_name: string) => {
    setOpeningRepo(repo_name); // Set the repo being opened
    const res = await cloneRepo(user_name, repo_name, token);
    console.log(res);
    setFolderPath("./repos/" + repo_name);
    navigate("/code");
  };

  return (
    <div className="h-screen w-[64vw] mx-auto pt-4">
      {profileLoading ? (
        <div>Profile Loading...</div>
      ) : (
        <div className="flex flex-row items-center justify-between mb-4">
          <div className="flex flex-row items-center gap-4">
            <Avatar>
              <AvatarImage src={userData?.avatar_url} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold">{userData?.name}</h1>

              <p className="text-xs">{userData?.bio}</p>
            </div>
          </div>
          <p className="text-sm">
            <span className="font-semibold text-primary-foreground">
              {userData?.public_repos}
            </span>{" "}
            Public Repositories
          </p>
          <DynamicWidget />
        </div>
      )}
      {reposLoading ? (
        <div>Repos Loading...</div>
      ) : (
        <>
          <Input placeholder="Search Repos..." />
          <div className="space-y-2 mt-4">
            {repos?.map((repo, index) => (
              <div
                className="p-2 rounded-md border transition-all duration-150 hover:bg-white/5 hover:cursor-pointer hover:-translate-y-[2px]"
                onClick={async () =>
                  await openEditor(repo?.owner?.login, repo?.name)
                }
                key={index}
              >
                <div className="flex flex-row items-center">
                  {openingRepo === repo?.name ? (
                    <span className="text-muted-foreground font-medium">
                      Setting up your IDE...
                    </span>
                  ) : (
                    <>
                      {repo?.full_name}
                      {repo?.visibility === "private" && (
                        <Lock className="w-4 h-4 ml-2 text-primary" />
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Repos;
