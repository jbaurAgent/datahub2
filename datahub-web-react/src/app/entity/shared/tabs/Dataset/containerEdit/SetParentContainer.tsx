import React, { useState } from 'react';
// import { Select } from 'antd';
import Select from 'antd/lib/select';
import styled from 'styled-components';
import { Form } from 'antd';
// import { gql, useQuery } from '@apollo/client';
import { useGetSearchResultsLazyQuery } from '../../../../../../graphql/search.generated';
import { useEntityRegistry } from '../../../../../useEntityRegistry';
import { EntityType, SearchResult } from '../../../../../../types.generated';

const SearchResultContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px;
`;

const SearchResultContent = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
`;

// const SearchResultDisplayName = styled.div`
//     margin-left: 5px;
// `;

interface Props {
    platformType: string;
    compulsory: boolean;
}

const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};

export const SetParentContainer = (props: Props) => {
    // need this to render the display name of the container
    // decided not to put name of parent container of selected container - the new feature in 0.8.36 would be better
    console.log(`the dataPlatform chosen is ${props.platformType}`);
    const entityRegistry = useEntityRegistry();
    const [selectedContainers, setSelectedContainers] = useState('');
    const [containerSearch, { data: containerSearchData }] = useGetSearchResultsLazyQuery();
    const searchResults = containerSearchData?.search?.searchResults || [];
    const renderSearchResult = (result: SearchResult) => {
        const displayName = entityRegistry.getDisplayName(result.entity.type, result.entity);
        return (
            <SearchResultContainer>
                <SearchResultContent>
                    <div>{displayName}</div>
                </SearchResultContent>
            </SearchResultContainer>
        );
    };
    const handleContainerSearch = (text: string) => {
        if (text.length > 0) {
            containerSearch({
                variables: {
                    input: {
                        type: EntityType.Container,
                        query: text,
                        start: 0,
                        count: 5,
                        filters: [
                            {
                                field: 'platform',
                                value: props.platformType,
                            },
                        ],
                    },
                },
            });
        }
    };
    const onSelectMember = (urn: string) => {
        setSelectedContainers(urn);
    };
    const removeOption = () => {
        console.log(`removing ${selectedContainers}`);
        setSelectedContainers('');
    };
    return (
        <>
            <Form.Item
                {...formItemLayout}
                name="parentContainer"
                label="Specify a Container for the Dataset (Optional)"
                rules={[
                    {
                        required: props.compulsory,
                        message: 'A container must be specified.',
                    },
                ]}
            >
                <Select
                    style={{ width: 300 }}
                    showSearch
                    autoFocus
                    filterOption={false}
                    value={selectedContainers}
                    showArrow
                    placeholder="Search for a parent container.."
                    onSearch={handleContainerSearch}
                    onSelect={(container: any) => onSelectMember(container)}
                    allowClear
                    onClear={removeOption}
                    onDeselect={removeOption}
                >
                    {searchResults?.map((result) => (
                        <Select.Option value={result.entity.urn}>{renderSearchResult(result)}</Select.Option>
                    ))}
                </Select>
            </Form.Item>
        </>
    );
};
