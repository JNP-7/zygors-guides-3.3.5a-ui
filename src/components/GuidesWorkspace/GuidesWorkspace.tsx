import { useState } from "react";
import { Container, Nav } from "react-bootstrap";
import Guide, { GuideExtProps, getDefaultGuideName } from "../Guide/Guide";
import Tab from "react-bootstrap/Tab";

function GuidesWorkspace() {
  const ADD_GUIDE_BUTTON_KEY: string = "addGuideButton";

  const [guides, setGuides] = useState<GuideExtProps[]>([]);
  const [currentTabKey, setCurrentTabKey] = useState(ADD_GUIDE_BUTTON_KEY);

  function handleOnChangeGuideName(newName: string, indexToUpdate: number) {
    const nextGuides: GuideExtProps[] = guides.map((nextGuide, index) => {
      return index === indexToUpdate
        ? { ...nextGuide, guideName: newName }
        : nextGuide;
    });

    setGuides(nextGuides);
  }

  function handleAddGuide(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    let nGuides = guides.length;
    setCurrentTabKey(nGuides.toString());
    setGuides([
      ...guides,
      {
        guideName: "",
      },
    ]);
  }

  function handleDeleteGuide(indexToDelete: number) {
    let nGuides = guides.length;
    if (nGuides - 1 >= 0) {
      setCurrentTabKey(Math.max(indexToDelete - 1, 0).toString());
    } else {
      setCurrentTabKey(ADD_GUIDE_BUTTON_KEY);
    }
    let newGuides: GuideExtProps[] = guides.filter((_, index) => {
      return index !== indexToDelete;
    });
    setGuides(newGuides);
  }

  function handleOnTabSelect(activeKey: string) {
    if (activeKey !== ADD_GUIDE_BUTTON_KEY) {
      setCurrentTabKey(activeKey);
    }
  }

  return (
    <Container className="workspace-main-container py-4">
      <Tab.Container
        transition={false}
        defaultActiveKey={currentTabKey}
        activeKey={currentTabKey}
        onSelect={(activeKey) =>
          handleOnTabSelect(
            activeKey !== null ? activeKey : ADD_GUIDE_BUTTON_KEY
          )
        }
      >
        <Nav variant="tabs" as="ul">
          {guides.map(function (nextGuide, nextIndex) {
            return (
              <Nav.Item key={nextIndex} as="li">
                <Nav.Link eventKey={nextIndex}>
                  {nextGuide.guideName !== ""
                    ? nextGuide.guideName
                    : getDefaultGuideName(nextIndex)}
                </Nav.Link>
              </Nav.Item>
            );
          })}
          <Nav.Item key={ADD_GUIDE_BUTTON_KEY} as="li">
            <Nav.Link
              eventKey={ADD_GUIDE_BUTTON_KEY}
              onClick={(e) => handleAddGuide(e)}
              title="Add guide"
            >
              &#10010;
            </Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          {guides.map(function (nextGuide, nextIndex) {
            return (
              <Tab.Pane key={nextIndex} eventKey={nextIndex} className="p-4">
                <Guide
                  guideIndex={nextIndex}
                  onChangeGuideName={handleOnChangeGuideName}
                  onDeleteGuide={handleDeleteGuide}
                  guideName={nextGuide.guideName}
                ></Guide>
              </Tab.Pane>
            );
          })}
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
}

export default GuidesWorkspace;
