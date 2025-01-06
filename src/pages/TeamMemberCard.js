import React from 'react';
import {
  CardMeta,
  CardHeader,
  CardDescription,
  CardContent,
  Card,
  Image,
} from 'semantic-ui-react';

const TeamMemberCard = ({ imageSrc, name, since, description }) => (
  <Card>
    <Image src={imageSrc} wrapped ui={false} />
    <CardContent>
      <CardHeader>{name}</CardHeader>
      <CardMeta>
        <span className='date'>Since {since}</span>
      </CardMeta>
      <CardDescription>
        {description}
      </CardDescription>
    </CardContent>
  </Card>
);

export default TeamMemberCard;