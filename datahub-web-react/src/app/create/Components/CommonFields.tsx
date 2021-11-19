import React from 'react';
import { Button, Form, Input, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export const CommonFields = () => {
    return (
        <>
            <Form.Item
                name="dataset_name"
                label="Dataset Name"
                rules={[
                    {
                        required: true,
                        message: 'Missing dataset name',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="dataset_description"
                label="Dataset Description"
                rules={[
                    {
                        required: false,
                        message: 'Missing dataset description',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="dataset_origin"
                label="Dataset Origin"
                rules={[
                    {
                        required: false,
                        message: 'Missing dataset origin',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                name="dataset_location"
                label="Dataset Location"
                rules={[
                    {
                        required: false,
                        message: 'Missing dataset location',
                    },
                ]}
            >
                <Input />
            </Form.Item>
            <Form.List
                name="browsepaths"
                rules={[
                    {
                        validator: async (_, browsepaths) => {
                            if (!browsepaths || browsepaths.length < 1) {
                                return new Error('At least 1 browsepath is needed');
                            }
                            if (!browsepaths || browsepaths.length > 3) {
                                return new Error('no more than 3 browsepath');
                            }
                            return true;
                        },
                    },
                ]}
            >
                {(fields, { add, remove }, { errors }) => (
                    <>
                        <Space style={{ display: 'inline', marginBottom: 8 }} align="baseline">
                            {fields.map((field) => (
                                <Form.Item label="Browsing Paths for Dataset" required key={field.key}>
                                    <Form.Item
                                        {...field}
                                        validateTrigger={['onChange', 'onBlur']}
                                        rules={[
                                            {
                                                required: true,
                                                whitespace: true,
                                                pattern: new RegExp(/\/[0-9a-zA-Z /]+$/),
                                                message: 'Please input a path starting with a / ',
                                            },
                                        ]}
                                        noStyle
                                    >
                                        <Input placeholder="browsing path" style={{ width: '30%' }} />
                                    </Form.Item>
                                    {fields.length > 1 ? (
                                        <MinusCircleOutlined
                                            className="dynamic-delete-button"
                                            onClick={() => remove(field.name)}
                                        />
                                    ) : null}
                                </Form.Item>
                            ))}
                            <Form.Item>
                                <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                                    Add more browsing paths
                                </Button>
                                <Form.ErrorList errors={errors} />
                            </Form.Item>
                        </Space>
                    </>
                )}
            </Form.List>
        </>
    );
};
