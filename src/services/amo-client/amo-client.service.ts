import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import * as process from 'process';
import axios, { AxiosError } from 'axios';
import { IAuthTokens, applyAuthTokenInterceptor } from 'axios-jwt';
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

  async getLeads(params?: { query: LeadQueryParamDto }) {
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
          console.log('SETTER creds', this.creds);
        },
        get: async (key: string) => {
          return this.creds?.[key] || null;
        },
      }),
    });
  }

  // минус - при HOT-reload происходит реинициализация
  async onApplicationBootstrap() {
    const { data } = await firstValueFrom(
      this.httpService
        .post<Credentials>('oauth2/access_token', {
          client_id: process.env.APP_CLIENT_ID,
          client_secret: process.env.APP_CLIENT_SECRET,
          grant_type: 'authorization_code',
          code: process.env.APP_CLIENT_AUTH_CODE,
          redirect_uri: process.env.APP_REDIRECT_URI,
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.error(`Auth Error: ${JSON.stringify(error.response.data)}`);
            throw 'APP_CLIENT_AUTH_CODE will update!';
          }),
        ),
    );
    this.creds = data;
  }
}
