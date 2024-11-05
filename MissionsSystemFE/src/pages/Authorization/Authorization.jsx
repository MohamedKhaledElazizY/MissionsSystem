import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressSpinner } from 'primereact/progressspinner';
import { auths, TOAST_LIFETIME } from '../../data.js';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { axiosInstance } from '../../components/StateKeeper/StateKeeper';
import { Toast } from 'primereact/toast';

import './Authorization.css';
// import { Navigate } from 'react-router-dom';

const Authorization = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedAuths, setSelectedAuths] = useState([]);

    const showSuccess = () => {
        toast.current.show({
            severity: 'success',
            summary: 'حفظ',
            detail: 'تم أضافة صلاحيات للمستخدم ',
            life: TOAST_LIFETIME
        });
    };

    const toast = useRef(null);
    useEffect(() => {
        axiosInstance
            .get('/User')
            .then((response) => {
                setUsers([...response.data]);
                setIsLoading(false);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        if (selectedUser.id) {
            console.log(selectedUser.id);
            axiosInstance
                .get(`/Authentication/${selectedUser.id}`)
                .then((response) => {
                    const keys = Object.keys(response.data);
                    const values = Object.values(response.data);
                    const _selectedAuths = [];
                    values.forEach((value, index) => {
                        if (value === true) {
                            _selectedAuths.push(keys[index]);
                        }
                    });
                    console.log(_selectedAuths);
                    setSelectedAuths([..._selectedAuths]);
                })
                .catch((error) => console.error(error));
        }
    }, [selectedUser]);

    const onAuthChange = (e) => {
        let _selectedAuths = [...selectedAuths];
        console.log(selectedUser.id);
        if (e.checked) {
            _selectedAuths.push(e.value);
            console.log(_selectedAuths);
        } else {
            _selectedAuths = _selectedAuths.filter((auth) => auth !== e.value);
            console.log(_selectedAuths);
        }
        setSelectedAuths(_selectedAuths);
    };

    function handleSaveAuth(e) {
        console.log(selectedAuths);

        axiosInstance
            .put(`/Authentication/${selectedUser.id}`, selectedAuths)
            .then(() => {
                showSuccess();
            })
            .catch((error) => console.error(error));
    }

    return (
        <div className="align-items-center p-3">
            {isLoading ? (
                <ProgressSpinner className="flex justify-content-center" />
            ) : (
                <div className="grid">
                    <div className="col-7">
                        <DataTable
                            value={users}
                            rows={15}
                            size="small"
                            selectionMode="radiobutton"
                            selection={selectedUser}
                            onSelectionChange={(e) => setSelectedUser(e.value)}
                            dataKey="id"
                            paginator>
                            <Column selectionMode="single" />
                            <Column field="id" header="الرقم التسلسلي" />
                            <Column field="name" header="الاسم الشخصي" />
                            <Column field="userName" header="اسم المستخدم" />
                        </DataTable>
                    </div>
                    <div className="col-3 pr-6">
                        <div className="auth__container">
                            {auths.map((auth, index) => (
                                <div key={index} className="align-items-center ">
                                    <Checkbox
                                        inputId={auth.key}
                                        name="auth"
                                        value={auth.key}
                                        onChange={(e) => onAuthChange(e)}
                                        checked={selectedAuths.some((item) => item === auth.key)}
                                    />
                                    <label htmlFor={auth.label} className="mr-3">
                                        {auth.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                        <div className="btn_area">
                            <Toast ref={toast} />
                            <Button className="btn mt-3 w-full" label="حفظ الصلاحيات" onClick={handleSaveAuth} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Authorization;
