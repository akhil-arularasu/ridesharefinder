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

const AkhilCard = () => (
  <Card>
    <Image src='/Akhil-Headshot-Small.jpg' wrapped ui={false} />
    <CardContent>
      <CardHeader>Akhil Arularasu</CardHeader>
      <CardMeta>
        <span className='date'>Since Jan 2023</span>
      </CardMeta>
      <CardDescription>
        Founder & Tech Lead
      </CardDescription>
    </CardContent>
  </Card>
)

export default AkhilCard
