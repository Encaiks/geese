import { makeUrl } from '@/utils/api';

import { fetcher } from './base';

import { OAuthURLResponse, User } from '@/types/user';

export const Logout = async (headers: any): Promise<Response> =>
  fetcher<Response>(makeUrl(`/user/logout/`), { headers: headers });

export const CurrentUser = async (headers: any): Promise<Response> =>
  fetcher<Response>(makeUrl(`/user/me/`), { headers: headers });

export const getOAtuhURL = async (): Promise<OAuthURLResponse> => {
  const reqData: RequestInit = {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  };
  const res = await fetch(
    makeUrl(`/user/oauth/wechat/url/`, { url_type: 'geese' }),
    reqData
  );
  const data = await res.json();
  return data;
};

export const OAuthWechatAPI = async (
  code: string,
  state: string,
  cookie: string,
  user_agent: string,
  ip: string
): Promise<User> => {
  const data: RequestInit = {};
  data.credentials = 'include';
  data.headers = {
    'Content-Type': 'application/json',
    Cookie: cookie,
    'User-Agent': user_agent,
    'x-real-ip': ip,
  };
  data.method = 'POST';
  data.body = JSON.stringify({ code: code, state: state });
  const result: User = await fetcher(makeUrl(`/user/oauth/wechat/`), data);
  return result;
};
