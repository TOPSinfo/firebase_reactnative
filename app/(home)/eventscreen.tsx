import Event from '@/components/Event'
import { Colors } from '@/constants/Colors'
import { resetSelectedEvent } from '@/redux/eventSlice'
import React, { useEffect } from 'react'
import { View } from 'react-native'
import { useDispatch } from 'react-redux'

const EventScreen = () => {

  const disptach = useDispatch()
  useEffect(() => {
    return () => {
      disptach(resetSelectedEvent())
    }
  })

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <Event />
    </View>
  )
}

export default EventScreen