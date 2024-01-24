import { security } from '../security';

export interface ContactDetails {
  id: number;
  first_name: string;
  last_name: string;
  title?: string;
  email?: string;
  street_address?: string;
  city?: string;
  state_name?: string;
  state_id?: string;
  postal_code?: string;
  country_name?: string;
  country_id?: string;
  work_phone?: string;
  home_phone?: string;
  thumbnail?: string;
  picture?: string;
  security: security[]; //CR this should not be an array, should be object only
}
