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

const SantosCard = () => (
  <Card>
    <Image src='/Santos-Headshot-Small.jpg' wrapped ui={false} />
    <CardContent>
      <CardHeader>Santos Torres</CardHeader>
      <CardMeta>
        <span className='date'>Since April 2024</span>
      </CardMeta>
      <CardDescription>
        UI/UX Design Team
      </CardDescription>
    </CardContent>
  </Card>
)

export default SantosCard
