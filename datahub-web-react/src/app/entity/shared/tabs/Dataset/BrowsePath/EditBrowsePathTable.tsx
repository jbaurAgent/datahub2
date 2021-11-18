// import { Empty } from 'antd';
import React from 'react';
import { gql, useQuery } from '@apollo/client';
import { GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
import { useBaseEntity } from '../../../EntityContext';

export const EditBrowsePathTable = () => {
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
    const dataPaths =
        data &&
        data.browsePaths.map((x) => {
            const temp: [] = x.path;
            return temp.join('/');
        });
    if (data) console.log(dataPaths);
    return (
        <>
            <span>You need to be a dataowner of this dataset to make edits</span>
        </>
    );
};
