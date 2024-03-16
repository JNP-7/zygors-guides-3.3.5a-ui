import GuideSection, { GuideSectionProps } from "../GuideSection/GuideSection";

export interface GuideProps {
  guideName: string;
}

function Guide({ guideName }: GuideProps) {
  let guideSections: GuideSectionProps[] = [{ sectionName: "Section 1" }];

  return (
    <>
      <div className="guide-data">
        <h1>{guideName}</h1>
      </div>
      <div className="guide-content">
        {guideSections.map(function (nextGuideSection, index) {
          return (
            <GuideSection
              sectionName={nextGuideSection.sectionName}
            ></GuideSection>
          );
        })}
      </div>
    </>
  );
}

export default Guide;
