import { gql, useQuery } from '@apollo/client';
import { h } from 'preact';
import styled from 'styled-components';
import { Container } from '../../common/components/Container';
import { Body } from '../../common/components/Typography';
import { GetTabs } from '../../generated/GetTabs';
import { Tab } from './Tab';

const GET_TABS = gql`
  query GetTabs {
    getTabs {
      id
      trackTitle
      trackArtist
    }
  }
`;

export const Tabs = () => {
  const { data } = useQuery<GetTabs>(GET_TABS);

  return (
    <Container maxWidth={800} width={'100%'}>
      {data?.getTabs.length === 0 && <Body>No tabs yet</Body>}
      <Table>
        <tbody>
          {data?.getTabs.map((tab) => (
            <tr key={tab.id}>
              <td>{tab.trackTitle}</td>
              <td>{tab.trackArtist}</td>
            </tr>
          ))}
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
