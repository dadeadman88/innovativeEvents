// import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
// import notifee, { AndroidImportance, EventType, Notification } from '@notifee/react-native';
// import { navigateToCorespondingScreen } from './Constants';

// export class PushNotification {
//     static async requestUserPermission() {
//         notifee.requestPermission()
//         let hasPermission = await messaging().hasPermission();
//         if (hasPermission == messaging.AuthorizationStatus.DENIED || hasPermission == messaging.AuthorizationStatus.NOT_DETERMINED) {
//             const authStatus = await messaging().requestPermission();
//             const enabled =
//                 authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//                 authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//             return enabled;
//             // if (enabled) {
//             //     this.requestUserPermission();
//             // }
//         }
//         return false;
//     }

//     static async displayNotification(notification: Notification) {
//         notifee.displayNotification({
//             ...notification,
//             android: {
//                 channelId: "default",
//                 pressAction: {
//                     id: "default"
//                 }
//             },
//         })
//     }

//     static async init(navigation: any) {
//         let permission = await this.requestUserPermission();
//         const channelId = await notifee.createChannel({
//             id: 'default',
//             name: 'Default Channel',
//             importance: AndroidImportance.HIGH,
//             sound: "default",
//         });
//         messaging().onMessage((message) => {
//             let notification = message.notification;
//             this.displayNotification({
//                 title: notification?.title,
//                 body: notification?.body,
//                 data: message.data
//             })
//         })
//         notifee.onForegroundEvent((event) => {
//             let data = event.detail.notification?.data;
//             let customData = data?.custom ? JSON.parse(data?.custom) : data
//             if (event.type == EventType.ACTION_PRESS || event.type == EventType.PRESS) {
//                 navigateToCorespondingScreen(navigation, customData.type, customData.object_id)
//             }
//         })
//     }

// }