// src/pages/home/Tab0.tsx

import { useEffect, useState } from 'react';
import AppPageMetadata from 'src/domain/core/AppPageMetadata';
import { useBreadcrumbContext } from 'src/domain/utility/AppContextProvider/BreadcrumbContextProvider';
import { useIntl } from 'react-intl';
import IntlMessages from 'src/domain/utility/IntlMessages';
import React from 'react';
import { Layout, Statistic, Row, Col, Card, Typography } from 'antd';
import axiosInstance from 'src/shared/utils/axios.config';
import { Pie, Column, Line } from '@ant-design/plots';
import './Home.css';

const { Content, Footer } = Layout;

// Define the types for the API responses
interface TransactionSummary {
  totalTransactions: number;
  totalAmount: string;
  averageAmount: string;
  maxAmount: string;
  minAmount: string;
}

interface MonthlyUserStatistic {
  month: number;
  total: number;
}

interface SubscriptionStatistics {
  totalSubscriptions: number;
  activeSubscriptions: number;
  revenue: number;
}

const Tab0: React.FC = () => {
  const { setBreadcrumb }: any = useBreadcrumbContext();
  const { messages } = useIntl();
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactionSummary, setTransactionSummary] = useState<TransactionSummary>({
    totalTransactions: 0,
    totalAmount: '0.00',
    averageAmount: '0.00',
    maxAmount: '0.00',
    minAmount: '0.00',
  });
  const [monthlyUserStatistics, setMonthlyUserStatistics] = useState<MonthlyUserStatistic[]>([]);
  const [subscriptionStatistics, setSubscriptionStatistics] = useState<SubscriptionStatistics>({
    totalSubscriptions: 0,
    activeSubscriptions: 0,
    revenue: 0,
  });

  useEffect(() => {
    setBreadcrumb([
      {
        text: <IntlMessages id="tab0.sideBarName" />,
        url: '/Home',
      },
    ]);

    const fetchWalletData = async () => {
      const response = await fetch('/api/wallet');
      const data = await response.json();
      setWalletBalance(data.balance);
    };

    const fetchTransactionSummary = async () => {
      const response = await axiosInstance.get('/transaction/summary');
      setTransactionSummary(response.data);
    };

    const fetchMonthlyUserStatistics = async () => {
      const response = await axiosInstance.get('/user/monthly-statistics');
      setMonthlyUserStatistics(response.data);
    };

    const fetchSubscriptionStatistics = async () => {
      const response = await axiosInstance.get('/subscription/statistics');
      setSubscriptionStatistics(response.data);
    };

    fetchWalletData();
    fetchTransactionSummary();
    fetchMonthlyUserStatistics();
    fetchSubscriptionStatistics();
  }, [setBreadcrumb]);

  const pieData = [
    { type: 'Club Managers', value: 30 },
    { type: 'Clubs', value: 70 },
  ];

  const columnData = monthlyUserStatistics.map((stat) => ({
    type: `Month ${stat.month}`,
    value: stat.total,
  }));

  const lineData = columnData.map((stat, index) => ({
    month: `Month ${index + 1}`,
    value: stat.value,
  }));

  const pieConfig = {
    appendPadding: 10,
    data: pieData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    label: {
      type: 'spider',
      labelHeight: 28,
      content: '{name}\n{percentage}',
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  const columnConfig = {
    data: columnData,
    xField: 'type',
    yField: 'value',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      type: { alias: 'Month' },
      value: { alias: 'Users' },
    },
  };

  const lineConfig = {
    data: lineData,
    xField: 'month',
    yField: 'value',
    label: {},
    point: {
      size: 5,
      shape: 'diamond',
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: '#000',
          fill: 'red',
        },
      },
    },
    interactions: [
      {
        type: 'marker-active',
      },
    ],
  };

  return (
    <AppPageMetadata title={messages['tab0.sideBarName'].toString()}>
      <IntlMessages id="tab0.sideBarName" />
      <Layout className="layout">
        <div className="admin-wallet">
          <Typography.Text className="admin-wallet-title">Admin Wallet Balance:</Typography.Text>
          <Typography.Text className="admin-wallet-balance">${walletBalance}</Typography.Text>
        </div>

        <Content style={{ padding: '0 50px' }}>
          <div className="site-layout-content">
            <Row gutter={16}>
              <Col span={8}>
                <Card>
                  <Statistic title="Total Transactions" value={transactionSummary.totalTransactions} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Total Amount" value={transactionSummary.totalAmount} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Average Amount" value={transactionSummary.averageAmount} />
                </Card>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Card>
                  <Statistic title="Max Amount" value={transactionSummary.maxAmount} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Min Amount" value={transactionSummary.minAmount} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Total Subscriptions" value={subscriptionStatistics.totalSubscriptions} />
                </Card>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}>
                <Card>
                  <Statistic title="Active Subscriptions" value={subscriptionStatistics.activeSubscriptions} />
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <Statistic title="Revenue" value={subscriptionStatistics.revenue} />
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={12}>
                <Card title="Ratio of Club Managers to Clubs">
                  <Pie {...pieConfig} />
                </Card>
              </Col>
              <Col span={12}>
                <Card title="Monthly User Statistics">
                  <Column {...columnConfig} />
                </Card>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: 16 }}>
              <Col span={24}>
                <Card title="Reservations Over the Months">
                  <Line {...lineConfig} />
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>©2024 منصة إدارة الملاعب</Footer>
      </Layout>
    </AppPageMetadata>
  );
};

export default Tab0;
