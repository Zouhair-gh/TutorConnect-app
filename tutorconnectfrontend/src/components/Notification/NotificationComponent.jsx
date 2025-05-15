import React, { useState, useEffect } from 'react';
import { useAuth } from '../../api/AuthContext';
import webSocketService from '../../api/websocket.service';
import { Bell, Check } from 'react-feather';

const NotificationComponent = () => {
    const { currentUser } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (!currentUser?.id) return;

        // Connect to WebSocket
        webSocketService.connect(
            () => {
                console.log('WebSocket connected, subscribing to notifications');
                webSocketService.subscribeToTutorNotifications(
                    currentUser.id,
                    (notification) => {
                        setNotifications(prev => [notification, ...prev]);
                        setUnreadCount(prev => prev + 1);
                    }
                );
            },
            (error) => {
                console.error('WebSocket error:', error);
            }
        );

        return () => {
            webSocketService.disconnect();
        };
    }, [currentUser]);

    const markAsRead = (id) => {
        // In a real app, you would call an API to mark as read
        setNotifications(prev =>
            prev.map(n => n.id === id ? {...n, read: true} : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const markAllAsRead = () => {
        // In a real app, you would call an API to mark all as read
        setNotifications(prev =>
            prev.map(n => ({...n, read: true}))
        );
        setUnreadCount(0);
    };

    return (
        <div className="dropdown">
            <button
                className="btn btn-link nav-link py-2 px-3 dropdown-toggle"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
                )}
            </button>

            {isOpen && (
                <div className="dropdown-menu dropdown-menu-end show" style={{ width: '300px' }}>
                    <div className="px-3 py-2 d-flex justify-content-between align-items-center border-bottom">
                        <h6 className="mb-0">Notifications</h6>
                        <button
                            className="btn btn-sm btn-link p-0"
                            onClick={markAllAsRead}
                        >
                            Mark all as read
                        </button>
                    </div>

                    <div className="notification-list" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {notifications.length === 0 ? (
                            <div className="px-3 py-3 text-center text-muted">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification, index) => (
                                <div
                                    key={index}
                                    className={`px-3 py-2 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                                >
                                    <div className="d-flex justify-content-between">
                                        <strong>{notification.title}</strong>
                                        {!notification.read && (
                                            <button
                                                className="btn btn-sm p-0"
                                                onClick={() => markAsRead(notification.id)}
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="small">{notification.message}</div>
                                    <div className="text-muted small">
                                        {new Date(notification.timestamp).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationComponent;