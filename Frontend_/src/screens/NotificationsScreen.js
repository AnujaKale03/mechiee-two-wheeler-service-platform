// screens/NotificationsScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  StatusBar, ActivityIndicator, RefreshControl, Alert,
} from 'react-native';
import {
  fetchNotifications, markAsRead, markAllRead, deleteNotification,
} from '../utils/notificationApi';

// Icon + colour per notification type
const TYPE_META = {
  BOOKING_CONFIRMED:  { icon: '🎉', color: '#22C55E' },
  BOOKING_CANCELLED:  { icon: '❌', color: '#F43F5E' },
  MECHANIC_ASSIGNED:  { icon: '🔧', color: '#38BDF8' },
  MECHANIC_EN_ROUTE:  { icon: '🚗', color: '#F59E0B' },
  SERVICE_COMPLETED:  { icon: '✅', color: '#22C55E' },
  INVOICE_READY:      { icon: '🧾', color: '#A78BFA' },
};

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function NotificationItem({ item, onPress, onDelete }) {
  const meta = TYPE_META[item.type] || { icon: '🔔', color: '#888' };
  return (
    <TouchableOpacity
      style={[styles.item, !item.read && styles.itemUnread]}
      onPress={() => onPress(item)}
      activeOpacity={0.75}
    >
      {/* Unread dot */}
      {!item.read && <View style={[styles.unreadDot, { backgroundColor: meta.color }]} />}

      {/* Icon */}
      <View style={[styles.iconWrap, { backgroundColor: meta.color + '22' }]}>
        <Text style={styles.iconText}>{meta.icon}</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.itemBody}  numberOfLines={2}>{item.body}</Text>
        <Text style={styles.itemTime}>{timeAgo(item.createdAt)}</Text>
      </View>

      {/* Delete */}
      <TouchableOpacity style={styles.deleteBtn} onPress={() => onDelete(item._id)}>
        <Text style={styles.deleteText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread]               = useState(0);
  const [page, setPage]                   = useState(1);
  const [hasMore, setHasMore]             = useState(true);
  const [loading, setLoading]             = useState(true);
  const [refreshing, setRefreshing]       = useState(false);

  const load = useCallback(async (p = 1, reset = false) => {
    try {
      const data = await fetchNotifications(p);
      setNotifications(prev => reset ? data.notifications : [...prev, ...data.notifications]);
      setUnread(data.unreadCount);
      setHasMore(p < data.pagination.pages);
      setPage(p);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(1, true); }, [load]);

  const onRefresh = () => { setRefreshing(true); load(1, true); };
  const onEndReached = () => { if (hasMore && !loading) load(page + 1); };

  const handlePress = async (item) => {
    if (!item.read) {
      await markAsRead(item._id);
      setNotifications(prev => prev.map(n => n._id === item._id ? { ...n, read: true } : n));
      setUnread(u => Math.max(0, u - 1));
    }
    // Navigate to the relevant screen
    const screen = item.booking ? 'BookingDetail' : 'Home';
    const params = item.booking ? { bookingId: item.booking._id } : {};
    navigation.navigate(screen, params);
  };

  const handleDelete = async (id) => {
    Alert.alert('Delete', 'Remove this notification?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteNotification(id);
          setNotifications(prev => prev.filter(n => n._id !== id));
        },
      },
    ]);
  };

  const handleMarkAllRead = async () => {
    await markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnread(0);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator color="#22C55E" size="large" />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F0F" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Notifications {unread > 0 && <Text style={styles.badge}> {unread}</Text>}
        </Text>
        {unread > 0 && (
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAll}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <NotificationItem item={item} onPress={handlePress} onDelete={handleDelete} />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#22C55E" />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySub}>You'll see booking updates and service alerts here</Text>
          </View>
        }
        contentContainerStyle={notifications.length === 0 && styles.emptyContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, backgroundColor: '#0F0F0F' },
  centered:{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F0F0F' },
  header:  { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 52, gap: 12 },
  back:    { fontSize: 22, color: '#888', marginRight: 4 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: '#FFF' },
  badge:   { color: '#22C55E', fontWeight: '700' },
  markAll: { fontSize: 13, color: '#22C55E', fontWeight: '600' },

  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    gap: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#1E1E1E',
    position: 'relative',
  },
  itemUnread: { backgroundColor: '#141414' },
  unreadDot: {
    position: 'absolute',
    left: 6,
    top: 20,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText:  { fontSize: 20 },
  content:   { flex: 1 },
  itemTitle: { color: '#FFF', fontWeight: '600', fontSize: 14, marginBottom: 3 },
  itemBody:  { color: '#888', fontSize: 13, lineHeight: 18 },
  itemTime:  { color: '#555', fontSize: 12, marginTop: 4 },
  deleteBtn: { padding: 4 },
  deleteText:{ color: '#444', fontSize: 16 },

  emptyContainer: { flex: 1 },
  empty:     { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyText: { color: '#FFF', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  emptySub:  { color: '#555', fontSize: 14, textAlign: 'center', paddingHorizontal: 40 },
});