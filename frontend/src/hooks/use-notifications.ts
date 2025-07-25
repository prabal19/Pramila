
'use client';

import { useEffect, useCallback, useSyncExternalStore } from 'react';
import { useAuth } from './use-auth';
import type { Order, ReturnRequest } from '@/lib/types';
import { getUserOrders } from '@/lib/orders';
import { getUserReturns } from '@/lib/returns';

type StatusRecord = {
    [id: string]: string; // e.g., { "orderId123": "Shipped", "returnId456": "Approved" }
};

const SEEN_STATUS_KEY = 'pramila-seen-statuses';

// --- Global State Management ---
const listeners: Set<() => void> = new Set();
let state: {
    orders: Order[];
    returns: ReturnRequest[];
    seenStatuses: StatusRecord;
} = {
    orders: [],
    returns: [],
    seenStatuses: {},
};

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const setState = (newState: Partial<typeof state>) => {
  state = { ...state, ...newState };
  emitChange();
};

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

const getSnapshot = () => state;

const useNotificationsStore = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
// --- End Global State Management ---


export const useNotifications = () => {
    const store = useNotificationsStore();
    const { user } = useAuth();

    const getLocalStorageKey = useCallback(() => {
        return user ? `${SEEN_STATUS_KEY}-${user._id}` : null;
    }, [user]);

    // Load seen statuses from localStorage on user change
    useEffect(() => {
        const key = getLocalStorageKey();
        if (key) {
            try {
                const stored = localStorage.getItem(key);
                setState({ seenStatuses: stored ? JSON.parse(stored) : {} });
            } catch (error) {
                console.error("Failed to load seen statuses from localStorage", error);
                setState({ seenStatuses: {} });
            }
        } else {
             setState({ seenStatuses: {} });
        }
    }, [getLocalStorageKey]);

    // Fetch orders and returns periodically
    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                const [orders, returns] = await Promise.all([
                    getUserOrders(user._id),
                    getUserReturns(user._id),
                ]);
                setState({ orders, returns });
            } else {
                 setState({ orders: [], returns: [] });
            }
        };

        fetchData(); // Initial fetch
        const interval = setInterval(fetchData, 30000); // Poll every 30 seconds

        return () => clearInterval(interval);
    }, [user]);

    const updateSeenStatuses = (newSeen: StatusRecord) => {
        const key = getLocalStorageKey();
        if (key) {
             try {
                localStorage.setItem(key, JSON.stringify(newSeen));
                setState({ seenStatuses: newSeen });
            } catch (error) {
                console.error("Failed to save seen statuses to localStorage", error);
            }
        }
    }

    const orderNotificationCount = store.orders.filter(order => order.status !== store.seenStatuses[order._id]).length;
    const returnNotificationCount = store.returns.filter(ret => ret.status !== store.seenStatuses[ret._id]).length;
    const totalNotificationCount = orderNotificationCount + returnNotificationCount;

    const clearOrderNotifications = useCallback(() => {
        const newSeen = { ...store.seenStatuses };
        store.orders.forEach(order => {
            newSeen[order._id] = order.status;
        });
        updateSeenStatuses(newSeen);
    }, [store.orders, store.seenStatuses]);
    
    const clearReturnNotifications = useCallback(() => {
        const newSeen = { ...store.seenStatuses };
        store.returns.forEach(ret => {
            newSeen[ret._id] = ret.status;
        });
        updateSeenStatuses(newSeen);
    }, [store.returns, store.seenStatuses]);
    
    const clearAllNotifications = useCallback(() => {
       clearOrderNotifications();
       clearReturnNotifications();
    }, [clearOrderNotifications, clearReturnNotifications]);

    return {
        orderNotificationCount,
        returnNotificationCount,
        totalNotificationCount,
        clearOrderNotifications,
        clearReturnNotifications,
        clearAllNotifications,
    };
}
