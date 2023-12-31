import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';
import axios, { AxiosError } from 'axios';
import {
  IAuthTokens,
  applyAuthTokenInterceptor,
  setAuthTokens,
} from 'axios-jwt';
import { getBaseUrl } from 'src/lib';
import { catchError, firstValueFrom } from 'rxjs';
import { LeadQueryParamDto } from '../../validators';

export interface Credentials {
  token_type?: string;
  expires_in?: number;
  access_token?: string;
  refresh_token?: string;
}

@Injectable()
export class AmoClientService {
  private creds: Credentials = {};
  constructor(private readonly httpService: HttpService) {}

  async getLeadsOld(params?: { query: LeadQueryParamDto }) {
    const { data } = await firstValueFrom(
      this.httpService
        .get('/api/v4/leads', {
          headers: {
            Authorization: `${this.creds.token_type} ${this.creds.access_token}`,
          },
          params,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(
              `api/v4/leads: ${JSON.stringify(error.response.data)}`,
            );
            throw 'Error!';
          }),
        ),
    );
    return data;
  }
  async getLeads(params?: { query: LeadQueryParamDto }) {
    const { data } = await this.httpService.axiosRef
      .get('/api/v4/leads', {
        params,
      })
      .then((res) => res)
      .catch((error) => {
        console.error(`api/v4/leads: ${JSON.stringify(error.response.data)}`);
        throw 'Error!';
      });

    return data;
  }

  async reAuth() {
    try {
      const { data } = await firstValueFrom(
        this.httpService
          .post<Credentials>('oauth2/access_token', {
            // занятный факт, в документации сказано, что чтение из process.env может быть медленным, поэтому мы можем кешировать значения
            client_id: process.env.APP_CLIENT_ID,
            client_secret: process.env.APP_CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: process.env.APP_CLIENT_AUTH_CODE,
            redirect_uri: process.env.APP_REDIRECT_URI,
          })
          .pipe(
            catchError((error: AxiosError) => {
              console.error(
                `Auth Error: ${JSON.stringify(error.response.data)}`,
              );
              throw 'APP_CLIENT_AUTH_CODE will update!';
            }),
          ),
      );

      await setAuthTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
      // this.creds = data;
    } catch (e) {
      console.error(e);
    }
  }

  async onModuleInit(): Promise<void> {
    applyAuthTokenInterceptor(this.httpService.axiosRef, {
      requestRefresh: async (
        refreshToken: string,
      ): Promise<IAuthTokens | string> => {
        const props = {
          client_id: process.env.APP_CLIENT_ID,
          client_secret: process.env.APP_CLIENT_SECRET,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          redirect_uri: process.env.APP_REDIRECT_URI,
        };
        const response = await axios.post(
          `${getBaseUrl()}oauth2/access_token`,
          props,
        );
        return response.data.access_token;
      },
      getStorage: () => ({
        remove: async (key: string) => {
          delete this.creds[key];
        },
        set: async (key: string, value: string) => {
          this.creds[key] = value;
        },
        get: async (key: string) => {
          return this.creds?.[key] || null;
        },
      }),
      header: 'Authorization',
      headerPrefix: 'Bearer ',
    });
  }

  // минус - при HOT-reload происходит реинициализация
  async onApplicationBootstrap() {
    await this.reAuth();
  }
}
