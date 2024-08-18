enum GuideTranslationType {
  FULL = "Full",
  CUSTOM_TO_TEXT = "Custom tasks to text",
  FULL_TEXT = "Full text guide",
}

export function getTranslationTypeInfo(type: GuideTranslationType): string {
  switch (type) {
    case GuideTranslationType.FULL:
      return "The guide with all its tasks as they were defined";
    case GuideTranslationType.CUSTOM_TO_TEXT:
      return 'Tasks marked as "Custom" will be translated to a "Comment" or "Go to" type task';
    case GuideTranslationType.FULL_TEXT:
      return 'All tasks will be translated to a "Comment" or "Go to" type task';
  }
}

export default GuideTranslationType;
