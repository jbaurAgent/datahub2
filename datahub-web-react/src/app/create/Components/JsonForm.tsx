import React, { useState } from 'react';
import JsonSchemaEditor from '@optum/json-schema-editor';
import { JSONSchema7 } from '@optum/json-schema-editor/dist/JsonSchemaEditor.types';
import { Button, Divider, Form, message, Space } from 'antd';
import Dragger from 'antd/lib/upload/Dragger';
import { v4 as uuidv4 } from 'uuid';
import { CommonFields } from './CommonFields';

export const JsonForm = () => {
    const [state, setState] = useState({ schema: {} });
    const [key, setKey] = useState(uuidv4());
    const [form] = Form.useForm();
    const layout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 16,
        },
    };
    const printIt = (data) => {
        console.log(JSON.parse(data));
    };
    const onFinish = (values) => {
        console.log(values);
    };
    const onReset = () => {
        form.resetFields();
        setState({ schema: {} });
        setKey(uuidv4());
    };
    const flatten = (obj, prefix = '', res = {}) =>
        Object.entries(obj).reduce((r, [key1, val]) => {
            const k = `${prefix}${key1}`;
            if (typeof val === 'object') {
                flatten(val, `${k}.`, r);
            } else {
                res[k] = val;
            }
            return r;
        }, res);
    const props = {
        name: 'file',
        maxCount: 1,
        multiple: false,
        action: 'http://localhost:9002/jsonSchema',
        accept: 'application/json',
        onChange(info) {
            const { status } = info.file;
            if (status === 'done') {
                console.log('info:', info.file.response);
                const newSchema: JSONSchema7 = info.file.response;
                console.log(flatten(info.file.response));
                setState({ schema: newSchema });
                setKey(uuidv4());
                message.success(`${info.file.name} - inferred schema from json file successfully.`).then();
            } else if (status === 'error') {
                message.error(`${info.file.name} - unable to infer schema from json file.`).then();
            }
        },
    };
    // need to set unique key to trigger update the component
    return (
        <div>
            <div>
                <Form
                    {...layout}
                    form={form}
                    initialValues={{ fields: [{ field_description: '' }] }}
                    name="dynamic_form_item"
                    onFinish={onFinish}
                >
                    <Dragger {...props}>
                        <p className="ant-upload-text">Click here to infer schema from json file</p>
                    </Dragger>
                    <Divider dashed orientation="left">
                        Dataset Info
                    </Divider>
                    <CommonFields />
                    <Form.Item label="Dataset Fields" name="fields">
                        <JsonSchemaEditor key={key} data={state.schema} onSchemaChange={printIt} />
                        <Space>
                            <Button type="primary" htmlType="submit">
                                Submit
                            </Button>
                            <Button htmlType="button" onClick={onReset}>
                                Reset
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};
