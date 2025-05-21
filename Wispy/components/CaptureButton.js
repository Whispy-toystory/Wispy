// components/CaptureButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

export default function CaptureButton({ onPress, title }) { // title prop 추가
    return (
        <TouchableOpacity onPress={onPress} style={styles.buttonContainer}>
            {title ? ( // title prop이 있으면 텍스트 버튼 표시
                <View style={[styles.buttonBody, styles.textButtonBody, title === "OK" ? styles.okButtonBody : (title === "Done" ? styles.doneButtonBody : {})]}>
                    <Text style={styles.buttonText}>{title}</Text>
                </View>
            ) : ( // title prop이 없으면 기존 아이콘 모양 버튼 표시
                <View style={[styles.buttonBody, styles.iconButtonBody]}>
                    <View style={styles.innerCircle} />
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonBody: {
        width: 70,
        height: 70,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    iconButtonBody: {
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
    },
    textButtonBody: { // 기본 텍스트 버튼 스타일
        backgroundColor: '#007AFF', // 기본 파란색 (Done 버튼 등)
    },
    okButtonBody: { // "OK" 버튼 특별 스타일
        backgroundColor: '#60D060', // 밝은 녹색
    },
    doneButtonBody: { // "Done" 버튼 특별 스타일 (textButtonBody 기본값 사용 또는 다른 색 지정)
        backgroundColor: '#007AFF',
    },
    innerCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'white',
    },
    buttonText: {
        color: 'white',
        fontSize: 22,
        fontWeight: 'bold',
    },
});