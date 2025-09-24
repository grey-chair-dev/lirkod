import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

export default function LibraryScreen() {
  const mockPlaylists = [
    { id: '1', name: 'Liked Songs', songCount: 50 },
    { id: '2', name: 'My Playlist #1', songCount: 25 },
    { id: '3', name: 'Workout Mix', songCount: 30 },
    { id: '4', name: 'Chill Vibes', songCount: 40 },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Library</Text>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Create</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.filterBar}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Playlists</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Artists</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterButtonText}>Albums</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.playlistList}>
          {mockPlaylists.map((playlist) => (
            <TouchableOpacity key={playlist.id} style={styles.playlistItem}>
              <View style={styles.playlistIcon}>
                <Text style={styles.playlistIconText}>♪</Text>
              </View>
              <View style={styles.playlistInfo}>
                <Text style={styles.playlistName}>{playlist.name}</Text>
                <Text style={styles.playlistCount}>{playlist.songCount} songs</Text>
              </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  createButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#282828',
    borderRadius: 20,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  filterBar: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  filterButton: {
    marginRight: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#282828',
    borderRadius: 20,
  },
  filterButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  playlistList: {
    gap: 16,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  playlistIcon: {
    width: 50,
    height: 50,
    backgroundColor: '#282828',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  playlistIconText: {
    fontSize: 20,
    color: '#1db954',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  playlistCount: {
    fontSize: 14,
    color: '#b3b3b3',
  },
});
