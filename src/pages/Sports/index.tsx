// src/pages/home/Sports.tsx

import React, { useEffect, useState } from 'react';
import AppPageMetadata from 'src/domain/core/AppPageMetadata';
import { useBreadcrumbContext } from 'src/domain/utility/AppContextProvider/BreadcrumbContextProvider';
import { useIntl } from 'react-intl';
import IntlMessages from 'src/domain/utility/IntlMessages';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import axiosInstance from 'src/shared/utils/axios.config';
import './sports.css';

interface ISport {
    id: number;
    name: string;
}

const Sports: React.FC = () => {
    const { setBreadcrumb }: any = useBreadcrumbContext();
    const { messages } = useIntl();

    useEffect(() => {
        setBreadcrumb([
            {
                text: <IntlMessages id="Sports.sideBarName" />,
                url: '/sports',
            },
        ]);
    }, []);

    const [sports, setSports] = useState<ISport[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [form] = Form.useForm();

    useEffect(() => {
        fetchSports();
    }, []);

    const fetchSports = async () => {
        try {
            const response = await axiosInstance.get('/sport/all');
            setSports(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch sports:', error);
            setLoading(false);
        }
    };

    const handleAddSport = async (values: { name: string }) => {
        try {
            const response = await axiosInstance.post('/sport/add', values);
            setSports([...sports, response.data]);
            setIsModalVisible(false);
            form.resetFields();
            message.success('Sport added successfully!');
        } catch (error) {
            console.error('Failed to add sport:', error);
            message.error('Failed to add sport.');
        }
    };

    const handleDeleteSport = async (id: number) => {
        try {
            await axiosInstance.delete(`/sport/delete/${id}`);
            setSports(sports.filter((sport) => sport.id !== id));
            message.success('Sport deleted successfully!');
        } catch (error) {
            console.error('Failed to delete sport:', error);
            message.error('Failed to delete sport.');
        }
    };

    const columns = [
        {
            title: 'Sport ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Sport Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text: string, record: ISport) => (
                <Button type="primary" danger onClick={() => handleDeleteSport(record.id)}>
                    Delete
                </Button>
            ),
        },
    ];

    return (
        <div className="sports-page">
            <h1 className="page-title">Sports</h1>
            <div>
                <Button className='add-btn' type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }}>
                    Add Sport
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={sports}
                rowKey="id"
                loading={loading}
                className="sports-table"
            />
            <Modal
                title="Add Sport"
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleAddSport} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Sport Name"
                        rules={[{ required: true, message: 'Please enter the sport name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item>
                        <Button className='add-btn' type="primary" htmlType="submit">
                            Add
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Sports;
