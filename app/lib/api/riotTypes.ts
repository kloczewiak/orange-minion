export type AccountDto = {
  puuid: string;
  /**
   *
   * This field may be excluded from the response if the account doesn't have a gameName.
   */
  gameName: string;
  /**
   *
   * This field may be excluded from the response if the account doesn't have a tagLine.
   */
  tagLine: string;
};

export type Cluster = 'EUROPE' | 'AMERICAS' | 'ASIA' | 'ESPORTS';
export type Region =
  | 'BR1'
  | 'EUN1'
  | 'EUW1'
  | 'JP1'
  | 'KR'
  | 'LA1'
  | 'LA2'
  | 'ME1'
  | 'NA1'
  | 'OC1'
  | 'PH2'
  | 'RU'
  | 'SG2'
  | 'TH2'
  | 'TR1'
  | 'TW2'
  | 'VN2';

export type RegionReadable =
  | 'BR'
  | 'EUNE'
  | 'EUW'
  | 'JP'
  | 'KR'
  | 'LAN'
  | 'LAS'
  | 'ME'
  | 'NA'
  | 'OCE'
  | 'PH'
  | 'RU'
  | 'SG'
  | 'TH'
  | 'TR'
  | 'TW'
  | 'VN';

export type SummonerDTO = {
  /**
   *
   * Encrypted account ID
   *
   * Max length 56 characters.
   */
  accountId: string;
  /**
   *
   * ID of the summoner icon associated with the summoner.
   */
  profileIconId: number;
  /**
   *
   * Date summoner was last modified specified as epoch milliseconds
   *
   * The following events will update this timestamp: summoner name change, summoner level change, or profile icon change.
   */
  revisionDate: number;
  /**
   *
   * Encrypted summoner ID
   *
   * Max length 63 characters.
   */
  id: string;
  /**
   *
   * Encrypted PUUID
   *
   * Exact length of 78 characters.
   */
  puuid: string;
  /**
   *
   * Summoner level associated with the summoner.
   */
  summonerLevel: number;
};

export type RewardConfigDto = {
  /**
   *
   * Reward value
   */
  rewardValue: string;
  /**
   *
   * Reward type
   */
  rewardType: string;
  /**
   *
   * Maximun reward
   */
  maximumReward: number;
};

export type NextSeasonMilestonesDto = {
  /**
   *
   * Grades required for milestone
   */
  requireGradeCounts: { [grade: string]: number };
  /**
   *
   * Reward marks.
   */
  rewardMarks: number;
  /**
   *
   * Bonus.
   */
  bonus: boolean;
  /**
   *
   * Reward configuration.
   */
  rewardConfig?: RewardConfigDto;
  /**
   *
   * Sum of all required grades in `requireGradeCounts`
   */
  totalGamesRequires: number;
};

export type ChampionMasteryDto = {
  /**
   *
   * Player Universal Unique Identifier
   *
   * Exact length of 78 characters
   *
   * (Encrypted)
   */
  puuid: string;
  /**
   *
   * Number of points needed to achieve next level
   *
   * Zero if player reached maximum champion level for this champion.
   */
  championPointsUntilNextLevel: number;
  /**
   *
   * Champion ID for this entry.
   */
  championId: number;
  /**
   *
   * Last time this champion was played by this player - in Unix milliseconds time format.
   */
  lastPlayTime: number;
  /**
   *
   * Champion level for specified player and champion combination.
   */
  championLevel: number;
  /**
   *
   * Total number of champion points for this player and champion combination - they are used to determine championLevel.
   */
  championPoints: number;
  /**
   *
   * Number of points earned since current level has been achieved.
   */
  championPointsSinceLastLevel: number;
  markRequiredForNextLevel: number;
  championSeasonMilestone: number;
  nextSeasonMilestone: NextSeasonMilestonesDto;
  /**
   *
   * The token earned for this champion at the current championLevel
   *
   * When the championLevel is advanced the tokensEarned resets to 0.
   */
  tokensEarned: number;
  milestoneGrades?: string[];
};

export type ChampionSummaryItem = {
  id: number;
  name: string;
  alias: string;
  squarePortraitPath: string;
  roles: string[];
};

export type ChampionSkinTable = {
  [key: string]: any;
  skins: ChampionSkinsTableItem[];
};

export type ChampionSkinsTableItem = {
  id: number;
  isBase: boolean;
  name: string;
  splashPath: string;
  uncenteredSplashPath: string;
  tilePath: string;
  loadScreenPath: string;
  skinType: string;
  rarity: string;
  isLegacy: boolean;
  splashVideoPath: string;
  collectionSplashVideoPath: string;
  collectionCardHoverVideoPath: string;
  featuresText: string;
  chromaPath: string;
  // Don't really need that right now so I won't type it
  chromas: any[];
  // I don't know what the type of this is
  emblems: any;
  regionRarityId: number;
  rarityGemPath: string;
  skinLines: { id: number }[];
  description: string;
};

export type ChampionInfo = {
  maxNewPlayerLevel: number;
  freeChampionIdsForNewPlayers: number[];
  freeChampionIds: number[];
};
