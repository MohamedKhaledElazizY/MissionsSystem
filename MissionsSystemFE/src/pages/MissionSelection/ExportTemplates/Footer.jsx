import React from 'react';
import { Text, View } from '@react-pdf/renderer';

function Footer() {
    const styles = StyleSheet.create({
        footer: {
            flexDirection: 'column',
            justifyContent: 'end',
            alignItems: 'end',
            width: '100%',
            fontSize: 16
        }
    });

    return (
        <View style={styles.footer}>
            <Text>التوقيع/</Text>
            <Text>عقيد/ هاني السعيد حسانين</Text>
            <Text>رئيس قسم المتابعة</Text>
        </View>
    );
}

export default Footer;
