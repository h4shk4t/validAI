import { useCodespaceStore } from "@/lib/stores/codespace-store";
import axios from "axios";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const Terminal = () => {
  const [command, setCommand] = useState<string>("");
  const [output, setOutput] = useState<string>("This is your regular console, type commands to get started.");
  const { homeFolderPath } = useCodespaceStore();
  const [changed_diretories, setChangedDirectories] = useState<string[]>([]);

  async function exec(command: string) {
    try {
      console.log(homeFolderPath + changed_diretories.join("/"));
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URI}/run-command`,
        {
          command: `cd ${
            homeFolderPath + "/" + changed_diretories.join("/")
          } && ${command}`,
        }
      );
      setOutput(res.data.output);
      console.log(res.data.output);
    } catch (error) {
      setOutput("Error executing the command.");
      console.error(error);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (command.startsWith("cd ")) {
      setChangedDirectories((prev) => [
        ...prev,
        ...command.split(" ")[1].split("/"),
      ]);
      setOutput("");
    } else {
      await exec(command);
    }
    setCommand("");
  };

  return (
    <>
      <div className="text-sm font-mono p-2 whitespace-pre">{output}</div>
      <div className="flex flex-row gap-2 w-full border-t py-1 bg-muted fixed bottom-0">
        <ChevronRight className="w-4" />
        <form className="flex-1" onSubmit={handleSubmit}>
          <input
            type="text"
            value={command}
            placeholder="Enter command..."
            onChange={(e) => setCommand(e.target.value)}
            className="w-full outline-none font-mono text-sm bg-muted"
          />
        </form>
      </div>
    </>
  );
};

export default Terminal;
