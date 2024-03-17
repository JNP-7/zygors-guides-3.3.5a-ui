import { useState } from "react";
import { Container, Nav, Row } from "react-bootstrap";
import Guide, { GuideProps } from "../Guide/Guide";
import Tab from "react-bootstrap/Tab";

function GuidesWorkspace() {
  const addGuideButtonKey: string = "addGuideButton";

  const [guides, setGuides] = useState<GuideProps[]>([]);
  const [currentTabKey, setCurrentTabKey] = useState(addGuideButtonKey);

  function handleAddGuide(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    let nGuides = guides.length;
    setCurrentTabKey(nGuides.toString());
    setGuides([...guides, { guideName: `Guide ${nGuides + 1}` }]);
  }

  function handleOnTabSelect(activeKey: string) {
    if (activeKey !== addGuideButtonKey) {
      setCurrentTabKey(activeKey);
    }
  }

  return (
    <Container className="workspace-main-container ">
      <Tab.Container
        transition={false}
        defaultActiveKey={currentTabKey}
        activeKey={currentTabKey}
        onSelect={(activeKey) =>
          handleOnTabSelect(activeKey !== null ? activeKey : addGuideButtonKey)
        }
      >
        <Nav variant="tabs" as="ul">
          {guides.map(function (nextGuide, nextIndex) {
            return (
              <Nav.Item key={nextIndex} as="li">
                <Nav.Link eventKey={nextIndex}>{nextGuide.guideName}</Nav.Link>
              </Nav.Item>
            );
          })}
          <Nav.Item key={addGuideButtonKey} as="li">
            <Nav.Link
              eventKey={addGuideButtonKey}
              onClick={(e) => handleAddGuide(e)}
            >
              &#10010;
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          {guides.map(function (nextGuide, nextIndex) {
            return (
              <Tab.Pane key={nextIndex} eventKey={nextIndex}>
                <Guide guideName={nextGuide.guideName}></Guide>
              </Tab.Pane>
            );
          })}
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default GuidesWorkspace;
