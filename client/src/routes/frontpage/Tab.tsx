import { Container } from '../../common/components/Container';
import { h } from 'preact';
import { theme } from '../../common/theme';
import { Icon } from '../../common/components/Icon';
import { gql, useQuery } from '@apollo/client';

const EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

export const Tab = () => {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);
  console.log(data);

  return (
    <Container
      borderRadius={theme.borderRadius}
      background="white"
      padding={16}
      flexDirection={'column'}
      border={`1px solid ${theme.colors.gray.light}`}
      width={128}
    >
      <Container>
        <Icon size={128} icon="audiotrack" />
      </Container>
      <Container>Tämä kala pääsi karkuun</Container>
    </Container>
  );
};
