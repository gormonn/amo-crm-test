import {
  createEffect,
  createEvent,
  createStore,
  restore,
  sample,
} from 'effector';
import { createGate } from 'effector-react';
import { debounce, pending } from 'patronum';
import { Lead } from 'shared/types';
import { api } from 'shared/api';

const getAllLeads = createEvent();
const getAllLeadsFx = createEffect(async () => {
  const { data } = await api.leads.getAll();
  return data;
});

const getFilteredLeads = createEvent<string>();
const getFilteredLeadsFx = createEffect(async (query: string) => {
  const { data } = await api.leads.getFiltered(query);
  return data;
});

const setQuery = createEvent<string>();
const $query = restore<string>(setQuery, '');
const $queryDeb = debounce({ source: $query, timeout: 200 });

const $leads = createStore<Array<Lead>>([]);
const $error = createStore<string>('');
const load = createGate();

sample({
  clock: load.open,
  target: getAllLeads,
});

sample({
  clock: getAllLeads,
  target: getAllLeadsFx,
});

sample({
  clock: getAllLeadsFx.doneData,
  fn: (props) => props._embedded.leads,
  target: $leads,
});

sample({
  clock: getAllLeadsFx.failData,
  fn: JSON.stringify,
  target: $error,
});

sample({
  source: $queryDeb,
  filter: (val) => val.length >= 3,
  target: getFilteredLeads,
});

sample({
  source: $queryDeb,
  filter: (val) => val.length === 0,
  target: getAllLeads,
});

sample({
  clock: getFilteredLeads,
  target: getFilteredLeadsFx,
});

sample({
  clock: getFilteredLeadsFx.doneData,
  fn: (props) => props._embedded.leads,
  target: $leads,
});

sample({
  clock: getFilteredLeadsFx.failData,
  fn: JSON.stringify,
  target: $error,
});

const $inProgress = pending({ effects: [getAllLeadsFx, getFilteredLeadsFx] });

export const model = {
  load,
  $inProgress,
  $leads,
  $error,
  setQuery,
  $query,
};
