// import { Empty } from 'antd';
import React from 'react';
import { Tabs } from 'antd';
import { GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
import { EntityType } from '../../../../../../types.generated';
// import { useGetAuthenticatedUser } from '../../../../../useGetAuthenticatedUser';
import { FindWhoAmI } from '../../../../dataset/whoAmI';
import { useBaseEntity } from '../../../EntityContext';
import { EditSchemaTableEditable } from './EditSchemaTableEditable';
import { EditPropertiesTableEditable } from './EditPropertiesTableEditable';
import { EditBrowsePathTable } from '../BrowsePath/EditBrowsePathTable';
import { DeleteSchemaTabv2 } from '../Delete/DeleteSchemaTabv2';

export const EditSchemaTab = () => {
    const { TabPane } = Tabs;
    const queryBase = useBaseEntity<GetDatasetQuery>()?.dataset?.ownership?.owners;
    const currUser = FindWhoAmI();
    const ownersArray =
        queryBase
            ?.map((x) =>
                x?.type === 'DATAOWNER' && x?.owner?.type === EntityType.CorpUser
                    ? x?.owner?.urn.split(':').slice(-1)
                    : '',
            )
            .flat() || [];
    // console.log(`ownersArray is ${ownersArray} and I am ${currUser}`);
    if (ownersArray.includes(currUser)) {
        return (
            <>
                <Tabs defaultActiveKey="1">
                    <TabPane tab="Edit Schema" key="1">
                        <EditSchemaTableEditable />
                    </TabPane>
                    <TabPane tab="Edit Properties" key="2">
                        <EditPropertiesTableEditable />
                    </TabPane>
                    <TabPane tab="Edit Browse Path" key="3">
                        <EditBrowsePathTable />
                    </TabPane>
                    <TabPane tab="Delete/Undo Delete" key="4">
                        <DeleteSchemaTabv2 />
                    </TabPane>
                </Tabs>
            </>
        );
    }
    return (
        <>
            <span>You need to be a dataowner of this dataset to make edits</span>
        </>
    );
};
