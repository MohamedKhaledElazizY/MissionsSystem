import React from 'react';
import { Image, Text, View } from '@react-pdf/renderer';
import logo from '../../../assets/images/oooo.png';

function Title({ fromData, toDate }) {
    const styles = StyleSheet.create({
        title: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        titleDepartments: {
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 12
        },
        titleText: {
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: 18,
            fontWeight: 'bold'
        },
        titleImage: {
            marginVertical: 15,
            marginHorizontal: 100
        }
    });

    return (
        <View style={styles.title}>
            <View style={styles.titleDepartments}>
                <Text>هيئة تدريب القوات المسلحة</Text>
                <Text>كلية الضباط الاحتياط</Text>
                <Text>قسم المتابعة</Text>
            </View>
            <View style={styles.titleText}>
                <Text>
                    بيان بالمأموريات من {fromData} الي {toDate}
                </Text>
            </View>
            <View>
                <Image style={styles.titleImage} src={logo} />
            </View>
        </View>
    );
}

export default Title;
