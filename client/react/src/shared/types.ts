
export type Nullable<T> = T | null;

/**
  Типы полей в документации:
  https://www.amocrm.ru/developers/content/crm_platform/custom-fields
*/
type CustomField =   {
  field_id: number,
  values: Array<{ value: unknown }> 
}

export type Link = {
  self: {
    href: string
  }
}

export type Company = {
  id: number;
  _links: Array<Link>;
}

export type Ebedded = {
  tags: Array<unknown>;
  companies: Array<Company>;
}

export type Lead = {
  id: number;
  name: string;
  price: number;
  responsible_user_id: number;
  group_id: number;
  status_id: number;
  pipeline_id: number;
  loss_reason_id: Nullable<number>;
  created_by: number;
  updated_by: number;
  created_at: number;
  updated_at: number;
  closed_at:  Nullable<number>;
  closest_task_at:  Nullable<number>;
  is_deleted:  boolean;
  custom_fields_values:  Nullable<Array<CustomField>>;
  score: Nullable<number>;
  account_id: number;
  labor_cost: Nullable<number>;
  _links: Array<Link>;
  _embedded: Ebedded
}

export type LeadResponse = {
  _page: number;
  _links: Link;
  _embedded: {
    leads: Array<Lead>
  }
}