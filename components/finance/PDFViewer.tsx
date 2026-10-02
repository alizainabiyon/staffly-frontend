'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { PDFViewerProps } from '@/lib/types';

export function PDFViewer({ url, title, onClose }: PDFViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={true} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">{zoom}%</span>
              <Button variant="outline" size="sm" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleRotate}>
                <RotateCw className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto p-4">
          <div className="flex justify-center">
            <div 
              style={{ 
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center'
              }}
              className="transition-transform duration-200"
            >
              {/* PDF Content Placeholder */}
              <div className="w-[595px] h-[842px] bg-white border shadow-lg p-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-800">Staffly</h1>
                  <p className="text-gray-600">Complete Business Management Solution</p>
                </div>
                
                <div className="mb-6">
                  <h2 className="text-xl font-semibold mb-4">{title}</h2>
                  <div className="border-b-2 border-gray-300 mb-4"></div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-semibold">Document Number:</p>
                      <p className="text-gray-600">DOC-2024-001</p>
                    </div>
                    <div>
                      <p className="font-semibold">Date:</p>
                      <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="mt-8">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2 text-left">Description</th>
                          <th className="border border-gray-300 p-2 text-right">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-300 p-2">Sample Item 1</td>
                          <td className="border border-gray-300 p-2 text-right">₨ 10,000</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 p-2">Sample Item 2</td>
                          <td className="border border-gray-300 p-2 text-right">₨ 15,000</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 p-2 font-semibold">Total</td>
                          <td className="border border-gray-300 p-2 text-right font-semibold">₨ 25,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-8 text-sm text-gray-600">
                    <p>Thank you for your business!</p>
                    <p>For any queries, please contact us at support@staffly.com</p>
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 text-center text-xs text-gray-500">
                  <p>Generated by Staffly - Business Management System</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}