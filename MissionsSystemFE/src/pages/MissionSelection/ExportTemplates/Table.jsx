import React from 'react';
import { StyleSheet, View } from '@react-pdf/renderer';
import TableHeader from './TableHeader';
import TableRow from './TableRow';

function Table({ headerData, data }) {
    const styles = StyleSheet.create({
        tableContainer: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            border: '5 solid black'
        }
    });

    return (
        <View style={styles.tableContainer}>
            <TableHeader headerData={headerData} />
            {data.map((mission, index) => (
                <TableRow mission={mission} key={index} />
            ))}
        </View>
    );
}

export default Table;
