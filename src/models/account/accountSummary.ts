import { security } from '../security';
export interface accountSummary {
  id: string;
  account_name: string;
  account_number: string;
  email_address?: string;
  main_phone?: string;
  security: security;
}
