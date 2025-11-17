import { security } from '../security';

export interface AccountDetails {
  id: string;
  account_name?: string;
  account_number?: string;
  email_address?: string;
  main_phone?: string;
  street_address?: string;
  city?: string;
  state_name?: string;
  state_id?: number;
  postal_code?: string;
  country_name?: string;
  country_id?: number;
  other_phone?: string;
  fax?: string;
  security?: security;
}
