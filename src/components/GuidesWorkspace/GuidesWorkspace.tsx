import { createContext, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import Guide, { GuideExtProps, getDefaultGuideName } from "../Guide/Guide";
import Tab from "react-bootstrap/Tab";
import { Updater, useImmer } from "use-immer";

type GuidesWorkspaceContextType = {
  guidesContext: GuideExtProps[];
  setGuidesContext: Updater<GuideExtProps[]>;
};

export const GuidesWorkspaceContext = createContext<GuidesWorkspaceContextType>(
  {
    guidesContext: [],
    setGuidesContext: () => {},
  }
);

export interface GuidesWorkspaceContextAccessor {
  indexPath: number[];
}

function GuidesWorkspace() {
  const ADD_GUIDE_BUTTON_KEY: string = "addGuideButton";

  const [guides, updateGuides] = useImmer<GuideExtProps[]>([]);
  const [currentTabKey, setCurrentTabKey] = useState(ADD_GUIDE_BUTTON_KEY);

  function handleAddGuide(e: React.MouseEvent<HTMLElement, MouseEvent>) {
    let nGuides = guides.length;
    setCurrentTabKey(nGuides.toString());
    updateGuides((guides) => {
      guides.push({
        guideName: "",
        guideAuthor: "",
        guideSections: [],
      });
    });
  }

  function handleDeleteGuide(indexToDelete: number) {
    let nGuides = guides.length;
    if (nGuides - 1 >= 0) {
      setCurrentTabKey(Math.max(indexToDelete - 1, 0).toString());
    } else {
      setCurrentTabKey(ADD_GUIDE_BUTTON_KEY);
    }
  }

  function handleOnTabSelect(activeKey: string) {
    if (activeKey !== ADD_GUIDE_BUTTON_KEY) {
      setCurrentTabKey(activeKey);
    }
  }

  return (
    <GuidesWorkspaceContext.Provider
      value={{
        guidesContext: guides,
        setGuidesContext: updateGuides,
      }}
    >
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
                    onDeleteGuide={handleDeleteGuide}
                    guideName={nextGuide.guideName}
                    guideSections={nextGuide.guideSections}
                    indexPath={[nextIndex]}
                    guideAuthor={nextGuide.guideAuthor}
                  ></Guide>
                </Tab.Pane>
              );
            })}
          </Tab.Content>
        </Tab.Container>
      </Container>
    </GuidesWorkspaceContext.Provider>
  );
}

export default GuidesWorkspace;
