import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { axiosInstance } from '../../components/StateKeeper/StateKeeper';
import './ResetPassword.css';

const ResetPassword = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axiosInstance
            .get('/User')
            .then((response) => {
                setUsers([...response.data]);
                setIsLoading(false);
            })
            .catch((error) => console.error(error));
    }, []);

    function onRowEditComplete(e) {
        let _users = [...users];
        let { newData, index } = e;
        _users[index] = newData;
        console.log(newData);
        axiosInstance
            .put(`/User/ResetPassword/${_users[index].id}`, JSON.stringify(_users[index].password), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response) => {
                console.log(response.data);
                setUsers(_users);
                location.reload();
            })

            .catch((error) => console.error(error));
    }

    function passwordEditor(options) {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    }

    return (
        <div className="m-auto p-5">
            {isLoading ? (
                <ProgressSpinner className="flex justify-content-center" />
            ) : (
                <DataTable
                    value={users}
                    className=""
                    rows={15}
                    size="small"
                    editMode="row"
                    onRowEditComplete={onRowEditComplete}
                    paginator>
                    <Column field="id" header="الرقم التسلسلي" />
                    <Column field="name" header="الاسم الشخصي" />
                    <Column field="userName" header="اسم المستخدم" />
                    <Column field="password" header="كلمة السر" editor={(options) => passwordEditor(options)} />
                    <Column header="تعديل كلمة السر" rowEditor />
                </DataTable>
            )}
        </div>
    );
};

export default ResetPassword;
