enum CoordinatesMap {
  AlteracMountains = "Alterac Mountains",
  ArathiHighlands = "Arathi Highlands",
  Ashenvale = "Ashenvale",
  Azshara = "Azshara",
  Badlands = "Badlands",
  BlastedLands = "Blasted Lands",
  BurningSteppes = "Burning Steppes",
  Darkshore = "Darkshore",
  Darnassus = "Darnassus",
  DeadwindPass = "Deadwind Pass",
  Desolace = "Desolace",
  DunMorogh = "Dun Morogh",
  Durotar = "Durotar",
  Duskwood = "Duskwood",
  DustwallowMarsh = "Dustwallow Marsh",
  EasternPlaguelands = "Eastern Plaguelands",
  ElwynnForest = "Elwynn Forest",
  Felwood = "Felwood",
  Feralas = "Feralas",
  HillsbradFoothills = "Hillsbrad Foothills",
  Ironforge = "Ironforge",
  LochModan = "Loch Modan",
  Moonglade = "Moonglade",
  Mulgore = "Mulgore",
  Orgrimmar = "Orgrimmar",
  RedridgeMountains = "Redridge Mountains",
  SearingGorge = "Searing Gorge",
  Silithus = "Silithus",
  SilverpineForest = "Silverpine Forest",
  StonetalonMountains = "Stonetalon Mountains",
  StormwindCity = "Stormwind City",
  StranglethornVale = "StranglethornVale",
  SwampOfSorrows = "Swamp of Sorrows",
  Tanaris = "Tanaris",
  Teldrassil = "Teldrassil",
  TheBarrens = "The Barrens",
  TheHinterlands = "The Hinterlands",
  TirisfalGlades = "Tirisfal Glades",
  ThousandNeedles = "Thousand Needles",
  ThunderBluff = "Thunder Bluff",
  UnGoroCrater = "Un'Goro Crater",
  Undercity = "Undercity",
  WesternPlaguelands = "Western Plaguelands",
  Westfall = "Westfall",
  Wetlands = "Wetlands",
  Winterspring = "Winterspring",
}

export function getCoordinatesMapOrdinal(map: CoordinatesMap | string): number {
  if (typeof map === "string") {
    return Object.values(CoordinatesMap)
      .map((nextCoordMap) => {
        return nextCoordMap.toString();
      })
      .indexOf(map);
  } else {
    return Object.values(CoordinatesMap).indexOf(map);
  }
}

export default CoordinatesMap;
