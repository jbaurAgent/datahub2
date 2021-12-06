import * as React from 'react';
import { DatabaseFilled, DatabaseOutlined } from '@ant-design/icons';
import { Tag, Typography } from 'antd';
import styled from 'styled-components';
import { Dataset, EntityType, SearchResult } from '../../../types.generated';
import { Entity, IconStyleType, PreviewType } from '../Entity';
import { Preview } from './preview/Preview';
import { FIELDS_TO_HIGHLIGHT } from './search/highlights';
import { Direction } from '../../lineage/types';
import getChildren from '../../lineage/utils/getChildren';
import { EntityProfile } from '../shared/containers/profile/EntityProfile';
import {
    GetDatasetOwnersGqlQuery,
    GetDatasetQuery,
    useGetDatasetQuery,
    useUpdateDatasetMutation,
} from '../../../graphql/dataset.generated';
import { GenericEntityProperties } from '../shared/types';
import { PropertiesTab } from '../shared/tabs/Properties/PropertiesTab';
import { DocumentationTab } from '../shared/tabs/Documentation/DocumentationTab';
import { SchemaTab } from '../shared/tabs/Dataset/Schema/SchemaTab';
import QueriesTab from '../shared/tabs/Dataset/Queries/QueriesTab';
import { SidebarAboutSection } from '../shared/containers/profile/sidebar/SidebarAboutSection';
import { SidebarOwnerSection } from '../shared/containers/profile/sidebar/Ownership/SidebarOwnerSection';
import { SidebarTagsSection } from '../shared/containers/profile/sidebar/SidebarTagsSection';
import { SidebarStatsSection } from '../shared/containers/profile/sidebar/Dataset/StatsSidebarSection';
import StatsTab from '../shared/tabs/Dataset/Stats/StatsTab';
import { LineageTab } from '../shared/tabs/Lineage/LineageTab';
import { EditSchemaTab } from '../shared/tabs/Dataset/Schema/EditSchemaTab';
import { useGetMeQuery } from '../../../graphql/me.generated';
import { AdminTab } from '../shared/tabs/Dataset/Schema/AdminTab';
import { EditPropertiesTab } from '../shared/tabs/Dataset/Schema/EditPropertiesTab';
// import { useGetMeQuery } from '../../../graphql/me.generated';

const MatchTag = styled(Tag)`
    &&& {
        margin-bottom: 0px;
        margin-top: 10px;
    }
`;
function FindWhoAmI() {
    const { data } = useGetMeQuery();
    const whoami = data?.me?.corpUser?.username;
    return whoami;
}

/**
 * Definition of the DataHub Dataset entity.
 */
export class DatasetEntity implements Entity<Dataset> {
    type: EntityType = EntityType.Dataset;

    icon = (fontSize: number, styleType: IconStyleType) => {
        if (styleType === IconStyleType.TAB_VIEW) {
            return <DatabaseOutlined style={{ fontSize }} />;
        }

        if (styleType === IconStyleType.HIGHLIGHT) {
            return <DatabaseFilled style={{ fontSize, color: '#B37FEB' }} />;
        }

        if (styleType === IconStyleType.SVG) {
            return (
                <path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-600 72h560v208H232V136zm560 480H232V408h560v208zm0 272H232V680h560v208zM304 240a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0z" />
            );
        }

        return (
            <DatabaseFilled
                style={{
                    fontSize,
                    color: '#BFBFBF',
                }}
            />
        );
    };

    isSearchEnabled = () => true;

    isBrowseEnabled = () => true;

    isLineageEnabled = () => true;

    getAutoCompleteFieldName = () => 'name';

    getPathName = () => 'dataset';

    getCollectionName = () => 'Datasets';

