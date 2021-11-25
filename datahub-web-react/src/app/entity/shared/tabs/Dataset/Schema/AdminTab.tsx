// import { Empty } from 'antd';
import React from 'react';
import { GetDatasetOwnersSpecialQuery } from '../../../../../../graphql/dataset.generated';
import { useGetAuthenticatedUser } from '../../../../../useGetAuthenticatedUser';
import { useBaseEntity } from '../../../EntityContext';
import { EditBrowsePathTable } from '../BrowsePath/EditBrowsePathTable';
import { DeleteSchemaTabv2 } from './DeleteSchemaTabv2';

export const AdminTab = () => {
    const queryBase = useBaseEntity<GetDatasetOwnersSpecialQuery>()?.dataset?.ownership?.owners;
    const ownersArray = queryBase?.map((x) => (x?.type === 'DATAOWNER' ? x?.owner?.urn.split(':').slice(-1) : ''));
    const ownersArray2 = ownersArray?.flat() ?? [];
    const currUser = useGetAuthenticatedUser()?.corpUser?.username || '-';
    if (ownersArray2.includes(currUser)) {
        return (
            <>
                <DeleteSchemaTabv2 />
                <EditBrowsePathTable />
            </>
        );
    }
    return (
        <>
            <span>You need to be a dataowner of this dataset to make edits</span>
        </>
    );
};
