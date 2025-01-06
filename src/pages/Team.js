import React from 'react';
import TeamMemberCard from './TeamMemberCard';

const Team = () => (
  <div>
    <TeamMemberCard 
      imageSrc="/Akhil-Headshot-Small.jpg" 
      name="Akhil Arularasu" 
      since="Jan 2023" 
      description="Founder & Full Stack Development" 
    />
    <TeamMemberCard 
      imageSrc="/Alan-Headshot-Small.jpg" 
      name="Alan Shnir" 
      since="Aug 2023" 
      description="Operations" 
    />
    <TeamMemberCard 
      imageSrc="/Santos-Headshot-Small.jpg" 
      name="Santos Torres" 
      since="April 2024" 
      description="UI/UX Design Team" 
    />
    <TeamMemberCard 
      imageSrc="/Zoe-Headshot-Small.jpg" 
      name="Zoe Bair" 
      since="April 2024" 
      description="UI/UX Design Team" 
    />
    <TeamMemberCard 
      imageSrc="/Chloe-Headshot-Small.jpg" 
      name="Chloe Au-Yeung" 
      since="June 2024" 
      description="UI/UX Design Team" 
    />

  </div>
);

export default Team;