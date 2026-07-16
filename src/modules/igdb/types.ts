export interface IgdbGame {
  igdbId: number;
  name: string;
  slug: string;
  summary?: string;
  releaseDate?: Date;
  coverUrl?: string;
  platformIds: number[];
}

export interface IgdbPlatform {
  igdbId: number;
  name: string;
  slug: string;
  generation?: number;
  logoUrl?: string;
  summary?: string;
}

export interface IgdbPopularGame {
  igdbId: number;
  name: string;
  slug: string;
  summary?: string;
  releaseDate?: Date;
  coverUrl?: string;
  platforms: IgdbPlatform[];
}
