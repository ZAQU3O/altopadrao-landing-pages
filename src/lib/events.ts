type Listener = (payload: any) => void;

class NotificationBus {
  private listeners: Set<Listener> = new Set();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(payload: any) {
    for (const listener of this.listeners) {
      try {
        listener(payload);
      } catch (err) {
        console.error('Error in SSE listener:', err);
      }
    }
  }
}

const globalForEvents = globalThis as unknown as {
  notificationBus?: NotificationBus;
};

export const notificationBus =
  globalForEvents.notificationBus ?? new NotificationBus();

if (process.env.NODE_ENV !== 'production') {
  globalForEvents.notificationBus = notificationBus;
}

