// import { Empty } from 'antd';
import React from 'react';
// import { useGetAuthenticatedUser } from '../../../../../useGetAuthenticatedUser';
import { Table } from 'antd'; // https://ant.design/components/table/#components-table-demo-basic

export const EditSchemaTable = () => {
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
    // const currUser = useGetAuthenticatedUser()?.corpUser?.username || '-';
    return (
        <>
            Edit Dataset Schema here:
            <Table dataSource={dataSource} columns={columns} />;
        </>
    );
};
