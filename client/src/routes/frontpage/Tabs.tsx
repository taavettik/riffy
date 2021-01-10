import { gql, useQuery } from '@apollo/client';
import { h } from 'preact';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Container } from '../../common/components/Container';
import { Spacing } from '../../common/components/Spacing';
import { Body, Heading, Subheading } from '../../common/components/Typography';
import { GetTabs } from '../../generated/GetTabs';
import { useEffect } from 'preact/hooks';
import { AddIcon } from '../../common/icons';

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
  const { data, refetch } = useQuery<GetTabs>(GET_TABS);

  useEffect(() => {
    refetch();
  }, []);

  return (
    <Container maxWidth={800} width={'100%'} flexDirection="column">
      <Subheading>My tabs</Subheading>

      <Spacing dir="y" amount={16} />

      {data?.getTabs.map((tab) => (
        <Row key={tab.id}>
          <TableLink to={`/tab/${tab.id}`}>{tab.trackTitle}</TableLink>
          <TableLink to={`/tab/${tab.id}`}>{tab.trackArtist}</TableLink>
        </Row>
      ))}
      <Row>
        <TableLink to="/create">
          <AddIcon size={32} />
          <Spacing dir="x" amount={16} />
          <Body>Create tab</Body>
        </TableLink>
      </Row>
    </Container>
  );
};

const Row = styled(Container)`
  border-bottom: 1px solid black;
  width: 100%;
  flex-wrap: wrap;
`;

const TableLink = styled(Link)`
  display: flex;
  align-items: center;
  flex-direction: row;
  text-decoration: none;
  color: black;
  min-height: 40px;
  min-width: 200px;
  display: flex;
  padding-left: 4px;
  &:hover {
    background-color: ${(props) => props.theme.colors.primary.lightest};
  }
  flex: 1;
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
