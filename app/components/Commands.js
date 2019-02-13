// @flow
import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';

import styles from './Commands.css';

type Props = {};

export default class Commands extends Component<Props> {
  props: Props;

  constructor(props) {
      super(props);
      this.state = {
          command: '',
          hex: false,
          save: false
      };
  }

  render() {
    const { hex, command, save } = this.state;
    return (
      <React.Fragment>
        <div className={styles.itemsHolder}>
          <FormControlLabel
              className={styles.itemCheck}
              control={
                  <Checkbox
                  checked={this.state.hex}
                  onChange={() => this.setState({hex: !hex})}
                  value="checkedA"
                  />
              }
              label="Hex"
          />
          <TextField
              className={styles.itemText}
              id="textfield-command"
              label="Command"
              value={command}
              onChange={(e) => this.setState({command: e.target.value})}
              margin="normal"
              variant="standard"
          >
          </TextField>
          <Button size="small"
              className={styles.itemBtn}
              disabled={!this.props.sendable}
              onClick={() => this.props.onSend({hex, command})}
              color={'primary'}
              variant="contained">
              Send
          </Button>
        </div>
        <Divider variant="middle" />
      </React.Fragment>
    );
  }
}
