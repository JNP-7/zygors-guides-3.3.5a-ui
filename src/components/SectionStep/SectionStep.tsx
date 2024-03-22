import React from "react";
import Accordion from "react-bootstrap/Accordion";
import StepTask, { StepTaskProps } from "../StepTask/StepTask";
import { ListGroup } from "react-bootstrap";

export interface SectionStepProps {
  stepSummary: string;
  stepIndex?: number;
}

function SectionStep({ stepSummary, stepIndex }: SectionStepProps) {
  let stepTasks: StepTaskProps[] = [
    { summary: "Go to X,Y", depth: 0 },
    { summary: "Accept something", depth: 0 },
    { summary: "Kill some boars", depth: 0 },
  ];
  function getCurrentIndex() {
    return stepIndex !== undefined ? stepIndex : 0;
  }
  return (
    <Accordion.Item
      key={getCurrentIndex()}
      eventKey={getCurrentIndex().toString()}
    >
      <Accordion.Header>
        //Step #{(getCurrentIndex() + 1).toString()} || {stepSummary}
      </Accordion.Header>
      <Accordion.Body>
        {stepTasks.length > 0 && (
          <ListGroup as="ul">
            {stepTasks.map((nextTask, index) => (
              <StepTask
                summary={nextTask.summary}
                depth={nextTask.depth}
              ></StepTask>
            ))}
          </ListGroup>
        )}
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default SectionStep;
