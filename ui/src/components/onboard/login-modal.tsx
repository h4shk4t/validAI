import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Check, Github, MoveRight } from "lucide-react";
import { DynamicWidget, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { useNavigate } from "react-router-dom";
import useTokenStore from "@/lib/stores/token";

const LoginModal = () => {
  const isDynamicLoggedIn = useIsLoggedIn();
  const accessToken = useTokenStore((s) => s.token);
  const isGithubLoggedIn = !!accessToken;

  const navigate = useNavigate();

  return (
    <Dialog>
      <DialogTrigger asChild>
        {isDynamicLoggedIn && isGithubLoggedIn ? (
          <Button
            onClick={() => {
              if (isDynamicLoggedIn && isGithubLoggedIn) {
                navigate("/repos");
              }
            }}
            className="mb-10 text-lg px-10 py-6"
            variant={"expandIcon"}
            iconPlacement="right"
            Icon={MoveRight}
          >
            Get Started
          </Button>
        ) : (
          <Button
            className="mb-10 text-lg px-10 py-6"
            variant={"expandIcon"}
            iconPlacement="right"
            Icon={MoveRight}
          >
            Login
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Login with Github and Dynamic</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col space-y-4">
          {isGithubLoggedIn ? (
            <p className="inline-flex items-center gap-2">
              Github logged in <Check className="w-4 h-4" />
            </p>
          ) : (
            <Button
              onClick={() =>
                (window.location.href =
                  "https://github.com/login/oauth/authorize?client_id=Ov23liRv0ktKpaw29Jfw&scope=repo,user")
              }
            >
              Sign up with <Github className="w-4 h-4 ml-2" />
            </Button>
          )}
          <DynamicWidget />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
