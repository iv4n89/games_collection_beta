export {
  searchGames,
  getPopularGames,
  getPopularGamesForPlatform,
  getOfficialPlatformGames,
  searchOfficialPlatformGames,
  getGameMedia,
} from "./games";
export type { GameSort } from "./games";
export {
  searchPlatforms,
  getPlatformDetails,
  getAllPlatforms,
  getPlatformGameCounts,
} from "./platforms";
export type { IgdbGame, IgdbPlatform, IgdbPopularGame } from "./types";
