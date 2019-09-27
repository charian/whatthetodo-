import React, {Component, useState} from 'react';
import {View, Text} from 'react-native';
import {Frame} from 'framer';

// const [rotate, setRotate] = useState(0);
// const toggleRotate = () => setRotate(rotate + 90);

export default class App extends React.Component {
  render() {
    return (
      <View>
        <Text>asd</Text>
        {/* <Frame
          animate={{rotate}}
          onTap={toggleRotate}
          size={150}
          radius={30}
          background={'#000'}
        /> */}
      </View>
    );
  }
}
