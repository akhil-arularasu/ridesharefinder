import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { createMedia } from '@artsy/fresnel';
import PropTypes from 'prop-types';
import { InView } from 'react-intersection-observer';
import {
  Button,
  Container,
  Menu,
  Segment,
  Sidebar,
  Icon,
} from 'semantic-ui-react';

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
});

const DesktopContainer = ({ children }) => {
  const [fixed, setFixed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/home';
  const isAboutPage = location.pathname === '/about';
  const isAccountPage = location.pathname === '/account';
  const isDashboardPage = location.pathname === '/dashboard';
  const isLoginPage = location.pathname === '/login';
  const isSignUpPage = location.pathname === '/signup';
  const isPasswordResetPage = location.pathname === '/passwordreset';
  const isPasswordResetFinalPage = location.pathname === '/reset_password/:token';
  const isFaqPage = location.pathname === '/faq';

  const toggleFixedMenu = (inView) => setFixed(!inView);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Function to check if the current page is NOT Dashboard or Account
  const isNotDashboardOrAccountPage = () => {
    return location.pathname !== '/dashboard' && location.pathname !== '/account';
  };


  return (
    <Media greaterThan="mobile">
      <InView onChange={toggleFixedMenu}>
        <Segment inverted textAlign="center" style={{ minHeight: 100, padding: '1em 0em' }} vertical>
          <Menu fixed={fixed ? 'top' : null} inverted={!fixed} pointing={!fixed} secondary={!fixed} size="large">
            <Container>
            <Menu.Item style={{ top: '0.55em' }}>
                <img alt="logo" src="RSF-Logo-Icon.png" />
            </Menu.Item>

            { isNotDashboardOrAccountPage() && (
              <>
              <Menu.Item as={NavLink} to="/home" exact activeClassName="active">
                Home
              </Menu.Item>
              <Menu.Item as={NavLink} to="/about" activeClassName="active">
                About
              </Menu.Item>
              <Menu.Item as='a' href="https://fringe-base-ad9.notion.site/TrypSync-Careers-22c549c6b5a549d18fcc0c3cd26ebd7d?pvs=25" target="_blank" rel="noopener noreferrer">
                Careers
              </Menu.Item>
              <Menu.Item as={NavLink} to="/faq" activeClassName="active">
                FAQ
              </Menu.Item>

              </>
            )}
              <Menu.Item position="right">
                {(isHomePage || isAboutPage || isPasswordResetPage || isPasswordResetFinalPage || isFaqPage) && (
                  <>
                    <NavLink to="/login">
                      <Button as="a" inverted={!fixed}>Log in</Button>
                    </NavLink>
                    <NavLink to="/signup">
                      <Button as="a" inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }}>
                        Sign Up
                      </Button>
                    </NavLink>
                    <NavLink to="https://calendly.com/helloakhil/30min" target="_blank">
                      <Button as="a" inverted={!fixed} style={{ marginLeft: '0.5em' }}>
                        Free Coffee
                      </Button>
                    </NavLink>
                  </>
                )}
                {(isAccountPage || isDashboardPage) && (
                  <>
                    {isAccountPage && (
                      <NavLink to="/dashboard">
                        <Button as="a" inverted={!fixed}>Dashboard</Button>
                      </NavLink>
                    )}
                    {isDashboardPage && (
                      <NavLink to="/account">
                        <Button as="a" inverted={!fixed}>Account</Button>
                      </NavLink>
                    )}
                    <Button as="a" inverted={!fixed} onClick={logout} style={{ marginLeft: '0.5em' }}>
                      Log Out
                    </Button>
                    <NavLink to="https://calendly.com/helloakhil/30min" target="_blank">
                      <Button as="a" inverted={!fixed} style={{ marginLeft: '0.5em' }}>
                        Free Coffee
                      </Button>
                    </NavLink>
                  </>
                )}
              {isLoginPage && (
                <>
                <NavLink to="/signup">
                  <Button as="a" inverted={!fixed}>Sign Up</Button>
                </NavLink>
                    <NavLink to="https://calendly.com/helloakhil/30min" target="_blank">
                    <Button as="a" inverted={!fixed} style={{ marginLeft: '0.5em' }}>
                      Free Coffee
                    </Button>
                  </NavLink>
                </>              
              )}
              {isSignUpPage && (
                <>
                <NavLink to="/login">
                  <Button as="a" inverted={!fixed}>Log In</Button>
                </NavLink>
                <NavLink to="https://calendly.com/helloakhil/30min" target="_blank">
                  <Button as="a" inverted={!fixed} style={{ marginLeft: '0.5em' }}>
                    Free Coffee
                  </Button>
                </NavLink>
              </>
              )}
              </Menu.Item>
            </Container>
          </Menu>
        </Segment>
      </InView>
      {children}
    </Media>
  );
};

