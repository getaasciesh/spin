// @flow
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Commands from '../components/Commands';

import styles from './HomePage.css';

import * as SerialPort from 'serialport';
const Readline = require('@serialport/parser-readline')

type Props = {
};

export default class HomePage extends Component<Props> {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      ports: [],
      selectedPort: '',
      baudRate: 115200,
      isConnected: false,
      logs: ''
    };
  }

  componentDidMount() {
    this.timer = setInterval(async () => {
      const ports = await SerialPort.list();
      if (ports.length != this.state.ports.length) {
        this.setState({ports});
      }
    }, 500);
  }

  togglePortConnection() {
    if (this.port) {
      // close port
      this.port.unpipe(this.parser);
      this.port.close();
      this.port = null;
      this.parser = null;
      this.setState({isConnected: false});
    } else {
      this.port = new SerialPort(this.state.selectedPort, {
        baudRate: this.state.baudRate
      })
      this.parser = new Readline()
      this.port.pipe(this.parser)
      this.port.on('open', () => {
        this.setState({isConnected: true});
      })
      this.parser.on('data', (text) => {
        this.setState({
          logs: text + '\n' + this.state.logs
        })
      })
    }
  }

  convertToHex(str) {
    let arr = [];
    for (var i = 0, l = str.length; i < l; i ++) {
            var ascii = str.charCodeAt(i);
            arr.push(ascii);
    }
    arr.push(255);
    arr.push(255);
    arr.push(255);
    return new Buffer(arr);
  }

  writeToPort({hex, command}) {
    if (!this.port) return;
    this.setState({
      logs: `Sent command: ${command}` + '\n' + this.state.logs
    })
    if (hex) {
      command = Buffer.from(`${command}\r\n`)
    }
    this.port.write(command);
  }

  render() {
    const {selectedPort, ports, baudRate, isConnected, logs} = this.state;
    return (
      <React.Fragment>
        <div className={styles.itemsHolder}>
          <div className={styles.items}>
            <TextField
              id="outlined-select-port"
              select
              label="Port"
              className={styles.item}
              value={selectedPort}
              onChange={(e) => this.setState({selectedPort: e.target.value})}
              margin="normal"
              variant="outlined"
            >
              {ports.map(port => (
                <MenuItem key={port.comName} value={port.comName}>
                  {port.comName}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className={styles.items}>
            <TextField
              id="outlined-select-baudrate"
              label="Baud Rate"
              className={styles.item}
              value={baudRate}
              onChange={(e) => this.setState({selectedPort: e.target.value})}
              margin="normal"
              variant="outlined"
            >
              {ports.map(port => (
                <MenuItem key={port.comName} value={port.comName}>
                  {port.comName}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className={styles.items}>
            <Button size="large"
              disabled={!selectedPort}
              className={styles.item}
              onClick={() => this.togglePortConnection()}
              color={isConnected ? 'secondary' : 'primary'}
              variant="contained">
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </div>
        <div className={styles.cardHolder}>
          <Card className={styles.card}>
            <CardActionArea>
              <CardContent>
                <div className={styles.textFieldHolder}>
                  <TextField
                      id="outlined-multiline-static"
                      label="Logs"
                      multiline
                      disabled
                      value={this.state.logs}
                      className={styles.textField}
                      margin="normal"
                      variant="outlined"
                    />
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
          <Card className={styles.card}>
            <CardActionArea>
              <CardContent>
                <Commands onSend={(data) => this.writeToPort(data)} sendable={this.state.isConnected}/>
              </CardContent>
            </CardActionArea>
          </Card>
        </div>
      </React.Fragment>
    );
  }
}
