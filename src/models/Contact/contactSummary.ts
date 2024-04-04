import { security } from '../security';
export interface ContactSummary {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  thumbnail?: string;
  security: security[];
}
