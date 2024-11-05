import React, { useState, useEffect, useRef, useContext } from 'react';
import { createRoot } from 'react-dom/client';
import { userContext } from '../../reducers/UserProvider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputTextarea } from 'primereact/inputtextarea';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Ranks, SOCKET_URL, TOAST_LIFETIME } from '../../data.js';
import { axiosInstance } from '../../components/StateKeeper/StateKeeper';
import { Link } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { HubConnectionBuilder } from '@microsoft/signalr';
import notificationAudio from '../../assets/sounds/notification.wav';
import Template from './ExportTemplates/Template';
import { PDFDownloadLink } from '@react-pdf/renderer/lib/react-pdf.browser.es.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './MissionSelection.css';

const MissionSelection = () => {
    const { state } = useContext(userContext);
    const [allOfficers, setAllOfficers] = useState([]);
    const [allMissions, setAllMissions] = useState([]);
    const [search, setSearch] = useState({
        fromDate: new Date(),
        toDate: new Date(),
        rank: '',
        name: '',
        dist: '',
        officers: []
    });
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deletedMissionId, setDeletedMissionId] = useState({});
    const [isSearching, setIsSearching] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [socket, setSocket] = useState(null);
    const toast = useRef(null);
    const audioPlayer = useRef(null);
    const defaultStatement = 'لا يوجد';

    useEffect(() => {
        axiosInstance
            .get('/Officer')
            .then((response) => {
                setAllOfficers(response.data);
            })
            .catch((error) => console.error(error));
        handleSearch(null, true);
    }, []);

    useEffect(() => {
        if (socket) {
            socket
                .start()
                .then(() => {
                    socket.on('ReceiveMission', (newMission) => {
                        toast.current.show({
                            severity: 'info',
                            summary: 'مأمورية جديدة',
                            detail: 'تم أضافة مأمورية جديدة',
                            life: TOAST_LIFETIME
                        });
                        audioPlayer.current.play();
                        let _newMission = JSON.parse(newMission);
                        _newMission = { ..._newMission.mission, officers: _newMission.offecierid, isNew: true };
                        setAllMissions([_newMission, ...allMissions]);
                    });
                })
                .catch((error) => console.error(error));
        }
    }, [socket]);

    const rowClass = (data) => {
        if (data.persRev) {
            return 'personalreview__row';
        } else {
            switch (data.state) {
                case 'مأمورية مؤجلة':
                    return 'posponed__row';
                case 'مأمورية منتهية':
                    return 'ended__row';
                case 'مأمورية جارية':
                    return 'running__row';
                default:
                    break;
            }
        }
    };

    function fetchMissions() {
        axiosInstance
            .get('/Mission')
            .then((response) => {
                let missions = response.data;
                missions = missions.map((element) => {
                    return { ...element.mission, officers: element.offecierid };
                });
                setAllMissions([...missions]);
            })
            .catch((error) => console.error(error));
    }

    function handleSearchInputChange(e) {
        search[e.target.name] = e.target.value;
        console.log(e.target.value);
        setSearch({ ...search });
    }

    function handleFilterOfficers(e) {
        search.rank = e.value;
        search.officers = allOfficers.filter((x) => x.rank.trim() === e.value);
        setSearch({ ...search });
    }

    function togglePersonalReview(data) {
        axiosInstance
            .put(`Mission/personalReview/${data.missionId}`, JSON.stringify(!data.persRev), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(() => (isSearching ? handleSearch() : fetchMissions()))
            .catch((error) => console.error(error));
    }

    function prepareDelete(data) {
        setShowConfirmDelete(true);
        setDeletedMissionId(data.missionId);
    }

    function handleDelete() {
        axiosInstance
            .delete(`Mission/${deletedMissionId}`)
            .then(() => (isSearching ? handleSearch() : fetchMissions()))
            .catch((error) => console.error(error));
    }

    function handleSearch(e, isFirstLoad = false) {
        e?.preventDefault();
        setIsSearching(true);
        let fromDateSearch = '',
            toDateSearch = '';
        if (search.fromDate) fromDateSearch = new Date(search.fromDate).toLocaleDateString().replaceAll('/', '-');
        if (search.toDate) toDateSearch = new Date(search.toDate).toLocaleDateString().replaceAll('/', '-');
        axiosInstance
            .get(
                `/Mission/MissionSearch?FromDate=${fromDateSearch}&ToDate=${toDateSearch}&Name=${search.name}&Rank=${search.rank}&Distination=${search.dist}`
            )
            .then((response) => {
                let missions = response.data;
                missions = missions.map((element) => {
                    return { ...element.mission, officers: element.offecierid };
                });
                setAllMissions([...missions]);
                if (isFirstLoad) {
                    setIsLoading(false);
                    const connect = new HubConnectionBuilder().withUrl(SOCKET_URL).withAutomaticReconnect().build();
                    setSocket(connect);
                }
            })
            .catch((error) => console.error(error));
    }

    function clearSearchCondition(e) {
        e.preventDefault();
        setSearch({
            fromDate: new Date(),
            toDate: new Date(),
            rank: '',
            name: '',
            dist: '',
            officers: []
        });
        setIsSearching(false);
        handleSearch(null, true);
    }

    const exportPdf = () => {
        // const temp = createRoot(document.getElementById('export'));
        // temp.render(
        //     <PDFViewer>
        //         <ExportTemplate data={allMissions} />
        //     </PDFViewer>
        // );
    };

    return (
        <div className="p-3 pb-0">
            {isLoading ? (
                <ProgressSpinner className="flex justify-content-center" />
            ) : (
                <div className="flex flex-column">
                    <audio src={notificationAudio} ref={audioPlayer} hidden></audio>
                    <Toast ref={toast} />
                    <div>
                        <Button type="button" label="طباعة" icon="pi pi-print" iconPos="right" onClick={exportPdf} />
                        {/* <PDFDownloadLink
                            document={
                                <Template
                                    headerData={[
                                        'م',
                                        'الدرجة/الرتبة',
                                        'الاسم',
                                        'الاتجاه',
                                        'بيان المأمورية',
                                        'ما تم تنفيذه',
                                        'خروج',
                                        'دخول',
                                        'الحالة'
                                    ]}
                                    data={allMissions}
                                    fromData={search.fromDate}
                                    toData={search.toDate}
                                />
                            }
                            fileName="missions.pdf"
                            style={{
                                textDecoration: 'none',
                                padding: '10px',
                                color: '#4a4a4a',
                                backgroundColor: '#f2f2f2',
                                border: '1px solid #4a4a4a'
                            }}>
                            تحميل
                        </PDFDownloadLink> */}
                    </div>
                    <div className="flex flex-column">
                        <div className="flex align-items-center justify-content-evenly pt-1 pb-3">
                            <div className="flex gap-3">
                                <div className="flex flex-column gap-1">
                                    <label>تاريخ الخروج</label>
                                    <Calendar
                                        name="fromDate"
                                        value={search.fromDate}
                                        onChange={handleSearchInputChange}
                                        dateFormat="yy-mm-dd"
                                        showButtonBar
                                    />
                                </div>
                                <div className="flex flex-column gap-1">
                                    <label>تاريخ الدخول</label>
                                    <Calendar
                                        name="toDate"
                                        value={search.toDate}
                                        onChange={handleSearchInputChange}
                                        dateFormat="yy-mm-dd"
                                        showButtonBar
                                    />
                                </div>
                            </div>
                            <div className="flex flex-column gap-3 w-2">
                                <div className="">
                                    <Dropdown
                                        value={search.rank}
                                        onChange={handleFilterOfficers}
                                        className="w-full"
                                        options={Ranks}
                                        placeholder="اختر الرتبة"
                                    />
                                </div>
                                <div className="">
                                    <Dropdown
                                        value={search.name}
                                        name="name"
                                        onChange={handleSearchInputChange}
                                        className="w-full"
                                        optionLabel="name"
                                        optionValue="name"
                                        options={search.officers}
                                        placeholder="اختر الاسم"
                                    />
                                </div>
                            </div>
                            <div className="px-4">
                                <InputTextarea
                                    name="dist"
                                    value={search.dist}
                                    className=""
                                    onChange={handleSearchInputChange}
                                    rows={3}
                                    cols={40}
                                    placeholder="الاتجاه"
                                    autoResize
                                />
                            </div>
                            <div className="flex gap-3">
                                <div>
                                    <Button type="submit" label="بحث" className="btn" onClick={handleSearch} />
                                </div>
                                <div>
                                    <Button
                                        type="submit"
                                        label="الغاء شروط البحث"
                                        className="btn"
                                        onClick={clearSearchCondition}
                                    />
                                </div>
                            </div>
                        </div>
                        <ConfirmDialog
                            visible={showConfirmDelete}
                            onHide={() => setShowConfirmDelete(false)}
                            header="حذف مأمورية"
                            message="هل تريد حذف المأمورية؟"
                            accept={handleDelete}
                            acceptLabel="حذف"
                            reject={() => setShowConfirmDelete(false)}
                            rejectLabel="الغاء"
                            position="center"
                            resizable={false}
                            draggable={false}
                            closeOnEscape
                            blockScroll
                        />
                        <DataTable
                            className=""
                            value={allMissions}
                            size="small"
                            rowGroupMode="rowspan"
                            groupRowsBy="missionId"
                            rows={10}
                            rowClassName={rowClass}
                            paginator
                            scrollable
                            scrollHeight="420px">
                            <Column
                                style={{ flex: '0 0 0%' }}
                                header="#"
                                body={(data, options) => options.rowIndex + 1}
                            />
                            <Column
                                className="flex flex-column align-items-start justify-content-start"
                                header="الدرجة/الرتبة"
                                style={{ maxWidth: '100px' }}
                                body={(data) =>
                                    data.officers.map((x, idx) => (
                                        <span key={idx} className={data.isNew ? 'font-bold' : ''}>
                                            {x.rank}
                                        </span>
                                    ))
                                }
                            />
                            <Column
                                className="flex flex-column align-items-start justify-content-start"
                                header="الاسم"
                                body={(data) =>
                                    data.officers.map((x, idx) => (
                                        <span key={idx} className={data.isNew ? 'font-bold' : ''}>
                                            {x.name}
                                        </span>
                                    ))
                                }
                            />
                            <Column
                                className="flex flex-column align-items-baseline text-overflow-ellipsis overflow-x-hidden"
                                header="الاتجاه"
                                body={(data) => (
                                    <span className={data.isNew ? 'font-bold' : ''}>
                                        {data.dist ? data.dist : defaultStatement}
                                    </span>
                                )}
                            />
                            <Column
                                className="flex flex-column align-items-baseline text-overflow-ellipsis overflow-x-hidden"
                                header="البيان"
                                body={(data) => (
                                    <span className={data.isNew ? 'font-bold' : ''}>
                                        {data.reason ? data.reason : defaultStatement}
                                    </span>
                                )}
                            />
                            <Column
                                className="flex flex-column align-items-baseline text-overflow-ellipsis overflow-x-hidden"
                                header="ما تم تنفيذه"
                                body={(data) => (
                                    <span className={data.isNew ? 'font-bold' : ''}>
                                        {data.done ? data.done : defaultStatement}
                                    </span>
                                )}
                            />
                            <Column
                                style={{ maxWidth: '70px' }}
                                body={(data) => (
                                    <span className={data.isNew ? 'font-bold' : ''}>
                                        {data.fromTime ? data.fromTime : defaultStatement}
                                    </span>
                                )}
                                header="خروج"
                            />
                            <Column
                                style={{ maxWidth: '70px' }}
                                body={(data) => (
                                    <span className={data.isNew ? 'font-bold' : ''}>
                                        {data.toTime ? data.toTime : defaultStatement}
                                    </span>
                                )}
                                header="دخول"
                            />
                            {state.auths.personalReview && (
                                <Column
                                    className="flex flex-column align-items-center justify-content-center"
                                    header="عرض شخصي"
                                    style={{ maxWidth: '110px' }}
                                    body={(data) => (
                                        <Checkbox checked={data.persRev} onChange={() => togglePersonalReview(data)} />
                                    )}
                                />
                            )}
                            <Column
                                style={{ maxWidth: '120px' }}
                                header="حالة المأمورية"
                                className="justify-content-center"
                                field="state"
                                body={(data) => <span className={data.isNew ? 'font-bold' : ''}>{data.state}</span>}
                            />
                            {state.auths.editMission && (
                                <Column
                                    header="تعديل"
                                    style={{ maxWidth: '80px' }}
                                    className="justify-content-center"
                                    body={(body) => (
                                        <Link to={`/mission-entry/${body.missionId}`} className="">
                                            <Button
                                                type="button"
                                                className="bg-white shadow-8"
                                                icon="pi pi-pencil"
                                                raised
                                                size="sm"
                                                text
                                                rounded
                                            />
                                        </Link>
                                    )}
                                />
                            )}
                            {state.auths.deleteMission && (
                                <Column
                                    header="حذف"
                                    style={{ maxWidth: '80px' }}
                                    className="justify-content-center"
                                    body={(data) => (
                                        <Button
                                            type="button"
                                            icon="pi pi-trash"
                                            className="bg-white shadow-8"
                                            onClick={() => prepareDelete(data)}
                                            raised
                                            text
                                            size="sm"
                                            rounded
                                        />
                                    )}
                                />
                            )}
                        </DataTable>
                    </div>
                </div>
            )}
        </div>
    );
};
export default MissionSelection;
