import { h } from 'preact';
import { MdArrowBack } from 'react-icons/md';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { Card } from './Card';
import { Container } from './Container';
import { Grid, GridArea } from './Grid';
import { IconButton } from './IconButton';
import { Spacing } from './Spacing';
import { Subheading } from './Typography';

export const Page: React.FC<{
  title: JSX.Element | string;
  showBackButton?: boolean;
  backButtonLink?: string;
  actions?: JSX.Element;
}> = ({ children, backButtonLink, title, showBackButton, actions }) => {
  const history = useHistory();
  return (
    <Container height="100%" flexDirection="column">
      <Container width="100%" justifyContent="space-between" flexWrap="wrap">
        <Container minHeight="64px" alignItems="center">
          {showBackButton ? (
            <>
              <IconButton
                onClick={() =>
                  backButtonLink
                    ? history.push(backButtonLink)
                    : history.goBack()
                }
                icon={MdArrowBack}
                size={32}
              />
              <Spacing dir="x" amount={16} />{' '}
            </>
          ) : null}
          <Subheading>{title}</Subheading>
        </Container>

        <Container minHeight="64px">{actions ?? null}</Container>
      </Container>

      <Content>{children}</Content>
    </Container>
  );
};

const Content = styled(Container)`
  overflow: auto;
`;
