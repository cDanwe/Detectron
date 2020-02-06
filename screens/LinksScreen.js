import React, { Component } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  Text,
  View,
  RefreshControl,
  Modal,
  Image,
  Dimensions,
  ScrollView,
  Button
} from 'react-native';
import { TouchableHighlight, TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

async function deleteBilan(id) {
  await fetch('http://192.168.8.103:33333/query', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: "DELETE FROM `bilan` WHERE id=" + id,
    })
  })
  alert("Suppression effectuée avec succès")
}

function Item({ row, onPress }) {
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
      <TouchableOpacity onPress={() => onPress()}>
        <Text>
          <Text style={{ fontSize: 20, flex: 1 }}>{row.name + "\n"}</Text>
          <Text>Bilan du </Text>
          <Text style={{ fontWeight: 'bold' }}>{row.date}</Text>
        </Text>
      </TouchableOpacity>
      <TouchableHighlight style={{ textAlign: 'right' }} onPress={() => deleteBilan(row.id)}>
        <Ionicons name="md-trash" color="red" size={26} />
      </TouchableHighlight>
    </View>
  );
}

class FormModal extends Component {
  state = {
    modalVisible: false,
    name: "",
    description: ""
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  constructor(props) {
    super(props)
    this.state.modalVisible = props.visible
  }

  render() {
    return (
      <View>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          presentationStyle="formSheet"
          onRequestClose={() => {
            this.setModalVisible(false)
          }}>
          <ScrollView>
            <View style={{ marginTop: 22, marginbottom: 30, padding: 20, justifyContent: 'center' }}>
              <Text style={{ marginTop: 10 }}>Image</Text>
              <Image
                source={{
                  //uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAX0AAADnCAQAAABY+k5LAAAE1nRFWHRteGZpbGUAJTNDbXhmaWxlJTIwaG9zdCUzRCUyMnd3dy5kcmF3LmlvJTIyJTIwbW9kaWZpZWQlM0QlMjIyMDE5LTEyLTE3VDEyJTNBMzUlM0EwMi42MjdaJTIyJTIwYWdlbnQlM0QlMjJNb3ppbGxhJTJGNS4wJTIwKFgxMSUzQiUyMExpbnV4JTIweDg2XzY0KSUyMEFwcGxlV2ViS2l0JTJGNTM3LjM2JTIwKEtIVE1MJTJDJTIwbGlrZSUyMEdlY2tvKSUyMENocm9tZSUyRjc4LjAuMzkwNC45NyUyMFNhZmFyaSUyRjUzNy4zNiUyMiUyMGV0YWclM0QlMjJJNzlEWTVOdzdSVjBqcU9EeVc2YSUyMiUyMHZlcnNpb24lM0QlMjIxMi40LjIlMjIlMjB0eXBlJTNEJTIyZGV2aWNlJTIyJTIwcGFnZXMlM0QlMjIxJTIyJTNFJTNDZGlhZ3JhbSUyMGlkJTNEJTIyMjZzR3lReUFnbzZpMmN3WDZkMzElMjIlMjBuYW1lJTNEJTIyUGFnZS0xJTIyJTNFN1pmTGpwc3dGSWFmaG1VcndDR2t5dzVKcHJPbzFEYTlURmVWQ3lmQnFzSElPQVAwNld0aWN6RU1tYzVGQ2xLYlRYeCUyQmpvJTJGdHo3JTJCeHNGQ1FsTmNjWiUyRkY3RmdHMVhEc3FMYlMyWE5keGJGZiUyQjFVcWxGTSUyRjNsWERnSk5KSm5iQWp2MEdMdGxhUEpJTGNTQlNNVVVFeVV3eFpta0lvREExenpnb3piYyUyQm9PV3FHRHpBU2RpR21ZJTJGVWJpVVNzMUpYcmQlMkZvN0lJZTRHZGxadmxGUEV0d2s2NVhrTVk1WTBaUFF4a0lCWjB5b1ZsSUdRR3Q0RFJmVmJ6dnh0SjBZaDFUOFRRZTJ1ZlhENVBPbiUyRlU5YSUyRlJCZlZzN0g3ZGRYdXNvZHBrZTk0RFhoa2lOaHFaU3ZJUVZlbzFBTEVGVkRwWWlKZ0YyR3d6b3U1TTViNkNvV0NaV1JJNXM0ejlSZTdFa0pjdmdyUFFwd0FlWGs5SjBXaW5RVHNBUUVyMlNLN29BYVIxU05RWFJjOUxaRlMzRnZSeG9OYXlNYzJzb2RLOW5RdUI2Qnpq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"
                  uri: this.state.image_data
                }}
                style={{
                  width: 9 * Dimensions.get('window').width / 10,
                  aspectRatio: 0.8
                }}
              />
              <Text style={{ marginTop: 10, fontWeight: "bold" }}>Nom du bilan:</Text>
              <Text
                style={{ height: 40, borderColor: 'gray', padding: 5, marginBottom: 10 }}
              >{this.state.name}</Text>

              <Text style={{ marginTop: 10, fontWeight: "bold" }}>Description:</Text>
              <Text
                style={{ height: 150, borderColor: 'gray', padding: 5, marginBottom: 10 }}
              >{this.state.description}</Text>
              <Button
                title="Close"
                onPress={() => { this.setModalVisible(false) }}
              />
            </View>
          </ScrollView>
        </Modal>
      </View>
    );
  }
}

var modal = null;

export default class LinksScreen extends Component {

  constructor(props) {
    super(props)
    var th = this

    this.state = {
      bilans: [],
      refreshing: false
    }

    this.refreshBilans()

  }

  refreshBilans() {
    var th = this
    fetch('http://192.168.8.103:33333/query', {
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
      });
    th.setState({
      refreshing: false
    })
  }

  displayItem(item) {
    modal.setState({
      ...item
    })
    modal.setModalVisible(true)
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.state.bilans}
          renderItem={({ item }) => <Item row={item} onPress={() => this.displayItem(item)} />}
          keyExtractor={(rowData) => JSON.stringify(rowData.id)}
          refreshControl={
            <RefreshControl refreshing={this.state.refreshing} onRefresh={this.refreshBilans.bind(this)} />
          }
        />
        <FormModal
          visible={false}
          ref={ref => {
            if (!modal)
              modal = ref;
          }}
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
