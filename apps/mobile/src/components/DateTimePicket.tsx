// import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
// import React from 'react';
// import { Button, Platform, Text } from 'react-native';
// import { View } from 'react-native';

// interface DateTimePickerProps {
//     onChange: (date: Date) => void;
//     currentDate: Date;
// };

// export default function DateTimePicket(props: DateTimePickerProps) {

//     if (Platform.OS === "android") {
//         return <AndroidDateTimePicker {...props} />
//     }

//     if (Platform.OS === "ios") {
//         return <IOSDateTimePicker {...props} />
//     }

//     return null;
// }

// export const AndroidDateTimePicker = ({ onChange, currentDate }: DateTimePickerProps) => {

//     const showDateTimePicker = () => {
//         DateTimePickerAndroid.open({
//             value: currentDate,
//             onChange: (_, date?: Date) => onChange(date || new Date()),
//             mode: "date"
//         });
//     };

//     return (
//         <RNDateTimePicker
//             style={{ alignSelf: 'flex-start' }}
//             accentColor='black'
//             minimumDate={new Date()}
//             value={currentDate}
//             mode='date'
//             display='default'
//             onChange={(_, date?: Date) => onChange(date || new Date())}
//         />
//     )
// };

// export const IOSDateTimePicker = ({ onChange, currentDate }: DateTimePickerProps) => {

//     const showDateTimePicker = () => {
//         DateTimePickerAndroid.open({
//             value: currentDate,
//             onChange: (_, date?: Date) => onChange(date || new Date()),
//             mode: "date"
//         });
//     };

//     return (
//         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10 }}>
//             <Text>
//                 {currentDate.toLocaleDateString()}
//             </Text>
//             <Button title="Abrir Calendário" onPress={showDateTimePicker} />
//         </View>
//     )
// };
