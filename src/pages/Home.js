/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, { Component, useState } from 'react'
import { InView } from 'react-intersection-observer'
import LogoCarousel from './LogoCarousel'; // Adjust the path as needed
import { Link } from 'react-router-dom';
import TestimonialsCarousel from './TestimonialsCarousel'
import ScrollMouse from './scrollMouse'; // Import ScrollMouse component
import LoomVideoModal from './LoomVideoModal.js'; // Adjust the path as needed
import UniversitiesMap from './UniversitiesMap.js'; // Adjust the path as needed

import {
  Button,
  Container,
  Divider,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Segment,
  Sidebar,
  Modal
} from 'semantic-ui-react'

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

/* Heads up!
 * HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled
 * components for such things.
 */
const HomepageHeading = ({ mobile }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

return (
  <Container text>
    <Header
      as='h1'
      content='TrypSync'
      inverted
      style={{
        fontSize: mobile ? '2em' : '4em',
        fontWeight: 'normal',
        marginBottom: 0,
        marginTop: mobile ? '1.5em' : '3em',
      }}
    />
    <Header
      as='h2'
      content='Connecting Students, One Tryp at a Time.'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
  <a href="/login">
    <Button primary size='huge'>
      Get Started
      <Icon name='right arrow' />
    </Button>
  </a>
  <br />
  <br />

  <Button primary size='medium' onClick={openModal}> {/* Adjust the size to 'medium' */}
  Demo <span style={{ marginRight: '10px' }}></span><Icon name='video' />
  </Button>
    <LoomVideoModal
        isOpen={isModalOpen}
        close={closeModal}
      />
    <br></br>
    <br></br>
    <br></br>
    <ScrollMouse /> {/* Add the ScrollMouse component here */}
  </Container>
)
    }

const SocialFollow = () => (
  <div style={{ position: 'absolute', bottom: 30, right: 20 }}>
    {/* LinkedIn Button */}
    <a href="https://www.linkedin.com/company/trypsync" target="_blank" rel="noopener noreferrer" style={{ marginRight: 10 }}>
      <Button icon circular color='linkedin'>
        <Icon name='linkedin' />
      </Button>
    </a>

    {/* Instagram Button */}
    <a href="https://www.instagram.com/trypsync" target="_blank" rel="noopener noreferrer" style={{ marginRight: 10 }}>
      <Button icon circular color='instagram'>
        <Icon name='instagram' />
      </Button>
    </a>

    {/* Email Button */}
    <a href="mailto:team@trypsync.com" target="_blank" rel="noopener noreferrer">
      <Button icon circular color='blue'>
        <Icon name='mail' />
      </Button>
    </a>
  </div>
);

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
  state = {}

  toggleFixedMenu = (inView) => this.setState({ fixed: !inView })

  render() {
    const { children } = this.props
    const { fixed } = this.state

    return (
      <Media greaterThan='mobile'>
          <Segment
            inverted
            textAlign='center'
            style={{ minHeight: 650, padding: '1em 0em' }}
            vertical
          >
            <Menu
              fixed={fixed ? 'top' : null}
              inverted={!fixed}
              pointing={!fixed}
              secondary={!fixed}
              size='large'
            >
            </Menu>
            <HomepageHeading />
          </Segment>

        {children}
      </Media>
    )
  }
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
}

class MobileContainer extends Component {
  render() {
    const { children } = this.props;

    return (
      <Media as={Sidebar.Pushable} at='mobile'>
        <Segment inverted textAlign='center' style={{ minHeight: 350, padding: '1em 0em' }} vertical>
          <HomepageHeading mobile /> {/* Pass the mobile prop to adjust styling for mobile screens */}
        </Segment>
        {children}
      </Media>
    );
  }
}

MobileContainer.propTypes = {
  children: PropTypes.node,
}

const ResponsiveContainer = ({ children }) => (
  /* Heads up!
   * For large applications it may not be best option to put all page into these containers at
   * they will be rendered twice for SSR.
   */
  <MediaContextProvider>
    <DesktopContainer>{children}</DesktopContainer>
    <MobileContainer>{children}</MobileContainer>
  </MediaContextProvider>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
}

