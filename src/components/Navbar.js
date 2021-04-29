import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import MetamaskButton from './helper/MetamaskButton';

const Header = (props) => {
    return (
        <React.Fragment>
            <Navbar variant="light" bg="secondary">
                <Navbar.Brand href="/"><i class="fab fa-phoenix-squadron"></i> Home</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href={'/dashboard/' + props.account}><i class="fab fa-dyalog"></i> ashboard</Nav.Link> {/* Only if props.address is a creator */}
                        <Nav.Link href={'/following/' + props.account}><i class="fab fa-gratipay"></i> Following</Nav.Link>
                        <Nav.Link href={'/streams/' + props.account}><i class="fab fa-ethereum"></i> Streams</Nav.Link>
                        <Nav.Link href="/add-creator"><i class="fas fa-plus"></i> Become Creator</Nav.Link>
                        <Nav.Link href="/view-creators"><i class="fas fa-street-view"></i> View Creators</Nav.Link>
                        <Nav.Link href="/add-post"><i class="fas fa-file-medical"></i> New post</Nav.Link>
                    </Nav>
                    <Nav>
                        { props.account !== null ? <>Connected account:&nbsp;<strong>{props.account}</strong></> : <MetamaskButton /> }
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </React.Fragment>
    );
}

export default Header;
