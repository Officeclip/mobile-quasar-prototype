import { security } from '../security';
export interface accountSummary {
  id: string;
  account_number: string;
  account_name: string;
  email: string;
  owner: string;
  security: security;
}
