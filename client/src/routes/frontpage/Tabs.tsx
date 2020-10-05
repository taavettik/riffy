import { gql, useQuery } from '@apollo/client';
import { h } from 'preact';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '../../common/components/Container';
import { Icon } from '../../common/components/Icon';
import { Spacing } from '../../common/components/Spacing';
import { Body } from '../../common/components/Typography';
import { GetTabs } from '../../generated/GetTabs';

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
    <Container maxWidth={800} width={'100%'} flexDirection="column">
      <Table>
        <tbody>
          {data?.getTabs.map((tab) => (
            <tr key={tab.id}>
              <td>
                <TableLink to={`/tab/${tab.id}`}>{tab.trackTitle}</TableLink>
              </td>
              <td>
                <TableLink to={`/tab/${tab.id}`}>{tab.trackArtist}</TableLink>
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2}>
              <TableLink to="/create">
                <Icon icon="add_circle" />
                <Spacing dir="x" amount={16} />
                <Body>Create tab</Body>
              </TableLink>
            </td>
          </tr>
        </tbody>
      </Table>
    </Container>
  );
};

const TableLink = styled(Link)`
  display: flex;
  align-items: center;
  flex-direction: row;
  text-decoration: none;
  color: black;
  height: 40px;
  display: flex;
  padding-left: 4px;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary.lightest};
  }
`;

const Table = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;

  td {
    border-bottom: 1px solid black;
    cursor: pointer;
    margin: 0;
    padding: 0;
  }

  tr {
  }
`;
