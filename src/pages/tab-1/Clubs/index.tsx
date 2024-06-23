import React, { useEffect, useState } from 'react';
import axiosInstance from 'src/shared/utils/axios.config';
import { useBreadcrumbContext } from 'src/domain/utility/AppContextProvider/BreadcrumbContextProvider';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Button, Table, Modal } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import AppPageMetadata from 'src/domain/core/AppPageMetadata';
import IntlMessages from 'src/domain/utility/IntlMessages';
import backGroundSignin from '../../../../src/assets/images/backGroundSignin.jpg';
import './Clubs.css';
import './elements.css';

interface IClub {
  id: number;
  name: string;
  description: string;
  location: string;
  pic: string;
  isBlocked: boolean;
  user_id: number;
}

const ClubList: React.FC = () => {
  const { setBreadcrumb }: any = useBreadcrumbContext();
  const { messages } = useIntl();
  const [clubs, setClubs] = useState<IClub[]>([]);
  const [selectedClub, setSelectedClub] = useState<IClub | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setBreadcrumb([
      {
        text: <IntlMessages id="tab1.sideBarName" />,
        url: '/Clubs-Management/Clubs',
      },
    ]);

    fetchClubs(); // Fetch clubs when component mounts
  }, []);

  const fetchClubs = async () => {
    try {
      const response = await axiosInstance.get('/club/all');
      setClubs(response.data); // Assuming response.data is an array of clubs
    } catch (error) {
      console.error('Error fetching clubs:', error);
      // Handle error fetching clubs (e.g., show error message)
    }
  };

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
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Is Blocked',
      dataIndex: 'isBlocked',
      key: 'isBlocked',
      render: (isBlocked: boolean) => (
        <div className={`verification-status ${isBlocked ? 'not-verified' : 'verified'}`}>
          {isBlocked ? 'Blocked' : 'Active'}
        </div>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text: any, record: IClub) => (
        <Button onClick={() => openDetailsPopup(record)}>
          <InfoCircleOutlined />
        </Button>
      ),
    },
  ];

  const openDetailsPopup = (club: IClub) => {
    setSelectedClub(club);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedClub(null);
    setModalVisible(false);
  };

  return (
    <AppPageMetadata title={messages['tab1.tab11'].toString()}>
      <div className="club-list">
        <h1 className="page-title">
          <IntlMessages id="tab1.tab11" />
        </h1>

        <div className="container">
          <Link to="/Clubs-Management/Add-Club">
            <Button className="btn">Add Club +</Button>
          </Link>
        </div>

        <Table columns={columns} dataSource={clubs} rowKey="id" />

        <Modal
          title={selectedClub?.name}
          visible={modalVisible}
          onCancel={closeModal}
          footer={[
            <Button key="close" onClick={closeModal}>
              Close
            </Button>,
          ]}
        >
          <p>Description: {selectedClub?.description}</p>
          <p>User ID: {selectedClub?.user_id}</p>
          {/* Additional fields as needed */}
        </Modal>
      </div>
    </AppPageMetadata>
  );
};

export default ClubList;
