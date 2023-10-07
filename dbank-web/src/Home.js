/* eslint-disable max-classes-per-file */
/* eslint-disable react/no-multi-comp */

import { createMedia } from '@artsy/fresnel'
import PropTypes from 'prop-types'
import React, {  useState, useEffect } from 'react'
import { InView } from 'react-intersection-observer'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
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
  Tab,
  Message,
} from 'semantic-ui-react'
import conf from './conf'

const { MediaContextProvider, Media } = createMedia({
  breakpoints: {
    mobile: 0,
    tablet: 768,
    computer: 1024,
  },
})

const HomepageHeading = ({ mobile, available, logIn }) => {
  return (
    <Container text>
      <Image alt="logo" style={{ marginTop: '6em', marginBottom: '6em' }} src='/images/logo.003.png' centered />
      <Header
        as='h1'
        style={{
          fontSize: mobile ? '2em' : '4em',
          fontWeight: 'normal',
          marginTop: mobile ? '0' : '0',
        }}
      >
        <span style={{color: 'gold'}}>Quantum AI LLM Hyper Ledger Bank-as-a-Service VUI and API</span>
      </Header>
      <Header
        as='h2'
        style={{
          fontSize: mobile ? '1.1em' : '2.2em',
          fontWeight: 'normal',
          marginTop: mobile ? '0.25em' : '0.5em',
          marginBottom: '2em',
        }}
      >
        <span style={{color: 'dimgray'}}>Save Money with Decentralized Bank</span>
      </Header>
      <Button
        style={{
          marginBottom: '5em',
        }}
        color='orange' size='huge' onClick={() => logIn(false)}
      >
        { available ? 'Get Started' : 'Join a Whitelist' }
        <Icon name='right arrow' />
      </Button>
    </Container>
  )
}

HomepageHeading.propTypes = {
  mobile: PropTypes.bool,
  available: PropTypes.bool.isRequired,
  logIn: PropTypes.func.isRequired,
}

const DesktopContainer = ({ children, available, logIn }) => {
  const [ fixed, setFixed ] = useState(false)

  return (
    <Media greaterThan='mobile'>
      <InView onChange={(inView) => setFixed(!inView)}>
        <Segment
          textAlign='center'
          style={{ minHeight: 700, padding: '1em 0em' }}
        >
          <Menu
            fixed={fixed ? 'top' : null}
            pointing={!fixed}
            secondary={!fixed}
            size='large'
          >
            <Container>
              <Menu.Item active>
                <Image avatar alt="logo" src='/images/android-chrome-192x192.png' />
                <Link to='/'> {' '} Home</Link>
              </Menu.Item>
              <Menu.Item position='right'>
                { available ? (
                  <>
                    <Button as='a' onClick={() => logIn(true)} >
                      Log In
                    </Button>
                    <Button as='a' primary={fixed} style={{ marginLeft: '0.5em' }} onClick={() => logIn(false)} >
                      Sign up
                    </Button>
                  </>
                ) : (
                  <Button onClick={logIn}>
                    Join a Whitelist
                  </Button>
                )}
              </Menu.Item>
            </Container>
          </Menu>
          <HomepageHeading available={available} logIn={logIn}/>
        </Segment>
      </InView>

      {children}
    </Media>
  )
}

DesktopContainer.propTypes = {
  children: PropTypes.node,
  available: PropTypes.bool.isRequired,
  logIn: PropTypes.func.isRequired,
}

