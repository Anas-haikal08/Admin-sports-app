import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AppConfirmPopup from '../../../domain/core/AppConfirmPopup';
import { getLoading, getVisibleLogout } from 'src/domain/app/redux/auth/auth-selectors';
import { setLoading, setVisibleLogout } from 'src/domain/app/redux/auth/auth-slice';
import '../AuthWrapper.style.less';

const Logout = () => {
  const visibleLogout = useSelector(getVisibleLogout);
  const loading = useSelector(getLoading);
  const dispatch = useDispatch();
  const { messages } = useIntl();
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/sign-in');
      window.location.reload();
    }
  }, [navigate]);

  const logout = () => {
    console.log('Logout function called');
    dispatch(setLoading(true));
    localStorage.removeItem('token');
    console.log('Token removed from localStorage');
    dispatch(setVisibleLogout(false));
    dispatch(setLoading(false));
    navigate('/sign-in');
    window.location.reload();
  };

  console.log('Token in localStorage:', localStorage.getItem('token'));

  return (
    <AppConfirmPopup
      loading={loading}
      visible={visibleLogout}
      setVisible={(data: any) => dispatch(setVisibleLogout(data))}
      handleOK={logout}
      title={messages['common.logout.title']}
      okText={messages['common.ok']}
      cancelText={messages['common.cancel']}
    />
  );
};

export default Logout;
//logout done 