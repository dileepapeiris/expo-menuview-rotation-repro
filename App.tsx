import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { MenuView, type MenuAction } from '@expo/ui/community/menu';

// Reproduction for https://github.com/expo/expo/issues/52194
// Full-width MenuView triggers on iOS measure unbounded and keep their first size after rotation.

const TITLES = [
  'Quarterly planning notes and follow-ups from the product design review meeting',
  'A longer headline that should wrap onto multiple lines instead of being clipped by the row',
  'Release checklist for the mobile application, including signing and store metadata',
];

const ACTIONS: MenuAction[] = [
  { id: 'open', title: 'Open', image: 'folder' },
  { id: 'share', title: 'Share', image: 'square.and.arrow.up' },
  { id: 'delete', title: 'Delete', attributes: { destructive: true }, image: 'trash' },
];

function Row({ title }: { title: string }) {
  return (
    <View style={styles.row} testID="row">
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>AB</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Tap to open · long-press for actions</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </View>
  );
}

export default function App() {
  const { width, height } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.heading}>MenuView width repro (#52194)</Text>
        <Text style={styles.hint}>
          {`Window ${Math.round(width)} × ${Math.round(height)}. `}
          Rotate the simulator (Cmd + Left/Right arrow). MenuView rows should wrap and reflow exactly like the plain rows.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.section}>MenuView, long-press (ContextMenu)</Text>
        {TITLES.map((title, index) => (
          <MenuView key={`ctx-${index}`} actions={ACTIONS} onPressAction={() => {}} shouldOpenOnLongPress>
            <Row title={title} />
          </MenuView>
        ))}

        <Text style={styles.section}>MenuView, tap (Menu)</Text>
        {TITLES.slice(0, 1).map((title, index) => (
          <MenuView key={`menu-${index}`} actions={ACTIONS} onPressAction={() => {}}>
            <Row title={title} />
          </MenuView>
        ))}

        <Text style={styles.section}>MenuView, small trigger (should hug content)</Text>
        <View style={styles.inlineRow}>
          <MenuView actions={ACTIONS} onPressAction={() => {}}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>More…</Text>
            </View>
          </MenuView>
          <Text style={styles.inlineText}>text after the trigger</Text>
        </View>

        <Text style={styles.section}>Plain React Native (reference)</Text>
        {TITLES.map((title, index) => (
          <Row key={`plain-${index}`} title={title} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 4 },
  heading: { fontSize: 22, fontWeight: '700', color: '#111' },
  hint: { fontSize: 13, lineHeight: 18, color: '#555' },
  content: { paddingHorizontal: 16, paddingBottom: 32 },
  section: {
    marginTop: 18,
    marginBottom: 8,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#888',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
    backgroundColor: '#f6f8fb',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4a6fa5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, fontWeight: '600', color: '#111' },
  subtitle: { marginTop: 2, fontSize: 12, color: '#777' },
  chevron: { fontSize: 26, lineHeight: 26, color: '#999' },
  inlineRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#e3ecf7',
  },
  pillText: { fontSize: 14, fontWeight: '600', color: '#1f4e8c' },
  inlineText: { fontSize: 14, color: '#555' },
});
