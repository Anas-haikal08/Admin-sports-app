import React, { useEffect, useState } from 'react';
import AppPageMetadata from 'src/domain/core/AppPageMetadata';
import { useBreadcrumbContext } from 'src/domain/utility/AppContextProvider/BreadcrumbContextProvider';
import { useIntl } from 'react-intl';
import IntlMessages from 'src/domain/utility/IntlMessages';
import axiosInstance from 'src/shared/utils/axios.config';
import { Table, message } from 'antd';
import './transactions.css';

interface ITransaction {
    id: number;
    user_id: number;
    amount: string;
    type: string;
    status: string;
    paymentIntentId: string;
    refundStatus: string | null;
    createdAt: string;
    updatedAt: string;
}

const Transactions: React.FC = () => {
    const { setBreadcrumb }: any = useBreadcrumbContext();
    const { messages } = useIntl();

    useEffect(() => {
        setBreadcrumb([
            {
                text: <IntlMessages id="trans.sideBarName" />,
                url: '/transactions',
            },
        ]);
        fetchTransactions(1, 10);
    }, []);

    const [transactions, setTransactions] = useState<ITransaction[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    const fetchTransactions = async (page: number, pageSize: number) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get('/transaction/all', {
                params: {
                    page,
                    limit: pageSize,
                },
            });
            setTransactions(response.data.rows);
            setTotal(response.data.count);
        } catch (error) {
            console.error('Failed to fetch transactions:', error);
            message.error('Failed to fetch transactions.');
        }
        setLoading(false);
    };

    const columns = [
        {
            title: 'User ID',
            dataIndex: 'user_id',
            key: 'user_id',
        },
        {
            title: 'Amount',
            dataIndex: 'amount',
            key: 'amount',
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Payment Intent ID',
            dataIndex: 'paymentIntentId',
            key: 'paymentIntentId',
        },
        {
            title: 'Refund Status',
            dataIndex: 'refundStatus',
            key: 'refundStatus',
            render: (text: string | null) => (text ? text : 'N/A'),
        },
        {
            title: 'Created At',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: string) => new Date(text).toLocaleString(),
        },
        {
            title: 'Updated At',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (text: string) => new Date(text).toLocaleString(),
        },
    ];

    const handleTableChange = (pagination: any) => {
        fetchTransactions(pagination.current, pagination.pageSize);
    };

    return (
        <AppPageMetadata title={messages['trans.sideBarName'].toString()}>
            <div className="transactions-page">
                <h1 className="page-title">
                    <IntlMessages id="trans.sideBarName" />
                </h1>
                <Table
                    dataSource={transactions}
                    columns={columns}
                    rowKey="id"
                    pagination={{ total, defaultPageSize: 10 }}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </div>
        </AppPageMetadata>
    );
};

export default Transactions;
