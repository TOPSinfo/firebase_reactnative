import DetailsHeader from '@/components/DetailsHeader'
import { Colors } from '@/constants/Colors'
import { Fonts } from '@/constants/Fonts'
import { Images } from '@/constants/Images'
import { setLoading } from '@/redux/loadingSlice'
import { getAstrologer } from '@/services/db'
import { horizontalScale, moderateScale } from '@/utils/matrix'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, } from 'react-native'
import { useDispatch } from 'react-redux'


const Details = () => {
    const [details, setDetails] = useState<any>(null)
    const { id } = useLocalSearchParams<{ id: string }>()

    const disptach = useDispatch()

    const onPlus = () => {
    }

    const getDetails = async () => {
        disptach(setLoading(true))
        const res = await getAstrologer(id)
        console.log('Details', res)
        if (res) {
            setDetails(res.astrologer)
            disptach(setLoading(false))
        }
    }

    useEffect(() => {
        getDetails()
    }, [])



    if (!details) return null

    return (
        <View style={{ flex: 1 }}>
            <DetailsHeader title={'Astrologer'} rightIcon={Images.plus} onRight={onPlus} />

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white
    },
    name: {
        fontSize: moderateScale(18),
        fontFamily: Fonts.PoppinsMedium,
        color: Colors.black1
    },
    rateButton: {
        paddingHorizontal: horizontalScale(8),
        height: horizontalScale(30),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: horizontalScale(4),
        backgroundColor: Colors.orange
    },
    rate: {
        fontSize: moderateScale(10),
        fontFamily: Fonts.PoppinsBold,
        color: Colors.white,
    },
    skills: {
        fontSize: moderateScale(10),
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.grey,
        marginLeft: horizontalScale(5)
    },
    box: {
        height: horizontalScale(60),
        width: '30%',
        borderWidth: 0.5,
        borderRadius: horizontalScale(5),
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.white1
    },
    boxLabel: {
        fontSize: moderateScale(16),
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.black1
    },
    date: {
        fontSize: moderateScale(12),
        fontFamily: Fonts.PoppinsRegular,
        color: Colors.black1,
        marginTop: horizontalScale(10)
    }
})

export default Details