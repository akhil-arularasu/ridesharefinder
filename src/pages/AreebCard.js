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

const AreebCard = () => (
  <Card>
    <Image src='/Areeb-Headshot-Small.jpg' wrapped ui={false} />
    <CardContent>
      <CardHeader>Areeb Maqbool Ahmed</CardHeader>
      <CardMeta>
        <span className='date'>Since Aug 2023</span>
      </CardMeta>
      <CardDescription>
        Finance Lead
      </CardDescription>
    </CardContent>
  </Card>
)

export default AreebCard
