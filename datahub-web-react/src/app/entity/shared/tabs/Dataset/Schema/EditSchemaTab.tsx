// import { Empty } from 'antd';
import React from 'react';
// import { getBrowsePathsResolver } from '../../../../../../graphql-mock/resolver/getBrowsePathsResolver';
import { gql, useQuery } from '@apollo/client';
import { GetDatasetOwnersSpecialQuery, GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
// import { BrowsePath } from '../../../../../../types.generated';
import { useGetAuthenticatedUser } from '../../../../../useGetAuthenticatedUser';
import { useBaseEntity } from '../../../EntityContext';
import { DeleteSchemaTab } from './DeleteSchemaTab';
// import { EditSchemaTable } from './EditSchemaTable';
import EditSchemaTableNew from './EditSchemaTableNew';
// import EditSchemaTableNew from './EditSchemaTableNew';

// import { EntityType } from '../../../../../../types.generated';

export const EditSchemaTab = () => {
    const queryBase = useBaseEntity<GetDatasetOwnersSpecialQuery>()?.dataset?.ownership?.owners;
    const ownersArray = queryBase?.map((x) => (x?.type === 'DATAOWNER' ? x?.owner?.urn.split(':').slice(-1) : ''));
    const ownersArray2 = ownersArray?.flat() ?? [];
    const currUser = useGetAuthenticatedUser()?.corpUser?.username || '-';
    const queryFields = useBaseEntity<GetDatasetQuery>()?.dataset?.schemaMetadata?.fields;
    const baseEntity = useBaseEntity<GetDatasetQuery>();
    const currUrn = baseEntity && baseEntity.dataset && baseEntity.dataset?.urn;
    console.log(currUrn);
    const queryresult = gql`
        {
            browsePaths(
                input: {
                    urn: "${currUrn}"
                    type: DATASET
                }
            ) {
                path
            }
        }
    `;
    const { data } = useQuery(queryresult, { skip: currUrn === undefined });
    // data && data.browsePaths.map
    if (data) {
        data.browsePaths.map((x) => console.log(x.path));
    }
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