    renderProfile = (urn: string) => (
        <EntityProfile
            urn={urn}
            entityType={EntityType.Dataset}
            useEntityQuery={useGetDatasetQuery}
            useUpdateQuery={useUpdateDatasetMutation}
            getOverrideProperties={this.getOverrideProperties}
            tabs={[
                {
                    name: 'Schema',
                    component: SchemaTab,
                },
                {
                    name: 'Documentation',
                    component: DocumentationTab,
                },
                {
                    name: 'Properties',
                    component: PropertiesTab,
                },
                {
                    name: 'Lineage',
                    component: LineageTab,
                    shouldHide: (_, dataset: GetDatasetQuery) =>
                        (dataset?.dataset?.upstreamLineage?.entities?.length || 0) === 0 &&
                        (dataset?.dataset?.downstreamLineage?.entities?.length || 0) === 0,
                },
                {
                    name: 'Queries',
                    component: QueriesTab,
                    shouldHide: (_, dataset: GetDatasetQuery) => !dataset?.dataset?.usageStats?.buckets?.length,
                },
                {
                    name: 'Stats',
                    component: StatsTab,
                    shouldHide: (_, dataset: GetDatasetQuery) =>
                        !dataset?.dataset?.datasetProfiles?.length && !dataset?.dataset?.usageStats?.buckets?.length,
                },
                {
                    name: 'Edit Schema',
                    component: EditSchemaTab,
                    shouldHide: (_, _dataset: GetDatasetOwnersGqlQuery) => {
                        const currUser = FindWhoAmI() as string;
                        const owners = _dataset?.dataset?.ownership?.owners;
                        const ownersArray =
                            owners
                                ?.map((x) => (x?.type === 'DATAOWNER' ? x?.owner?.urn.split(':').slice(-1) : ''))
                                ?.flat() ?? [];
                        if (ownersArray.includes(currUser)) {
                            // console.log('return unhide');
                            return false;
                        }
                        console.log('return hide');
                        return true;
                    },
                },
                {
                    name: 'Edit Properties',
                    component: EditPropertiesTab,
                    shouldHide: (_, _dataset: GetDatasetOwnersGqlQuery) => {
                        const currUser = FindWhoAmI() as string;
                        const owners = _dataset?.dataset?.ownership?.owners;
                        const ownersArray =
                            owners
                                ?.map((x) => (x?.type === 'DATAOWNER' ? x?.owner?.urn.split(':').slice(-1) : ''))
                                ?.flat() ?? [];
                        if (ownersArray.includes(currUser)) {
                            // console.log('return unhide');
                            return false;
                        }
                        console.log('return hide');
                        return true;
                    },
                },
                {
                    name: 'Dataset Admin',
                    component: AdminTab,
                    shouldHide: (_, _dataset: GetDatasetOwnersGqlQuery) => {
                        const currUser = FindWhoAmI() as string;
                        const owners = _dataset?.dataset?.ownership?.owners;
                        const ownersArray =
                            owners
                                ?.map((x) => (x?.type === 'DATAOWNER' ? x?.owner?.urn.split(':').slice(-1) : ''))
                                ?.flat() ?? [];
                        if (ownersArray.includes(currUser)) {
                            // console.log('return unhide');
                            return false;
                        }
                        console.log('return hide');
                        return true;
                    },
                },
            ]}
            sidebarSections={[
                {
                    component: SidebarAboutSection,
                },
                {
                    component: SidebarStatsSection,
                    shouldHide: (_, dataset: GetDatasetQuery) =>
                        !dataset?.dataset?.datasetProfiles?.length && !dataset?.dataset?.usageStats?.buckets?.length,
                },
                {
                    component: SidebarTagsSection,
                    properties: {
                        hasTags: true,
                        hasTerms: true,
                    },
                },
                {
                    component: SidebarOwnerSection,
                },
            ]}
        />
    );

    getOverrideProperties = (_: GetDatasetQuery): GenericEntityProperties => {
        // TODO(@shirshanka): calcualte entityTypeOverride value and return it in the object below
        return {};
    };

    renderPreview = (_: PreviewType, data: Dataset) => {
        return (
            <Preview
                urn={data.urn}
                name={data.name}
                origin={data.origin}
                description={data.editableProperties?.description || data.description}
                platformName={data.platform.displayName || data.platform.name}
                platformLogo={data.platform.info?.logoUrl}
                owners={data.ownership?.owners}
                globalTags={data.globalTags}
                glossaryTerms={data.glossaryTerms}
            />
        );
    };

    renderSearch = (result: SearchResult) => {
        const data = result.entity as Dataset;
        return (
            <Preview
                urn={data.urn}
                name={data.name}
                origin={data.origin}
                description={data.editableProperties?.description || data.description}
                platformName={data.platform.name}
                platformLogo={data.platform.info?.logoUrl}
                owners={data.ownership?.owners}
                globalTags={data.globalTags}
                snippet={
                    // Add match highlights only if all the matched fields are in the FIELDS_TO_HIGHLIGHT
                    result.matchedFields.length > 0 &&
                    result.matchedFields.every((field) => FIELDS_TO_HIGHLIGHT.has(field.name)) && (
                        <MatchTag>
                            <Typography.Text>
                                Matches {FIELDS_TO_HIGHLIGHT.get(result.matchedFields[0].name)}{' '}
                                <b>{result.matchedFields[0].value}</b>
                            </Typography.Text>
                        </MatchTag>
                    )
                }
            />
        );
    };

    getLineageVizConfig = (entity: Dataset) => {
        return {
            urn: entity.urn,
            name: entity.name,
            type: EntityType.Dataset,
            upstreamChildren: getChildren({ entity, type: EntityType.Dataset }, Direction.Upstream).map(
                (child) => child.entity.urn,
            ),
            downstreamChildren: getChildren({ entity, type: EntityType.Dataset }, Direction.Downstream).map(
                (child) => child.entity.urn,
            ),
            icon: entity.platform.info?.logoUrl || undefined,
            platform: entity.platform.name,
        };
    };

    displayName = (data: Dataset) => {
        return data.name;
    };
}
