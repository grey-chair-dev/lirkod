import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useMusicPlayer } from '../contexts/MusicPlayerContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { playSong } = useMusicPlayer();

  const mockSongs = [
    {
      id: '1',
      title: 'Blinding Lights',
      artist: { id: '1', name: 'The Weeknd' },
      album: { id: '1', title: 'After Hours', coverImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' },
      duration: 200,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    },
    {
      id: '2',
      title: 'Levitating',
      artist: { id: '2', name: 'Dua Lipa' },
      album: { id: '2', title: 'Future Nostalgia', coverImage: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop' },
      duration: 203,
      audioUrl: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    },
  ];

  const handlePlaySong = (song: any) => {
    playSong(song);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good evening</Text>
        <Text style={styles.userName}>{user?.displayName || user?.username}</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Recently Played</Text>
        
        <View style={styles.songList}>
          {mockSongs.map((song) => (
            <TouchableOpacity
              key={song.id}
              style={styles.songItem}
              onPress={() => handlePlaySong(song)}
            >
              <Image source={{ uri: song.album.coverImage }} style={styles.albumCover} />
              <View style={styles.songInfo}>
                <Text style={styles.songTitle}>{song.title}</Text>
                <Text style={styles.artistName}>{song.artist.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Made for You</Text>
        
        <View style={styles.playlistGrid}>
          {mockSongs.map((song) => (
            <TouchableOpacity
              key={`playlist-${song.id}`}
              style={styles.playlistItem}
              onPress={() => handlePlaySong(song)}
            >
              <Image source={{ uri: song.album.coverImage }} style={styles.playlistCover} />
              <Text style={styles.playlistTitle}>{song.album.title}</Text>
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
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  userName: {
    fontSize: 16,
    color: '#b3b3b3',
    marginBottom: 16,
  },
  logoutButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#282828',
    borderRadius: 20,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
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
  songList: {
    marginBottom: 32,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 8,
  },
  albumCover: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 14,
    color: '#b3b3b3',
  },
  playlistGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  playlistItem: {
    width: '48%',
    marginBottom: 16,
  },
  playlistCover: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  playlistTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
});
