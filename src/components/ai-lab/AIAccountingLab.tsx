'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Brain, 
  Mic, 
  MicOff, 
  FileText, 
  Upload, 
  Download, 
  CheckCircle, 
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  Camera,
  Scan,
  Receipt,
  Calculator,
  BarChart3,
  Lightbulb
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

interface Transaction {
  id: string
  date: string
  description: string
  amount: number
  type: 'income' | 'expense'
  category: string
  status: 'matched' | 'unmatched' | 'flagged'
  confidence?: number
}

interface InvoiceData {
  id: string
  vendor: string
  invoiceNumber: string
  date: string
  dueDate: string
  amount: number
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  tax?: number
  total: number
  extractedAt: string
  confidence: number
}

export function AIAccountingLab() {
  const [activeTab, setActiveTab] = useState<'voice' | 'scan' | 'analytics'>('voice')
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [extractedInvoice, setExtractedInvoice] = useState<InvoiceData | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const { user } = useAuth()

  // Mock data for demonstration
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      date: '2024-01-15',
      description: 'Office Rent Payment',
      amount: 2500,
      type: 'expense',
      category: 'Rent',
      status: 'matched',
      confidence: 0.95
    },
    {
      id: '2',
      date: '2024-01-14',
      description: 'Client Invoice #001',
      amount: 5000,
      type: 'income',
      category: 'Services',
      status: 'unmatched',
      confidence: 0.88
    },
    {
      id: '3',
      date: '2024-01-13',
      description: 'Software Subscription',
      amount: 99,
      type: 'expense',
      category: 'Software',
      status: 'matched',
      confidence: 0.92
    }
  ]

  useEffect(() => {
    // Load mock transactions
    setTransactions(mockTransactions)
  }, [])

  const handleVoiceRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false)
      // Simulate voice processing
      setTimeout(() => {
        setTranscript("Office rent payment of two thousand five hundred dollars due on January 15th. Client invoice number zero zero one for five thousand dollars received on January 14th.")
        toast.success('Voice recording processed successfully!')
      }, 1000)
    } else {
      // Start recording
      setIsRecording(true)
      setTranscript('')
      toast.info('Voice recording started... Speak clearly about your transactions.')
    }
  }

  const handleVoiceReconciliation = async () => {
    setIsProcessing(true)
    try {
      // Simulate AI processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Update transaction statuses
      setTransactions(prev => prev.map(tx => ({
        ...tx,
        status: tx.status === 'unmatched' ? 'matched' : tx.status,
        confidence: tx.confidence ? Math.min(tx.confidence + 0.1, 1) : 0.9
      })))
      
      toast.success('Voice reconciliation completed! 2 transactions matched.')
    } catch (error) {
      toast.error('Failed to process voice reconciliation')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      toast.success(`File "${file.name}" uploaded successfully!`)
    }
  }

  const handleInvoiceScanning = async () => {
    if (!uploadedFile) {
      toast.error('Please upload an invoice file first.')
      return
    }

    setIsProcessing(true)
    try {
      // Simulate AI invoice processing
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock extracted invoice data
      const mockInvoice: InvoiceData = {
        id: 'inv_' + Date.now(),
        vendor: 'Tech Solutions Inc.',
        invoiceNumber: 'TS-2024-001',
        date: '2024-01-10',
        dueDate: '2024-02-10',
        amount: 1500,
        items: [
          {
            description: 'Cloud Services',
            quantity: 1,
            unitPrice: 1000,
            total: 1000
          },
          {
            description: 'Support Package',
            quantity: 1,
            unitPrice: 500,
            total: 500
          }
        ],
        tax: 150,
        total: 1650,
        extractedAt: new Date().toISOString(),
        confidence: 0.94
      }
      
      setExtractedInvoice(mockInvoice)
      toast.success('Invoice scanned and data extracted successfully!')
    } catch (error) {
      toast.error('Failed to scan invoice')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'matched': return 'bg-green-100 text-green-800'
      case 'unmatched': return 'bg-yellow-100 text-yellow-800'
      case 'flagged': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600'
    if (confidence >= 0.7) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            AI Accounting Lab
          </h1>
          <p className="text-muted-foreground">
            Experience the future of accounting with AI-powered tools
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          <Zap className="w-3 h-3 mr-1" />
          Beta Features
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions.length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Matched</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {transactions.filter(t => t.status === 'matched').length}
            </div>
            <p className="text-xs text-muted-foreground">Auto-reconciled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">AI confidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Saved</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="voice" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            Voice Reconciliation
          </TabsTrigger>
          <TabsTrigger value="scan" className="flex items-center gap-2">
            <Scan className="h-4 w-4" />
            Invoice Scanning
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Voice Reconciliation Tab */}
        <TabsContent value="voice" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Voice Recording Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mic className="h-5 w-5" />
                  Voice Recording
                </CardTitle>
                <CardDescription>
                  Speak naturally about your transactions and let AI do the rest
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Recording Button */}
                <div className="flex justify-center">
                  <Button
                    size="lg"
                    onClick={handleVoiceRecording}
                    disabled={isProcessing}
                    className={`w-32 h-32 rounded-full ${
                      isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/600'
                    }`}
                  >
                    {isRecording ? (
                      <MicOff className="h-12 w-12" />
                    ) : (
                      <Mic className="h-12 w-12" />
                    )}
                  </Button>
                </div>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                  </p>
                </div>

                {/* Transcript Display */}
                {transcript && (
                  <div className="space-y-2">
                    <h4 className="font-semibold">Transcript:</h4>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{transcript}</p>
                    </div>
                  </div>
                )}

                {/* Processing Button */}
                {transcript && (
                  <Button
                    onClick={handleVoiceReconciliation}
                    disabled={isProcessing}
                    className="w-full"
                  >
                    {isProcessing ? 'Processing...' : 'Process Voice Reconciliation'}
                  </Button>
                )}

                {/* Tips */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Pro Tips:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• Speak clearly and at a moderate pace</li>
                        <li>• Mention dates, amounts, and descriptions</li>
                        <li>• Use consistent terminology</li>
                        <li>• Include vendor names and invoice numbers</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  AI-processed transactions from voice input
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                          <span className="font-medium text-sm">
                            {transaction.description}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${transaction.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {transaction.type}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{transaction.date} • {transaction.category}</span>
                        {transaction.confidence && (
                          <span className={getConfidenceColor(transaction.confidence)}>
                            {Math.round(transaction.confidence * 100)}% confidence
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Invoice Scanning Tab */}
        <TabsContent value="scan" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upload Interface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Invoice Upload
                </CardTitle>
                <CardDescription>
                  Upload invoice images or PDFs for AI-powered data extraction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* File Upload Area */}
                <div className="border-2 border-dashed border-muted-foreground rounded-lg p-8 text-center">
                  <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <div className="space-y-2">
                    <p className="text-lg font-medium">Upload Invoice</p>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to select files
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: PDF, JPG, PNG (Max 10MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="invoice-upload"
                  />
                  <Button asChild className="w-full">
                    <label htmlFor="invoice-upload" className="cursor-pointer">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose File
                    </label>
                  </Button>
                </div>

                {/* Uploaded File Info */}
                {uploadedFile && (
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm font-medium truncate">
                          {uploadedFile.name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                )}

                {/* Scan Button */}
                <Button
                  onClick={handleInvoiceScanning}
                  disabled={!uploadedFile || isProcessing}
                  className="w-full"
                >
                  {isProcessing ? 'Scanning Invoice...' : 'Scan Invoice with AI'}
                </Button>

                {/* Features */}
                <div className="space-y-3">
                  <h4 className="font-semibold">AI Extraction Features:</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Vendor Name</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Invoice Number</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Date & Due Date</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Line Items</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Tax Amount</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      <span>Total Amount</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Extracted Data */}
            {extractedInvoice && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="h-5 w-5" />
                    Extracted Invoice Data
                  </CardTitle>
                  <CardDescription>
                    AI-extracted information with {Math.round(extractedInvoice.confidence * 100)}% confidence
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Invoice Header */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Vendor:</span>
                      <p className="font-medium">{extractedInvoice.vendor}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Invoice #:</span>
                      <p className="font-medium">{extractedInvoice.invoiceNumber}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p className="font-medium">{extractedInvoice.date}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Due Date:</span>
                      <p className="font-medium">{extractedInvoice.dueDate}</p>
                    </div>
                  </div>

                  {/* Line Items */}
                  <div>
                    <h4 className="font-semibold mb-2">Line Items:</h4>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted">
                            <th className="text-left p-2">Description</th>
                            <th className="text-right p-2">Qty</th>
                            <th className="text-right p-2">Unit Price</th>
                            <th className="text-right p-2">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {extractedInvoice.items.map((item, index) => (
                            <tr key={index} className="border-t">
                              <td className="p-2">{item.description}</td>
                              <td className="p-2 text-right">{item.quantity}</td>
                              <td className="p-2 text-right">${item.unitPrice}</td>
                              <td className="p-2 text-right">${item.total}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Subtotal:</span>
                      <p className="font-medium">${extractedInvoice.amount}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Tax:</span>
                      <p className="font-medium">${extractedInvoice.tax || 0}</p>
                    </div>
                    <div className="col-span-2 border-t pt-2">
                      <span className="text-muted-foreground">Total:</span>
                      <p className="font-bold text-lg">${extractedInvoice.total}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      <Download className="h-4 w-4 mr-2" />
                      Export Data
                    </Button>
                    <Button className="flex-1">
                      <Calculator className="h-4 w-4 mr-2" />
                      Add to Accounting
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Reconciliation Accuracy */}
            <Card>
              <CardHeader>
                <CardTitle>Reconciliation Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary">94%</div>
                    <p className="text-sm text-muted-foreground">Overall Accuracy</p>
                  </div>
                  <Progress value={94} className="h-2" />
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Voice Recognition</span>
                      <span className="text-green-600">96%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Invoice Scanning</span>
                      <span className="text-green-600">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Data Extraction</span>
                      <span className="text-yellow-600">89%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Processing Time */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Voice Processing</span>
                    <span className="text-sm font-medium">2.3s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Invoice Scanning</span>
                    <span className="text-sm font-medium">3.1s</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Data Validation</span>
                    <span className="text-sm font-medium">1.2s</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Average</span>
                      <span className="text-sm font-bold text-primary">2.2s</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Cost Savings */}
            <Card>
              <CardHeader>
                <CardTitle>Time Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">12.5h</div>
                    <p className="text-sm text-muted-foreground">Saved This Week</p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Manual Entry</span>
                      <span>15.0h</span>
                    </div>
                    <div className="flex justify-between">
                      <span>AI Processing</span>
                      <span>2.5h</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Efficiency Gain</span>
                      <span className="text-sm font-bold text-green-600">83%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>
                AI Lab usage statistics over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>Usage Analytics Chart</p>
                  <p className="text-sm">Detailed analytics coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}