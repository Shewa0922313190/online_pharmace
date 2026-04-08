import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../../Contexts/AuthContext';
import { prescriptionAPI } from '../../../api/api';
import { Card, CardContent } from '../../../uti/card';
import { Button } from '../../../uti/button';
import { toast } from 'sonner';
import {
  Upload,
  FileText,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Plus,
  Eye,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../../uti/dialog';

// Local Status Badge Component
const PrescriptionStatusBadge = ({ status, showIcon = true }) => {
  const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    Verified: 'bg-green-100 text-green-800 border-green-300',
    Rejected: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusIcons = {
    Pending: <AlertCircle className="h-3 w-3 mr-1" />,
    Verified: <CheckCircle className="h-3 w-3 mr-1" />,
    Rejected: <XCircle className="h-3 w-3 mr-1" />,
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
      {showIcon && statusIcons[status]}
      {status}
    </span>
  );
};

const PrescriptionUploadPage = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const loadPrescriptions = useCallback(async () => {
    if (!user) return;
    
    try {
      const data = await prescriptionAPI.getUserPrescriptions(user.user_ID);
      setPrescriptions(data);
    } catch (error) {
      toast.error('Failed to load prescriptions');
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadPrescriptions();
  }, [loadPrescriptions]);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      await handleUpload(files[0]);
    }
  };

  const handleFileSelect = async (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      await handleUpload(files[0]);
    }
  };

  const handleUpload = async (file) => {
    if (!user) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // In a real app, you would upload the file to a server/cloud storage
      // For this demo, we'll use a placeholder URL
      const imageUrl = URL.createObjectURL(file);
      
      await prescriptionAPI.uploadPrescription({
        user_ID: user.user_ID,
        image_url: imageUrl,
        prescription_date: new Date().toISOString().split('T')[0],
        verification_status: 'Pending',
      });

      toast.success('Prescription uploaded successfully');
      loadPrescriptions();
    } catch (error) {
      toast.error('Failed to upload prescription');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Verified':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Prescriptions</h1>
            <p className="text-muted-foreground mt-1">
              Upload and manage your prescriptions
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted-foreground/25 hover:border-muted-foreground/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {isUploading ? (
                <div className="py-8">
                  <Loader2 className="h-12 w-12 mx-auto animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Uploading prescription...</p>
                </div>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Upload Prescription
                  </h3>
                  <p className="text-muted-foreground mb-4 max-w-md mx-auto">
                    Drag and drop your prescription image here, or click to browse.
                    Supports JPG, PNG up to 5MB.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="prescription-upload"
                  />
                  <Button asChild>
                    <label htmlFor="prescription-upload" className="cursor-pointer">
                      <Plus className="h-4 w-4 mr-2" />
                      Select File
                    </label>
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions List */}
        <h2 className="text-xl font-semibold mb-4">Prescription History</h2>
        
        {prescriptions.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No prescriptions yet</h3>
            <p className="text-muted-foreground">
              Upload your first prescription to get started
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prescriptions.map((prescription) => (
              <Card key={prescription.prescription_ID} className="overflow-hidden">
                {/* Prescription Image */}
                <div 
                  className="aspect-video bg-muted cursor-pointer overflow-hidden"
                  onClick={() => setSelectedPrescription(prescription)}
                >
                  <img
                    src={prescription.image_url}
                    alt={`Prescription ${prescription.prescription_ID}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">
                        Prescription #{prescription.prescription_ID}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(prescription.prescription_date).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusIcon(prescription.verification_status)}
                  </div>
                  
                  <PrescriptionStatusBadge 
                    status={prescription.verification_status} 
                    showIcon={false}
                  />
                  
                  {prescription.notes && (
                    <p className="text-sm text-muted-foreground mt-3">
                      Note: {prescription.notes}
                    </p>
                  )}
                  
                  {prescription.expiry_date && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Expires: {new Date(prescription.expiry_date).toLocaleDateString()}
                    </p>
                  )}
                  
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => setSelectedPrescription(prescription)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Prescription Detail Dialog */}
      <Dialog 
        open={!!selectedPrescription} 
        onOpenChange={() => setSelectedPrescription(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Prescription #{selectedPrescription?.prescription_ID}
            </DialogTitle>
            <DialogDescription>
              Uploaded on {selectedPrescription && new Date(selectedPrescription.prescription_date).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                <img
                  src={selectedPrescription.image_url}
                  alt={`Prescription ${selectedPrescription.prescription_ID}`}
                  className="w-full h-full object-contain"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <PrescriptionStatusBadge status={selectedPrescription.verification_status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Upload Date</p>
                  <p className="font-medium">
                    {new Date(selectedPrescription.prescription_date).toLocaleDateString()}
                  </p>
                </div>
                {selectedPrescription.expiry_date && (
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">
                      {new Date(selectedPrescription.expiry_date).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
              
              {selectedPrescription.notes && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Pharmacist Notes</p>
                  <p>{selectedPrescription.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrescriptionUploadPage;