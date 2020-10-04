import { h } from 'preact';
import { Card } from './Card';
import { Grid, GridArea } from './Grid';

export const Page: React.FC<{ title: string }> = ({ children, title }) => (
  <Grid
    padding={30}
    width="100%"
    gridTemplateRows={'1fr'}
    gridTemplateColumns={'1fr'}
    gridAreas={['page']}
  >
    <GridArea area={'page'}>
      <Card heading={title} width={'100%'} height={'100%'}>
        {children}
      </Card>
    </GridArea>
  </Grid>
);
