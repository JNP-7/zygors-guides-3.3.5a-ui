enum TaskType {
  COMMENT = "Comment",
  GOTO = "Go to",
}

export function getTaskTypeDescription(type: TaskType): string {
  switch (type) {
    case TaskType.COMMENT:
      return "Provides a descriptive instruction for the player, in full-text form";
    case TaskType.GOTO:
      return "Instructs the player to go to the specified location";
  }
}

export function getTaskTypeOrdinal(taskType: TaskType) {
  return Object.values(TaskType).indexOf(taskType);
}

export default TaskType;
