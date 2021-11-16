// import { Empty } from 'antd';
import React from 'react';
import { Table } from 'antd';
import { SortableContainer as sortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import { arrayMoveImmutable } from 'array-move';
// import { useBaseEntity } from '../../../EntityContext';
// import { GetDatasetQuery } from '../../../../../../graphql/dataset.generated';

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);

// const queryFields = useBaseEntity<GetDatasetQuery>()?.dataset?.schemaMetadata?.fields;
// const data = queryFields?.map((x, ind) => {
//     return {
//         key: ind,
//         name: x?.fieldPath,
//         datahubType: x?.type,
//         nativeType: x?.nativeDataType,
//     };
// });

const columns = [
    {
        title: 'Sort',
        dataIndex: 'sort',
        width: 30,
        className: 'drag-visible',
        render: () => <DragHandle />,
    },
    {
        title: 'Name',
        dataIndex: 'name',
        className: 'drag-visible',
    },
    {
        title: 'Age',
        dataIndex: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
    },
];

const data = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        index: 0,
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        index: 1,
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        index: 2,
    },
];
type DataArray = {
    key: string;
    name: string;
    age: number;
    address: string;
    index: number;
}[];

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

class EditSchemaTableNew extends React.Component<any, { dataSource: DataArray }> {
    constructor(props) {
        super(props);
        this.state = { dataSource: data };
    }

    onSortEnd = ({ oldIndex, newIndex }) => {
        const { dataSource } = this.state;
        if (oldIndex !== newIndex) {
            const newArray: DataArray = [];
            const newData = arrayMoveImmutable(newArray.concat(dataSource), oldIndex, newIndex).filter((el) => !!el);
            console.log('Sorted items: ', newData);
            this.setState({ dataSource: newData });
        }
    };

    DraggableContainer = (props) => (
        <SortableContainer
            useDragHandle
            disableAutoscroll
            helperClass="row-dragging"
            onSortEnd={this.onSortEnd}
            {...props}
        />
    );

    DraggableBodyRow = ({ _, _s, ...restProps }) => {
        const { dataSource } = this.state;
        // function findIndex base on Table rowKey props and should always be a right array index
        const index = dataSource.findIndex((x) => x.index === restProps['data-row-key']);
        return <SortableItem index={index} {...restProps} />;
    };

    render() {
        const { dataSource } = this.state;

        return (
            <Table
                pagination={false}
                dataSource={dataSource}
                columns={columns}
                rowKey="index"
                components={{
                    body: {
                        wrapper: this.DraggableContainer,
                        row: this.DraggableBodyRow,
                    },
                }}
            />
        );
    }
}

export default EditSchemaTableNew;
