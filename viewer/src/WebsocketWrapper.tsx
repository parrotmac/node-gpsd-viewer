import React from 'react';

interface WebsocketProps {
    url: string
    onMessage: (data: string) => void
    onOpen?: () => void
    onClose?: () => void,
    debug?: boolean,
    reconnect: boolean,
    protocol?: string,
    reconnectIntervalInMilliSeconds?: number
};

interface WebsocketState {
    ws: WebSocket
    attempts: number
}

class WebsocketWrapper extends React.Component<WebsocketProps, WebsocketState> {
    public static defaultProps = {
        debug: false,
        reconnect: true
    }

    private shouldReconnect: boolean;
    private timeoutID: any; // Handle returned by `setTimeout`

    constructor(props: any) {
        super(props);
        this.shouldReconnect = this.props.reconnect;
        this.state = {
            ws: new WebSocket(this.props.url, this.props.protocol),
            attempts: 1,
        };
        this.sendMessage = this.sendMessage.bind(this);
        this.setupWebsocket = this.setupWebsocket.bind(this);
    }

    logging(logline: string) {
        if (this.props.debug === true) {
            console.log(logline);
        }
    }

    generateInterval(attempts: number) {
        if (this.props.reconnectIntervalInMilliSeconds) {
            return this.props.reconnectIntervalInMilliSeconds;
        }
        return Math.min(30, (Math.pow(2, attempts) - 1)) * 1000;
    }

    setupWebsocket() {
        let websocket = this.state.ws;

        websocket.onopen = () => {
            this.logging('Websocket connected');
            if (typeof this.props.onOpen === 'function') this.props.onOpen();
        };

        websocket.onmessage = (evt) => {
            this.props.onMessage(evt.data);
        };

        websocket.onclose = () => {
            this.logging('Websocket disconnected');
            if (typeof this.props.onClose === 'function') this.props.onClose();
            if (this.shouldReconnect) {
                let time = this.generateInterval(this.state.attempts);
                this.timeoutID = setTimeout(() => {
                    this.setState({ attempts: this.state.attempts + 1 });
                    this.setState({ ws: new WebSocket(this.props.url, this.props.protocol) });
                    this.setupWebsocket();
                }, time);
            }
        }
    }

    componentDidMount() {
        this.setupWebsocket();
    }

    componentWillUnmount() {
        this.shouldReconnect = false;
        clearTimeout(this.timeoutID);
        let websocket = this.state.ws;
        websocket.close();
    }

    sendMessage(message: string) {
        let websocket = this.state.ws;
        websocket.send(message);
    }

    render() {
        return this.props.children || null;
    }
}

export default WebsocketWrapper;
