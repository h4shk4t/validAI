import React, { useState } from "react";
import { Step, Stepper, type StepItem } from "@/components/ui/stepper";
import { useCodespaceStore } from "@/lib/stores/codespace-store";
import ChooseModelImg from "@/assets/choose-model.svg";
import ChooseRepoImg from "@/assets/choose-repo.svg";
import SelectModel from "./select-model";
import SelectRepo from "./select-repo";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const InitializeCodebase = () => {
  const steps = [
    { label: "Select Model" },
    { label: "Select Repository" },
  ] satisfies StepItem[];

  const stepMetadata = [
    { label: "Select model to use", img: ChooseModelImg },
    { label: "Select Your Repo", img: ChooseRepoImg },
  ];

  const [step, setStep] = useState(0);
  const { hasOnboarded } = useCodespaceStore();

  return (
    <div className="flex w-full h-full gap-4">
      <div className="w-[40%] flex items-center flex-col justify-center">
        <img src={stepMetadata[step].img} className="h-[300px]" alt="Sign Up" />
        <p className="text-lg tracking-tight mt-8">
          {stepMetadata[step].label}
        </p>
      </div>
      <div className="flex flex-col gap-4 w-[56%] my-0 ms-auto justify-center">
        <Stepper
          initialStep={0}
          steps={steps}
          className="w-[60%] justify-start"
        >
          {steps.map(({ label }, index) => {
            return (
              <Step key={label} label={label}>
                <div className="w-[64%]">
                  {index == 0 && <SelectModel step={step} setStep={setStep} />}
                  {index == 1 && <SelectRepo step={step} setStep={setStep} />}
                </div>
              </Step>
            );
          })}
          {hasOnboarded && (
            <Card className="bg-background w-[64%] h-[20rem] border-none">
              <CardHeader>
                <CardTitle>You are now ready to use AkashPay!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You have completed all the steps required to use AkashPay. Now
                  login into the dashboard.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Link to="/login">
                  <Button size={"lg"}>Login</Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </Stepper>
      </div>
    </div>
  );
};

export default InitializeCodebase;
