import { Grid, GridArea } from '../../common/components/Grid';
import { h } from 'preact';
import { Card } from '../../common/components/Card';
import { Container } from '../../common/components/Container';
import { Heading, Subheading } from '../../common/components/Typography';
import { Tabs } from './Tabs';

export const Frontpage = () => {
  const gridAreas = ``;

  return (
    <Grid
      padding={30}
      width="100%"
      gridTemplateRows={'1fr'}
      gridTemplateColumns={'1fr'}
      gridAreas={['test']}
    >
      <GridArea area={'test'}>
        <Card heading={'My Tabs'} width={'100%'} height={'100%'}>
          <Tabs />
        </Card>
      </GridArea>
    </Grid>
  );
};
