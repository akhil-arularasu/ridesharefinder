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

const AlanCard = () => (
  <Card>
    <Image src='/Alan-Headshot-Small.jpg' wrapped ui={false} />
    <CardContent>
      <CardHeader>Alan Shnir</CardHeader>
      <CardMeta>
        <span className='date'>Since Aug 2023</span>
      </CardMeta>
      <CardDescription>
        Operations Lead
      </CardDescription>
    </CardContent>
  </Card>
)

export default AlanCard
