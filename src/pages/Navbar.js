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

  const isHomePage = location.pathname === '/Home';
  const isHomePageLower = location.pathname === '/home';
  const isAboutPage = location.pathname === '/About';
  const isAccountPage = location.pathname === '/Account';
  const isDashboardPage = location.pathname === '/Dashboard';
  const isLoginPage = location.pathname === '/Login';
  const isSignUpPage = location.pathname === '/SignUp';
  const isPasswordResetPage = location.pathname === '/PasswordReset';
  const isPasswordResetFinalPage = location.pathname === '/Reset_Password/:token';


  const toggleFixedMenu = (inView) => setFixed(!inView);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/Login');
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
              <Menu.Item as={NavLink} to="/Home" exact activeClassName="active">
                Home
              </Menu.Item>
              <Menu.Item as={NavLink} to="/About" activeClassName="active">
                About
              </Menu.Item>
              <Menu.Item as="a">Careers</Menu.Item>
              <Menu.Item position="right">
                {(isHomePage || isAboutPage || isPasswordResetPage || isHomePageLower || isPasswordResetFinalPage) && (
                  <>
                    <NavLink to="/Login">
                      <Button as="a" inverted={!fixed}>Log in</Button>
                    </NavLink>
                    <NavLink to="/SignUp">
                      <Button as="a" inverted={!fixed} primary={fixed} style={{ marginLeft: '0.5em' }}>
                        Sign Up
                      </Button>
                    </NavLink>
                  </>
                )}
                {(isAccountPage || isDashboardPage) && (
                  <>
                    {isAccountPage && (
                      <NavLink to="/Dashboard">
                        <Button as="a" inverted={!fixed}>Dashboard</Button>
                      </NavLink>
                    )}
                    {isDashboardPage && (
                      <NavLink to="/Account">
                        <Button as="a" inverted={!fixed}>Account</Button>
                      </NavLink>
                    )}
                    <Button as="a" inverted={!fixed} onClick={logout} style={{ marginLeft: '0.5em' }}>
                      Log Out
                    </Button>
                  </>
                )}
              {isLoginPage && (
                <NavLink to="/SignUp">
                  <Button as="a" inverted={!fixed}>Sign Up</Button>
                </NavLink>
              )}
              {isSignUpPage && (
                <NavLink to="/Login">
                  <Button as="a" inverted={!fixed}>Log In</Button>
                </NavLink>
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

  const isHomePage = location.pathname === '/Home';
  const isAboutPage = location.pathname === '/About';
  const isAccountPage = location.pathname === '/Account';
  const isDashboardPage = location.pathname === '/Dashboard';
  const isLoginPage = location.pathname === '/Login';
  const isSignUpPage = location.pathname === '/SignUp';

  const handleSidebarHide = () => setSidebarOpened(false);
  const handleToggle = () => setSidebarOpened(true);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/Login');
  };

  return (
    <Media as={Sidebar.Pushable} at="mobile">
      <Sidebar.Pushable>
        <Sidebar as={Menu} animation="overlay" onHide={handleSidebarHide} vertical visible={sidebarOpened}>
          <Menu.Item as={NavLink} to="/Home" exact activeClassName="active">
            Home
          </Menu.Item>
          <Menu.Item as={NavLink} to="/About" activeClassName="active">
            About
          </Menu.Item>
          <Menu.Item as="a">Careers</Menu.Item>
          {(isHomePage || isAboutPage) && (
            <>
              <Menu.Item as={NavLink} to="/Login">Log in</Menu.Item>
              <Menu.Item as={NavLink} to="/SignUp">Sign Up</Menu.Item>
            </>
          )}
          {(isAccountPage || isDashboardPage) && (
            <>
              {isAccountPage && (
                <Menu.Item as={NavLink} to="/Dashboard">Dashboard</Menu.Item>
              )}
              {isDashboardPage && (
                <Menu.Item as={NavLink} to="/Account">Account</Menu.Item>
              )}
              <Menu.Item onClick={logout}>Log Out</Menu.Item>
            </>
          )}
          {isLoginPage && (
          <NavLink to="/SignUp">
            <Button as="a" inverted>Sign Up</Button>
          </NavLink>
          )}
          {isSignUpPage && (
            <NavLink to="/Login">
              <Button as="a" inverted>Log In</Button>
            </NavLink>
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