const MobileContainer = ({ children, available, logIn }) => {
  const [ sidebarOpened, setSidebarOpened ] = useState(false)

  return (
    <Media as={Sidebar.Pushable} at='mobile'>
      <Sidebar.Pushable>
        <Sidebar
          as={Menu}
          animation='overlay'
          onHide={() => setSidebarOpened(false)}
          vertical
          visible={sidebarOpened}
        >
          <Menu.Item active>
            <Link to='/'>Home</Link>
          </Menu.Item>
          { available ? (
            <>
              <Menu.Item as='a' onClick={() => logIn(true)}>
                Log In
              </Menu.Item>
              <Menu.Item as='a' onClick={() => logIn(false)}>
                Sign up
              </Menu.Item>
            </>
          ) : (
            <Menu.Item onClick={() => logIn(false)}>
              { available ? 'Get Started' : 'Join a Whitelist' }
            </Menu.Item>
          )}
        </Sidebar>

        <Sidebar.Pusher dimmed={sidebarOpened}>
          <Segment
            textAlign='center'
            style={{ minHeight: 350, padding: '1em 0em' }}
            vertical
          >
            <Container>
              <Menu pointing secondary size='large'>
                <Menu.Item onClick={() => setSidebarOpened(true)}>
                  <Icon name='sidebar' />
                </Menu.Item>
                <Menu.Item position='right'>
                  { available ? (
                    <>
                      <Button as='a' onClick={() => logIn(true)}>
                        { available ? 'Log In' : 'Join a Whilelist' }
                      </Button>
                      <Button as='a' style={{ marginLeft: '0.5em' }} onClick={() => logIn(false)}>
                        { available ? 'Sign up': 'Join a Whitelist' }
                      </Button>
                    </>
                  ) : (
                    <Button onClick={logIn}>
                      Join a Whitelist
                    </Button>
                  ) }
                </Menu.Item>
              </Menu>
            </Container>
            <HomepageHeading mobile available={available} logIn={logIn}/>
          </Segment>

          {children}
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </Media>
  )
}

MobileContainer.propTypes = {
  children: PropTypes.node,
  available: PropTypes.bool.isRequired,
  logIn: PropTypes.func.isRequired,
}

const ResponsiveContainer = ({ children, available, logIn }) => (
  /* Heads up!
   * For large applications it may not be best option to put all page into these containers at
   * they will be rendered twice for SSR.
   */
  <MediaContextProvider>
    <DesktopContainer available={available} logIn={logIn}>{children}</DesktopContainer>
    <MobileContainer available={available} logIn={logIn}>{children}</MobileContainer>
  </MediaContextProvider>
)

ResponsiveContainer.propTypes = {
  children: PropTypes.node,
  available: PropTypes.bool,
  logIn: PropTypes.func,
}

