import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PestControlForm.css';

interface Pest {
  id: string;
  name: string;
  icon: string;
}

const pests: Pest[] = [
  { id: 'rats', name: 'Rats', icon: '🐀' },
  { id: 'mice', name: 'Mice', icon: '🐁' },
  { id: 'squirrels', name: 'Squirrels', icon: '🐿️' },
  { id: 'ants', name: 'Ants', icon: '🐜' },
  { id: 'cockroaches', name: 'Cockroaches', icon: '🪳' },
  { id: 'birds', name: 'Birds', icon: '🐦' },
  { id: 'bedbugs', name: 'Bed bugs', icon: '🐞' },
  { id: 'fleas', name: 'Fleas', icon: '🦟' },
  { id: 'storedinsects', name: 'Stored product insects', icon: '🪲' },
  { id: 'flies', name: 'Flies', icon: '🪰' },
  { id: 'moths', name: 'Moths', icon: '🦋' },
  { id: 'hornets', name: 'Hornets', icon: '🐝' },
  { id: 'wasps', name: 'Wasps', icon: '🐝' },
  { id: 'mites', name: 'Mites', icon: '🕷️' },
  { id: 'unknown', name: 'Unknown', icon: '❓' },
];

const PestControlForm: React.FC = () => {
  const [selectedPests, setSelectedPests] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      postcode: '',
    },
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditing, setIsEditing] = useState({
    address: false,
    contact: false,
  });
  const [currentStep, setCurrentStep] = useState<'select' | 'summary'>('select');

  useEffect(() => {
    // Simulating pre-populated data after login
    if (isLoggedIn) {
      setFormData({
        name: 'Mr Dan Smith',
        email: 'dsmith@email.com',
        phone: '01234567890',
        address: {
          line1: '21-23 BOURNEMOUTH ROAD',
          line2: '',
          city: 'LONDON',
          postcode: 'SE15 4UJ',
        },
      });
    }
  }, [isLoggedIn]);

  const handlePestSelection = (pestId: string) => {
    setSelectedPests(prev => 
      prev.includes(pestId) ? prev.filter(id => id !== pestId) : [...prev, pestId]
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      if (name.startsWith('address.')) {
        const addressField = name.split('.')[1];
        return { ...prev, address: { ...prev.address, [addressField]: value } };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitted:', { ...formData, selectedPests });
    // Here you would send the data to your backend
  };

  const handleLogin = () => {
    // Simulating login process
    setIsLoggedIn(true);
  };

  const handleEdit = (section: 'address' | 'contact') => {
    setIsEditing(prev => ({ ...prev, [section]: true }));
  };

  const handleSave = (section: 'address' | 'contact') => {
    setIsEditing(prev => ({ ...prev, [section]: false }));
    // Here you would send the updated data to your backend
    console.log('Updated:', formData);
  };

  const handleNext = () => {
    setCurrentStep('summary');
  };

  const handleFinalSubmit = () => {
    console.log('Final submission:', { ...formData, selectedPests });
    // Here you would send the data to your backend
    // After successful submission, you might want to show a confirmation message or redirect
  };

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">A Local Authority</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#services">Services</Nav.Link>
            </Nav>
            {!isLoggedIn ? (
              <Button variant="outline-light" onClick={handleLogin}>Sign In</Button>
            ) : (
              <Navbar.Text>Signed in as: {formData.name}</Navbar.Text>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <h1 className="mb-4">Report a pest problem {'>'} {currentStep === 'select' ? 'Pests' : 'Summary'}</h1>
        <Row>
          <Col md={8}>
            {currentStep === 'select' ? (
              <Form onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                <h2>Select pests that you want our technicians to inspect inside the property</h2>
                <p>You have added {selectedPests.length} pests</p>
                <Row xs={2} md={3} className="g-4 mb-4">
                  {pests.map(pest => (
                    <Col key={pest.id}>
                      <Card
                        className={`pest-card ${selectedPests.includes(pest.id) ? 'selected' : ''}`}
                        onClick={() => handlePestSelection(pest.id)}
                        role="button"
                        tabIndex={0}
                      >
                        <Card.Body className="d-flex align-items-center">
                          <div className="me-2 pest-checkbox">
                            {selectedPests.includes(pest.id) && <span>✓</span>}
                          </div>
                          <span className="me-2">{pest.icon}</span>
                          <span>{pest.name}</span>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
                <Button variant="primary" type="submit" className="w-100">Next</Button>
              </Form>
            ) : (
              <Card>
                <Card.Body>
                  <h2>Summary of Your Pest Report</h2>
                  <h5>Selected Pests:</h5>
                  <ul>
                    {selectedPests.map(pestId => (
                      <li key={pestId}>{pests.find(p => p.id === pestId)?.name} {pests.find(p => p.id === pestId)?.icon}</li>
                    ))}
                  </ul>
                  <h5>Address:</h5>
                  <p>
                    {formData.address.line1}<br />
                    {formData.address.line2 && <>{formData.address.line2}<br /></>}
                    {formData.address.city}<br />
                    {formData.address.postcode}
                  </p>
                  <h5>Contact Details:</h5>
                  <p>
                    {formData.name}<br />
                    {formData.email}<br />
                    {formData.phone}
                  </p>
                  <Button variant="primary" onClick={handleFinalSubmit} className="w-100 mt-3">Submit Report</Button>
                  <Button variant="secondary" onClick={() => setCurrentStep('select')} className="w-100 mt-2">Back to Selection</Button>
                </Card.Body>
              </Card>
            )}
          </Col>
          <Col md={4}>
            <Card>
              <Card.Header>Your booking</Card.Header>
              <Card.Body>
                <h5>Address</h5>
                {isEditing.address ? (
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" name="address.line1" value={formData.address.line1} onChange={handleInputChange} placeholder="Address Line 1" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" name="address.line2" value={formData.address.line2} onChange={handleInputChange} placeholder="Address Line 2" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" name="address.city" value={formData.address.city} onChange={handleInputChange} placeholder="City" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" name="address.postcode" value={formData.address.postcode} onChange={handleInputChange} placeholder="Postcode" />
                    </Form.Group>
                    <Button variant="primary" onClick={() => handleSave('address')} className="w-100 mb-3">Save</Button>
                  </Form>
                ) : (
                  <>
                    <p>{formData.address.line1}<br />
                       {formData.address.line2}<br />
                       {formData.address.city}<br />
                       {formData.address.postcode}</p>
                    <Button variant="light" onClick={() => handleEdit('address')} className="w-100 mb-3">EDIT</Button>
                  </>
                )}

                <h5>Contact details</h5>
                {isEditing.contact ? (
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Name" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone" />
                    </Form.Group>
                    <Button variant="primary" onClick={() => handleSave('contact')} className="w-100 mb-3">Save</Button>
                  </Form>
                ) : (
                  <>
                    <p>{formData.name}<br />{formData.email}<br />{formData.phone}</p>
                    <Button variant="light" onClick={() => handleEdit('contact')} className="w-100 mb-3">EDIT</Button>
                  </>
                )}

                <Button variant="secondary" className="w-100">CLEAR</Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <footer className="mt-5 bg-light py-3">
        <Container>
          <Row>
            <Col>
              <a href="#" className="me-3">Terms and disclaimer</a>
              <a href="#" className="me-3">Emergency contacts</a>
              <a href="#" className="me-3">Feedback and complaints</a>
              <a href="#" className="me-3">Modern Slavery Statement</a>
              <a href="#" className="me-3">Complete saved eform</a>
              <a href="#" className="me-3">Accessibility statement</a>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default PestControlForm;
