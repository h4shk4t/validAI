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
          <DialogTitle>Login in through Dynamic and Github</DialogTitle>
        </DialogHeader>
        <div className="flex justify-center my-4">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 opacity-20 blur-xl"></div>
            <img
              src="/hexagon.png"
              alt="3D Hexagon"
              className="w-30 h-28 animate-spin-slow relative z-10"
              style={{ animation: 'spin 10s linear infinite' }}
            />
          </div>
        </div>
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
              className="bg-[#0D152D] border-[#243A64] border"
            >
              Login with <Github className="w-4 h-4 ml-2" />
            </Button>
          )}
          <DynamicWidget />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
