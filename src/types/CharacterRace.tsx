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

export default CharacterRace;
