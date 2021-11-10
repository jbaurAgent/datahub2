// import { Empty } from 'antd';
import React from 'react';
import { Button } from 'antd';
import { GetDatasetOwnersSpecialQuery } from '../../../../../../graphql/dataset.generated';
import { useGetAuthenticatedUser } from '../../../../../useGetAuthenticatedUser';
import { useBaseEntity } from '../../../EntityContext';

export default function EditSchemaTab() {
    // const baseEntity = useBaseEntity<GetDatasetQuery>();
    // const output = baseEntity?.dataset?.datasetProfiles?.length || -1;
    // const hasUsageStats = baseEntity?.dataset?.globalTags?.tags;
    // const new1 = hasUsageStats?.map((x) => x.tag.name);
    const queryBase = useBaseEntity<GetDatasetOwnersSpecialQuery>();
    const ownershipArray = queryBase?.dataset?.ownership?.owners;
    const ownersArray = ownershipArray?.map((x) =>
        x?.type === 'DATAOWNER' ? x?.owner?.urn.split(':').slice(-1) : null,
    );
    return (
        <>
            <br />
            <Button> {ownersArray} </Button>
            <br />
            welcome back, {useGetAuthenticatedUser()?.corpUser?.username}
            <br />
            {/* <span>hello Tech View</span> */}
        </>
    );
}