const Home = () => (
  <ResponsiveContainer>
    <Segment style={{ padding: '8em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as='h3' style={{ fontSize: '2.33em' }}>
              Campus-Airport ridesharing has never been easier.
            </Header>
            <p style={{ fontSize: '1.33em' }}>
            Here at TrypSync, our mission is to leverage the power of technology to connect college students efficiently, making ridesharing easy, safe, and accessible. We're committed to reducing the environmental impact of travel and building community among students.            </p>
            <Header as='h3' style={{ fontSize: '2.33em' }}>
              Get Started Today.
            </Header>
            <p style={{ fontSize: '1.33em' }}>
            TrypSync is 100% free to use. All you need is a valid @edu email address from any of the schools in our <a href="#trypsync-network">network</a>. Once you <a href="/signup">sign up</a>, check your inbox to confirm your account and get started!            </p>
          </Grid.Column>
          <Grid.Column floated='right' width={6}>
            <Image size='medium' src='/RSF-Logo-full.png' />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign='center'>
          <a href="/about">
            <Button size='huge'>About Us</Button>
          </a>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>

    <Segment style={{ padding: '6em 0em' }} vertical>
      <Container text>
        <Header as='h3' style={{ fontSize: '2em' }}>
          Join our Team.
        </Header>
        <p style={{ fontSize: '1.33em' }}>
          As TrypSync expands to other colleges and universities throughout the United States, we are on the lookout for exceptional talent to join our versatile team. Interested areas of expertise include Web & Mobile Development, Social Media, Marketing and more.
        </p>
        <a href="https://fringe-base-ad9.notion.site/TrypSync-Careers-22c549c6b5a549d18fcc0c3cd26ebd7d?pvs=25">
          <Button as='a' size='large'>
            Jobs & Internships
          </Button>
        </a>

        <Divider
          as='h4'
          className='header'
          horizontal
          style={{ margin: '3em 0em', textTransform: 'uppercase' }}
        >
          <a href='#'>Student Testimonials</a>
        </Divider>

        <Header as='h3' style={{ fontSize: '1.5em' }}>
          What They're Saying About Us
        </Header>       
        <TestimonialsCarousel />

        <Divider 
          id="trypsync-network"
          as='h4'
          className='header'
          horizontal
          style={{ margin: '2em 0em', textTransform: 'uppercase' }}
        >
          <a href='#'>The TrypSync Network</a>
        </Divider>

        <Header as='h3' style={{ fontSize: '1em' }}>
        TrypSync offers a broad support network to a diverse range of colleges and universities. TrypSync is not directly affiliatied with any of the institutions we serve. 
        <br></br>
        <br></br>
        Want to partner with TrypSync at your school? Contact us at team@trypsync.com
        </Header>       
        <br></br>
        <UniversitiesMap />


      </Container>

    
      {
        /*
      <Segment style={{ padding: '4em 0em' }} vertical>
        <Container>
        <Divider
          as='h4'
          className='header'
          horizontal
          style={{ margin: '3em 0em', textTransform: 'uppercase' }}
        >
          <a href='#'>Supported Institutions</a>
          </Divider>
          <LogoCarousel />
        </Container>
      </Segment> */
      }
    </Segment>
    
    <Segment inverted vertical style={{ padding: '3em 0em' }}>
      <Container>
        <Grid divided inverted stackable>
          <Grid.Row>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='About' />
              <List link inverted>
                <List.Item as='a'>Contact Us</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={3}>
              <Header inverted as='h4' content='Services' />
              <List link inverted>
                <List.Item as={Link} to="/faq">FAQ</List.Item>
              </List>
            </Grid.Column>
            <Grid.Column width={7}>
              <Header as='h4' inverted>
                TrypSync
              </Header>
              <p>
              © Copyright 2024 RideShareFinder LLC. All Rights Reserved.
              </p>
              <p>An Akhil Arularasu Production :P
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
      <SocialFollow /> {/* Add this line inside the segment */}
    </Segment>
  </ResponsiveContainer>
)

export default Home