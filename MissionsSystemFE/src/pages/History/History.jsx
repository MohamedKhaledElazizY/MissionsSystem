import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { API_BASE_URL } from '../../data.js';
import './History.css';
const History = () => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios
            .get(`${API_BASE_URL}/UserHistory`, {
                headers: {
                    Accept: 'text/plain'
                }
            })
            .then((response) => {
                setHistory([...response.data]);
            })
            .catch((error) => console.error(error));
    }, []);

    return (
        <div className="container history__container">
            <div className="flex justify-content-center pt-5">
                <DataTable
                    value={history}
                    size="small"
                    rows={15}
                    showGridlines
                    resizableColumns
                    tableStyle={{ minWidth: '70rem' }}
                    paginator>
                    <Column field="userName" header="الاسم الشخصى" />
                    <Column field="action" header="الاجراء" />
                    <Column body={(data) => data.dateTime.replace('T', ' | ')} header="توقيت اتمام الاجراء" />
                </DataTable>
            </div>
        </div>
    );
};

export default History;
