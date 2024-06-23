import React, { useState, useEffect } from 'react';
import AppPageMetadata from 'src/domain/core/AppPageMetadata';
import { useBreadcrumbContext } from 'src/domain/utility/AppContextProvider/BreadcrumbContextProvider';
import { useIntl } from 'react-intl';
import IntlMessages from 'src/domain/utility/IntlMessages';
import { Button, Modal, Input, Form, Table, message } from 'antd';
import axiosInstance from 'src/shared/utils/axios.config';
import './plans.css';

interface IPlan {
    id: number;
    name: string;
    price: string;
    duration: number;
}

const Plans: React.FC = () => {
    const { setBreadcrumb }: any = useBreadcrumbContext();
    const { messages } = useIntl();

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [plans, setPlans] = useState<IPlan[]>([]);
    const [editingKey, setEditingKey] = useState<number | null>(null);

    useEffect(() => {
        setBreadcrumb([
            {
                text: <IntlMessages id="Plans.sideBarName" />,
                url: '/Clubs-Management/Plans',
            },
        ]);
        fetchPlans();
    }, [setBreadcrumb]);

    const fetchPlans = async () => {
        try {
            const response = await axiosInstance.get('/plan/all');
            setPlans(response.data);
        } catch (error) {
            console.error('Failed to fetch plans:', error);
        }
    };

    const handleAddPlan = async (newPlan: IPlan) => {
        try {
            const response = await axiosInstance.post('/plan/add', newPlan);
            setPlans([...plans, response.data]);
            message.success('Plan added successfully!');
        } catch (error) {
            console.error('Failed to add plan:', error);
            message.error('Failed to add plan.');
        }
    };

    const handleEditPlan = async (id: number, updatedPlan: IPlan) => {
        try {
            await axiosInstance.put(`/plan/update/${id}`, updatedPlan);
            setPlans(plans.map(plan => (plan.id === id ? updatedPlan : plan)));
            setEditingKey(null);
            message.success('Plan updated successfully!');
        } catch (error) {
            console.error('Failed to update plan:', error);
            message.error('Failed to update plan.');
        }
    };

    const handleDeletePlan = async (id: number) => {
        try {
            await axiosInstance.delete(`/plan/delete/${id}`);
            setPlans(plans.filter(plan => plan.id !== id));
            message.success('Plan deleted successfully!');
        } catch (error) {
            console.error('Failed to delete plan:', error);
            message.error('Failed to delete plan.');
        }
    };

    const isEditing = (record: IPlan) => record.id === editingKey;

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            editable: true,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            editable: true,
        },
        {
            title: 'Duration',
            dataIndex: 'duration',
            key: 'duration',
            editable: true,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: any, record: IPlan) => {
                const editable = isEditing(record);
                return editable ? (
                    <span>
                        <Button
                            type="link"
                            onClick={() => save(record.id)}
                            style={{ marginRight: 8 }}
                        >
                            Save
                        </Button>
                        <Button type="link" onClick={cancel}>
                            Cancel
                        </Button>
                    </span>
                ) : (
                    <span>
                        <Button
                            type="link"
                            disabled={editingKey !== null}
                            onClick={() => edit(record)}
                        >
                            Edit
                        </Button>
                        <Button
                            type="link"
                            danger
                            onClick={() => handleDeletePlan(record.id)}
                        >
                            Delete
                        </Button>
                    </span>
                );
            },
        },
    ];

    const mergedColumns = columns.map(col => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record: IPlan) => ({
                record,
                inputType: col.dataIndex === 'price' || col.dataIndex === 'duration' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    const edit = (record: IPlan) => {
        form.setFieldsValue({ ...record });
        setEditingKey(record.id);
    };

    const cancel = () => {
        setEditingKey(null);
    };

    const save = async (id: number) => {
        try {
            const row = (await form.validateFields()) as IPlan;
            handleEditPlan(id, { ...row, id });
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };

    const EditableCell: React.FC<{
        editing: boolean;
        dataIndex: string;
        title: string;
        inputType: 'number' | 'text';
        record: IPlan;
        index: number;
        children: React.ReactNode;
    }> = ({
        editing,
        dataIndex,
        title,
        inputType,
        record,
        index,
        children,
        ...restProps
    }) => {
            const inputNode = inputType === 'number' ? <Input type="number" /> : <Input />;
            return (
                <td {...restProps}>
                    {editing ? (
                        <Form.Item
                            name={dataIndex}
                            style={{ margin: 0 }}
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

    const handleModalOk = () => {
        form.validateFields().then((values: IPlan) => {
            setIsModalVisible(false);
            handleAddPlan(values);
            form.resetFields();
        });
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    return (
        <AppPageMetadata title={messages['Plans.sideBarName'].toString()}>
            <div className="plans-page">
                <div className="TitleButtonWrapper">
                    <h1 className="page-title">
                        <IntlMessages id="Plans.sideBarName" />
                    </h1>
                    <Button className="Addbtn" onClick={() => setIsModalVisible(true)}>
                        Add New Plan
                    </Button>
                </div>
                <Modal
                    title="Add Plan"
                    visible={isModalVisible}
                    onOk={handleModalOk}
                    onCancel={handleModalCancel}
                    destroyOnClose
                >
                    <Form form={form} layout="vertical">
                        <Form.Item
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please enter the name' }]}
                        >
                            <Input allowClear />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="Price"
                            rules={[{ required: true, message: 'Please enter the price' }]}
                        >
                            <Input allowClear type="number" />
                        </Form.Item>
                        <Form.Item
                            name="duration"
                            label="Duration (days)"
                            rules={[{ required: true, message: 'Please enter the duration' }]}
                        >
                            <Input allowClear type="number" />
                        </Form.Item>
                    </Form>
                </Modal>

                <Form form={form} component={false}>
                    <Table
                        components={{
                            body: {
                                cell: EditableCell,
                            },
                        }}
                        bordered
                        dataSource={plans}
                        columns={mergedColumns}
                        rowClassName="editable-row"
                        pagination={false}
                        rowKey="id"
                    />
                </Form>
            </div>
        </AppPageMetadata>
    );
};

export default Plans;
