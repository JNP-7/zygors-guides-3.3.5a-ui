import {
  ItemUsageTaskProps,
  getItemUsageSummary,
} from "../../../types/CommonTaskProps";
import CoordinatesMap from "../../../types/CoordinatesMap";
import TaskType from "../../../types/TaskType";
import { StepTaskExtProps, StepTaskProps } from "../StepTask/StepTask";

export const DEFAULT_COORDS_MAP_INDEX = -1;
export const DEFAULT_COORDS_MAP = {
  text: "Current map",
  value: DEFAULT_COORDS_MAP_INDEX,
};

const MAX_GOTO_SUMMARY_COMMENT_LENGTH = 30;

export interface GoToTaskExtProps extends StepTaskExtProps, ItemUsageTaskProps {
  comment?: string;
  xCoord: number;
  yCoord: number;
  coordsMap: number;
}

interface GoToTaskProps
  extends GoToTaskExtProps,
    StepTaskProps,
    ItemUsageTaskProps {}

export function getGoToTaskSummary(goToTaskProps: GoToTaskExtProps): string {
  let formattedComment = "";
  if (goToTaskProps.comment !== undefined) {
    formattedComment =
      goToTaskProps.comment.length > MAX_GOTO_SUMMARY_COMMENT_LENGTH
        ? goToTaskProps.comment
            .substring(0, MAX_GOTO_SUMMARY_COMMENT_LENGTH)
            .concat("...")
        : goToTaskProps.comment;
    formattedComment += ", ";
  }
  let coordsMsg = "Go to ";
  if (goToTaskProps.coordsMap !== DEFAULT_COORDS_MAP_INDEX) {
    coordsMsg += Object.values(CoordinatesMap)[goToTaskProps.coordsMap] + " ";
  }
  coordsMsg += `[${goToTaskProps.xCoord},${goToTaskProps.yCoord}]`;
  let itemUsageSummary = getItemUsageSummary(goToTaskProps, false);
  return `${formattedComment}${coordsMsg}${
    itemUsageSummary !== "" ? `and ${itemUsageSummary}` : ""
  }`;
}

export function getDefaultGoToTask(
  depth: number,
  subTasks: StepTaskExtProps[] = []
): GoToTaskExtProps {
  return {
    xCoord: 0.0,
    yCoord: 0.0,
    depth: depth,
    subTasks: subTasks,
    type: TaskType.GOTO,
    coordsMap: DEFAULT_COORDS_MAP_INDEX,
  };
}

function GoToTask(goToTaskProps: GoToTaskProps) {
  return <p className="mb-0">{getGoToTaskSummary(goToTaskProps)}</p>;
}

export default GoToTask;
