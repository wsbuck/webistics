export interface AnalyticsPostBody {
  ip: string;
  city: string;
  region: string;
  country_code: string;
  postal: string;
  latitude: number;
  longitude: number;
  org: string;
}

export interface LoginBody {
  username: string;
  password: string;
}