DesktopContainer.propTypes = {
  children: PropTypes.node,
};

const MobileContainer = ({ children }) => {
  const [sidebarOpened, setSidebarOpened] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isHomePage = location.pathname === '/home';
  const isAboutPage = location.pathname === '/about';
  const isAccountPage = location.pathname === '/account';
  const isDashboardPage = location.pathname === '/dashboard';
  const isLoginPage = location.pathname === '/login';
  const isSignUpPage = location.pathname === '/signup';
  const isPasswordResetPage = location.pathname === '//passwordreset'
  const isFaqPage = location.pathname === '/faq';

  const handleSidebarHide = () => setSidebarOpened(false);
  const handleToggle = () => setSidebarOpened(true);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Media as={Sidebar.Pushable} at="mobile">
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation="overlay" onHide={handleSidebarHide} vertical visible={sidebarOpened}>
          <Menu.Item as={NavLink} to="/home" exact activeClassName="active">
            Home
          </Menu.Item>
          <Menu.Item as={NavLink} to="/about" activeClassName="active">
            About
          </Menu.Item>
          <Menu.Item as='a' href="https://fringe-base-ad9.notion.site/TrypSync-Careers-22c549c6b5a549d18fcc0c3cd26ebd7d?pvs=25" target="_blank" rel="noopener noreferrer">
            Careers
          </Menu.Item>
          <Menu.Item as={NavLink} to="/faq" activeClassName="active">
            FAQ
          </Menu.Item>
          {(isHomePage || isAboutPage || isFaqPage || isPasswordResetPage) && (
            <>
              <Menu.Item as={NavLink} to="/login">Log in</Menu.Item>
              <Menu.Item as={NavLink} to="/signup">Sign Up</Menu.Item>
            </>
          )}
          {(isAccountPage || isDashboardPage) && (
            <>
              {isAccountPage && (
                <Menu.Item as={NavLink} to="/dashboard">Dashboard</Menu.Item>
              )}
              {isDashboardPage && (
                <Menu.Item as={NavLink} to="/account">Account</Menu.Item>
              )}
              <Menu.Item onClick={logout}>Log Out</Menu.Item>
            </>
          )}
          {isLoginPage && (
                <Menu.Item as={NavLink} to="/signup">Sign Up</Menu.Item>
          )}
          {isSignUpPage && (
                <Menu.Item as={NavLink} to="/login">Log In</Menu.Item>
                )}
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment inverted textAlign="center" style={{ minHeight: 150, padding: '1em 0em' }} vertical>
            <Container>
              <Menu inverted pointing secondary size="large">
                <Menu.Item onClick={handleToggle}>
                  <Icon name="sidebar" />
                </Menu.Item>
                <Menu.Item position="right">
                  {/* You can add additional items here if necessary */}
                </Menu.Item>
              </Menu>
            </Container>
          </Segment>
          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Media>
  );
};

MobileContainer.propTypes = {
  children: PropTypes.node,
};

const Navbar = () => (
  <MediaContextProvider>
    <DesktopContainer />
    <MobileContainer />
  </MediaContextProvider>
);

export default Navbar;
