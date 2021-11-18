// import { Empty } from 'antd';
import React, { useState } from 'react';
import { Form, Input, Popconfirm, Table, Typography } from 'antd';
import PropTypes from 'prop-types';
import { useBaseEntity } from '../../../EntityContext';
import { GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
// import { useBaseEntity } from '../../../EntityContext';
// import { GetDatasetQuery } from '../../../../../../graphql/dataset.generated';
// editable version

export const EditSchemaTableEditable = () => {
    const EditableCell = ({ editing, dataIndex, title, _record, _index, children, ...restProps }) => {
        const inputNode = <Input />;
        return (
            <td {...restProps}>
                {editing ? (
                    <Form.Item
                        name={dataIndex}
                        style={{
                            margin: 0,
                        }}
                        rules={[
                            {
                                required: true,
                                message: `Please Input ${title}!`,
                            },
                        ]}
                    >
                        {inputNode}
                    </Form.Item>
                ) : (
                    children
                )}
            </td>
        );
    };
    EditableCell.propTypes = {
        title: PropTypes.objectOf(PropTypes.any).isRequired,
        editing: PropTypes.objectOf(PropTypes.any).isRequired,
        children: PropTypes.objectOf(PropTypes.any).isRequired,
        dataIndex: PropTypes.objectOf(PropTypes.any).isRequired,
        _record: PropTypes.objectOf(PropTypes.any).isRequired,
        handleSave: PropTypes.objectOf(PropTypes.any).isRequired,
        _index: PropTypes.objectOf(PropTypes.any).isRequired,
    };
    const queryFields = useBaseEntity<GetDatasetQuery>()?.dataset?.schemaMetadata?.fields;
    const dataSource = queryFields?.map((x, ind) => {
        return {
            key: ind,
            name: x?.fieldPath,
            datahubType: x?.type,
            nativeType: x?.nativeDataType,
            index: ind,
        };
    });
    const formalData = dataSource || [];
    const [form] = Form.useForm();
    const [data, setData] = useState(formalData);
    const [editingKey, setEditingKey] = useState('');

    const isEditing = (record) => record.key === editingKey;

    const edit = (record) => {
        form.setFieldsValue({
            name: '',
            age: '',
            address: '',
            ...record,
        });
        setEditingKey(record.key);
    };

    const cancel = () => {
        setEditingKey('');
    };

    const save = async (key) => {
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => key === item.key);

            if (index > -1) {
                const item = newData[index];
                newData.splice(index, 1, { ...item, ...row });
                setData(newData);
                setEditingKey('');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            width: '25%',
            editable: true,
        },
        {
            title: 'Type',
            dataIndex: 'datahubType',
            width: '15%',
            editable: true,
        },
        {
            title: 'NativeType',
            dataIndex: 'nativeType',
            width: '40%',
            editable: true,
        },
        {
            title: 'operation',
            dataIndex: 'operation',
            render: (_, record) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <button
                            type="button"
                            onClick={() => save(record.key)}
                            style={{
                                marginRight: 8,
                            }}
                        >
                            Save
                        </button>
                        <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
                            <button
                                type="button"
                                onClick={(e) => e}
                                style={{
                                    marginRight: 8,
                                }}
                            >
                                Cancel
                            </button>
                        </Popconfirm>
                    </span>
                ) : (
                    <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
                        Edit
                    </Typography.Link>
                );
            },
        },
    ];
    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });
    return (
        <Form form={form} component={false}>
            <Table
                components={{
                    body: {
                        cell: EditableCell,
                    },
                }}
                bordered
                dataSource={data}
                columns={mergedColumns}
                rowClassName="editable-row"
                pagination={false}
            />
        </Form>
    );
};
