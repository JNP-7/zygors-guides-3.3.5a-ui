enum CharacterRace {
  DWARF = "Dwarf",
  GNOME = "Gnome",
  HUMAN = "Human",
  NIGHT_ELF = "Night Elf",
  ORC = "Orc",
  TAUREN = "Tauren",
  TROLL = "Troll",
  UNDEAD = "Undead",
}

export function getCharacterRaceOrdinal(characterRace: CharacterRace) {
  return Object.values(CharacterRace).indexOf(characterRace);
}

export function getCharacterRaceByOrdinal(ordinal: number): CharacterRace {
  return Object.values(CharacterRace)[ordinal];
}

export function getRaceWowApiValue(characterRace: CharacterRace): string {
  switch (characterRace) {
    case CharacterRace.DWARF:
      return "Dwarf";
    case CharacterRace.GNOME:
      return "Gnome";
    case CharacterRace.HUMAN:
      return "Human";
    case CharacterRace.NIGHT_ELF:
      return "NightElf";
    case CharacterRace.ORC:
      return "Orc";
    case CharacterRace.TAUREN:
      return "Tauren";
    case CharacterRace.TROLL:
      return "Troll";
    case CharacterRace.UNDEAD:
      return "Scourge";
  }
}

export default CharacterRace;
