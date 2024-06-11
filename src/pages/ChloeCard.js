import React from 'react'
import {
  CardMeta,
  CardHeader,
  CardDescription,
  CardContent,
  Card,
  Icon,
  Image,
} from 'semantic-ui-react'

const ChloeCard = () => (
  <Card>
    <Image src='/Chloe-Headshot-Small.jpg' wrapped ui={false} />
    <CardContent>
      <CardHeader>Chloe Au-Yeung</CardHeader>
      <CardMeta>
        <span className='date'>Since June 2024</span>
      </CardMeta>
      <CardDescription>
        UI/UX Design Team
      </CardDescription>
    </CardContent>
  </Card>
)

export default ChloeCard
