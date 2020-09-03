import { h } from 'preact';
import styled from 'styled-components';
import { Tab } from './Tab';

export const Tabs = () => {
  return (
    <Table>
      <tbody>
        <tr>
          <td>Freud Marx Engels &amp; Jung</td>
          <td>Tämä kala pääsi karkuun</td>
        </tr>
      </tbody>
    </Table>
  );
};

const Table = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;

  td {
    border: 1px solid black;
    padding: 4px;
    margin: 0;
  }
`;
