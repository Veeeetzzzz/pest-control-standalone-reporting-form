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
    photo: null as File | null,
  });
  const [isEditing, setIsEditing] = useState({
    address: false,
    contact: false,
  });
  const [currentStep, setCurrentStep] = useState<'select' | 'summary'>('select');

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
    const { name, value, files } = e.target;
    setFormData(prev => {
      if (name.startsWith('address.')) {
        const addressField = name.split('.')[1];
        return { ...prev, address: { ...prev.address, [addressField]: value } };
      }
      if (name === 'photo' && files) {
        return { ...prev, photo: files[0] };
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

  const handleFinalSubmit = async () => {
    console.log('Final submission:', { ...formData, selectedPests });
    
    try {
      const submissionData = new FormData();
      submissionData.append('name', formData.name);
      submissionData.append('email', formData.email);
      submissionData.append('phone', formData.phone);
      submissionData.append('address[line1]', formData.address.line1);
      submissionData.append('address[line2]', formData.address.line2);
      submissionData.append('address[city]', formData.address.city);
      submissionData.append('address[postcode]', formData.address.postcode);
      submissionData.append('selectedPests', JSON.stringify(selectedPests));
      if (formData.photo) {
        submissionData.append('photo', formData.photo);
      }

      const dynamicsResponse = await axios.post('http://localhost:5000/api/submit-to-dynamics', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Dynamics submission successful:', dynamicsResponse.data);

      const salesforceResponse = await axios.post('http://localhost:5000/api/submit-to-salesforce', submissionData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Salesforce submission successful:', salesforceResponse.data);

      alert('Your pest control report has been successfully submitted!');
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('There was an error submitting your report. Please try again later.');
    }
  };

  return (
    <>
      <Container className="mt-4">
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
            <Form.Group className="mb-4">
              <Form.Label>Upload a photo (optional)</Form.Label>
              <Form.Control type="file" name="photo" onChange={handleInputChange} />
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
              {formData.photo && (
                <div>
                  <h5>Uploaded Photo:</h5>
                  <img src={URL.createObjectURL(formData.photo)} alt="Uploaded Pest" style={{ maxWidth: '100%' }} />
                </div>
              )}
              <Button variant="primary" onClick={handleFinalSubmit} className="w-100 mt-3">Submit Report</Button>
              <Button variant="secondary" onClick={() => setCurrentStep('select')} className="w-100 mt-2">Back to Selection</Button>
            </Card.Body>
          </Card>
        )}
      </Container>
    </>
  );
};

export default PestControlForm;
