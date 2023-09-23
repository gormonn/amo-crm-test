import { Alert, Table, Input } from 'antd';
import { useGate, useUnit } from 'effector-react';
import { leadsModel } from 'entities/leads';
import css from './leads.module.scss';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Price',
    dataIndex: 'price',
    key: 'price',
  },
];

export const Leads = () => {
  useGate(leadsModel.load);
  const [dataSource, error, inProgress, setQuery, query] = useUnit([
    leadsModel.$leads,
    leadsModel.$error,
    leadsModel.$inProgress,
    leadsModel.setQuery,
    leadsModel.$query,
  ]);

  return (
    <div className={css.leads}>
      {error && <Alert message={error} type="warning" closable></Alert>}
      <Input
        placeholder="input search text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Table dataSource={dataSource} columns={columns} loading={inProgress} />
    </div>
  );
};
