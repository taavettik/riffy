import { h } from 'preact';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Container } from '../../common/components/Container';
import { Spacing } from '../../common/components/Spacing';
import { Subheading } from '../../common/components/Typography';

export const RecentTabs = () => {
  return (
    <Container flexDirection="column">
      <Subheading>Recently viewed</Subheading>

      <Spacing dir="y" amount={16} />

      <TabLink to="/">hello world</TabLink>
    </Container>
  );
};

const TabLink = styled(Link)`
  color: black;
  min-height: 40px;
  display: flex;
  width: 100%;
  text-decoration: none;
  border-bottom: 1px solid black;
  vertical-align: middle;
  align-items: center;

  :hover {
    color: ${(p) => p.theme.colors.primary.darkest};
    border-color: ${(p) => p.theme.colors.primary.darkest};
  }
`;
