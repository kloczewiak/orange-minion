export type Perk = {
  id: number;
  name: string;
  majorChangePatchVersion: string;
  tooltip: string;
  shortDesc: string;
  longDesc: string;
  recommendationDescriptor: string;
  iconPath: string;
  endOfGameStatDescs: string[];
  recommendationDescriptorAttributes: PerkRDAs;
};

export type PerkRDAs = {
  kUtility?: number;
  kBurstDamage?: number;
  kDamagePerSecond?: number;
  kMoveSpeed?: number;
  kHealing?: number;
  kDurability?: number;
  kCooldown?: number;
  kGold?: number;
  kMana?: number;
};

export type PerkStyles = {
  schemaVersion: number;
  styles: PerkStyle[];
};

export type PerkStyle = {
  id: number;
  name: string;
  tooltip: string;
  iconPath: string;
  assetMap: { [key: string]: string };
  isAdvanced: boolean;
  allowedSubStyles: number[];
  subStyleBonus: SubStyleBonus[];
  slots: PerkSlot[];
  defaultPageName: string;
  defaultSubStyle: number;
  defaultPerks: number[];
  defaultPerksWhenSplashed: number[];
  defaultStatModsPerSubStyle: DefaultStatModsPerSubStyle[];
};

export type DefaultStatModsPerSubStyle = {
  id: string;
  perks: number[];
};

export type PerkSlot = {
  type: PerkType;
  slotLabel: string;
  perks: number[];
};

export type PerkType = 'kKeyStone' | 'kMixedRegularSplashable' | 'kStatMod';

export type SubStyleBonus = {
  styleId: number;
  perkId: number;
};
