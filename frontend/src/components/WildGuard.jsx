import React, { useState, useEffect } from "react";
import {
  Camera,
  Upload,
  Users,
  MapPin,
  Phone,
  User,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerUser } from "@/services/api";

const WildGuard = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    pincode: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentView, setCurrentView] = useState("register"); // 'register' or 'camera'
  const [message, setMessage] = useState({ type: "", text: "" }); // For success/error messages

  const CAMERA_PINCODE = "682020";

  useEffect(() => {
    const savedUsers = localStorage.getItem("wildGuardUsers");
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wildGuardUsers", JSON.stringify(users));
  }, [users]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "pincode") {
      const numericValue = value.replace(/\D/g, "").slice(0, 6);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else if (name === "phoneNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = async () => {
    // Clear previous messages
    setMessage({ type: "", text: "" });

    // Validate form data
    if (
      !formData.fullName.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.pincode.trim()
    ) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      return;
    }

    if (formData.phoneNumber.length !== 10) {
      setMessage({ type: "error", text: "Phone number must be 10 digits" });
      return;
    }

    if (formData.pincode.length !== 6) {
      setMessage({ type: "error", text: "Pincode must be 6 digits" });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await registerUser(formData);

      // Success - show message and clear form
      setMessage({ type: "success", text: "User registered successfully!" });
      setFormData({ fullName: "", phoneNumber: "", pincode: "" });

      // Add to local state for display (optional - you could fetch from backend instead)
      const newUser = {
        id: Date.now(),
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        pincode: formData.pincode,
        timestamp: new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      };
      setUsers((prev) => [newUser, ...prev]);
    } catch (error) {
      // Error handling
      setMessage({
        type: "error",
        text: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold">
              <span className="text-gray-800">Wild</span>
              <span className="text-orange-500">Guard</span>
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant={currentView === "register" ? "default" : "outline"}
              onClick={() => setCurrentView("register")}
              className="flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Register
            </Button>
            <Button
              variant={currentView === "camera" ? "default" : "outline"}
              onClick={() => setCurrentView("camera")}
              className="flex items-center gap-2"
            >
              <Camera className="h-4 w-4" />
              Camera
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentView === "register" ? (
          // Registration View
          <div className="grid grid-cols-2 gap-8">
            {/* User Registration */}
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <User className="h-5 w-5 text-primary" />
                  User Registration
                </h2>
                {/* Message Display */}
                {message.text && (
                  <div
                    className={`p-3 rounded-md text-sm ${
                      message.type === "success"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {message.text}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="+91 9876543210"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">10 digit number</p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="pincode"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <MapPin className="h-4 w-4" />
                    Pincode
                  </Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    type="text"
                    placeholder="682020"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full"
                  />
                </div>

                <Button
                  onClick={handleRegister}
                  disabled={
                    isSubmitting ||
                    !formData.fullName ||
                    formData.phoneNumber.length !== 10 ||
                    formData.pincode.length !== 6
                  }
                  className="w-full mt-6"
                  variant="default"
                >
                  {isSubmitting ? "Registering..." : "Register for Alerts"}
                </Button>
              </div>
            </Card>

            {/* Registered Users */}
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Registered Users
                </h2>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>No users registered yet</p>
                  </div>
                ) : (
                  users.map((user) => (
                    <div
                      key={user.id}
                      className="border-b border-gray-100 pb-4 last:border-b-0"
                    >
                      <div className="space-y-1">
                        <h3 className="font-medium text-gray-800">
                          {user.fullName}
                        </h3>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Phone className="h-3 w-3" />
                          <span>{user.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3" />
                          <span>Pincode: {user.pincode}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          Registered: {user.timestamp}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        ) : (
          // Camera View
          <div className="grid grid-cols-2 gap-8">
            {/* Wildlife Camera Simulation */}
            <Card className="p-6">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <Camera className="h-5 w-5 text-primary" />
                  Wildlife Camera Simulation
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>Kochi Wildlife Zone (PIN: {CAMERA_PINCODE})</span>
                </div>
              </div>

              <div className="space-y-4">
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <img
                        src={imagePreview}
                        alt="Wildlife preview"
                        className="max-w-full h-auto max-h-64 mx-auto rounded-md"
                      />
                    </div>
                    <p className="text-sm text-gray-600 text-center">
                      Image ready for processing
                    </p>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No image selected</p>
                  </div>
                )}

                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imageInput"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      document.getElementById("imageInput").click()
                    }
                    className="w-full"
                  >
                    Choose Image
                  </Button>

                  <Button
                    onClick={handleImageUpload}
                    disabled={!selectedImage || isSubmitting}
                    className="w-full bg-green-200 text-green-800 hover:bg-green-300 border-green-300"
                    variant="outline"
                  >
                    {isSubmitting ? "Processing..." : "Process Image"}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Detection Results */}
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center h-full min-h-96 text-center">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-800">
                    Upload an image to see detection results
                  </h3>
                  <p className="text-gray-500">
                    Wildlife detection results will appear here
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-auto py-4 text-center border-t border-gray-200">
        <p className="text-sm text-gray-500">
          WildGuard - Wildlife Conflict Alert System
        </p>
      </footer>
    </div>
  );
};

export default WildGuard;
