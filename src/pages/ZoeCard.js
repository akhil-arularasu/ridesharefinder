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

const ZoeCard = () => (
  <Card>
    <Image src='/Zoe-Headshot-Small.jpg' wrapped ui={false} />
    <CardContent>
      <CardHeader>Zoe Bair</CardHeader>
      <CardMeta>
        <span className='date'>Since April 2024</span>
      </CardMeta>
      <CardDescription>
        UI/UX Design Team
      </CardDescription>
    </CardContent>
  </Card>
)

export default ZoeCard
