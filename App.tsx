import { MenuView } from '@expo/ui/community/menu';
import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

// Repro for https://github.com/expo/expo/issues/52194
//
// The same row is rendered twice: wrapped in MenuView, and plain.
// Expected: both fill the screen width and the long title wraps.
// Actual (iOS): the MenuView row is wider than the screen, the title
// doesn't wrap and the chevron is cut off. After rotating the device
// and back, the MenuView row keeps its old size.

const titles = [
  'test test test test test test test test test test test test test test',
  'hello hello hello hello hello hello hello hello hello hello hello hello',
  'row row row row row row row row row row row row row row row row row row',
];

const actions = [
  { id: 'open', title: 'Open' },
  { id: 'share', title: 'Share' },
];

function Row({ title }: { title: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.chevron}>›</Text>
    </View>
  );
}

export default function App() {
  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.heading}>Inside MenuView</Text>
        {titles.map((title) => (
          <MenuView key={title} actions={actions} shouldOpenOnLongPress>
            <Row title={title} />
          </MenuView>
        ))}

        <Text style={styles.heading}>Plain</Text>
        {titles.map((title) => (
          <Row key={title} title={title} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingTop: 72 },
  heading: { fontSize: 13, fontWeight: '600', color: '#888', marginTop: 24, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  title: { flex: 1, fontSize: 16 },
  chevron: { fontSize: 24, color: '#999', marginLeft: 8 },
});
