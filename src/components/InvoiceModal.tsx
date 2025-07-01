import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Printer, X, Receipt, User, Calendar, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvoiceModalProps {
  open: boolean;
  onClose: () => void;
  patient: any;
  appointment: any;
  consultationData?: any;
}

const InvoiceModal: React.FC<InvoiceModalProps> = ({ 
  open, 
  onClose, 
  patient,
  appointment,
  consultationData 
}) => {
  const { toast } = useToast();

  const invoiceData = {
    invoiceNumber: `INV-${Date.now()}`,
    date: new Date().toLocaleDateString(),
    consultationFee: 500,
    medicationsFee: consultationData?.medications ? 200 : 0,
    testsFee: consultationData?.testsOrdered ? 300 : 0,
    totalAmount: 500 + (consultationData?.medications ? 200 : 0) + (consultationData?.testsOrdered ? 300 : 0)
  };

  const generateInvoicePDF = () => {
    const invoiceContent = `
      MEDICAL INVOICE
      
      Invoice Number: ${invoiceData.invoiceNumber}
      Date: ${invoiceData.date}
      
      Patient Information:
      Name: ${patient?.name || 'N/A'}
      MR Number: ${patient?.mrNumber || 'N/A'}
      Phone: ${patient?.phone || 'N/A'}
      
      Doctor: ${appointment?.doctorName || 'N/A'}
      Appointment Type: ${appointment?.appointmentType || 'N/A'}
      
      Services:
      - Consultation Fee: $${invoiceData.consultationFee}
      ${consultationData?.medications ? `- Medications: $${invoiceData.medicationsFee}` : ''}
      ${consultationData?.testsOrdered ? `- Tests: $${invoiceData.testsFee}` : ''}
      
      Total Amount: $${invoiceData.totalAmount}
      Payment Mode: Cash
      Status: Paid
      
      Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${invoiceData.invoiceNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    toast({
      title: "✅ Invoice Downloaded",
      description: "Invoice has been downloaded successfully.",
    });
  };

  const handlePrint = () => {
    window.print();
    toast({
      title: "📄 Print Initiated",
      description: "Invoice print job has been sent to printer.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-[#0F52BA]" />
            <span>Medical Invoice</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 print:space-y-4">
          {/* Invoice Header */}
          <div className="bg-blue-50 p-4 rounded-lg print:bg-white print:border">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <h3 className="font-bold text-lg text-[#0F52BA]">Medical Center</h3>
                <p className="text-sm text-gray-600">Healthcare Services</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">Invoice #{invoiceData.invoiceNumber}</p>
                <p className="text-sm text-gray-600">{invoiceData.date}</p>
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="bg-gray-50 p-4 rounded-lg print:bg-white print:border">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Patient Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {patient?.name || 'N/A'}
              </div>
              <div>
                <span className="font-medium">MR Number:</span> {patient?.mrNumber || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {patient?.phone || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Date:</span> {invoiceData.date}
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="bg-green-50 p-4 rounded-lg print:bg-white print:border">
            <h3 className="font-semibold text-green-700 mb-3 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Service Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Doctor:</span> {appointment?.doctorName || 'N/A'}
              </div>
              <div>
                <span className="font-medium">Type:</span> {appointment?.appointmentType || 'N/A'}
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div className="bg-yellow-50 p-4 rounded-lg print:bg-white print:border">
            <h3 className="font-semibold text-yellow-700 mb-3 flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              Billing Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Consultation Fee</span>
                <span className="font-medium">${invoiceData.consultationFee}</span>
              </div>
              {consultationData?.medications && (
                <div className="flex justify-between items-center">
                  <span>Medications</span>
                  <span className="font-medium">${invoiceData.medicationsFee}</span>
                </div>
              )}
              {consultationData?.testsOrdered && (
                <div className="flex justify-between items-center">
                  <span>Tests</span>
                  <span className="font-medium">${invoiceData.testsFee}</span>
                </div>
              )}
              <hr className="my-2" />
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-[#0F52BA]">${invoiceData.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="flex justify-center">
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              Payment Status: PAID (Cash)
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4 border-t print:hidden">
          <Button variant="outline" onClick={onClose}>
            <X className="w-4 h-4 mr-2" />
            Close
          </Button>
          <div className="flex gap-2">
            <Button onClick={handlePrint} variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Print Invoice
            </Button>
            <Button onClick={generateInvoicePDF} className="bg-[#0F52BA] hover:bg-[#000080]">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvoiceModal;