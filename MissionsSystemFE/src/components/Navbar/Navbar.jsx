import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menubar } from 'primereact/menubar';
import logo from '../../assets/images/logo.ico';
import { Button } from 'primereact/button';
import { BiLogOutCircle } from 'react-icons/bi';
import { Divider } from 'primereact/divider';
import { Link } from 'react-router-dom';
import { userContext } from '../../reducers/UserProvider';
import { API_BASE_URL } from '../../data.js';
import axios from 'axios';
import './Navbar.css';

const Navbar = () => {
    const { state, dispatch } = useContext(userContext);
    const navigate = useNavigate();
    const navbarLinks = [
        {
            template: (item, options) => {
                return (
                    state.auths.addMember && (
                        <Link to="/mission-member" className={options.className}>
                            <span className={`${options.iconClassName} pi pi-user-plus`}></span>
                            تكويد أفراد المأمورية
                        </Link>
                    )
                );
            }
        },
        {
            template: (item, options) => {
                return (
                    state.auths.addMission && (
                        <Link to="/mission-entry" className={options.className}>
                            <span className={`${options.iconClassName} pi pi-plus-circle`}></span>
                            إدخال مأمورية
                        </Link>
                    )
                );
            }
        },
        {
            template: (item, options) => {
                return (
                    <Link to="/mission-selection" className={options.className}>
                        <span className={`${options.iconClassName} pi pi-eye`}></span>
                        عرض المأموريات
                    </Link>
                );
            }
        },
        {
            label: 'الاعدادات',
            icon: 'pi pi-cog',
            items: [
                {
                    template: (item, options) => {
                        return (
                            state.auths.addNewUser && (
                                <Link to="/register" className={options.className}>
                                    <span className={`${options.iconClassName} pi pi-user-plus`}></span>
                                    اضافة مستخدم
                                </Link>
                            )
                        );
                    }
                },
                {
                    template: (item, options) => {
                        return (
                            state.auths.resetPassword && (
                                <Link to="/reset-password" className={options.className}>
                                    <span className={`${options.iconClassName} pi pi-pencil`}></span>
                                    تغيير كلمة سر
                                </Link>
                            )
                        );
                    }
                },
                {
                    template: (item, options) => {
                        return (
                            state.auths.addAuths && (
                                <Link to="/authorization" className={options.className}>
                                    <span className={`${options.iconClassName} pi pi-key`}></span>
                                    اضافة صلاحيات
                                </Link>
                            )
                        );
                    }
                },
                {
                    template: (item, options) => {
                        return (
                            state.auths.openHistory && (
                                <Link to="/history" className={options.className}>
                                    <span className={`${options.iconClassName} pi pi-history`}></span>
                                    تاريخ الاستخدام
                                </Link>
                            )
                        );
                    }
                }
            ]
        },
        {
            template: (item, options) => {
                return (
                    <>
                        <Button severity="secondary" className="mr-5" onClick={handleLogout} rounded>
                            <BiLogOutCircle />
                            <span>تسجيل الخروج</span>
                        </Button>
                    </>
                );
            }
        }
    ];

    function handleLogout(e) {
        dispatch({
            type: 'LOGOUT',
            payload: {}
        });
        navigate('/login');
        // axios
        //     .get(`${API_BASE_URL}/User/Logout`)
        //     .then(() => {
        //         dispatch({
        //             type: 'LOGOUT',
        //             payload: {}
        //         });
        //         navigate('/login');
        //     })
        //     .catch((error) => console.error(error));
    }

    return (
        <div className="card">
            <Menubar
                model={navbarLinks}
                start={
                    <div className="flex">
                        <Link to="/">
                            <img src={logo} height="60" />
                            <span className="prog__title"> مــنظـــومـــة المــأموريـــــــات </span>
                        </Link>
                        <Divider className="vertical__divider" layout="vertical" />
                    </div>
                }
            />
        </div>
    );
};

export default Navbar;
