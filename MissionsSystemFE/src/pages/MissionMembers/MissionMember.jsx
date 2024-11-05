import React, { useEffect, useState, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Ranks, TOAST_LIFETIME } from '../../data';
import { Divider } from 'primereact/divider';
import { axiosInstance } from '../../components/StateKeeper/StateKeeper';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import './missionmember.css';

const MissionMember = () => {
    const [getMembers, setGetMembers] = useState(0);
    const [missionmembers, setMembers] = useState(null);
    const [deletemembers, setDeleteMembers] = useState(false);
    const [deletedMember, setDeletedMember] = useState([]);
    const [search, setSearch] = useState({
        name: '',
        phone: '',
        rank: ''
    });

    const toast = useRef(null);

    useEffect(() => {
        axiosInstance
            .get('/Officer')
            .then((response) => {
                setMembers([...response.data]);
            })
            .catch((error) => console.error(error));
    }, [getMembers]);

    const [credentials, setCredentials] = useState({
        rank: '',
        name: '',
        militaryNo: '',
        phone: ''
    });

    const [validation, setValidation] = useState({
        form: '',
        rank: '',
        name: '',
        militaryNo: '',
        phone: ''
    });

    function handleInputChange(e) {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    }

    // start add members===========================
    function validateName(input) {
        if (!input.length) {
            return { value: false, message: 'برجاء ادخال الاسم الشخصي' };
        }
        return { value: true, message: '' };
    }

    function validateRank(input) {
        if (!input.length) {
            return { value: false, message: 'برجاء ادخال الرتبة' };
        }
        return { value: true, message: '' };
    }

    function handleAdd(e) {
        e.preventDefault();
        const resultName = validateName(credentials.name);
        const resultRank = validateRank(credentials.rank);
        const resultPhone = credentials.phone;

        setValidation({
            ...validation,
            name: resultName.message,
            rank: resultRank.message,
            phone: resultPhone.message
        });
        if (resultName.value && resultRank.value) {
            axiosInstance
                .post('/Officer', credentials)
                .then(() => {
                    setGetMembers(!getMembers);
                    showSuccess();
                    setCredentials({
                        rank: '',
                        name: '',
                        militaryNo: '',
                        phone: ''
                    });
                })
                .catch((error) => {
                    setValidation({ ...validation, form: 'فشلت عملية اضافة فرد جديد' });
                    console.error(error);
                });
        }
    }

    const showSuccess = () => {
        toast.current.show({
            severity: 'success',
            summary: 'حفظ',
            detail: 'تم أضافة فرد جديد بنجاح',
            life: TOAST_LIFETIME
        });
    };
    // end add members=============================

    // start edit members==========================
    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    };

    const rankEditor = (options) => {
        return (
            <Dropdown
                value={options.value}
                options={Ranks}
                onChange={(e) => options.editorCallback(e.value)}
                placeholder="أختر الرتبة"
            />
        );
    };

    const onRowEditComplete = (e) => {
        let _missionmembers = [...missionmembers];
        let { newData, index } = e;
        _missionmembers[index] = newData;
        console.log(newData);
        axiosInstance
            .put(`/Officer/${_missionmembers[index].id}`, _missionmembers[index])
            .then((response) => {
                console.log(response.data);
                setMembers(_missionmembers);
            })
            .catch((error) => console.error(error));
        setMembers(_missionmembers);
    };
    // end edit members=============================

    // start delete members=========================
    function handleDelete() {
        let _missionmembers = missionmembers.filter((val) => val.id !== deletedMember.id);
        console.log(deletedMember);
        axiosInstance
            .delete(`/Officer/${deletedMember.id}`)
            .then(() => {
                setMembers(_missionmembers);
                hideDeleteMembersDialog();
            })
            .catch((error) => console.error(error));
    }

    const actionBodyTemplate = (data) => {
        return (
            <Button
                type="button"
                icon="pi pi-trash"
                rounded
                outlined
                severity="danger"
                onClick={() => prepareDeletedMember(data)}
            />
        );
    };

    function prepareDeletedMember(data) {
        setDeleteMembers(true);
        setDeletedMember(data);
    }

    const hideDeleteMembersDialog = () => {
        setDeleteMembers(false);
    };

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="لا" icon="pi pi-times" outlined onClick={hideDeleteMembersDialog} />
            <Button label="نعم" icon="pi pi-check" severity="danger" onClick={handleDelete} />
        </React.Fragment>
    );
    // end delete members===========================

    // start search members=========================
    function handleSearch(e) {
        e.preventDefault();
        axiosInstance
            .get(`/Officer/OfficersSearch?Name=${search.name}&Rank=${search.rank}&Phone=${search.phone}`)
            .then((response) => {
                setMembers([...response.data]);
            })
            .catch((error) => console.error(error));
    }

    function clearSearchCondition(e) {
        e.preventDefault();

        setSearch({
            name: '',
            phone: '',
            rank: ''
        });

        axiosInstance
            .get(`/Officer/OfficersSearch?Name=${''}&Rank=${''}&Phone=${''}`)
            .then((response) => {
                setMembers([...response.data]);
            })
            .catch((error) => console.error(error));
    }
    // end search members============================
    return (
        <form action="">
            <div className="container missiommember_container">
                {/************************** entry area *************************************/}

                <div className="input_area">
                    <div className="field w-full pb-3">
                        <span className="p-float-label">
                            <InputText
                                value={credentials.name}
                                name="name"
                                className="p-inputtext-lg w-full"
                                onChange={handleInputChange}
                            />
                            <label htmlFor="name">الاسم</label>
                        </span>
                        <span className="validation__text">{validation.name}</span>
                    </div>

                    <div className="drop__down">
                        <Dropdown
                            value={credentials.rank}
                            name="rank"
                            onChange={handleInputChange}
                            options={Ranks}
                            editable
                            placeholder="الدرجة/الرتبة"
                            className="w-full md:w-15rem"
                        />
                        <span className="validation__text">{validation.rank}</span>
                    </div>

                    <div className="flex flex-column gap-2 ml-1">
                        <span className="p-float-label">
                            <InputText
                                value={credentials.phone}
                                name="phone"
                                className="p-inputtext-lg w-full"
                                onChange={handleInputChange}
                            />
                            <label htmlFor="phone">رقم الهاتف</label>
                        </span>
                        <span className="validation__text">{validation.phone}</span>
                    </div>

                    <div className="save__btn">
                        <Toast ref={toast} />
                        <Button className="btn" onClick={handleAdd}>
                            حفظ البيانات
                        </Button>
                    </div>
                </div>

                <Divider layout="vertical" />

                {/************************** search area ***********************************/}

                <div className="table_area pl-7">
                    <div className="card p-fluid flex flex-wrap gap-3">
                        <div className="">
                            <InputText
                                placeholder="الاسم"
                                value={search.name}
                                onChange={(e) => setSearch({ ...search, name: e.target.value })}
                            />
                        </div>

                        <div className="">
                            <Dropdown
                                value={search.rank}
                                onChange={(e) => setSearch({ ...search, rank: e.target.value })}
                                options={Ranks}
                                editable
                                placeholder="أختر الرتبة"
                                className="w-full md:w-16rem"
                            />
                        </div>

                        <div className="">
                            <InputText
                                placeholder="رقم الهاتف"
                                keyfilter="num"
                                value={search.phone}
                                onChange={(e) => setSearch({ ...search, phone: e.target.value })}
                            />
                        </div>

                        <div className="search__btn">
                            <Button type="submit" className="btn" onClick={handleSearch}>
                                بحث
                            </Button>
                        </div>
                        <div className="undo_search__btn">
                            <Button type="submit" className="btn" onClick={clearSearchCondition}>
                                الغاء شروط البحث
                            </Button>
                        </div>
                    </div>

                    <Divider type="solid" />

                    {/************************** table area *************************************/}

                    <div className="card p-fluid">
                        <DataTable
                            value={missionmembers}
                            editMode="row"
                            dataKey="id"
                            size="small"
                            rows={7}
                            onRowEditComplete={onRowEditComplete}
                            resizableColumns
                            showGridlines
                            tableStyle={{ minWidth: '50rem' }}
                            paginator>
                            <Column field="id" header="الكود الخاص" style={{ width: '10%' }} />
                            <Column
                                field="name"
                                header="الاسم"
                                editor={(options) => textEditor(options)}
                                style={{ width: '30%' }}
                            />
                            <Column
                                field="rank"
                                header="الرتبة/الدرجة"
                                editor={(options) => rankEditor(options)}
                                style={{ width: '20%' }}
                            />
                            <Column
                                field="phone"
                                header="رقم الهاتف"
                                editor={(options) => textEditor(options)}
                                style={{ width: '20%' }}
                            />
                            <Column
                                rowEditor
                                headerStyle={{ width: '10%', minWidth: '8rem' }}
                                bodyStyle={{ textAlign: 'center' }}
                            />
                            <Column
                                body={actionBodyTemplate}
                                exportable={false}
                                style={{ minWidth: '6rem' }}
                                bodyStyle={{ textAlign: 'center' }}
                            />
                        </DataTable>
                    </div>
                </div>

                <Dialog
                    visible={deletemembers}
                    style={{ width: '32rem' }}
                    breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                    header="حذف فرد"
                    modal
                    footer={deleteProductDialogFooter}
                    onHide={hideDeleteMembersDialog}>
                    <div className="confirmation-content">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                        <span className="mr-2">هل تريد حذف هذا الفرد؟</span>
                    </div>
                </Dialog>
            </div>
        </form>
    );
};

export default MissionMember;
