// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@venturo/react-ui';

const SamplePage = () => {
  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Sample page 2
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text ever
            since the 1500s
          </Typography>
          <Button variant="solid" color="primary">
            Click Me
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SamplePage;
