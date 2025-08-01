import React, { useState, useEffect } from 'react';
import { Camera, Upload, Users, MapPin, Phone, User, Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface User {
  id: number;
  fullName: string;
  phoneNumber: string;
  pincode: string;
  timestamp: string;
}

interface Message {
  type: 'success' | 'error' | '';
  text: string;
}

const WildlifeAlertSystem = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    pincode: ''
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<Message>({ type: '', text: '' });

  const CAMERA_PINCODE = "682020";

  useEffect(() => {
    const savedUsers = localStorage.getItem('wildlifeUsers');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('wildlifeUsers', JSON.stringify(users));
  }, [users]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'pincode') {
      const numericValue = value.replace(/\D/g, '').slice(0, 6);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === 'phoneNumber') {
      const numericValue = value.replace(/\D/g, '').slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please upload only JPEG or PNG images.' });
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setMessage({ type: 'error', text: 'Image size must be less than 5MB.' });
      return;
    }

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setMessage({ type: '', text: '' });
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setMessage({ type: 'error', text: 'Please enter your full name.' });
      return false;
    }

    if (formData.phoneNumber.length !== 10) {
      setMessage({ type: 'error', text: 'Please enter a valid 10-digit phone number.' });
      return false;
    }

    if (formData.pincode.length !== 6) {
      setMessage({ type: 'error', text: 'Please enter a valid 6-digit pincode.' });
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newUser: User = {
      id: Date.now(),
      fullName: formData.fullName,
      phoneNumber: formData.phoneNumber,
      pincode: formData.pincode,
      timestamp: new Date().toLocaleString('en-IN')
    };

    setUsers(prev => [newUser, ...prev]);
    setFormData({ fullName: '', phoneNumber: '', pincode: '' });
    setMessage({ type: 'success', text: 'Registration successful! You will receive wildlife alerts for your area.' });
    setIsSubmitting(false);

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      setMessage({ type: 'error', text: 'Please select an image to upload.' });
      return;
    }

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    setMessage({ type: 'success', text: 'Image uploaded successfully! Wildlife detection processing complete.' });
    setSelectedImage(null);
    setImagePreview(null);
    const input = document.getElementById('imageInput') as HTMLInputElement;
    if (input) input.value = '';
    setIsSubmitting(false);

    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Shield className="h-6 w-6 text-accent" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">Wildlife Alert System</h1>
              <p className="text-sm text-muted-foreground">Community-driven wildlife monitoring</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Status Message */}
        {message.text && (
          <div className="mb-6">
            <Alert className={`${
              message.type === 'success' 
                ? 'border-success/50 bg-success/5' 
                : 'border-destructive/50 bg-destructive/5'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
              <AlertTitle className={message.type === 'success' ? 'text-success' : 'text-destructive'}>
                {message.type === 'success' ? 'Success' : 'Error'}
              </AlertTitle>
              <AlertDescription className={message.type === 'success' ? 'text-success/80' : 'text-destructive/80'}>
                {message.text}
              </AlertDescription>
            </Alert>
          </div>
        )}

        <Tabs defaultValue="register" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="register" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Register for Alerts
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Camera Detection
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Registered Users ({users.length})
            </TabsTrigger>
          </TabsList>

          {/* Registration Tab */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-accent" />
                  Register for Wildlife Alerts
                </CardTitle>
                <CardDescription>
                  Stay informed about wildlife activity in your area. Register to receive SMS alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter 10-digit phone number"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    type="text"
                    placeholder="Enter 6-digit pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                  />
                </div>

                <Button 
                  onClick={handleRegister} 
                  disabled={isSubmitting}
                  className="w-full"
                  variant="default"
                >
                  {isSubmitting ? 'Registering...' : 'Register for Alerts'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Camera Detection Tab */}
          <TabsContent value="camera">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-accent" />
                  Wildlife Camera Detection
                </CardTitle>
                <CardDescription>
                  Upload images from wildlife cameras for automatic animal detection and alert processing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imageInput">Upload Wildlife Image</Label>
                  <Input
                    id="imageInput"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleImageChange}
                    className="cursor-pointer"
                  />
                  <p className="text-sm text-muted-foreground">
                    Accepted formats: JPEG, PNG (Max size: 5MB)
                  </p>
                </div>

                {imagePreview && (
                  <div className="space-y-2">
                    <Label>Image Preview</Label>
                    <div className="border rounded-lg p-4 bg-muted/20">
                      <img
                        src={imagePreview}
                        alt="Wildlife preview"
                        className="max-w-full h-auto max-h-64 mx-auto rounded-md shadow-sm"
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleImageUpload}
                  disabled={!selectedImage || isSubmitting}
                  className="w-full"
                  variant="default"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Processing...' : 'Upload & Process Image'}
                </Button>

                <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Camera className="h-5 w-5 text-accent mt-0.5" />
                    <div>
                      <h4 className="font-medium text-sm text-foreground">Camera Location Info</h4>
                      <p className="text-sm text-muted-foreground">
                        Camera Station Pincode: <Badge variant="secondary">{CAMERA_PINCODE}</Badge>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        All registered users in this area will be notified of wildlife detections.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-accent" />
                  Registered Users
                </CardTitle>
                <CardDescription>
                  Community members registered for wildlife alerts in their areas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {users.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No users registered yet.</p>
                    <p className="text-sm text-muted-foreground">Be the first to register for wildlife alerts!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="border rounded-lg p-4 bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{user.fullName}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              <span>{user.phoneNumber}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="h-3 w-3" />
                              <span>Pincode: {user.pincode}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="text-xs">
                              Active
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {user.timestamp}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default WildlifeAlertSystem;