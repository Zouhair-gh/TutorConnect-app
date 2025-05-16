import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = {};
    }

    connect(onConnect, onError) {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error('No auth token found');
            return;
        }

        this.client = new Client({
            brokerURL: 'ws://localhost:8080/ws',
            connectHeaders: {
                Authorization: `Bearer ${token}`
            },
            debug: function(str) {
                console.log(str);
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            webSocketFactory: () => new SockJS('http://localhost:8080/ws')
        });

        this.client.onConnect = (frame) => {
            console.log('Connected: ' + frame);
            onConnect && onConnect();
        };

        this.client.onStompError = (frame) => {
            console.error('Broker reported error: ' + frame.headers['message']);
            console.error('Additional details: ' + frame.body);
            onError && onError(frame);
        };

        this.client.activate();
    }

    subscribeToTutorNotifications(tutorId, callback) {
        if (!this.client || !this.client.connected) {
            console.error('WebSocket not connected');
            return;
        }

        const subscription = this.client.subscribe(
            `/topic/tutor/${tutorId}/notifications`,
            (message) => {
                callback(JSON.parse(message.body));
            }
        );

        this.subscriptions[`tutor-${tutorId}`] = subscription;
        return subscription;
    }

    disconnect() {
        if (this.client) {
            Object.values(this.subscriptions).forEach(sub => sub.unsubscribe());
            this.client.deactivate();
            console.log('Disconnected');
        }
    }
}

export default new WebSocketService();