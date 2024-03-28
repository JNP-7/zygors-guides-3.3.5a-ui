enum CharacterClass {
  DRUID = "Druid",
  HUNTER = "Hunter",
  MAGE = "Mage",
  PALLADIN = "Palladin",
  PRIEST = "Priest",
  ROGUE = "Rogue",
  SHAMAN = "Shaman",
  WARLOCK = "Warlock",
  WARRIOR = "Warrior",
}

export function getCharacterClassOrdinal(characterClass: CharacterClass) {
  return Object.values(CharacterClass).indexOf(characterClass);
}

export function getCharacterClassByName(className: string): CharacterClass {
  return Object.values(CharacterClass)[
    Object.keys(CharacterClass).indexOf(className)
  ];
}

export default CharacterClass;
