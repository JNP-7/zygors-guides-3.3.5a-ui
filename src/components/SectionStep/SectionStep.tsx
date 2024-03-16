import React from "react";
import Accordion from "react-bootstrap/Accordion";

export interface SectionStepProps {
  stepSummary: string;
  stepIndex?: number;
}

function SectionStep({ stepSummary, stepIndex }: SectionStepProps) {
  function getCurretnIndex() {
    return stepIndex !== undefined ? stepIndex : 0;
  }
  return (
    <Accordion.Item eventKey={getCurretnIndex().toString()}>
      <Accordion.Header>
        //Step #{(getCurretnIndex() + 1).toString()} || {stepSummary}
      </Accordion.Header>
      <Accordion.Body>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum.
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default SectionStep;
