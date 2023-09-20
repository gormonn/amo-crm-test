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
//token_type: 'Bearer',
//expires_in: 86400,
//access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6IjY4NDU0MjA1ZDk5YTY4YTAyODQxMjRhMDVhZjlmZjJjZWI3ZDE5YWMzYjkxNmM2Mzc2NWVkZDMzY2IxNzM4ZTAxMWE1NDRiMzZiNTk5ODllIn0.eyJhdWQiOiIxMTdmZjkwNy05OTdhLTRmZjMtOWNjYy0wZGU2Y2VjNGY3MjYiLCJqdGkiOiI2ODQ1NDIwNWQ5OWE2OGEwMjg0MTI0YTA1YWY5ZmYyY2ViN2QxOWFjM2I5MTZjNjM3NjVlZGQzM2NiMTczOGUwMTFhNTQ0YjM2YjU5OTg5ZSIsImlhdCI6MTY5NTE2Njc1MiwibmJmIjoxNjk1MTY2NzUyLCJleHAiOjE2OTUyNTMxNTIsInN1YiI6IjEwMDkxNDI2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxMjk2NDIyLCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOiJ2MiIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXX0.Mq6hnvbH2BOywnHL8Cs-xq5Tcaj_JmqN8NY-Afppckmv0EtfH2TRolO6vdociphJe7nWdnob4sBE-ogwIgoncNpKL5wxTgGsGlVgQmL1eiBYyo-k39Zpqxm7lYy9-0nW5fMGcQCqgkvreRkhQTdAbC6XbPRvgOSeRyrHRFDBhY5kTX4qPsPOPPyeEKNFx5ojsBDzgY6PCjqCv6yNgS-oRQaqklXlGTPHj5nKR0cesh6mNOEhHi1xggNml1j9978m8_VlpATjdSWXTQ49GVn6RDEed9ESbzXv3uyneCZVwF8stho9h4FkowD48o83rQ1PTvQZSVGpBA30SxjPCsFVjg',
//refresh_token: 'def50200c35d0e06a5c10b1ff2a4d860e1a6b690d0062d91716a7bd7072d5bd4a457427f6a28fd41e3216107cb321bc99f2af3a18f3ae4320a77febebd72efc50caad807435a4ae378f734ce40f18da13fa34627c6b788ffe3f8eca2a98fe5d1ff4af16b7098a526ef33583c923b0cd7db32c5935c5a95c7e100c6140cc52e7db1e0174f814682e478066ca7ba77c6413d355a5ce54d40afbdc00236202b9b6bde7d5827dbd398e23e109760be7423ab5685f29b91e59b867f985c8245d4c084f89e41c31389ad87e3cb70c33c0096fc7280cea4b3a0a3eba706e5a5aed4bb37849c6c4855309a68971680ea916a3b23214028c9e7558a1ff507a81b5d214228556a432aefa4afef29594d3b131d2f402ad91375881d43bf9143289bd662ef95aa2720d8a0e5be4a1498ce892b4bc3d87d16a96b46fa43cc9014865c8cd157ac2020f59afd7505cc6506daf64282f90f880aa06c0e1f29d77e1a57ca56961939aed73c9c8455d8e40b434b70ad432820b7dd38964b804fa68162c3872719ec03fd7257c4e05705fb1623a0ab1a33d7e6b3030777de5ec89f48fd47fbe46eec24f0594733d945b495e1354c917d43385047c00d202628246895ff1fd970f5c718d74db2ffd3f70749a995fbe38f7a8910c12ac77a2d6a522389fdea6137f5b12383c19722916439e5d2c6f55efa42db8d86'

@Injectable()
export class AmoClientService {
  private creds: Credentails = {};

  constructor(private readonly httpService: HttpService) {
    const requestRefresh: TokenRefreshRequest = async (
      refreshToken: string,
    ): Promise<IAuthTokens | string> => {
      const response = await axios.post(`${BASE_API}oauth2/access_token`, {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        redirect_uri: process.env.REDIRECT_URI,
      });
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
    return await this.httpService
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
      .catch((e) => e.response.data);
  }
}
