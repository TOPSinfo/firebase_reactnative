import React from 'react'
import { View, Text, Modal, TouchableWithoutFeedback } from 'react-native'

const RNModal = ({ visible, onClose, children }: { visible: boolean, onClose: () => void, children: React.ReactNode }) => {
    return (
        <Modal visible={visible} onRequestClose={onClose} transparent>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        {children}
                    </View>
                </TouchableWithoutFeedback>
            </View>
        </Modal>
    )
}

export default RNModal