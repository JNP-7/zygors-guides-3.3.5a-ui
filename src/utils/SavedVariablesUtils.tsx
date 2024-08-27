import { GuideExtProps } from "../components/Guide/Guide";
import {
  DEFAULT_START_LEVEL,
  FINAL_SECTION_OPTION,
  getDefaultSection,
  GuideSectionExtProps,
  NO_DEFAULT_RACE_SECTION,
} from "../components/GuideSection/GuideSection";
import { SectionStepExtProps } from "../components/SectionStep/SectionStep";
import { AcceptTaskExtProps } from "../components/stepTasks/AcceptTask/AcceptTask";
import { GoToTaskExtProps } from "../components/stepTasks/GoToTask/GoToTask";
import { TalkToTaskExtProps } from "../components/stepTasks/TalkToTask/TalkToTask";
import { TurnInTaskExtProps } from "../components/stepTasks/TurnInTask/TurnInTask";
import TaskType from "../types/TaskType";

interface LuaImportProcessState {
  currentSectionName: string;
  currentSectionSteps: SectionStepExtProps[];
  currentQuestTaskInfo: QuestTaskInfo | undefined;
  currentGoToTaskInfo: GoToTaskInfo | undefined;
  currentTalkToTaskInfo: TalkToTaskInfo | undefined;
  currentSectionIndex: number | undefined;
  currentSectionNextSection: number | undefined;
  currentSectionWasCreated: boolean;
  isAcceptQuestStep: boolean;
  isTurnInQuestStep: boolean;
}

interface QuestTaskInfo {
  questName: string;
  questId: number;
}

interface GoToTaskInfo {
  xCoord: number;
  yCoord: number;
  coordsMap: string;
}

interface TalkToTaskInfo {
  npcName: string;
  npcId: number;
}

const WA_VARIABLE_DEFINITION = '["WA_QUEST_LOG_HISTORY"] = {';

enum NonJSONEntryType {
  ACCEPT_QUEST_START = "Accepted Quest---------------",
  ACCEPT_QUEST_END = "END - Accepted Quest-------",
  TURN_IN_QUEST_START = "Turned in Quest---------------",
  TURN_IN_QUEST_END = "END - Turned in Quest-------",
}

enum QuestStepType {
  ACCEPT,
  TURN_IN,
}

function getNonJSONEntryType(entryText: string): NonJSONEntryType | null {
  let keys = Object.values(NonJSONEntryType).filter((x) => x == entryText);
  return keys.length > 0 ? keys[0] : null;
}

/**
 * Turns the quest log history saved variable into an array of strings
 * @param luaString The quest log history variable ("WA_QUEST_LOG_HISTORY") saved in <client_folder>/WTF/Account/<account_name>/SavedVariables.lua
 * @returns The quest log history saved variable parsed as an array of strings
 */
