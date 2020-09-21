import { h } from 'preact';
import styled from 'styled-components';
import { Container } from '../../common/components/Container';
import { Tab } from './Tab';

export const Tabs = () => {
  return (
    <Container maxWidth={800} width={'100%'}>
      <Table>
        <tbody>
          <tr>
            <td>Freud Marx Engels &amp; Jung</td>
            <td>Tämä kala pääsi karkuun</td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

const Table = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;

  td {
    border-bottom: 1px solid black;
    cursor: pointer;
    padding: 4px;
    margin: 0;
  }

  tr {
    &:hover {
      background-color: ${(props) => props.theme.colors.primary.lightest};
    }
  }
`;
