import { createContext, useEffect, useState } from "react";
import { Container, Nav, Toast, ToastContainer } from "react-bootstrap";
import Guide, { GuideExtProps, getDefaultGuideName } from "../Guide/Guide";
import Tab from "react-bootstrap/Tab";
import { Updater, useImmer } from "use-immer";
import { Dot, Plus } from "react-bootstrap-icons";
import GuideSelectionModal from "../modals/GuideSelectionModal/GuideSelectionModal";
import ConfirmationModal from "../modals/ConfirmationModal/ConfirmationModal";
import {
  getCopiedStepSummary,
  SectionStepExtProps,
} from "../SectionStep/SectionStep";

type GuidesWorkspaceContextType = {
  guidesContext: GuideExtProps[];
  setGuidesContext: Updater<GuideExtProps[]>;
  guideHasChanges: boolean[];
  setGuideHasChanges: Updater<boolean[]>;
  copiedStep: SectionStepExtProps | null;
  setCopiedStep: Updater<SectionStepExtProps | null>;
};

export const GuidesWorkspaceContext = createContext<GuidesWorkspaceContextType>(
  {
    guidesContext: [],
    setGuidesContext: () => {},
    guideHasChanges: [],
    setGuideHasChanges: () => {},
    copiedStep: null,
    setCopiedStep: () => {},
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
  const [closeRegardless, setCloseRegardless] = useState(false);
  const [closeConfirmationModalIsVisible, setCloseConfirmationModalIsVisible] =
    useState(false);
  const [copiedStep, updateCopiedStep] = useImmer<SectionStepExtProps | null>(
    null
  );

  function handleOnBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    setCloseConfirmationModalIsVisible(true);
    return "";
  }

  function addBeforeUnloadEvent() {
    window.addEventListener("beforeunload", handleOnBeforeUnload, {
      capture: true,
    });
  }

  function removeBeforeUnloadEvent() {
    window.removeEventListener("beforeunload", handleOnBeforeUnload, {
      capture: true,
    });
  }

  function handleOnCloseRegardless() {
    setCloseRegardless(true);
  }

  useEffect(() => {
    //If no changed guide return
    if (guideHasChanges.indexOf(true) < 0) {
      return;
    }

    if (!closeRegardless) {
      addBeforeUnloadEvent();
    } else {
      window.close();
    }

    return () => {
      removeBeforeUnloadEvent();
    };
  }, [guideHasChanges, closeRegardless]);

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

  function getCopiedStepToastText(): String {
    if (copiedStep !== null) {
      return "Clipboard: " + getCopiedStepSummary(copiedStep);
    } else {
      return "";
    }
  }

  return (
    <GuidesWorkspaceContext.Provider
      value={{
        guidesContext: guides,
        setGuidesContext: updateGuides,
        guideHasChanges: guideHasChanges,
        setGuideHasChanges: updateGuideHasChanges,
        copiedStep: copiedStep,
        setCopiedStep: updateCopiedStep,
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
      <ConfirmationModal
        onConfirmation={handleOnCloseRegardless}
        bodyText="One or more of the open guides have unsaved changes. Exit regardless?"
        confirmText="Exit"
        cancelText="Go Back"
        setShowVal={setCloseConfirmationModalIsVisible}
        showVal={closeConfirmationModalIsVisible}
      />
      <ToastContainer className="clipboard-toast">
        <Toast
          show={copiedStep !== null}
          onClose={() => updateCopiedStep(null)}
        >
          <Toast.Header
            closeButton={true}
            className="justify-content-between"
            closeLabel="Clear the clipboard"
          >
            Clipboard
          </Toast.Header>
          <Toast.Body>{getCopiedStepToastText()}</Toast.Body>
        </Toast>
      </ToastContainer>
    </GuidesWorkspaceContext.Provider>
  );
}

export default GuidesWorkspace;
