import { GuideExtProps } from "../components/Guide/Guide";
import { StepTaskExtProps } from "../components/stepTasks/StepTask/StepTask";

interface LuaImportProcessState {
  currentSectionName: string;
  currentSectionIndex: number | undefined;
  currentSectionNextSection: number | undefined;
  currentSectionWasCreated: boolean;
  currentSectionHasTasks: boolean;
  currentTaskProperties: StepTaskExtProps | undefined;
  isAcceptQuestTask: boolean;
  isTurnInQuestTask: boolean;
}

const WA_VARIABLE_DEFINITION = '["WA_QUEST_LOG_HISTORY"] = {';

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
    currentSectionName: "Default section",
    currentSectionIndex: undefined,
    currentSectionNextSection: undefined,
    currentSectionWasCreated: false,
    currentSectionHasTasks: false,
    currentTaskProperties: undefined,
    isAcceptQuestTask: false,
    isTurnInQuestTask: false,
  };

  luaEntries.forEach((nextEntry) => {
    //TODO: import process
  });

  return newGuideProps;
}
