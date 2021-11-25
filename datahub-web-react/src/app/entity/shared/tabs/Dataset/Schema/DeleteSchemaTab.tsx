// import { Empty } from 'antd';
import React from 'react';
import { Button, message, Typography } from 'antd';
import axios from 'axios';
import { GetDatasetOwnersSpecialQuery, GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
import { useGetAuthenticatedUser } from '../../../../../useGetAuthenticatedUser';
import { useBaseEntity } from '../../../EntityContext';

function CheckStatus(entity) {
    const rawStatus = entity?.dataset?.status?.removed;
    const currStatus = rawStatus === undefined ? false : rawStatus;
    return currStatus;
}
function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
}
export const DeleteSchemaTab = () => {
    const entity = useBaseEntity<GetDatasetQuery>();
    async function refreshPage() {
        await timeout(3000);
        window.location.reload();
    }
    const currDataset = useBaseEntity<GetDatasetOwnersSpecialQuery>()?.dataset?.urn;
    const currUser = useGetAuthenticatedUser()?.corpUser?.username || '-';
    const delMsg = 'The dataset will not be searchable after this. Confirm?';
    const reactivateMsg = 'The dataset will be restored to DataHub listing. Confirm?';
    const noActive = 'Dataset is currently NOT active in DataHub';
    const active = 'Dataset is currently active in Datahub';
    const printSuccessMsg = (status) => {
        message.success(`Status:${status} - Request submitted successfully`, 3).then();
    };
    const printErrorMsg = (error) => {
        message.error(error, 3).then();
    };
    const deleteDataset = () => {
        const msg = CheckStatus(entity) ? reactivateMsg : delMsg;
        const clicked = window.confirm(msg);
        if (clicked) {
            console.log('yes it is pressed');
            axios
                .post('http://localhost:8001/update_dataset_status', {
                    dataset_name: currDataset,
                    requestor: currUser,
                    desired_state: !CheckStatus(entity),
                })
                .then((response) => printSuccessMsg(response.status))
                .catch((error) => {
                    printErrorMsg(error.toString());
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
