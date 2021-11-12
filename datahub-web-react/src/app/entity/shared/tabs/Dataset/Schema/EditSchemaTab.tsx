// import { Empty } from 'antd';
import React from 'react';
import { Button } from 'antd';
// import xtype from 'xtypejs';
import axios from 'axios';
import { GetDatasetOwnersSpecialQuery, GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
import { useGetAuthenticatedUser } from '../../../../../useGetAuthenticatedUser';
import { useBaseEntity } from '../../../EntityContext';
// import { Status } from '../../../../../../types.generated';

export const EditSchemaTab = () => {
    // const baseEntity = useBaseEntity<GetDatasetQuery>();
    // const output = baseEntity?.dataset?.datasetProfiles?.length || -1;
    // const hasUsageStats = baseEntity?.dataset?.globalTags?.tags;
    // const new1 = hasUsageStats?.map((x) => x.tag.name);
    // const updateEntity = useEntityUpdate();
    // const updateStatus = (update: Status) => {
    //     updateEntity({ variables: { input: { urn, ownership: update } } })
    //         .then(() => message.success({ content: 'Updated!', duration: 2 }))
    //         .catch((e) => {
    //             message.destroy();
    //             message.error({ content: `Failed to update: \n ${e.message || ''}`, duration: 3 });
    //         });
    // };
    const rawStatus = useBaseEntity<GetDatasetQuery>()?.dataset?.status?.removed;
    const status = rawStatus === undefined ? false : rawStatus;
    const currDataset = useBaseEntity<GetDatasetOwnersSpecialQuery>()?.dataset?.urn;
    const queryBase = useBaseEntity<GetDatasetOwnersSpecialQuery>()?.dataset?.ownership?.owners;
    const ownersArray = queryBase?.map((x) => (x?.type === 'DATAOWNER' ? x?.owner?.urn.split(':').slice(-1) : ''));
    const ownersArray2 = ownersArray?.flat() ?? [];
    const currUser = useGetAuthenticatedUser()?.corpUser?.username || '-';
    const deleteDataset = () => {
        const result = window.confirm(
            "You can't undo this action once you leave the page as the dataset will not be searchable after this. Confirm?",
        );
        if (result) {
            console.log('yes it is pressed');
            axios.post('http://localhost:8000/trigger', { dataset: currDataset, owner: currUser });
        } else {
            console.log('nope');
        }
    };
    console.log(`status is ${status}`);
    if (ownersArray2.includes(currUser)) {
        return (
            <>
                <br />
                <Button htmlType="button" onClick={deleteDataset}>
                    Delete Dataset
                </Button>
                <br />
                Delete Status: ${status}
                <br />
                {/* <span>hello Tech View</span> */}
            </>
        );
    }
    return (
        <>
            <span>You need to be a dataowner of this dataset to make edits</span>
        </>
    );
};