const HomepageLayout = () => {
  const navigate = useNavigate()
  const [available, setAvailable] = useState(true)

  const logIn = (openLogin) => {
    if (available) {
      // navigate('/chat')
      if (openLogin) {
        navigate('/login')
      } else {
        navigate('/signup')
      }
    } else {
      console.log('navigate to interestForm')
      window.open(conf.interestForm.url, '_blank')
    }
  }

  useEffect(() => {
    // Run only once
    axios.get(`${conf.api.url}/available`)
      .then((response) => {
        if (response.data.status === 'available') {
          console.log('The API is available. You can log in.')
        } else {
          console.warn('Unknown availability status. Join a Whitelist.')
          setAvailable(false)
        }
      })
      .catch(function (error) {
        console.error('error:', error);
        console.warn('The API is unavailable. Join a Whitelist.')
        setAvailable(false)
      })
  }, []);

  return (
    <ResponsiveContainer logIn={logIn} available={available}>

      <Segment style={{ padding: '8em 0em' }} vertical>
        <Grid container stackable verticalAlign='middle'>
          <Grid.Row>
            <Grid.Column floated='left' width={8}>
              <Header as='h3' style={{ fontSize: '2em' }}>
                Decentralized Bank of Central Bank of the Central Banks
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <li>
A new era of financial cooperation.
                </li>
                <li>
Learn more about the DBCB and how it can benefit your country.
                </li>
                <li>
The Decentralized Bank of Central Banks (DBCB) is a new financial institution that is owned and operated by the central banks of the world. It is built on blockchain technology, which makes it transparent, secure, and efficient.
                </li>
              </p>

              <Header as='h3' style={{ fontSize: '2em' }}>
Decentralized Bank of Central Banks
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <ul>
                  <li>
<b>Benefits</b>
                  </li>
                  <li>
The DBCB offers a number of benefits to its members, including:
                  </li>
                  <li>
<b>Transparency:</b> All transactions on the DBCB are recorded on a public blockchain, which makes it impossible to tamper with them. This transparency can help to reduce corruption and build trust in the global financial system.
                  </li>
                  <li>
<b>Security:</b> Blockchain technology is very secure, making the DBCB resistant to hacking and other cyberattacks.
                  </li>
                  <li>
<b>Efficiency:</b> The DBCB can process transactions much faster and more efficiently than traditional financial institutions. This can help to reduce costs and improve access to financial services for people around the world.
                  </li>
                  <li>
<b>More Benefits</b>
                  </li>
                  <li>
The DBCB offers a number of benefits to its members, including:
                  </li>
                  <li>
<b>Transparency:</b> All transactions on the DBCB are recorded on a public blockchain, which makes it impossible to tamper with them. This transparency can help to reduce corruption and build trust in the global financial system.
                  </li>
                  <li>
<b>Security:</b> Blockchain technology is very secure, making the DBCB resistant to hacking and other cyberattacks.
                  </li>
                  <li>
<b>Efficiency:</b> The DBCB can process transactions much faster and more efficiently than traditional financial institutions. This can help to reduce costs and improve access to financial services for people around the world.
                  </li>
                  <li>
<b>How it works</b>
                  </li>
                  <li>
The DBCB is owned and operated by its members, which are the central banks of the world. Each member has a representative on the DBCB's governing council. The council is responsible for making decisions about the DBCB's policies and operations.
                  </li>
                  <li>
<b>Testimonials</b>
                  </li>
                  <li>
<b>Get involved</b>
                  </li>
                  <li>
The DBCB uses blockchain technology to record and process transactions. This makes it possible for members to send and receive payments from each other quickly and easily. The DBCB also supports a variety of other financial services, such as lending and borrowing.
                  </li>
                  <li>
If you are interested in learning more about the DBCB or becoming a member, please visit our website or contact us at [email protected]
                  </li>
                  <li>
<b>Call to action</b>
                  </li>
                  <li>
Learn more about the DBCB and how it can benefit your country
                  </li>
                  <li>
Sign up for our newsletter to stay up-to-date on the latest developments
                  <li>
                  </li>
Contact us to learn more about becoming a member
                  </li>
                  <li>
This website can be yours for just one laughther recorded to your camera and uploaded on YouTube with the link shared with us.
                  </li>
                  <li>
Recommend us how to develop your honnestly earned bank.
                  </li>
                  <li>
Be consious about your consiousness and unconsciousness types of minds with clear perception of the World financial system.
                  </li>
                  <li>
Control as much as you can in your own the most crucial successful bank.
                  </li>
                </ul>
                <ul>
                  <li>
Under the hood, you can find your own personal Banking-as-a-Service FinTech Robo-Adviser Quantum AI LLD (Large Language Dataset) with Smart Contracts Written on the Plain Human Language.
                  </li>
                  <li>
Tell us how we develop your personal bank.
                  </li>
                  <li>
<b>Tell us what your needs are, what your pains are, what your solutions are, what your benefts are. Feel free to contact us right now.</b>
                  </li>
                </ul>
              </p>

              <Header as='h3' style={{ fontSize: '2em' }}>
                Benefits
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <ul>
                  <li>
                    <b>Be more likable:</b> Your Own Bank is a great way to connect with people and make them smile.
                  </li>
                  <li>
                    <b>Be more successful:</b> Your Own Bank can help you succeed in your career and personal life.
                  </li>
                  <li>
                    <b>Be more confident:</b> When you know how to make people trust, you will feel more confident in yourself.
                  </li>
                </ul>
              </p>
            </Grid.Column>
            <Grid.Column floated='right' width={6}>
              <Image bordered rounded size='large' src='/images/00001.jpg' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={6}>
              <Image bordered rounded size='large' src='/images/00002.jpg' />
            </Grid.Column>
            <Grid.Column floated='right' width={8}>
              <Header as='h3' style={{ fontSize: '2em' }}>
                Save Money
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <ul>
                  <li>
                    Our progressive web app teaches you the fundamentals of independent financial life, such as how to use Your Own Decentralized Central Bank of the all Central Banks, personalized, and tailored to your individual needs.
                  </li>
                  <li>
                    You will learn how to craft different types of financial instruments, such as assets, smart contracts, and technology.
                  </li>
                  <li>
                    You will also learn how to tailor your porfolio investment into different audiences to make more money together with the synergies.
                  </li>
                </ul>
              </p>

              <Header as='h3' style={{ fontSize: '2em' }}>
                Make Investment and Trust Your Own Robo-Adviser
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <ul>
                  <li>
                    Monitor Robo-Adviser with Prometheus and Grafana.
                  </li>
                  <li>
                    Simply enter a topic and our LLM will generate a list of assets to use right now for you.
                  </li>
                  <li>
                    You can also edit the financial goals to make them your own.
                  </li>
                </ul>
              </p>

              <Header as='h3' style={{ fontSize: '2em' }}>
                Valuable Features
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <ul>
                  <li>
                    <b>Community:</b> Connect with other users and share your public portfolio and feedback.
                  </li>
                  <li>
                    <b>Challenges:</b> Complete challenges to earn rewards and enjoy your financial play with the gamification.
                  </li>
                  <li>
                    <b>Leaderboards:</b> See how you stack up against other users on our leaderboards.
                  </li>
                </ul>
              </p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column floated='left' width={6}>
              <Image bordered rounded size='large' src='/images/00003.jpg' />
            </Grid.Column>
            <Grid.Column floated='right' width={6}>
              <Image bordered rounded size='large' src='/images/00004.jpg' />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column textAlign='center'>
              <Button size='huge' onClick={() => logIn(false)}>
                { available ? 'Get Started' : 'Join a Whitelist' }
                <Icon name='right arrow' />
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      <Segment style={{ padding: '0em' }} vertical>
        <Grid celled='internally' columns='equal' stackable>
          <Grid.Row textAlign='center'>
            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
              <Header as='h4' style={{ fontSize: '1.5em' }}>
                <li>
                "[The DBCB] is a major step forward for the global financial system."
                </li>
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <Image avatar src='/images/users-00001.jpeg' />
                (Request Permission: No/Yes)
                - Christine Lagarde, President of the European Central Bank
              </p>
            </Grid.Column>
            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
              <Header as='h4' style={{ fontSize: '1.5em' }}>
                <li>
                "[The DBCB] has the potential to revolutionize the way that central banks interact with each other and with the global economy."
                </li>
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <Image avatar src='/images/users-00002.jpeg' />
                (Request Permission: No/Yes)
                - Jerome Powell, Chairman of the US Federal Reserve
              </p>
            </Grid.Column>
            <Grid.Column style={{ paddingBottom: '5em', paddingTop: '5em' }}>
              <Header as='h4' style={{ fontSize: '1.5em' }}>
                <li>
                  "[The DBCB] is a bold and visionary new initiative that has the potential to make the global financial system more transparent, secure, and efficient."
                </li>
              </Header>
              <p style={{ fontSize: '1.33em' }}>
                <Image avatar src='/images/users-00003.jpeg' />
                (Request Permission: No/Yes)
                - Yi Gang, Governor of the People's Bank of China
              </p>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>

      {/*
      <Container style={{ marginTop: '6em' }}>
        <Divider
          as='h4'
          className='header'
          horizontal
          style={{ margin: '3em 0em', textTransform: 'uppercase' }}
        >
          <a href='#'>
            Demo Video
          </a>
        </Divider>
        <Embed
          id='1FxJ4kelZvw'
          placeholder='/images/demo-placeholder.png'
          source='youtube'
        />
      </Container>
      */}

      <Segment style={{ padding: '3em 0em' }} vertical>
        <Container text>
          <Divider
            as='h4'
            className='header'
            horizontal
            style={{ margin: '3em 0em', textTransform: 'uppercase' }}
          >
            <a href='#'>
              Ready to Cash Out?
            </a>
          </Divider>
          <p style={{ fontSize: '1.33em' }}>
            Sign up for free today and start learning financial independence and making people smile:)
          </p>
          <Button size='large' color='yellow' onClick={() => logIn(false)}>
            { available ? 'Get Started Today' : 'Join a Whitelist' }
            <Icon name='right arrow' />
          </Button>
        </Container>
      </Segment>

      <Segment inverted vertical style={{ padding: '5em 0em' }}>
        <Container>
          <Grid divided inverted stackable>
            <Grid.Row>
              <Grid.Column width={3}>
                <Header inverted as='h4' content='About' />
                <List link inverted>
                  <List.Item as='a'>
                    <a href='mailto:admin@vuics.com'>
                      Contact Us
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://www.linkedin.com/showcase/decentralized-bank/' target='_blank' rel='noopener noreferrer'>
                      Follow on LinkedIn
                    </a>
                  </List.Item>
                  {/*
                  <List.Item as='a'>
                    <a href='https://youtube.com/playlist?list=PLXkNXBn6_PqxAFUWetX0_r7825eVMJTAs&si=hdD6MJ1Fo7MSHicc' target='_blank' rel='noopener noreferrer'>
                      Subscribe on YouTube
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://vuics.tawk.help/category/quantum-copilot' target='_blank' rel='noopener noreferrer'>
                      Knowledge Base
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://vuics.tawk.help/article/quantum-copilot-faq' target='_blank' rel='noopener noreferrer'>
                      FAQ
                    </a>
                  </List.Item>
                  */}
                </List>
              </Grid.Column>
              <Grid.Column width={5}>
                <Header inverted as='h4' content='Services' />
                <List link inverted>
                  <List.Item as='a'>
                    <a href='https://qc.vuics.com/' target='_blank' rel='noopener noreferrer'>
                      Quantum Copilot
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://quantum-gpt.vuics.com/' target='_blank' rel='noopener noreferrer'>
                      Quantum GPT
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://vuics.com' target='_blank' rel='noopener noreferrer'>
                      Voice User Interfaces
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <Divider />
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://cs.vuics.com' target='_blank' rel='noopener noreferrer'>
                      Contract Smarter
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://jf.vuics.com' target='_blank' rel='noopener noreferrer'>
                      Joke Funnier
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://qt.vuics.com' target='_blank' rel='noopener noreferrer'>
                      Quantum Trading Fund
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://hc.vuics.com' target='_blank' rel='noopener noreferrer'>
                      Hypno-Coaching
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://qm.vuics.com' target='_blank' rel='noopener noreferrer'>
                      TchaiQovsky: Quantum Music
                    </a>
                  </List.Item>
                  <List.Item as='a'>
                    <a href='https://db.vuics.com' target='_blank' rel='noopener noreferrer'>
                      Your Own Decentalized Bank
                    </a>
                  </List.Item>
                </List>
              </Grid.Column>
              <Grid.Column width={7}>
                <List link inverted>
                  <List.Item as='a'>
                    <p>
                      Fill the world with financial independence of yourself and your loved ones and the best friends altougher and as you wish.
                    </p>
                  </List.Item>
                  <List.Item as='a'>
                    <p>
                      © 2023 Vuics. All rights reserved.
                    </p>
                  </List.Item>
                </List>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Container>
      </Segment>
    </ResponsiveContainer>
  )
}

export default HomepageLayout
