import { StepTaskExtProps } from "../components/stepTasks/StepTask/StepTask";

export interface ItemUsageTaskProps {
  itemName?: string;
  itemId?: number;
}

export function getItemUsageSummary(
  { itemName, itemId }: ItemUsageTaskProps,
  firstLetterIsUppercase = true
): string {
  let firstLetter = firstLetterIsUppercase ? "U" : "u";
  if (itemName !== undefined) {
    return `${firstLetter}se ${itemName}${
      itemId !== undefined ? `#${itemId}` : ""
    }`;
  } else if (itemId !== undefined) {
    return `${firstLetter}se Item#${itemId}`;
  }
  return "";
}

export interface TadkEditionUpdateProps {
  setProps: (newProps: StepTaskExtProps) => void;
}
