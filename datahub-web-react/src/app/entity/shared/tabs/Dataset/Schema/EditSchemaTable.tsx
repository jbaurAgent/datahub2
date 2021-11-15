// import { Empty } from 'antd';
import React from 'react';
// import { useGetAuthenticatedUser } from '../../../../../useGetAuthenticatedUser';
import { Table, Divider } from 'antd'; // https://ant.design/components/table/#components-table-demo-basic
import { useBaseEntity } from '../../../EntityContext';
import { GetDatasetQuery } from '../../../../../../graphql/dataset.generated';

export const EditSchemaTable = () => {
    const queryFields = useBaseEntity<GetDatasetQuery>()?.dataset?.schemaMetadata?.fields;
    const dataSource = queryFields?.map((x, ind) => {
        return {
            key: ind,
            name: x?.fieldPath,
            datahubType: x?.type,
            nativeType: x?.nativeDataType,
        };
    });
    console.log(dataSource);
    // const dataSource = [
    //     {
    //         key: '1',
    //         name: 'Mike',
    //         age: 32,
    //         address: '10 Downing Street',
    //     },
    //     {
    //         key: '2',
    //         name: 'John',
    //         age: 42,
    //         address: '10 Downing Street',
    //     },
    // ];
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Type',
            dataIndex: 'datahubType',
            key: 'datahubType',
        },
        {
            title: 'NativeType',
            dataIndex: 'nativeType',
            key: 'nativeType',
        },
    ];
    // const currUser = useGetAuthenticatedUser()?.corpUser?.username || '-';
    return (
        <>
            Edit Dataset Schema here:
            <Divider />
            <Table dataSource={dataSource} columns={columns} />;
        </>
    );
};
