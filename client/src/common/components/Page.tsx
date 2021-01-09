import { h } from 'preact';
import { MdArrowBack } from 'react-icons/md';
import { useHistory } from 'react-router';
import { Card } from './Card';
import { Container } from './Container';
import { Grid, GridArea } from './Grid';
import { IconButton } from './IconButton';
import { Spacing } from './Spacing';
import { Subheading } from './Typography';

export const Page: React.FC<{
  title: string;
  showBackButton?: boolean;
  backButtonLink?: string;
  actions?: JSX.Element;
}> = ({ children, backButtonLink, title, showBackButton, actions }) => {
  const history = useHistory();
  return (
    <Container padding={30} width="100%">
      <Card
        heading={
          <Container width="100%" justifyContent="space-between">
            <Container alignItems="center">
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
            <Container>{actions ?? null}</Container>
          </Container>
        }
        width={'100%'}
        height={'100%'}
      >
        {children}
      </Card>
    </Container>
  );
};
