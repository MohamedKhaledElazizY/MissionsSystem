import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { axiosInstance } from '../../components/StateKeeper/StateKeeper';
import { Toast } from 'primereact/toast';
import { TOAST_LIFETIME } from '../../data';
import './Register.css';

const Register = () => {
    const toast = useRef(null);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        name: '',
        userName: '',
        password: ''
    });
    const [validation, setValidation] = useState({
        form: '',
        name: '',
        userName: '',
        password: ''
    });

    function handleInputChange(e) {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    }

    function validateName(input) {
        if (!input.length) {
            return { value: false, message: 'برجاء ادخال الاسم الشخصي' };
        }
        if (input.length < 3) {
            return { value: false, message: 'الاسم الشخصي يجب ألا يقل عن 3 حروف' };
        }
        return { value: true, message: '' };
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

    const showSuccess = () => {
        toast.current.show({ severity: 'success', summary: 'حفظ', detail: 'تم أضافة مستخدم جديد بنجاح', life: TOAST_LIFETIME });
    };

    function handleRegister(e) {
        e.preventDefault();
        const resultName = validateName(credentials.name);
        const resultUsername = validateUsername(credentials.userName);
        const resultPassword = validatePassword(credentials.password);
        setValidation({
            ...validation,
            name: resultName.message,
            userName: resultUsername.message,
            password: resultPassword.message
        });
        if (resultName.value && resultUsername.value && resultPassword.value) {
            axiosInstance
                .post('/User', credentials)
                .then(() => {
                    navigate('/register');
                    showSuccess();
                    setCredentials({
                        form: '',
                        name: '',
                        userName: '',
                        password: ''
                    });
                })
                .catch((error) => {
                    setValidation({ ...validation, form: 'فشلت عملية اضافة المستخدم, برجاء المحاولة مرة اخرى' });
                    console.error(error);
                });
        }
    }

    return (
        <main className="register__wrapper">
            <form className="flex flex-column align-items-center justify-content-center w-full p-2">
                <span className="validation__text pb-3">{validation.form}</span>
                <div className="field w-full pb-3">
                    <span className="p-float-label">
                        <InputText
                            id="name"
                            name="name"
                            value={credentials.name}
                            className="p-inputtext-lg w-full"
                            onChange={handleInputChange}
                        />
                        <label htmlFor="name">الاسم الشخصي</label>
                    </span>
                    <span className="validation__text">{validation.name}</span>
                </div>
                <div className="field w-full pb-3">
                    <span className="p-float-label">
                        <InputText
                            id="userName"
                            name="userName"
                            value={credentials.userName}
                            className="p-inputtext-lg w-full"
                            onChange={handleInputChange}
                        />
                        <label htmlFor="username">اسم المستخدم</label>
                    </span>
                    <span className="validation__text">{validation.userName}</span>
                </div>
                <div className="field w-full pb-3">
                    <span className="p-float-label">
                        <Password
                            id="password"
                            name="password"
                            value={credentials.password}
                            className="p-inputtext-lg w-full"
                            onChange={handleInputChange}
                            feedback={false}
                            toggleMask
                        />
                        <label htmlFor="password">كلمة المرور</label>
                    </span>
                    <span className="validation__text">{validation.password}</span>
                </div>

                <div className="save__btn">
                    <Toast ref={toast} />
                    <Button className="btn" type="submit" label="اضافة المستخدم" onClick={handleRegister} />
                </div>
            </form>
        </main>
    );
};

export default Register;
