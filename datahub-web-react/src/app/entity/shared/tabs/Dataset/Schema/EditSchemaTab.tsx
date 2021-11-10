// import { Empty } from 'antd';
import React from 'react';
import { Button } from 'antd';
import { GetDatasetQuery, GetDatasetOwnersSpecialQuery } from '../../../../../../graphql/dataset.generated';
import { useGetAuthenticatedUser } from '../../../../../useGetAuthenticatedUser';
import { useBaseEntity } from '../../../EntityContext';

export default function EditSchemaTab() {
    const baseEntity = useBaseEntity<GetDatasetQuery>();
    const hasUsageStats = baseEntity?.dataset?.globalTags?.tags;
    const new1 = hasUsageStats?.map((x) => x.tag.name);
    const new2 = useBaseEntity<GetDatasetOwnersSpecialQuery>();
    const new2a = new2?.dataset?.ownership?.owners;
    const new2b = new2a?.map((x) => x?.owner?.type);
    return (
        <>
            <br />
            <Button> Bah </Button>
            <br />
            welcome back, {useGetAuthenticatedUser()?.corpUser?.username}
            <br />
            <span>{new1}</span>
            <span>{new2b}</span>
            {/* <span>hello Tech View</span> */}
        </>
    );
}
