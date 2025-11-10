import { security } from '../security';
export interface accountSummary {
  id: string;
  account_name: string;
  account_number: string;
  email?: string;
  phone?: string;
  thumbnail?: string;
  security: security;
}