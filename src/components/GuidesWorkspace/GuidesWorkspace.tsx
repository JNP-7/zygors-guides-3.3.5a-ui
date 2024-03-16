import { useState } from "react";
import { Container, Row } from "react-bootstrap";
import Guide, { GuideProps } from "../Guide/Guide";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

function GuidesWorkspace() {
  //   const [guides, setGuides] = useState<GuideProps[]>([]);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  let guides: GuideProps[] = [
    { guideName: "Guide 1" },
    { guideName: "Guide 2" },
    { guideName: "Guide 3" },
  ];
  return (
    <Container className="workspace-main-container ">
      <Tabs defaultActiveKey={currentTabIndex} className="mb-3">
        {guides.map(function (nextGuide, nextIndex) {
          return (
            <Tab eventKey={nextIndex} title={nextGuide.guideName}>
              <Guide guideName={nextGuide.guideName}></Guide>
            </Tab>
          );
        })}
      </Tabs>
    </Container>
  );
}

export default GuidesWorkspace;
