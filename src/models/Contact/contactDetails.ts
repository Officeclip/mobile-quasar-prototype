import { security } from '../security';

export interface ContactDetails {
  id: string;
  first_name: string;
  last_name: string;
  title?: string;
  email?: string;
  street_address?: string;
  city?: string;
  state_name?: string;
  state_id?: number;
  postal_code?: string;
  country_name?: string;
  country_id?: number;
  work_phone?: string;
  home_phone?: string;
  thumbnail?: string;
  picture?: string;
  security: security;
}
