import { createContext, useState } from "react";
import { Container, Nav } from "react-bootstrap";
import Guide, { GuideExtProps, getDefaultGuideName } from "../Guide/Guide";
import Tab from "react-bootstrap/Tab";
import { Updater, useImmer } from "use-immer";
import { Dot, Plus } from "react-bootstrap-icons";
import GuideSelectionModal from "../modals/GuideSelectionModal/GuideSelectionModal";

type GuidesWorkspaceContextType = {
  guidesContext: GuideExtProps[];
  setGuidesContext: Updater<GuideExtProps[]>;
  guideHasChanges: boolean[];
  setGuideHasChanges: Updater<boolean[]>;
};

export const GuidesWorkspaceContext = createContext<GuidesWorkspaceContextType>(
  {
    guidesContext: [],
    setGuidesContext: () => {},
    guideHasChanges: [],
    setGuideHasChanges: () => {},
  }
);

export interface GuidesWorkspaceContextAccessor {
  indexPath: number[];
}

function GuidesWorkspace() {
  const ADD_GUIDE_BUTTON_KEY: string = "addGuideButton";

  const [guides, updateGuides] = useImmer<GuideExtProps[]>([]);
  const [guideHasChanges, updateGuideHasChanges] = useImmer<boolean[]>([]);
  const [currentTabKey, setCurrentTabKey] = useState(ADD_GUIDE_BUTTON_KEY);
  const [guideSelectionModalIsVisible, setGuideSelectionModalIsVisible] =
    useState(false);

  function handleAddGuide() {
    setGuideSelectionModalIsVisible(true);
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

  function handleOnGuidePicked(pickedGuide: GuideExtProps) {
    let nGuides = guides.length;
    setCurrentTabKey(nGuides.toString());
    updateGuides((guides) => {
      guides.push(pickedGuide);
    });
    setGuideSelectionModalIsVisible(false);
  }

  function buildGuideTabContent(
    nextGuide: GuideExtProps,
    nextIndex: number
  ): JSX.Element {
    return guideHasChanges[nextIndex] ? (
      <>
        <Nav.Link eventKey={nextIndex} className="has-changes">
          {nextGuide.guideName !== ""
            ? nextGuide.guideName
            : getDefaultGuideName(nextIndex)}
          <Dot className="has-changes-icon" width="2rem" height="2rem" />
        </Nav.Link>
      </>
    ) : (
      <Nav.Link eventKey={nextIndex}>
        {nextGuide.guideName !== ""
          ? nextGuide.guideName
          : getDefaultGuideName(nextIndex)}
      </Nav.Link>
    );
  }

  return (
    <GuidesWorkspaceContext.Provider
      value={{
        guidesContext: guides,
        setGuidesContext: updateGuides,
        guideHasChanges: guideHasChanges,
        setGuideHasChanges: updateGuideHasChanges,
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
                  {buildGuideTabContent(nextGuide, nextIndex)}
                </Nav.Item>
              );
            })}
            <Nav.Item key={ADD_GUIDE_BUTTON_KEY} as="li">
              <Nav.Link
                eventKey={ADD_GUIDE_BUTTON_KEY}
                onClick={() => handleAddGuide()}
                title="Add guide"
                className="add-guide-button"
              >
                <Plus size="1.25rem" />
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Tab.Content>
            {guides.map(function (nextGuide, nextIndex) {
              if (nextIndex.toString() === currentTabKey) {
                return (
                  <Tab.Pane
                    key={nextIndex}
                    eventKey={nextIndex}
                    className="p-4"
                  >
                    <Guide
                      onDeleteGuide={handleDeleteGuide}
                      guideName={nextGuide.guideName}
                      guideSections={nextGuide.guideSections}
                      indexPath={[nextIndex]}
                      guideAuthor={nextGuide.guideAuthor}
                    ></Guide>
                  </Tab.Pane>
                );
              }
            })}
          </Tab.Content>
        </Tab.Container>
      </Container>
      <GuideSelectionModal
        onPickGuide={handleOnGuidePicked}
        showVal={guideSelectionModalIsVisible || guides.length < 1}
        showCrossVal={guides.length > 0}
        setShowVal={setGuideSelectionModalIsVisible}
      />
    </GuidesWorkspaceContext.Provider>
  );
}

export default GuidesWorkspace;
