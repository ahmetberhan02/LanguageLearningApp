// Gerekli kütüphaneler
import { FontAwesome } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Speech from 'expo-speech';
import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import wordList from './toefl_words_ready_final.json';

const { width, height } = Dimensions.get('window');
const Stack = createNativeStackNavigator();

function FlashCardScreen({ navigation }) {
  const [currentWords, setCurrentWords] = useState(wordList);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [incorrectWords, setIncorrectWords] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const speak = (text) => {
    const cleanedText = text.split('(')[0].trim();
    Speech.speak(cleanedText, {
      language: 'en-US',
      rate: 0.8,
    });
  };

  const flipCard = () => setIsFlipped(!isFlipped);

  const playSound = () => {
    const currentWord = currentWords[currentIndex];
    speak(isFlipped ? currentWord.tr || currentWord.en : currentWord.en);
  };

  const handleAnswer = (isCorrect) => {
    const currentWord = currentWords[currentIndex];
    if (isCorrect) setCorrectCount(prev => prev + 1);
    else {
      setIncorrectCount(prev => prev + 1);
      setIncorrectWords(prev => [...prev, currentWord]);
    }

    if (currentIndex < currentWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    } else {
      const newIncorrect = !isCorrect ? [...incorrectWords, currentWord] : incorrectWords;
      if (newIncorrect.length > 0) {
        setCurrentWords(newIncorrect);
        setCurrentIndex(0);
        setIncorrectWords([]);
        setIsFlipped(false);
      } else {
        setIsCompleted(true);
      }
    }
  };

  const toggleFavorite = () => {
    const word = currentWords[currentIndex];
    const alreadyFavorite = favorites.find(w => w.en === word.en);
    if (alreadyFavorite) {
      setFavorites(favorites.filter(w => w.en !== word.en));
    } else {
      setFavorites([...favorites, word]);
    }
  };

  const isFavorite = favorites.find(w => w.en === currentWords[currentIndex].en);

  const resetApp = () => {
    setCurrentWords(wordList);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setIncorrectWords([]);
    setIsCompleted(false);
    setFavorites([]);
  };

  if (isCompleted) {
    return (
      <View style={styles.completedContainer}>
        <Text style={styles.completedEmoji}>🎉</Text>
        <Text style={styles.completedTitle}>Tüm kelimeleri öğrendiniz!</Text>
        <Text style={styles.completedSubtitle}>✅ {correctCount} doğru</Text>
        <TouchableOpacity style={styles.resetButton} onPress={resetApp}>
          <Text style={styles.resetButtonText}>🔄 Yeniden Başla</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentWord = currentWords[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.counterText}>❌ {incorrectCount}</Text>
        <Text style={styles.progressText}>{currentIndex + 1}/{currentWords.length}</Text>
        <Text style={styles.counterText}>✅ {correctCount}</Text>
      </View>

      <TouchableOpacity style={styles.card} onPress={flipCard}>
        <TouchableOpacity onPress={playSound} style={styles.soundButton}>
          <FontAwesome name="volume-up" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <FontAwesome name={isFavorite ? 'star' : 'star-o'} size={22} color="#FFD700" />
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <Text style={styles.cardWord}>
            {isFlipped ? (currentWord.tr || currentWord.en) : currentWord.en}
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.hintText}>Karta dokunarak çevir</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.wrongButton]} onPress={() => handleAnswer(false)}>
          <Text style={styles.buttonText}>❌ Bilmiyorum</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.correctButton]} onPress={() => handleAnswer(true)}>
          <Text style={styles.buttonText}>✅ Biliyorum</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('WordList')}
      >
        <Text style={styles.linkButtonText}>📖 Tüm Kelimeler</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.linkButton}
        onPress={() => navigation.navigate('Favorites', { favorites })}
      >
        <Text style={styles.linkButtonText}>⭐ Favorilerim</Text>
      </TouchableOpacity>
    </View>
  );
}

function WordListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.wordListTitle}>📚 TOEFL Kelime Listesi</Text>
      <ScrollView style={{ width: '90%' }}>
        {wordList.map((word, index) => (
          <View key={index} style={styles.wordRow}>
            <Text style={styles.wordText}>{index + 1}. {word.en}</Text>
            <Text style={styles.wordMeaning}>{word.tr || word.en}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function FavoriteWordsScreen({ route }) {
  const { favorites } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.wordListTitle}>⭐ Favori Kelimeler</Text>
      <ScrollView style={{ width: '90%' }}>
        {favorites.map((word, index) => (
          <View key={index} style={styles.wordRow}>
            <Text style={styles.wordText}>{word.en}</Text>
            <Text style={styles.wordMeaning}>{word.tr || word.en}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="FlashCard" component={FlashCardScreen} />
        <Stack.Screen name="WordList" component={WordListScreen} />
        <Stack.Screen name="Favorites" component={FavoriteWordsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20
  },
  counterText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600'
  },
  progressText: {
    color: '#888',
    fontSize: 14
  },
  card: {
    width: width * 0.9,
    height: height * 0.6,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  soundButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    padding: 6,
    backgroundColor: '#ddd',
    borderRadius: 20
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 6
  },
  cardContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  cardWord: {
    fontSize: 42,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
    textAlign: 'center'
  },
  hintText: {
    fontSize: 13,
    color: '#444',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 30
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    minWidth: 130,
    alignItems: 'center'
  },
  correctButton: {
    backgroundColor: '#22c55e'
  },
  wrongButton: {
    backgroundColor: '#ef4444'
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600'
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  completedEmoji: {
    fontSize: 80
  },
  completedTitle: {
    fontSize: 24,
    color: '#000',
    marginVertical: 10
  },
  completedSubtitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 30
  },
  resetButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 20
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16
  },
  linkButton: {
    marginTop: 20,
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 20
  },
  linkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600'
  },
  wordListTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20
  },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingVertical: 10,
    width: '100%'
  },
  wordText: {
    fontSize: 16,
    color: '#000'
  },
  wordMeaning: {
    fontSize: 16,
    color: '#444'
  }
});
