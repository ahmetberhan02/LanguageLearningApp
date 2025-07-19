import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import wordList from './toefl_words_ready_final.json';

export default function WordListScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 TOEFL Kelime Listesi</Text>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {wordList.map((word, index) => (
          <View key={index} style={styles.wordRow}>
            <Text style={styles.wordEn}>{word.en}</Text>
            <Text style={styles.wordTr}>{word.tr || word.en}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>⬅ Geri Dön</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121330',
    paddingTop: 50,
    paddingHorizontal: 20
  },
  title: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  scrollContent: {
    paddingBottom: 80
  },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#444',
    borderBottomWidth: 1,
    paddingVertical: 10
  },
  wordEn: {
    fontSize: 16,
    color: '#fff',
    flex: 1
  },
  wordTr: {
    fontSize: 16,
    color: '#bbb',
    flex: 1,
    textAlign: 'right'
  },
  backButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16
  }
});
