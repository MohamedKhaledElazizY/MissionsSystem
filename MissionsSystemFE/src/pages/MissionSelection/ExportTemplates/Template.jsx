import React from 'react';
import { Page, Document, StyleSheet, Font } from '@react-pdf/renderer/lib/react-pdf.browser.es.js';
import Title from './Title';
import Table from './Table';
import Footer from './Footer';

function Template({ headerData, data, fromData, toDate }) {
    // Font.register({ family: 'Tajwal', src: '../../../../assets/fonts/Tajawal-Bold.ttf' });

    const styles = StyleSheet.create({
        page: {
            // fontFamily: 'Tajwal',
            backgroundColor: '#ffffff',
            fontSize: 11,
            flexDirection: 'column',
            margin: 10,
            padding: 10,
            border: '5pt solid black'
        }
    });

    return (
        <Document language="arabic">
            <Page style={styles.page}>
                <Title fromData={fromData} toDate={toDate} />
                <Table headerData={headerData} data={data} />
                <Footer />
            </Page>
        </Document>
    );
}

export default Template;
