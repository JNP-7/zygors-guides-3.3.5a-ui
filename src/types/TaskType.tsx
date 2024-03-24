enum TaskType {
  COMMENT = "Comment",
}

export function getTaskTypeDescription(type: TaskType): string {
  switch (type) {
    case TaskType.COMMENT:
      return "Provides a descriptive instruction for the player, in full-text form";
  }
}

export default TaskType;
