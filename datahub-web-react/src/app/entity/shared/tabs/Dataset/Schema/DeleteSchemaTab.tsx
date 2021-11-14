// import { Empty } from 'antd';
import React from 'react';
import { Button, Typography } from 'antd';
import axios from 'axios';
import { GetDatasetOwnersSpecialQuery, GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
import { useGetAuthenticatedUser } from '../../../../../useGetAuthenticatedUser';
import { useBaseEntity } from '../../../EntityContext';

function CheckStatus(entity) {
    const rawStatus = entity?.dataset?.status?.removed;
    const currStatus = rawStatus === undefined ? false : rawStatus;
    return currStatus;
}

export const DeleteSchemaTab = () => {
    const entity = useBaseEntity<GetDatasetQuery>();
    function refreshPage() {
        window.location.reload();
    }
    const currDataset = useBaseEntity<GetDatasetOwnersSpecialQuery>()?.dataset?.urn;
    const currUser = useGetAuthenticatedUser()?.corpUser?.username || '-';
    const delMsg = 'The dataset will not be searchable after this. Confirm?';
    const reactivateMsg = 'The dataset will be restored to DataHub listing. Confirm?';
    const noActive = 'Dataset is currently NOT active in DataHub';
    const active = 'Dataset is currently active in Datahub';
    const deleteDataset = () => {
        const msg = CheckStatus(entity) ? reactivateMsg : delMsg;
        const clicked = window.confirm(msg);
        if (clicked) {
            console.log('yes it is pressed');
            axios.post('http://localhost:8001/delete_dataset', {
                dataset_name: currDataset,
                requestor: currUser,
                desired_status: !CheckStatus(entity),
            });
            refreshPage();
        }
    };
    if (!CheckStatus(entity)) {
        return (
            <>
                <Button htmlType="button" onClick={deleteDataset}>
                    Delete Dataset
                </Button>
                <Typography.Title level={5}>{active}</Typography.Title>
            </>
        );
    }
    return (
        <>
            <Button htmlType="button" onClick={deleteDataset}>
                Reactivate Dataset
            </Button>
            <Typography.Title level={4}>{noActive}</Typography.Title>
        </>
    );
};
