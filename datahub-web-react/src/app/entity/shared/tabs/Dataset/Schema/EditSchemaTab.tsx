// import { Empty } from 'antd';
import React from 'react';
import { GetDatasetOwnersSpecialQuery, GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
import { BrowsePath } from '../../../../../../types.generated';
import { useGetAuthenticatedUser } from '../../../../../useGetAuthenticatedUser';
import { useBaseEntity } from '../../../EntityContext';
import { DeleteSchemaTab } from './DeleteSchemaTab';
// import { EditSchemaTable } from './EditSchemaTable';
import EditSchemaTableNew from './EditSchemaTableNew';
// import EditSchemaTableNew from './EditSchemaTableNew';

export const EditSchemaTab = () => {
    const queryBase = useBaseEntity<GetDatasetOwnersSpecialQuery>()?.dataset?.ownership?.owners;
    const ownersArray = queryBase?.map((x) => (x?.type === 'DATAOWNER' ? x?.owner?.urn.split(':').slice(-1) : ''));
    const ownersArray2 = ownersArray?.flat() ?? [];
    const currUser = useGetAuthenticatedUser()?.corpUser?.username || '-';
    const queryFields = useBaseEntity<GetDatasetQuery>()?.dataset?.schemaMetadata?.fields;
    const browse = useBaseEntity<BrowsePath>()?.path; // check for ideas here: /home/admini/newtry/datahub/datahub-web-react/src/app/entity/shared/containers/profile/EntityProfile.tsx
    console.log(`browsepath is ${browse}`);
    if (ownersArray2.includes(currUser)) {
        return (
            <>
                <br />
                <DeleteSchemaTab />
                <br />
                <EditSchemaTableNew query={queryFields} />
            </>
        );
    }
    return (
        <>
            <span>You need to be a dataowner of this dataset to make edits</span>
        </>
    );
};