export function parseLuaWAQuestlogHistoryToArray(luaString: string): string[] {
  let preFormattedString: string;

  preFormattedString = luaString
    .replace(WA_VARIABLE_DEFINITION, "[") // fix variable definition
    .replace(/}([^}]*)$/, "]$1") // replace last enclosing curly bracket with a regular one
    .replace(/\[(.*)\]\s\=\s/g, "$1:") // change equal to colon & remove outer brackets
    .replace(/[\t\r\n]/g, "") // remove tabs & returns
    .replace(/\}\,\s--\s\[\d+\]\}/g, "]]") // replace sets ending with a comment with square brackets
    .replace(/\,\s--\s\[\d+\]/g, ",") // remove close subgroup and comment
    .replace(/,(\}|\])/g, "$1") // remove trailing comma
    .replace(/\}\,\{/g, "],[") // replace curly bracket set with square brackets
    .replace(/\{\{/g, "[["); // change double curlies to square brackets

  //escape the double brackets in the JSONs that are in string format as to not mess up the parsing of the array
  let openingString: string = "{";
  let enclosingString: string = "}";
  let targetChar: string = '"';
  let replaceChar: string = `\"`;
  let regex: RegExp = new RegExp(
    openingString + "([^]*?)" + enclosingString,
    "g"
  );
  let matchBetweenRegex: RegExp = new RegExp(targetChar, "g");

  let formattedString: string = preFormattedString.replace(regex, (match) => {
    return match.replace(matchBetweenRegex, replaceChar);
  });

  let jsonResult: string[] = window.JSON.parse(formattedString);
  return jsonResult;
}

export function getSimpleGuidePropsFromLuaEntries(
  luaEntries: string[]
): GuideExtProps {
  let newGuideProps: GuideExtProps = {
    guideAuthor: "LUA Guide importer",
    guideName: "Imported LUA guide",
    guideSections: [],
  };
  let importProcessState: LuaImportProcessState = {
    currentSectionName: "",
    currentSectionSteps: [],
    currentQuestTaskInfo: undefined,
    currentGoToTaskInfo: undefined,
    currentTalkToTaskInfo: undefined,
    currentSectionIndex: undefined,
    currentSectionNextSection: undefined,
    currentSectionWasCreated: false,
    isAcceptQuestStep: false,
    isTurnInQuestStep: false,
  };

  luaEntries.forEach((nextEntry, entryIndex) => {
    let parsedEntry: object | null = getEntryJSON(nextEntry);

    if (parsedEntry !== null) {
      //Retrieve task info
      if (isQuestTaskInfo(parsedEntry)) {
        importProcessState.currentQuestTaskInfo = parsedEntry as QuestTaskInfo;
      } else if (isGoToTaskInfo(parsedEntry)) {
        importProcessState.currentGoToTaskInfo = parsedEntry as GoToTaskInfo;
      } else if (isTalkToTaskInfo(parsedEntry)) {
        importProcessState.currentTalkToTaskInfo =
          parsedEntry as TalkToTaskInfo;
      } else {
        console.error(
          "Current entry (index: " +
            entryIndex +
            ") wasn't of a valid JSON type: " +
            parsedEntry.toString()
        );
      }
    } else {
      //Update state info for its respective entry type operation
      switch (getNonJSONEntryType(nextEntry)) {
        case NonJSONEntryType.ACCEPT_QUEST_START:
          resetTaskInfo(importProcessState, true, false);
          break;
        case NonJSONEntryType.ACCEPT_QUEST_END:
          importProcessState.currentSectionSteps.push(
            buildQuestStep(importProcessState, QuestStepType.ACCEPT)
          );
          resetTaskInfo(importProcessState, false, false);
          break;
        case NonJSONEntryType.TURN_IN_QUEST_START:
          resetTaskInfo(importProcessState, false, true);
          break;
        case NonJSONEntryType.TURN_IN_QUEST_END:
          importProcessState.currentSectionSteps.push(
            buildQuestStep(importProcessState, QuestStepType.TURN_IN)
          );
          resetTaskInfo(importProcessState, false, false);
          break;
      }
    }
  });

  if (importProcessState.currentSectionIndex === undefined) {
    //Never left the default section. Create it
    if (importProcessState.currentSectionSteps.length !== 0) {
      let defaultSection: GuideSectionExtProps = {
        defaultForRace: NO_DEFAULT_RACE_SECTION.value,
        nextSectionVal: FINAL_SECTION_OPTION.value,
        sectionName: "Default section",
        sectionSteps: importProcessState.currentSectionSteps,
        startLevel: DEFAULT_START_LEVEL,
      };
      newGuideProps.guideSections.push(defaultSection);
    } else {
      newGuideProps.guideSections.push(getDefaultSection());
    }
  }

  return newGuideProps;
}

function resetTaskInfo(
  processState: LuaImportProcessState,
  isAcceptQuestStep: boolean,
  isTurnInQuestStep: boolean
) {
  processState.isAcceptQuestStep = isAcceptQuestStep;
  processState.isTurnInQuestStep = isTurnInQuestStep;
  processState.currentQuestTaskInfo = undefined;
  processState.currentGoToTaskInfo = undefined;
  processState.currentTalkToTaskInfo = undefined;
}

function getEntryJSON(entry: string): object | null {
  try {
    return JSON.parse(entry);
  } catch (e) {
    return null;
  }
}

function buildQuestStep(
  processState: LuaImportProcessState,
  questStepType: QuestStepType
): SectionStepExtProps {
  let newAcceptQuestStep: SectionStepExtProps = {
    onlyForClasses: [],
    stepTasks: [],
  };

  if (processState.currentGoToTaskInfo !== undefined) {
    let newGoToTask: GoToTaskExtProps = {
      coordsMap: processState.currentGoToTaskInfo.coordsMap,
      depth: 0,
      isCustom: false,
      subTasks: [],
      type: TaskType.GOTO,
      xCoord: processState.currentGoToTaskInfo.xCoord,
      yCoord: processState.currentGoToTaskInfo.yCoord,
    };
    newAcceptQuestStep.stepTasks.push(newGoToTask);
  }

  let newTalkToTask: TalkToTaskExtProps | undefined = undefined;
  if (processState.currentTalkToTaskInfo !== undefined) {
    newTalkToTask = {
      depth: 0,
      isCustom: false,
      npcName: processState.currentTalkToTaskInfo.npcName,
      npcId: processState.currentTalkToTaskInfo.npcId,
      subTasks: [],
      type: TaskType.TALKTO,
    };
  }

  if (processState.currentQuestTaskInfo !== undefined) {
    let newTaskType: TaskType;
    switch (questStepType) {
      case QuestStepType.ACCEPT:
        newTaskType = TaskType.ACCEPTQ;
        break;
      case QuestStepType.TURN_IN:
        newTaskType = TaskType.TURNINQ;
        break;
    }

    let newQuestAcceptTask: AcceptTaskExtProps | TurnInTaskExtProps = {
      depth: newTalkToTask !== undefined ? 1 : 0,
      isCustom: false,
      questId: processState.currentQuestTaskInfo.questId,
      questName: processState.currentQuestTaskInfo.questName,
      subTasks: [],
      type: newTaskType,
    };

    //If "talk to" task exist add as a subtask, otherwise as a regular one
    if (newTalkToTask !== undefined) {
      newTalkToTask.subTasks.push(newQuestAcceptTask);
    } else {
      newAcceptQuestStep.stepTasks.push(newQuestAcceptTask);
    }
  }

  if (newTalkToTask !== undefined) {
    newAcceptQuestStep.stepTasks.push(newTalkToTask);
  }

  return newAcceptQuestStep;
}

function isQuestTaskInfo(jsonObj: object) {
  return (
    Object.keys(jsonObj).indexOf("questName") !== -1 &&
    Object.keys(jsonObj).indexOf("questId") !== -1
  );
}

function isGoToTaskInfo(jsonObj: object) {
  return (
    Object.keys(jsonObj).indexOf("xCoord") !== -1 &&
    Object.keys(jsonObj).indexOf("yCoord") !== -1 &&
    Object.keys(jsonObj).indexOf("coordsMap") !== -1
  );
}

function isTalkToTaskInfo(jsonObj: object) {
  return (
    Object.keys(jsonObj).indexOf("npcName") !== -1 &&
    Object.keys(jsonObj).indexOf("npcId") !== -1
  );
}
