import React, { useState, useEffect } from "react";
import {
  Receipt,
  Download,
  Mail,
  FileText,
  Printer,
  Building,
  CheckCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Invoice } from "@/lib/monetization/monetization-types";
import { fetchUserInvoices } from "@/lib/monetization/monetization-api";

interface InvoiceEngineViewProps {
  userId?: string;
}

export function InvoiceEngineView({ userId = "user-1" }: InvoiceEngineViewProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    void fetchUserInvoices(userId).then(setInvoices);
  }, [userId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-display text-2xl font-bold flex items-center gap-2">
          <Receipt className="size-6 text-accent" /> 24.11 Tax & GST Invoice Engine
        </h2>
        <p className="text-sm text-muted-foreground">
          View, download PDF, or email tax-compliant GST invoices for all subscription payments.
        </p>
      </div>

      {/* Invoice Table */}
      <Card className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="p-3">Invoice Number</th>
                <th className="p-3">Plan / Item</th>
                <th className="p-3">Amount</th>
                <th className="p-3">GST Tax (18%)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Date</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-secondary/20">
                  <td className="p-3 font-mono font-semibold text-accent">{inv.invoiceNumber}</td>
                  <td className="p-3 font-medium">{inv.planName}</td>
                  <td className="p-3 font-bold">₹{(inv.totalCents / 100).toLocaleString()}</td>
                  <td className="p-3 text-xs text-muted-foreground">
                    ₹{(inv.taxCents / 100).toLocaleString()}
                  </td>
                  <td className="p-3">
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      {inv.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(inv.issuedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs h-7 gap-1"
                      onClick={() => setSelectedInvoice(inv)}
                    >
                      <FileText className="size-3" /> View
                    </Button>
                    <Button
                      size="sm"
                      className="text-xs h-7 gap-1"
                      onClick={() => alert(`Downloading Invoice ${inv.invoiceNumber} PDF...`)}
                    >
                      <Download className="size-3" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl flex items-center justify-between">
                <span>Tax Invoice {selectedInvoice.invoiceNumber}</span>
                <Badge className="bg-emerald-500">{selectedInvoice.status.toUpperCase()}</Badge>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 text-sm py-2">
              {/* Company & Client Info */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-secondary/30 border border-border">
                <div>
                  <h4 className="font-bold text-xs uppercase text-muted-foreground mb-1">
                    Billed From
                  </h4>
                  <p className="font-semibold text-base">Sanatan Dharma Suite Technologies</p>
                  <p className="text-xs text-muted-foreground">GSTIN: 07AAACS1234F1Z9</p>
                  <p className="text-xs text-muted-foreground">Connaught Place, New Delhi 110001</p>
                </div>

                <div>
                  <h4 className="font-bold text-xs uppercase text-muted-foreground mb-1">Billed To</h4>
                  <p className="font-semibold text-base">{selectedInvoice.userName}</p>
                  <p className="text-xs text-muted-foreground">{selectedInvoice.userEmail}</p>
                  {selectedInvoice.companyName && (
                    <p className="text-xs text-muted-foreground">{selectedInvoice.companyName}</p>
                  )}
                </div>
              </div>

              {/* Line Items Table */}
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 font-semibold">
                    <th className="p-2">Item Description</th>
                    <th className="p-2">Qty</th>
                    <th className="p-2">Unit Price</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {selectedInvoice.lineItems.map((li) => (
                    <tr key={li.id}>
                      <td className="p-2 font-medium">{li.name}</td>
                      <td className="p-2">{li.quantity}</td>
                      <td className="p-2">₹{(li.unitPriceCents / 100).toLocaleString()}</td>
                      <td className="p-2 text-right font-bold">
                        ₹{(li.totalPriceCents / 100).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Tax & Total Summary */}
              <div className="p-4 rounded-lg bg-card border border-border space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>₹{(selectedInvoice.subtotalCents / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount Applied:</span>
                  <span className="text-rose-500">
                    -₹{(selectedInvoice.discountCents / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CGST (9%) + SGST (9%):</span>
                  <span>₹{(selectedInvoice.taxCents / 100).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border font-bold text-sm">
                  <span>Grand Total Paid:</span>
                  <span className="text-accent">
                    ₹{(selectedInvoice.totalCents / 100).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
              <Button onClick={() => alert(`Emailing invoice ${selectedInvoice.invoiceNumber}...`)}>
                <Mail className="size-4 mr-1.5" /> Email Invoice
              </Button>
              <Button onClick={() => alert(`Downloading Invoice PDF...`)}>
                <Download className="size-4 mr-1.5" /> Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
