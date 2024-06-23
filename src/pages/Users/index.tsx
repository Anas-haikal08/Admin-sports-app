import React, { useEffect, useState } from 'react';
import axiosInstance from 'src/shared/utils/axios.config';
import AppPageMetadata from 'src/domain/core/AppPageMetadata';
import { useBreadcrumbContext } from 'src/domain/utility/AppContextProvider/BreadcrumbContextProvider';
import { useIntl } from 'react-intl';
import IntlMessages from 'src/domain/utility/IntlMessages';
import { Table } from 'antd';
import './users.css';
import { CheckOutlined } from '@ant-design/icons';

interface IUser {
  id: number;
  username: string;
  email: string;
  phone_number: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role_id: number;
}

const Tab2: React.FC = () => {
  const { setBreadcrumb }: any = useBreadcrumbContext();
  const { messages } = useIntl();
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    setBreadcrumb([
      {
        text: <IntlMessages id="tab2.sideBarName" />,
        url: '/users',
      },
    ]);

    fetchUsers(); // Fetch users when component mounts
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/user/all');
      setUsers(response.data); // Assuming response.data is an array of users
    } catch (error) {
      console.error('Error fetching users:', error);
      // Handle error fetching users (e.g., show error message)
    }
  };

  const getUserType = (role_id: number): string => {
    switch (role_id) {
      case 1:
        return 'Player';
      case 2:
        return 'Club';
      case 3:
        return 'Admin';
      default:
        return 'Unknown';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone_number',
      key: 'phone_number',
    },
    {
      title: 'Verified',
      dataIndex: 'isVerified',
      key: 'isVerified',
      render: (isVerified: boolean) => (
        <span className={`verification-status ${isVerified ? 'verified' : 'not-verified'}`}>
          {isVerified ? <CheckOutlined /> : '-'}
        </span>
      ),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'User Type',
      dataIndex: 'role_id',
      key: 'role_id',
      render: (role_id: number) => getUserType(role_id),
    },
  ];

  return (
    <AppPageMetadata title={messages['tab2.sideBarName'].toString()}>
      <div className="user-list">
        <h1 className="page-title">
          <IntlMessages id="tab2.sideBarName" />
        </h1>

        <Table columns={columns} dataSource={users} rowKey="id" />
      </div>
    </AppPageMetadata>
  );
};

export default Tab2;
