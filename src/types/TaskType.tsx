enum TaskType {
  COMMENT = "Comment",
  GOTO = "Go to",
  TALKTO = "Talk to",
  ACCEPTQ = "Accept quest",
  TURNINQ = "Turn in quest",
  KILL = "Kill",
}

export function getTaskTypeDescription(type: TaskType): string {
  switch (type) {
    case TaskType.COMMENT:
      return "Provides a descriptive instruction for the player, in full-text form";
    case TaskType.GOTO:
      return "Instructs the player to go to the specified location";
    case TaskType.TALKTO:
      return "Instructs the player to talk to an NPC";
    case TaskType.ACCEPTQ:
      return "Instructs the player to accept a quest";
    case TaskType.TURNINQ:
      return "Instructs the player to turn in a completed quest";
    case TaskType.KILL:
      return "Instructs the player to kill an amount of the specified mob";
  }
}

export function getTaskTypeOrdinal(taskType: TaskType) {
  return Object.values(TaskType).indexOf(taskType);
}

export default TaskType;
