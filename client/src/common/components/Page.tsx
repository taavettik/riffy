import { h } from 'preact';
import { MdArrowBack } from 'react-icons/md';
import { useHistory } from 'react-router';
import { Card } from './Card';
import { Container } from './Container';
import { Grid, GridArea } from './Grid';
import { IconButton } from './IconButton';
import { Spacing } from './Spacing';
import { Subheading } from './Typography';

export const Page: React.FC<{ title: string; showBackButton?: boolean }> = ({
  children,
  title,
  showBackButton,
}) => {
  const history = useHistory();
  return (
    <Grid
      padding={30}
      width="100%"
      gridTemplateRows={'1fr'}
      gridTemplateColumns={'1fr'}
      gridAreas={['page']}
    >
      <GridArea area={'page'}>
        <Card
          heading={
            <Container alignItems="center">
              {showBackButton ? (
                <>
                  <IconButton
                    onClick={() => history.goBack()}
                    icon={MdArrowBack}
                    size={32}
                  />
                  <Spacing dir="x" amount={16} />{' '}
                </>
              ) : null}
              <Subheading>{title}</Subheading>
            </Container>
          }
          width={'100%'}
          height={'100%'}
        >
          {children}
        </Card>
      </GridArea>
    </Grid>
  );
};
