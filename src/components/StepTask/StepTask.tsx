import ListGroup from "react-bootstrap/ListGroup";

export interface StepTaskExtProps {
  summary: string;
  depth: number;
}

interface StepTaskProps extends StepTaskExtProps {}

function StepTask({ summary, depth }: StepTaskProps) {
  //TODO: Depth conditional is temporary, to get atleast one sublevel of tasks
  let subTasks: StepTaskProps[] =
    depth < 1
      ? [
          { summary: "Go to X,Y", depth: depth + 1 },
          { summary: "Turn in some quest", depth: depth + 1 },
        ]
      : [];
  return (
    <ListGroup.Item as="li">
      <p className="mb-0">{summary}</p>
      {subTasks.length > 0 && (
        <ListGroup as="ul">
          {subTasks.map((nextSubtask, index) => (
            <StepTask
              summary={nextSubtask.summary}
              depth={nextSubtask.depth}
            ></StepTask>
          ))}
        </ListGroup>
      )}
    </ListGroup.Item>
  );
}

export default StepTask;
