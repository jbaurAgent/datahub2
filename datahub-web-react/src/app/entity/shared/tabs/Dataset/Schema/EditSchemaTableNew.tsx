// import { Empty } from 'antd';
import React from 'react';
import { Button, Popconfirm, Table } from 'antd';
import { SortableContainer as sortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import { MenuOutlined } from '@ant-design/icons';
import { arrayMoveImmutable } from 'array-move';
// import { useBaseEntity } from '../../../EntityContext';
// import { GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
//draggable version with button

const DragHandle = SortableHandle(() => <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />);
type DataArray = {
    key: number;
    name: string;
    datahubType: string;
    nativeType: string;
    index: number;
}[];

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableContainer = sortableContainer((props) => <tbody {...props} />);

class EditSchemaTableNew extends React.Component<any, { dataSource: DataArray; count: number }> {
    readonly columns = [
        {
            title: 'Drag to Reorder',
            dataIndex: 'sort',
            width: 30,
            className: 'drag-visible',
            render: () => <DragHandle />,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            className: 'drag-visible',
            editable: true,
        },
        {
            title: 'Type',
            dataIndex: 'datahubType',
            editable: true,
        },
        {
            title: 'NativeType',
            dataIndex: 'nativeType',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) =>
                this.state.dataSource.length >= 1 ? (
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.key)}>
                        <a href="#/">Delete</a>
                    </Popconfirm>
                ) : null,
        },
    ];

    constructor(props) {
        super(props);
        const queryFields = this.props.query;
        const data = queryFields?.map((x, ind) => {
            return {
                key: ind,
                name: x?.fieldPath,
                datahubType: x?.type,
                nativeType: x?.nativeDataType,
                index: ind,
            };
        });
        const dataLen = data.length;
        // const [state, setState] = useState(0);
        this.state = { dataSource: data, count: dataLen };
    }

    handleDelete = (key) => {
        // const dataSource = [...this.state.dataSource];
        this.setState((prev_state) => ({
            dataSource: prev_state.dataSource.filter((item) => item.key !== key),
            count: prev_state.count - 1,
        }));
    };

    handleAdd = () => {
        const { count, dataSource } = this.state;
        const newData = {
            key: count,
            name: '',
            datahubType: '',
            nativeType: '',
            index: count,
        };
        this.setState({
            dataSource: [...dataSource, newData],
            count: count + 1,
        });
        // console.log(`${newData} + is added`);
    };

    handleSave = (row) => {
        const currState = this.state;
        const newData = [...currState.dataSource];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, { ...item, ...row });
        this.setState({
            dataSource: newData,
        });
    };

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
            <>
                <Button
                    onClick={this.handleAdd}
                    type="primary"
                    style={{
                        marginBottom: 16,
                    }}
                >
                    Add a row
                </Button>
                <Table
                    pagination={false}
                    dataSource={dataSource}
                    columns={this.columns}
                    rowKey="index"
                    components={{
                        body: {
                            wrapper: this.DraggableContainer,
                            row: this.DraggableBodyRow,
                        },
                    }}
                />
            </>
        );
    }
}

export default EditSchemaTableNew;
