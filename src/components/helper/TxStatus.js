import React from 'react';
import { Alert } from 'react-bootstrap';

const TxStatus = (props) => {
  let status;
  switch (props.txStatus) {
    case 'pending':
      status = (
          <div>
              <Alert variant="warning">
                  <Alert.Text>Please approve MetaMask pop-up & wait for transaction to get processed.</Alert.Text>
              </Alert>
          </div>
      );
      break;
    case 'success':
      status = (
        <div>
          <Alert variant="success">
              <Alert.Text>Transaction successful. ({props.txHash})</Alert.Text>
          </Alert>
        </div>
      );
      break;
    case 'error':
      status = (
        <div>
          <Alert variant="danger">
              <Alert.Text>{props.txError}</Alert.Text>
          </Alert>
        </div>
      );
      break;
    default:
      status = null;
      break;
  }

  return status;
};

export default TxStatus;
