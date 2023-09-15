import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';

type NavigationProps = {
    isLoggedIn: boolean,
    handleClick: ()=>void
}

export default function Navigation({ isLoggedIn, handleClick }:NavigationProps) {
    
    return (
        // <Navbar bg='dark' data-bs-theme='dark'>
        //     <Container>
        //         <Navbar.Brand href='/'>Yu-Gi-Oh Deck Editor</Navbar.Brand>
        //         <Nav className='me-auto'>
        //             { isLoggedIn ? (
        //                 <>
        //                     <Nav.Link href='/'>Create Deck</Nav.Link>
        //                     <Nav.Link as='button' onClick={handleClick}>Log Out</Nav.Link>
        //                 </>
        //             ) : (
        //                 <>
        //                     <Nav.Link as={Link} to='/register'>Sign Up</Nav.Link>
        //                     <Nav.Link as={Link} to='/login'>Log In</Nav.Link>
        //                 </>
        //             )}
        //         </Nav>
        //     </Container>
        // </Navbar>
        <>
          <Navbar key={'xxl'} expand={false} className="bg-body-tertiary navbar" bg='dark' data-bs-theme='dark'>
            <Container fluid className='navbar-container'>
              <Navbar.Brand href="#" className='nav-title'>Yu-Gi-Oh Deck Editor</Navbar.Brand>
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${false}`} />
              <Navbar.Offcanvas
                bg='dark'
                data-bs-theme='dark'
                className='nav'
                id={`offcanvasNavbar-expand-${false}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${false}`}
                placement="start"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${false}`} className='nav-title'>
                    Yu-Gi-Oh Deck Editor
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav className="justify-content-end text-center flex-grow-1 pe-3 nav-link">
                    { isLoggedIn ? (
                        <>
                            <Nav.Link href='/'>Create Deck</Nav.Link>
                            <Nav.Link as='button' onClick={handleClick}>Log Out</Nav.Link>
                        </>
                    ) : (
                        <>
                            <Nav.Link href='/'>View Decks</Nav.Link>
                            <Nav.Link as={Link} to='/register'>Sign Up</Nav.Link>
                            <Nav.Link as={Link} to='/login'>Log In</Nav.Link>
                        </>
                    )}
                  </Nav>
                  
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
      </>
    )
}
