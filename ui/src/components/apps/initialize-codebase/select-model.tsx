import { Button } from "@/components/ui/button";
import { useStepper } from "@/components/ui/stepper";
import { Model } from "@/types/model";
import React from "react";

interface SelectModelProps {
  subscribedModels: Model[];
  step: number;
  setStep: (step: number) => void;
}

const SelectModel = (props: SelectModelProps) => {
  const { nextStep } = useStepper();
  return (
    <div>
      SelectModel
      <Button
        onClick={() => {
          props.setStep(props.step + 1);
          nextStep();
        }}
      >
        Next
      </Button>
    </div>
  );
};

export default SelectModel;
