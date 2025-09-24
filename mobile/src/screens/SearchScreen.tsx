import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="What do you want to listen to?"
          placeholderTextColor="#535353"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Browse all</Text>
        
        <View style={styles.categoryGrid}>
          {[
            { name: 'Made For You', color: '#1db954' },
            { name: 'Recently Played', color: '#ff6b6b' },
            { name: 'Liked Songs', color: '#4ecdc4' },
            { name: 'Albums', color: '#45b7d1' },
            { name: 'Artists', color: '#96ceb4' },
            { name: 'Podcasts', color: '#feca57' },
          ].map((category, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.categoryItem, { backgroundColor: category.color }]}
            >
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#191414',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#282828',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#535353',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '48%',
    aspectRatio: 1.5,
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    justifyContent: 'flex-end',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});
