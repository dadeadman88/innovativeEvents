import CustomButton from '@/components/Button'
import Container from '@/components/Container'
import { router } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native-ui-lib'

const startTimer = () => {
    return (
        <Container appBar appBarTitle='' containerProps={{ centerH: true }}>

            <Text center large24 black bold>
                Job is currently in progress
            </Text>
            <Text gray medium small center>
                Please enter the verification code that the user has received to start the Job
            </Text>
            <View row marginT-30 gap-20>
                <CustomButton
                    flex
                    label='Cancel'
                    bg-inputBg
                    color='#000'
                    onPress={() => router.back()}
                />
                <CustomButton
                    flex
                    label='Complete'
                    onPress={() => router.push('/CompleteJob')}
                />

            </View>
        </Container>
    )
}

export default startTimer