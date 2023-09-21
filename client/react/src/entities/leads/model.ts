import { createEffect, createEvent, createStore, sample } from 'effector';
import { Lead } from 'shared/types';
import { api } from 'shared/api';

const getAllLeads = createEvent();
const getAllLeadsFx = createEffect(async () => {
  const { data } = await api.leads.getAll();
  return data;
});

const $leads = createStore<Array<Lead>>([]);

sample({
  clock: getAllLeads,
  target: getAllLeadsFx,
});

sample({
  clock: getAllLeadsFx.doneData,
  fn: (props) => props._embedded.leads,
  target: $leads,
});

export const model = {
  getAllLeads,
  $leads,
};
