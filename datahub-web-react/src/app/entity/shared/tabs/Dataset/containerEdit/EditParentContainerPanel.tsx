import { Button, Form, message } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import { GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
import { WhereAmI } from '../../../../../home/whereAmI';
import { FindMyUrn, FindWhoAmI, GetMyToken } from '../../../../dataset/whoAmI';
import { useBaseEntity } from '../../../EntityContext';
// import { Select } from 'antd';
import { SetParentContainer } from './SetParentContainer';

function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay));
}

export const EditParentContainerPanel = () => {
    const urlBase = WhereAmI();
    const updateUrl = `${urlBase}custom/update_containers`;
    const userUrn = FindMyUrn();
    const currUser = FindWhoAmI();
    const userToken = GetMyToken(userUrn);
    const dataset = useBaseEntity<GetDatasetQuery>();
    const datasetUrn = useBaseEntity<GetDatasetQuery>()?.dataset?.urn;
    const platform = dataset?.dataset?.platform?.urn || '';
    const containerValue = dataset?.dataset?.container?.properties?.name || '';

    const [modifiedState, setModifiedState] = useState(true);

    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 14,
        },
    };
    const [formState] = Form.useForm();

    const updateForm = () => {
        setModifiedState(false);
        const hasErrors = formState.getFieldsError().some(({ errors }) => errors.length);
        setModifiedState(!hasErrors);
    };
    const resetForm = () => {
        setModifiedState(true);
        formState.resetFields();
    };
    const printSuccessMsg = (status) => {
        message.success(`Status:${status} - Request submitted successfully`, 3).then();
    };
    const printErrorMsg = (error) => {
        message.error(error, 3).then();
    };
    const onFinish = async (values) => {
        const proposedContainer = values.parentContainerSelect[0];
        // container is always 1 only, hence list to singular value
        const submission = {
            dataset_name: datasetUrn,
            requestor: currUser,
            container: proposedContainer,
            user_token: userToken,
        };
        axios
            .post(updateUrl, submission)
            .then((response) => printSuccessMsg(response.status))
            .catch((error) => {
                printErrorMsg(error.toString());
            });
        await timeout(3000);
        window.location.reload();
    };

    return (
        <>
            <Form
                name="dynamic_item"
                {...layout}
                form={formState}
                onFinish={onFinish}
                onValuesChange={updateForm}
                initialValues={{
                    parentContainerSelect: containerValue,
                }}
            >
                <Button type="primary" htmlType="submit" disabled={modifiedState}>
                    Submit
                </Button>
                &nbsp;
                <Button htmlType="button" onClick={resetForm}>
                    Reset
                </Button>
                <SetParentContainer platformType={platform} />
            </Form>
        </>
    );
};
