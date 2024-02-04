/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, { Component, useEffect } from 'react'
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
  Menu,
  Segment,
  Sidebar,
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
      content='Careers'
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
      content='Join the Team.'
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

const Careers = () => {
    useEffect(() => {
        // Dynamically load the Typeform embed script
        const script = document.createElement('script');
        script.src = "//embed.typeform.com/next/embed.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Remove the script when the component unmounts
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div style={{ width: '100%', overflow: 'hidden' }}>
            {/* Adjust the height as needed, or make it responsive */}
            <div style={{ position: 'relative', height: '500px', maxWidth: '100%' }}>
                <div data-tf-live="01HMPGK0ASWXVFAF59RFBVGFBB" style={{ position: 'absolute', top: '0', left: '50%', transform: 'translateX(-50%)', width: '100%', height: '100%' }}></div>
            </div>
        </div>
    );
};

export default Careers;