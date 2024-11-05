import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ColorPicker } from 'primereact/colorpicker';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { Ranks, SOCKET_URL, stateTypes, TOAST_LIFETIME } from '../../data';
import { Button } from 'primereact/button';
import { axiosInstance } from '../../components/StateKeeper/StateKeeper';
import { Toast } from 'primereact/toast';
import { HubConnectionBuilder } from '@microsoft/signalr';
import './MissionEntry.css';

const MissionEntry = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useRef(null);
    const [selectedState, setselectedState] = useState({ name: '', key: '' });
    const [allOfficers, setAllOfficers] = useState([]);
    const [combined, setCombined] = useState({
        officerDropdownsOptions: [[]],
        mission: {
            missionId: null,
            fromDate: new Date(),
            toDate: new Date(),
            fromTime: '',
            toTime: '',
            dist: '',
            reason: '',
            done: '',
            state: '',
            persRev: '',
            officers: []
        }
    });
    const [numberOfOfficers, setNumberOfOfficers] = useState(1);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        axiosInstance
            .get('/Officer')
            .then((response) => {
                setAllOfficers(response.data);
                const connect = new HubConnectionBuilder().withUrl(SOCKET_URL).withAutomaticReconnect().build();
                connect.start().catch((error) => console.error(error));
                setSocket(connect);
            })
            .catch((error) => console.error(error));
    }, []);

    useEffect(() => {
        if (!id) {
            initializeForCreate();
        }
    }, [id]);

    useEffect(() => {
        if (allOfficers.length) {
            if (id) {
                axiosInstance
                    .get(`/Mission/${id}`)
                    .then((response) => {
                        console.log(response.data);
                        initializeForEdit(response.data.mission, response.data.offecierid);
                    })
                    .catch((error) => console.error(error));
            } else {
                initializeForCreate();
            }
        }
    }, [allOfficers]);

    useEffect(() => {
        if (numberOfOfficers > combined.mission.officers.length) {
            if (numberOfOfficers === 1) {
                combined.mission.officers.push({
                    id: null,
                    rank: '',
                    name: '',
                    phone: ''
                });
            } else {
                combined.mission.officers.push({
                    id: null,
                    rank: '',
                    name: ''
                });
                combined.officerDropdownsOptions.push([]);
            }
        } else if (numberOfOfficers < combined.mission.officers.length) {
            combined.mission.officers.pop();
            combined.officerDropdownsOptions.pop();
        }
        setCombined({ ...combined });
    }, [numberOfOfficers]);

    function initializeForCreate() {
        setselectedState({ name: '', key: '' });
        setCombined({
            officerDropdownsOptions: [[]],
            mission: {
                missionId: null,
                fromDate: new Date(),
                toDate: new Date(),
                fromTime: '',
                toTime: '',
                dist: '',
                reason: '',
                done: '',
                state: '',
                persRev: '',
                officers: [
                    {
                        id: null,
                        rank: '',
                        name: '',
                        phone: ''
                    }
                ]
            }
        });
        setNumberOfOfficers(1);
    }

    function initializeForEdit(mission, offecierid) {
        mission.fromDate = new Date(mission.fromDate);
        mission.toDate = new Date(mission.toDate);
        combined.mission = { ...combined.mission, ...mission };
        combined.mission.officers = offecierid;
        combined.officerDropdownsOptions.pop();
        combined.mission.officers.forEach((officer) => {
            const filteredOptions = allOfficers.filter((x) => x.rank.trim() === officer.rank.trim());
            combined.officerDropdownsOptions.push(filteredOptions);
        });
        setNumberOfOfficers(offecierid.length);
        setselectedState({ name: mission.state, key: mission.state });
        setCombined({ ...combined });
    }

    function handleOfficerData(e, key, index) {
        combined.mission.officers[index][key] = e.target.value.trim();
        if (!index && key === 'name') {
            const phone = combined.officerDropdownsOptions[index].find((x) => x.name === e.target.value).phone;
            combined.mission.officers[index].phone = phone ? phone.trim() : '';
        }
        setCombined({ ...combined });
    }

    function handleInputChange(e) {
        combined.mission[e.target.name] = e.target.value;
        setCombined({ ...combined });
    }

    function handleStateChange(e) {
        combined.mission.state = e.value.key;
        setselectedState(e.value);
        setCombined({ ...combined });
    }

    function handleFilterOfficers(e, index) {
        combined.mission.officers[index].rank = e.target.value;
        const _officers = allOfficers.filter((x) => x.rank.trim() === e.value);
        combined.officerDropdownsOptions[index] = _officers;
        setCombined({ ...combined });
    }

    function handleSubmit(e) {
        e.preventDefault();
        combined.mission.officers.forEach((officer, index) => {
            combined.mission.officers[index].id = allOfficers.find((x) => x.name === officer.name).id;
        });
        const data = {
            mission: combined.mission,
            offecierid: combined.mission.officers
        };
        if (!id) {
            delete data.mission.missionId;
            delete data.mission.persRev;
            delete data.mission.officers;
            axiosInstance
                .post('/Mission', data)
                .then((response) => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'اضافة مأمورية',
                        detail: 'تم أضافة مأمورية جديدة بنجاح',
                        life: TOAST_LIFETIME
                    });
                    socket.send('SendMission', JSON.stringify(response.data));
                    initializeForCreate();
                })
                .catch((error) => console.error(error));
        } else {
            axiosInstance
                .put(`/Mission/${id}`, data)
                .then(() => {
                    toast.current.show({
                        severity: 'success',
                        summary: 'تعديل مأمورية',
                        detail: 'تم تعديل المأمورية بنجاح',
                        life: TOAST_LIFETIME
                    });
                    setTimeout(() => location.reload(), TOAST_LIFETIME);
                })
                .catch((error) => console.error(error));
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-column align-items-start p-2">
            <Toast ref={toast} />
            <Button type="submit" label="حفظ المأمورية" className="btn" />
            <div className="flex align-items-baseline justify-content-around p-2 w-full">
                <div className="">
                    <div className="flex justify-content-between mb-2">
                        <div className="flex flex-column gap-1">
                            <label>تاريخ الخروج</label>
                            <Calendar
                                name="fromDate"
                                value={combined.mission.fromDate}
                                className="w-8"
                                onChange={handleInputChange}
                                dateFormat="yy-mm-dd"
                                showButtonBar
                            />
                        </div>
                        <div className="flex flex-column gap-1">
                            <label>تاريخ الدخول</label>
                            <Calendar
                                name="toDate"
                                value={combined.mission.toDate}
                                className="w-8"
                                onChange={handleInputChange}
                                dateFormat="yy-mm-dd"
                                showButtonBar
                            />
                        </div>
                    </div>
                    <div className="flex justify-content-between mb-4">
                        <div className="flex flex-column gap-1">
                            <label>وقت الخروج</label>
                            <InputMask
                                name="fromTime"
                                value={combined.mission.fromTime}
                                className="w-8"
                                onChange={handleInputChange}
                                mask="99:99"
                                placeholder="00:00"
                            />
                        </div>
                        <div className="flex flex-column gap-1">
                            <label>وقت الدخول</label>
                            <InputMask
                                name="toTime"
                                value={combined.mission.toTime}
                                className="w-8"
                                onChange={handleInputChange}
                                mask="99:99"
                                placeholder="00:00"
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <span className="p-float-label">
                            <InputTextarea
                                name="dist"
                                value={combined.mission.dist}
                                className=""
                                onChange={handleInputChange}
                                rows={3}
                                cols={40}
                                autoResize
                            />
                            <label>الاتجاه</label>
                        </span>
                    </div>
                    <div className="mb-3">
                        <span className="p-float-label">
                            <InputTextarea
                                name="reason"
                                value={combined.mission.reason}
                                className=""
                                onChange={handleInputChange}
                                rows={3}
                                cols={40}
                                autoResize
                            />
                            <label>البيان</label>
                        </span>
                    </div>
                    <div className="mb-1">
                        <span className="p-float-label">
                            <InputTextarea
                                name="done"
                                value={combined.mission.done}
                                onChange={handleInputChange}
                                rows={3}
                                cols={40}
                                autoResize
                            />
                            <label>ما تم تنفيذه</label>
                        </span>
                    </div>
                    <div className="mb-1">
                        <div className="flex flex-column">
                            {stateTypes.map((state) => {
                                return (
                                    <div key={state.key} className="flex align-items-center">
                                        <ColorPicker format="rgb" value={state.color} className="color__preview ml-2" />
                                        <RadioButton
                                            inputId={state.key}
                                            name="state"
                                            value={state}
                                            onChange={handleStateChange}
                                            checked={selectedState.key === state.key}
                                        />
                                        <label htmlFor={state.key} className="mr-2" style={{ fontWeight: 'bold' }}>
                                            {state.name}
                                        </label>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="w-8 pt-4">
                        <span className="flex flex-column">
                            <label
                                className="ml-1"
                                style={{ textDecoration: 'underline', fontWeight: 'bold', color: 'blue' }}>
                                طلب عرض شخصي بواسطة
                            </label>
                            <InputText
                                name="persRev"
                                value={combined.mission.personalReviewer}
                                onChange={handleInputChange}
                                disabled
                            />
                        </span>
                    </div>
                </div>
                <div className="flex flex-column gap-3 w-3">
                    <div className="flex flex-column gap-1">
                        <label>عدد أفراد المأمورية</label>
                        <InputNumber
                            value={numberOfOfficers}
                            onValueChange={(e) => setNumberOfOfficers(e.target.value)}
                            className="direction__ltr"
                            mode="decimal"
                            showButtons
                            min={1}
                            max={8}
                        />
                    </div>
                    <div className="flex flex-column gap-1">
                        {combined.mission.officers.map((person, index) => (
                            <div key={person.id || index}>
                                {!index ? <span>قائد المأمورية</span> : <span>الفرد رقم {index + 1}</span>}
                                <div className="flex flex-column gap-2 mb-2 border-1 border-round w-full p-4">
                                    <div className="">
                                        <Dropdown
                                            value={person.rank.trim()}
                                            onChange={(e) => handleFilterOfficers(e, index)}
                                            className="w-full"
                                            options={Ranks}
                                            placeholder="اختر الرتبة"
                                        />
                                    </div>
                                    <div className="">
                                        <Dropdown
                                            value={person.name.trim()}
                                            onChange={(e) => handleOfficerData(e, 'name', index)}
                                            className="w-full"
                                            optionLabel="name"
                                            optionValue="name"
                                            options={combined.officerDropdownsOptions[index]}
                                            placeholder="اختر الاسم"
                                        />
                                    </div>
                                    {!index && (
                                        <div className="">
                                            <InputText
                                                value={person.phone}
                                                onChange={(e) => handleOfficerData(e, 'phone', index)}
                                                className="w-full"
                                                placeholder="رقم الهاتف"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </form>
    );
};

export default MissionEntry;
