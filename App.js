import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { Constants } from 'expo';
import * as firebase from 'firebase';

const firebaseConfig = {
  apiKey: "AIzaSyCETV--RQC6XRMUSMtuUWGZfaw2IFg1L8k",
  authDomain: "assignment-2-5e466.firebaseapp.com",
  databaseURL: "https://assignment-2-5e466.firebaseio.com/",
  projectId: "assignment-2-5e466",
  storageBucket: "assignment-2-5e466.appspot.com",
  messagingSenderId: "324854445052",
  appId: "1:324854445052:web:7699e6415c94adbbdff879"
};
firebase.initializeApp(firebaseConfig);
//init firebase 
export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      message: '',
      messages: []
    }

    this.addItem = this.addItem.bind(this);
  }

  componentDidMount() {
    firebase
      .database()
      .ref()
      .child("messages")
      .once("value", snapshot => {
        const data = snapshot.val()
        if (snapshot.val()) {
          const initMessages = [];
          Object
            .keys(data)
            .forEach(message => initMessages.push(data[message]));
          this.setState({
            messages: initMessages
          })
        }
      });

    firebase
      .database()
      .ref()
      .child("messages")
      .on("child_added", snapshot => {
        const data = snapshot.val();
        if (data) {
          this.setState(prevState => ({
            messages: [data, ...prevState.messages]
          }))
        }
      })

  }

  addItem() {
    if (!this.state.message) return;

    const newMessage = firebase.database().ref()
      .child("messages")
      .push();
    newMessage.set(this.state.message, () => this.setState({ message: '' }))
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.mainBox}>
          <TextInput placeholder='Enter Reminders Here'
            value={this.state.message}
            onChangeText={(text) => this.setState({ message: text })}
            style={styles.initTxtInput} />
          <Button title='ADD' onPress={this.addItem} />
        </View>
        <FlatList data={this.state.messages}
          renderItem={
            ({ item }) =>
              <View style={styles.mainList}>
                <Text style={styles.listItem}>
                  {item}
                </Text>
              </View>
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: '#eee',

  },

  mainBox: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff'
  },

  initTxtInput: {
    flex: 1
  },

  mainList: {
    backgroundColor: '#fff',
    margin: 5,
    borderRadius: 5
  },

  listItem: {
    fontSize: 20,
    padding: 10
  },


});