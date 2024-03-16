import React from "react";
import { Accordion } from "react-bootstrap";
import SectionStep, { SectionStepProps } from "../SectionStep/SectionStep";

export interface GuideSectionProps {
  sectionName: string;
}

function GuideSection({ sectionName }: GuideSectionProps) {
  let sectionSteps: SectionStepProps[] = [
    { stepSummary: "Go to X,Y, Accept..." },
    { stepSummary: "Go to X,Y, Accept..." },
    { stepSummary: "Go to X,Y, Accept..." },
    { stepSummary: "Go to X,Y, Accept..." },
  ];

  return (
    <>
      <h2>{sectionName}</h2>
      <Accordion>
        {sectionSteps.map(function (nextStep, index) {
          return (
            <SectionStep
              stepSummary={nextStep.stepSummary}
              stepIndex={index}
            ></SectionStep>
          );
        })}
      </Accordion>
    </>
  );
}

export default GuideSection;
