
export interface Notification {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  patientName: string;
  mrNumber: string;
  timestamp: Date;
  read: boolean;
}

export const createCriticalVitalsNotification = (
  patientName: string,
  mrNumber: string,
  vitals: any
): Notification => {
  const criticalValues = [];
  
  if (vitals.systolic > 180) {
    criticalValues.push(`Systolic BP: ${vitals.systolic} mmHg (Critical)`);
  }
  
  if (vitals.spo2 < 90) {
    criticalValues.push(`SpO2: ${vitals.spo2}% (Critical)`);
  }

  return {
    id: `critical-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'critical',
    title: 'Critical Vitals Alert',
    message: `${patientName} (MR${mrNumber}) has critical vitals: ${criticalValues.join(', ')}`,
    patientName,
    mrNumber,
    timestamp: new Date(),
    read: false
  };
};

// Simple notification store for demo purposes
class NotificationStore {
  private notifications: Notification[] = [];
  private listeners: Array<(notifications: Notification[]) => void> = [];

  addNotification(notification: Notification) {
    this.notifications.unshift(notification);
    this.notifyListeners();
  }

  getNotifications() {
    return [...this.notifications];
  }

  markAsRead(id: string) {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.notifyListeners();
    }
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.getNotifications()));
  }
}

export const notificationStore = new NotificationStore();
