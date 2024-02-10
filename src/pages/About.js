/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import LogoCarousel from './LogoCarousel'; // Adjust the path as needed
import { NavLink } from 'react-router-dom';
import AkhilCard from './AkhilCard'; // Adjust the import path
import AreebCard from './AreebCard'; // Adjust the import path
import AlanCard from './AlanCard'; // Adjust the import path
import ScrollMouse from './scrollMouse'; // Import ScrollMouse component

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
  Checkbox
} from 'semantic-ui-react'

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

const SocialFollow = () => (
  <div style={{ position: 'absolute', bottom: 30, right: 20 }}>
    {/* LinkedIn Button */}
    <a href="https://www.linkedin.com/company/trypsync" target="_blank" rel="noopener noreferrer" style={{ marginRight: 10 }}>
      <Button icon circular color='linkedin'>
        <Icon name='linkedin' />
      </Button>
    </a>

    {/* Instagram Button */}
    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" style={{ marginRight: 10 }}>
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

/* Heads up!
 * HomepageHeading uses inline styling, however it's not the best practice. Use CSS or styled
 * components for such things.
 */
const HomepageHeading = ({ mobile }) => (
  <Container text>
    <Header
      as='h1'
      content='About Us'
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
      content='Learn Our Story.'
      inverted
      style={{
        fontSize: mobile ? '1.5em' : '1.7em',
        fontWeight: 'normal',
        marginTop: mobile ? '0.5em' : '1.5em',
      }}
    />
    <a href="/login">
    </a>
    <br></br>
    <br></br>
    <br></br>
    <ScrollMouse /> {/* Add the ScrollMouse component here */}
  </Container>
)

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
}

/* Heads up!
 * Neither Semantic UI nor Semantic UI React offer a responsive navbar, however, it can be implemented easily.
 * It can be more complicated, but you can create really flexible markup.
 */
class DesktopContainer extends Component {
  state = {}

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

const About = () => (
    <ResponsiveContainer>
    <Segment style={{ padding: '6em 0em' }} vertical>
      <Grid container stackable verticalAlign='middle'>
        <Grid.Row>
          <Grid.Column width={8}>
            <Header as='h3' style={{ fontSize: '2em' }}>
              Humble Beginnings.
            </Header>
            <p style={{ fontSize: '1.33em' }}>
            TrypSync (Formerly RideShareFinder) began in January 2023 as a small project I created to address the flood of rideshare requests in the Oxford College chat. I never imagined it would gain so much widespread support and usage by Oxford and Emory students! 
            Today, TrypSync has grown into a small organization with a single goal of leveraging technology for hassle-free, cost-effective, and sustainable transportation for college students nationwide.
            <br></br>
            <br></br>

            - Akhil Arularasu, Founder of TrypSync
            <br></br>
            (Oxford College Class of 2024 | Emory University Class of 2026)

            </p>

            <Header as='h3' style={{ fontSize: '2em' }}>
              What is TrypSync?
            </Header>
            <p style={{ fontSize: '1.33em' }}>
            TrypSync is a web service specifically designed to facilitate campus-based ridesharing within college communities. Students can either 'Create' or 'Join' Ride Groups to rideshare from or to their desired destinations, promoting safe carpooling among students.         </p>
          </Grid.Column>
          <Grid.Column floated='right' width={6}>
            <Image size='medium' src='/RSF-Logo-full.png' />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
        </Grid.Row>
      </Grid>
        </Segment>

    <Segment style={{ padding: '2em 0em' }} vertical>
  <Container text>
    <Divider
      as='h4'
      className='header'
      horizontal
      style={{ margin: '3em 0em', textTransform: 'uppercase' }}
    >
      <a href='#'>Why TrypSync</a>
    </Divider>

    <Header as='h3' style={{ fontSize: '2em', textAlign: 'center' }}>
      Why Choose Us?
    </Header>
    <p style={{ fontSize: '1.33em', textAlign: 'center' }}>
      Built <b>For</b> Students <b>By</b> Students:
    </p>
    <div style={{ textAlign: 'center' }}>
      <List style={{ display: 'inline-block', textAlign: 'left' }}>
        <List.Item>
          <Checkbox label='Efficient and Safe RideSharing' defaultChecked readOnly/>
        </List.Item>
        <List.Item>
          <Checkbox label='Environmentally Friendly Commuting' defaultChecked readOnly/>
        </List.Item>
        <List.Item>
          <Checkbox label='Community Building Among Students' defaultChecked readOnly/>
        </List.Item>
        <List.Item>
          <Checkbox label='Simple, Easy-to-Use Platform' defaultChecked readOnly/>
        </List.Item>
        <List.Item>
          <Checkbox label='Cost-Effective Travel Solutions' defaultChecked readOnly/>
        </List.Item>
      </List>
    </div>
  </Container>

  <Container text>
  <Divider
    as='h4'
    className='header'
    horizontal
    style={{ margin: '3em 0em', textTransform: 'uppercase' }}
  >
    <a href='#'>In the Media</a>
  </Divider>
  
  <ul style={{ fontSize: '1.1em', textAlign: 'left' }}>
    <li><a href="https://emorywheel.com/need-an-uber-emorys-new-rideshare-website-has-you-covered/">“Need an Uber? Emory’s new rideshare website has you covered”</a> - <em>The Emory Wheel</em>, January 2023</li>
  </ul>

  <Divider
    as='h4'
    className='header'
    horizontal
    style={{ margin: '3em 0em', textTransform: 'uppercase' }}
  >
    <a href='#'>Awards</a>
  </Divider>
  <ul style={{ fontSize: '1.1em', textAlign: 'left' }}>
    <li>2024 Global Student Entrepreneur Awards (GSEA) Competition Atlanta Chapter Runner Up - <em>Entreprenurs' Organization (EO) Atlanta Chapter</em>, February 2024</li>
  </ul>

  <Divider
    as='h4'
    className='header'
    horizontal
    style={{ margin: '3em 0em', textTransform: 'uppercase' }}
  >
    <a href='#'>What's Next</a>
  </Divider>
  <p style={{ fontSize: '1.33em', textAlign: 'center' }}>
    Improvement and Expansion. 🌎🚀
  </p>
</Container>
</Segment>

    {/* Segment for Cards */}
    <Segment style={{ padding: '2em 0em' }} vertical>
      <Container>
      <Divider
      as='h4'
      className='header'
      horizontal
      style={{ margin: '3em 0em', textTransform: 'uppercase' }}
    >
      <a href='#'>Meet the Team</a>
    </Divider>
    <div style={{ textAlign: 'center' }}>
        <Grid stackable columns={3}>
        <Grid.Column>
            <div style={{ maxWidth: '250px', margin: 'auto' }}>
              <AkhilCard />
            </div>
          </Grid.Column>
          <Grid.Column>
            <div style={{ maxWidth: '250px', margin: 'auto' }}>
              <AreebCard />
            </div>
          </Grid.Column>
          <Grid.Column>
            <div style={{ maxWidth: '250px', margin: 'auto' }}>
              <AlanCard />
            </div>
          </Grid.Column>
        </Grid>
        </div>
      </Container>
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
                <List.Item as='a'>FAQ</List.Item>
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
);

export default About