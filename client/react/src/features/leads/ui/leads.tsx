import { Alert, Button, Table } from 'antd';
import { useGate, useUnit } from 'effector-react';
import { leadsModel } from '../../../entities/leads';
import css from './leads.module.scss';

const dataSource = [
  {
    key: '1',
    name: 'Mike',
    age: 32,
    address: '10 Downing Street',
  },
  {
    key: '2',
    name: 'John',
    age: 42,
    address: '10 Downing Street',
  },
];

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
];

export const Leads = () => {
  useGate(leadsModel.load);
  const [dataSource, error, inProgress, getFilteredLeads] = useUnit([
    leadsModel.$leads,
    leadsModel.$error,
    leadsModel.$inProgress,
    leadsModel.getFilteredLeads,
  ]);

  return (
    <div className={css.leads}>
      {error && <Alert message={error} type="warning" closable></Alert>}
      <Table dataSource={dataSource} columns={columns} loading={inProgress} />
      <Button onClick={getFilteredLeads}>Use filter</Button>
    </div>
  );
};
