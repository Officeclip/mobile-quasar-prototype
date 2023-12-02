export interface responseError {
  status: number;
  subStatus: number;
  description: string;
  message: string;
  succeeded: boolean;
  utcTimeStamp: string;
}
