import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, FlatList, Text, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

function Item({ row }) {
  return (
    <View style={{
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 5,
      padding: 10,
      shadowOffset: { width: 10, height: 10 },
      shadowColor: 'black',
      shadowOpacity: 0.8,
      borderWidth: 2,
      borderRadius: 5,
      borderColor: '#ddd',
    }}>
      <Text>
        <Text>Bilan du </Text>
        <Text style={{ fontWeight: 'bold' }}>{row.date}</Text>
      </Text>
      <TouchableHighlight style={{ textAlign: 'right' }}>
        <Ionicons name="md-trash" color="red" size={26} />
      </TouchableHighlight>
    </View>
  );
}

export default class LinksScreen extends Component {

  constructor(props) {
    super(props)
    var th = this

    this.state = {
      bilans: []
    }

    let response = fetch('http://192.168.8.103:33333/query', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: "select * from bilan",
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
      th.setState({
        bilans: responseJson.result.map(t => {
          return {
            id: t[0],
            name: t[1],
            description: t[2],
            date: t[3],
            image: t[4]
          }
        })
      })
    })
    .catch((error) => {
      console.error("error", error);
    });;
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.bilans}
          renderItem={({ item }) => <Item row={item} />}
          keyExtractor={(rowData) => JSON.stringify(rowData.id)}
        />
      </SafeAreaView>
    );
  }
}

LinksScreen.navigationOptions = {
  title: 'Bilans',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
});
