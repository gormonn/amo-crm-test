import { createEffect, createEvent, createStore, sample } from 'effector';
import { createGate } from 'effector-react';
import { pending } from 'patronum';
import { Lead } from 'shared/types';
import { api } from 'shared/api';

const getAllLeads = createEvent();
const getAllLeadsFx = createEffect(async () => {
  const { data } = await api.leads.getAll();
  return data;
});

const getFilteredLeads = createEvent();
const getFilteredLeadsFx = createEffect(async () => {
  const { data } = await api.leads.getFiltered();
  return data;
});

const $leads = createStore<Array<Lead>>([]);
const $error = createStore<string>('');
const load = createGate();

sample({
  source: load.status,
  filter: Boolean,
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
  getFilteredLeads,
};
