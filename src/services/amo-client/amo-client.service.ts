import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';
import axios from 'axios';
import {
  IAuthTokens,
  StorageType,
  TokenRefreshRequest,
  applyAuthTokenInterceptor,
} from 'axios-jwt';
import { BASE_API } from 'src/lib';

export interface Credentails {
  token_type?: string;
  expires_in?: number;
  access_token?: string;
  refresh_token?: string;
}

@Injectable()
export class AmoClientService {
  private creds: Credentails = {};

  constructor(private readonly httpService: HttpService) {
    const requestRefresh: TokenRefreshRequest = async (
      refreshToken: string,
    ): Promise<IAuthTokens | string> => {
      const props = {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        redirect_uri: process.env.REDIRECT_URI,
      };
      console.log({ props });
      const response = await axios.post(
        `${BASE_API}oauth2/access_token`,
        props,
      );
      return response.data.access_token;
    };

    // может работать некорректно из-за (как говорят) странной реализации OAuth в CRM
    applyAuthTokenInterceptor(httpService.axiosRef, {
      requestRefresh,
      getStorage: () => ({
        remove: async (key: string) => {
          delete this.creds[key];
        },
        set: async (key: string, value: string) => {
          this.creds[key] = value;
        },
        get: async (key: string) => {
          return this.creds[key];
        },
      }),
    });
  }

  async auth() {
    console.log('process.env', process.env);
    const res = await this.httpService
      .post('oauth2/access_token', {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: process.env.CLIENT_AUTH_CODE,
        redirect_uri: process.env.REDIRECT_URI,
      })
      .toPromise() // todo: use rxjs
      .then((response) => {
        this.creds = response.data;
        return 'Auth success';
      })
      .catch((error) => {
        console.log({ error });
        return error.response.data;
      });
    return res;
    // todo: если вовзращаю сразу промис, то process.env путс
  }
}
