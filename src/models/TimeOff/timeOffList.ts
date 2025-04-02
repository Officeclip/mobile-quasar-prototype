export interface TimeOffList {
  categories: Categories[];
}

export interface Categories {
  id: string;
  name: string;
  balance: number;
  balanceType: string;
}
