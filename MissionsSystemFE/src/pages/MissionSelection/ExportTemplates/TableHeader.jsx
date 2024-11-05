import React from 'react';
import { Text, View, StyleSheet } from '@react-pdf/renderer/lib/react-pdf.browser.es.js';

function TableHeader({ headerData }) {
    const styles = StyleSheet.create({
        tableHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        tableHeaderItem: {
            width: '10%',
            border: '1pt solid black',
            padding: '10'
        }
    });

    return (
        <View style={styles.tableHeader}>
            {headerData.map((item, index) => (
                <Text style={styles.tableHeaderItem} key={index}>
                    {item}
                </Text>
            ))}
        </View>
    );
}

export default TableHeader;
