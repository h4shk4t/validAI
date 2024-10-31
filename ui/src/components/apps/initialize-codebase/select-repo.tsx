import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useStepper } from "@/components/ui/stepper";
import { cloneRepo } from "@/lib/api";
import { useCodespaceStore } from "@/lib/stores/codespace-store";
import { useNavbarStore } from "@/lib/stores/navbar-store";
import useTokenStore from "@/lib/stores/token";
import axios from "axios";
import { ChevronLeft, ChevronsLeft, ChevronsRight, Lock } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SelectRepoProps {
  step: number;
  setStep: (step: number) => void;
}

const SelectRepo = (props: SelectRepoProps) => {
  const { nextStep, prevStep } = useStepper();
  const { setHasOnboarded } = useCodespaceStore();
  const { setActiveAppIndex } = useNavbarStore();
  const token = useTokenStore((s) => s.token);

  const [repos, setRepos] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [reposLoading, setReposLoading] = useState(true);
  const [openingRepo, setOpeningRepo] = useState<string | null>(null);
  const [openingRepoUser, setOpeningRepoUser] = useState<string | null>(null);
  const [settingUp, setSettingUp] = useState(false);
  const { setFolderPath } = useCodespaceStore();

  const filteredRepos = repos.filter((repo) =>
    repo.full_name.toLowerCase().includes(search.toLowerCase())
  );

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

  const openEditor = async () => {
    if (!openingRepo || !openingRepoUser) return;
    setSettingUp(true);
    const res = await cloneRepo(openingRepoUser, openingRepo, token);
    console.log(res);
    setFolderPath("./repos/" + openingRepo);
    setHasOnboarded(true);
    setActiveAppIndex(0);
    nextStep();
    setSettingUp(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tighter my-2">
        Get started with your Repository
      </h1>
      <Input
        placeholder="Search Repos..."
        onChange={(e) => setSearch(e.target.value)}
      />
      {reposLoading ? (
        <div className="h-[20rem] border-b border-secondary mt-4">
          Getting your Repositories...
        </div>
      ) : (
        <>
          <div className="space-y-2 mt-4 h-[20rem] overflow-scroll border-b-2 py-2 border-accent">
            {filteredRepos?.map((repo, index) => (
              <div
                className={cn(
                  "p-2 rounded-md border transition-all duration-150 hover:border-b-primary hover:cursor-pointer hover:-translate-y-[2px]",
                  { "border-primary": openingRepo === repo?.name }
                )}
                onClick={() => {
                  setOpeningRepo(repo?.name);
                  setOpeningRepoUser(repo?.owner?.login);
                }}
                key={index}
              >
                <div className="flex flex-row items-center">
                  <>
                    {repo?.full_name}
                    {repo?.visibility === "private" && (
                      <Lock className="w-4 h-4 ml-2 text-primary" />
                    )}
                  </>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <div className="space-x-2 mt-8 flex items-center float-right">
        <Button
          variant={"ghost"}
          onClick={() => {
            prevStep();
            props.setStep(props.step - 1);
          }}
        >
          <ChevronsLeft className="mr-1" size={16} /> Prev
        </Button>
        <Button disabled={!openingRepo || settingUp} onClick={openEditor}>
          {settingUp ? (
            "Setting up..."
          ) : (
            <>
              Next <ChevronsRight className="ml-1" size={16} />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SelectRepo;
