import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import AppPageMetadata from 'src/domain/core/AppPageMetadata';
import './index.style.less';
import { Card, Col, Row, message } from 'antd';
import IntlMessages from 'src/domain/utility/IntlMessages';
import Button from 'src/shared/components/button';
import { Form, Formik } from 'formik';
import FormItem from 'src/shared/components/form-item';
import { Input, InputPassword } from 'src/shared/components/input';
import { signInSchema } from './schema';
import Checkbox from 'src/shared/components/checkbox';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'src/pages/auth/context/AuthContext';

const SignIn = () => {
  const { messages } = useIntl();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [initialValues] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      setSubmitting(true);
      await login(values.email, values.password);
      message.success(messages['auth.loginSuccess'].toString());
      navigate('/');
    } catch (error) {
      message.error(messages['auth.loginFailed'].toString());
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <AppPageMetadata title={messages['auth.signin'].toString()}>
      <div className='signin-container background-image'>
        <Row justify='center' align='middle' className='fullContent fullHeight'>
          <Col xl={8} lg={10} md={15} sm={20} xs={24}>
            <Card className='signin-card'>
              <Row gutter={[10, 30]}>
                <Col span={24}>
                  <h3 className='signin-title'>
                    <IntlMessages id='auth.signin.title' />
                  </h3>
                </Col>
                <Col span={24}>
                  <Formik
                    enableReinitialize
                    initialValues={initialValues}
                    onSubmit={handleSubmit}
                    validationSchema={signInSchema(messages)}
                    validateOnChange={false}
                    validateOnBlur={false}
                  >
                    {({ handleSubmit, isSubmitting }: any) => (
                      <Form>
                        <Row className='fullContent' gutter={[0, 20]} justify='center'>
                          <Col span={24}>
                            <FormItem
                              layoutHorizontal
                              name='email'
                              label={messages['common.email'].toString()}
                              classNameTitle='form-item-title'
                              fieldCommponent={<Input autoComplete='off' />}
                            />
                          </Col>
                          <Col span={24}>
                            <FormItem
                              layoutHorizontal
                              name='password'
                              label={messages['common.password'].toString()}
                              type='password'
                              classNameTitle='form-item-title'
                              fieldCommponent={<InputPassword autoComplete='new-password' />}
                            />
                          </Col>

                          <Col span={24}>
                            <Row gutter={[20, 10]} justify='space-around' align='middle'>
                              <Col>
                                <FormItem
                                  layoutHorizontal
                                  name='rememberMe'
                                  type='checkbox'
                                  fieldCommponent={
                                    <Checkbox>
                                      <IntlMessages id='auth.signin.rememberMe' />
                                    </Checkbox>
                                  }
                                />
                              </Col>
                              <Col>
                                <Button type='link' color='black' onClick={handleForgotPassword}>
                                  <IntlMessages id='auth.forgotPassword' />
                                </Button>
                              </Col>
                            </Row>
                          </Col>

                          <Col span={24}>
                            <Button
                              type='primary'
                              htmlType='submit'
                              className='fullContent'
                              onClick={handleSubmit}
                              loading={isSubmitting}
                            >
                              {messages['auth.signin'].toString()}
                            </Button>
                          </Col>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </div>
    </AppPageMetadata>
  );
};

export default SignIn;
