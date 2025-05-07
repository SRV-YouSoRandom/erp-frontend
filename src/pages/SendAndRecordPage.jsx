import { Title } from '@mantine/core';
import SendAndRecordForm from '../components/SendAndRecordForm';

const SendAndRecordPage = () => {
  return (
    <div>
      <Title order={2} mb={20}>Send Tokens & Record Transaction</Title>
      <SendAndRecordForm />
    </div>
  );
};

export default SendAndRecordPage;