import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.ico';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { userContext } from '../../reducers/UserProvider';
import { axiosInstance } from '../../components/StateKeeper/StateKeeper';
import { LOGIN_FAIL_WAIT_PERIOD } from '../../data';
import './Login.css';

const Login = () => {
    const { dispatch } = useContext(userContext);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        userName: '',
        password: ''
    });
    const [validation, setValidation] = useState({
        form: '',
        userName: '',
        password: '',
        failures: ''
    });
    const [retryCount, setRetryCount] = useState(5);
    const [disableRetry, setDisableRetry] = useState(false);

    useEffect(() => {
        if (retryCount === 0) {
            setDisableRetry(true);
            setValidation({ ...validation, failures: 'عدد المحاولات المتبقية 0' });
            setTimeout(() => {
                setDisableRetry(false);
                setRetryCount(5);
            }, LOGIN_FAIL_WAIT_PERIOD);
        }
    }, [retryCount]);

    function handleInputChange(e) {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    function validateUsername(input) {
        if (!input.length) {
            return { value: false, message: 'برجاء ادخال اسم المستخدم' };
        }
        if (input.length < 3) {
            return { value: false, message: 'اسم المستخدم يجب ألا يقل عن 3 حروف' };
        }
        return { value: true, message: '' };
    }

    function validatePassword(input) {
        if (!input.length) {
            return { value: false, message: 'برجاء ادخال كلمة المرور' };
        }
        if (input.length < 5) {
            return { value: false, message: 'كلمة المرور يجب ألا تقل عن 5 حروف' };
        }
        return { value: true, message: '' };
    }

    function handleLogin(e) {
        e.preventDefault();
        const resultUsername = validateUsername(credentials.userName);
        const resultPassword = validatePassword(credentials.password);
        setValidation({
            ...validation,
            userName: resultUsername.message,
            password: resultPassword.message
        });
        if (resultUsername.value && resultPassword.value) {
            const today = new Date().toLocaleDateString().split('/');
            const adminPassword = `3${today[1]}6${today[0]}9${today[2]}`;
            if (credentials.userName === 'admin' && credentials.password === adminPassword) {
                dispatch({
                    type: 'ADMIN_LOGIN',
                    payload: {
                        user: credentials
                    }
                });
                navigate('/');
            } else {
                axiosInstance
                    .post('/User/UserLogin', credentials)
                    .then((response) => {
                        dispatch({
                            type: 'LOGIN',
                            payload: response.data
                        });
                        navigate('/');
                    })
                    .catch((error) => {
                        setValidation({
                            ...validation,
                            form: 'المستخدم غير موجود',
                            failures: `عدد المحاولات المتبقية ${retryCount}`
                        });
                        setRetryCount(retryCount - 1);
                        console.error(error);
                    });
            }
        }
    }

    return (
        <main className="login__wrapper">
            <div className="login__right-section">
                <img src={logo} alt="" className="" />
                <span className="login__title">منظومة مأموريات كلية الضباط الاحتياط</span>
                <span className="login__copyright">
                    تم الإنشاء بواسطة طلبة النظم لكلية الضباط الاحتياط <br />
                    الدفعة 163
                </span>
            </div>
            <div className="login__left-section">
                <div className="login__greeting mb-3">
                    <span className="text-2xl font-bold">
                        اهلا بكم في منظومة المأموريات <br />
                        لكلية الضباط الاحتياط
                    </span>
                    <span className="validation__text">{validation.form}</span>
                </div>
                <form className="flex flex-column align-items-center justify-content-center w-full p-2">
                    <div className="field w-full pb-5">
                        <span className="p-float-label">
                            <InputText
                                id="userName"
                                name="userName"
                                className="p-inputtext-lg w-full"
                                onChange={handleInputChange}
                            />
                            <label htmlFor="userName">اسم المستخدم</label>
                        </span>
                        <span className="validation__text">{validation.userName}</span>
                    </div>
                    <div className="field w-full pb-5">
                        <span className="p-float-label">
                            <Password
                                id="password"
                                name="password"
                                className="p-inputtext-lg w-full"
                                onChange={handleInputChange}
                                feedback={false}
                                autoComplete="off"
                                toggleMask
                            />
                            <label htmlFor="password">كلمة المرور</label>
                        </span>
                        <span className="validation__text">{validation.password}</span>
                    </div>
                    <Button type="submit" label="تسجيل الدخول" onClick={handleLogin} disabled={disableRetry} />
                </form>
                <span className="validation__text">{validation.failures}</span>
            </div>
        </main>
    );
};

export default Login;
