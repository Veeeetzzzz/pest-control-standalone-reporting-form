import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PestControlForm.css';
import axios from 'axios';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './authConfig';
import SignIn from './SignIn';

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
  const { instance, accounts } = useMsal();
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
  const [isEditing, setIsEditing] = useState({
    address: false,
    contact: false,
  });
  const [currentStep, setCurrentStep] = useState<'select' | 'summary'>('select');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    if (accounts.length > 0) {
      instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0]
      }).then((response) => {
        // Use the access token to call Microsoft Graph API
        fetch('https://graph.microsoft.com/v1.0/me', {
          headers: {
            Authorization: `Bearer ${response.accessToken}`
          }
        })
        .then(response => response.json())
        .then(data => {
          setFormData(prev => ({
            ...prev,
            name: data.displayName,
            email: data.mail || data.userPrincipalName,
          }));
        });
      });
    }
  }, [instance, accounts]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setUploadedFiles(filesArray);
    }
  };

  const handleFinalSubmit = async () => {
    console.log('Final submission:', { ...formData, selectedPests, uploadedFiles });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('address', JSON.stringify(formData.address));
      formDataToSend.append('selectedPests', JSON.stringify(selectedPests));
      
      uploadedFiles.forEach(file => {
        formDataToSend.append('photos', file);
      });

      const response = await axios.post('http://localhost:5000/api/submit-appointment', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Appointment submission successful:', response.data);

      alert('Your pest control report has been successfully submitted!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your report. Please try again later.');
    }
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
            {accounts.length === 0 ? (
              <SignIn />
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
                <Form.Group className="mb-3">
                  <Form.Label>Upload Photos</Form.Label>
                  <Form.Control type="file" multiple onChange={handleFileChange} />
                </Form.Group>
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
                  <h5>Uploaded Photos:</h5>
                  <ul>
                    {uploadedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
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
