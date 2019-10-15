import React from 'react';
import {
  Alert,
  StyleSheet,
  Platform,
  Button,
  Text,
  View,
  FlatList,
  SafeAreaView,
} from 'react-native';
import firebase from 'react-native-firebase';
import RNIap, {
  Product,
  ProductPurchase,
  PurchaseError,
  acknowledgePurchaseAndroid,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';

const itemSkus = Platform.select({
  ios: ['wtd_monthly', 'wtd_yearly'],
  android: ['wtd_monthly', 'wtd_yearly'],
});
let purchaseUpdateSubscription;
let purchaseErrorSubscription;
export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notiPermission: false,
      currentUser: null,
      productList: [],
      receipt: '',
      availableItemsMessage: '',
    };
  }

  componentDidMount = async (): void => {
    const {currentUser} = firebase.auth();
    this.setState({currentUser});
    this.checkPermission();
    this.messageListener();
    try {
      const products = await RNIap.getProducts(itemSkus);
      this.setState({productList: products});
      console.log(this.state.productList);
    } catch (err) {
      console.warn(err); // standardized err.code and err.message available
    }

    purchaseUpdateSubscription = purchaseUpdatedListener(
      async (purchase: ProductPurchase) => {
        console.log('purchaseUpdatedListener', purchase);
        if (
          purchase.purchaseStateAndroid === 1 &&
          !purchase.isAcknowledgedAndroid
        ) {
          try {
            const ackResult = await acknowledgePurchaseAndroid(
              purchase.purchaseToken,
            );
            console.log('ackResult', ackResult);
          } catch (ackErr) {
            console.warn('ackErr', ackErr);
          }
        }
        this.setState({receipt: purchase.transactionReceipt}, () =>
          this.goNext(),
        );
      },
    );

    purchaseErrorSubscription = purchaseErrorListener(
      (error: PurchaseError) => {
        console.log('purchaseErrorListener', error);
        Alert.alert('purchase error', JSON.stringify(error));
      },
    );
  };

  componentWillUnmount = () => {
    this.notificationListener();
    this.notificationOpenedListener();
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      this.purchaseUpdateSubscription = null;
    }
    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      this.purchaseErrorSubscription = null;
    }
  };

  logOut = () => {
    firebase
      .auth()
      .signOut()
      .then(() =>
        this.props.navigation.navigate(
          'Login'.catch(error => this.setState({errorMessage: error.message})),
        ),
      );
  };

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.getFcmToken();
      console.log('You are granted allow notification');
    } else {
      this.requestPermission();
      console.log('You are not granted allow notification');
    }
  };

  getFcmToken = async () => {
    firebase.messaging().subscribeToTopic('wttAllUser');
    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      console.log('Your fcm Token is : ' + fcmToken);
      //this.showAlert('Your Firebase Token is:', fcmToken);
    } else {
      this.showAlert('Failed', 'No token received');
    }
  };

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      // User has authorised
    } catch (error) {
      // User has rejected permissions
    }
  };

  messageListener = async () => {
    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        const {title, body} = notification;
        this.showAlert(title, body);
      });

    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened(notificationOpen => {
        console.log(notificationOpen);
        const {title, body} = notificationOpen.notification;
        this.showAlert(title, body);
      });

    const notificationOpen = await firebase
      .notifications()
      .getInitialNotification();
    if (notificationOpen) {
      const {title, body} = notificationOpen.notification;
      console.log(notificationOpen);
      this.showAlert(title, body);
    }

    this.messageListener = firebase.messaging().onMessage(message => {
      console.log(JSON.stringify(message));
    });
  };

  showAlert = (title, message) => {
    Alert.alert(
      title,
      message,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  };
  writeUserData = (email, fname, lname) => {
    firebase
      .database()
      .ref('Users/')
      .set({
        email,
        fname,
        lname,
      })
      .then(data => {
        //success callback
        console.log('data ', data);
      })
      .catch(error => {
        //error callback
        console.log('error ', error);
      });
  };

  goNext = (): void => {
    Alert.alert('Receipt', this.state.receipt);
  };

  getItems = async (): void => {
    try {
      const products = await RNIap.getProducts(itemSkus);
      // const products = await RNIap.getSubscriptions(itemSkus);
      console.log('Products', products);
      this.setState({productList: products});
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  getSubscriptions = async (): void => {
    try {
      const products = await RNIap.getSubscriptions(itemSubs);
      console.log('Products', products);
      this.setState({productList: products});
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  getAvailablePurchases = async (): void => {
    try {
      console.info(
        'Get available purchases (non-consumable or unconsumed consumable)',
      );
      const purchases = await RNIap.getAvailablePurchases();
      console.info('Available purchases :: ', purchases);
      if (purchases && purchases.length > 0) {
        this.setState({
          availableItemsMessage: `Got ${purchases.length} items.`,
          receipt: purchases[0].transactionReceipt,
        });
      }
    } catch (err) {
      console.warn(err.code, err.message);
      Alert.alert(err.message);
    }
  };

  // Version 3 apis
  requestPurchase = async (sku): void => {
    try {
      RNIap.requestPurchase(sku);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  };

  requestSubscription = async (sku): void => {
    try {
      RNIap.requestSubscription(sku);
    } catch (err) {
      Alert.alert(err.message);
    }
  };

  render() {
    const {currentUser, productList} = this.state;
    return (
      <SafeAreaView style={styles.container}>
        <Text>Hi {currentUser && currentUser.email}!</Text>

        <Button title="Logout" onPress={this.logOut} />

        <View style={styles.subContainer}>
          <FlatList
            data={productList}
            renderItem={({item}) => (
              <View>
                <Text style={styles.title}>
                  {' '}
                  {item.title} {item.price} {item.currency}
                </Text>
                <Button
                  title="Purchase Monthly"
                  onPress={(): void => this.requestSubscription(item.productId)}
                />
                <Text>{item.description}</Text>
              </View>
            )}
            keyExtractor={item => item.productId}
          />
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    height: 100,
  },
});
