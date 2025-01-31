export interface FilterValues {
  mobName: string;
  location: string;
  mobType: string;
  mobDamage: string;
  minHp: number | undefined;
  maxHp: number | undefined;
  showAllMobs: boolean;
  useHpRange: boolean;
}

export interface CombinedMob {
  name: string;
  location: string;
  type: string;
  damageTypes: string[];
  maturity: string;
  health: number;
  dangerLevel: number;
  hpPerLevel: number;
  attacksPerMin?: number;
  movement?: string;
  combat?: string;
  aggression?: string;
  isEvent?: boolean;
  isInstance?: boolean;
}