import React, { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Search,
  CheckCircle,
  Clock,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Invoice } from "@/lib/monetization/monetization-types";
import { fetchUserInvoices } from "@/lib/monetization/monetization-api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface InvoiceEngineViewProps {
  userId?: string;
  isAdmin?: boolean;
}

export function InvoiceEngineView({ userId, isAdmin = false }: InvoiceEngineViewProps) {
  const { user } = useAuth();
  const targetUid = userId || user?.id || "demo";
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    async function loadInvoices() {
      setLoading(true);
      const list = await fetchUserInvoices(targetUid);
      setInvoices(list);
      setLoading(false);
    }
    void loadInvoices();
  }, [targetUid]);

  const filteredInvoices = invoices.filter(
    (inv) =>
      inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.planName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.userName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDownloadInvoice = (inv: Invoice) => {
    toast.success(`Downloading GST Invoice ${inv.invoiceNumber}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <FileText className="size-6 text-accent" /> GST Invoices & Billing History
          </h2>
          <p className="text-sm text-muted-foreground">
            Download 18% GST tax invoices for business accounting and tax filing.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search invoice number or plan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-muted-foreground">
          <div className="size-6 border-2 border-accent border-t-transparent animate-spin rounded-full mx-auto mb-2" />
          Loading invoices...
        </div>
      ) : filteredInvoices.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <FileText className="size-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="font-display text-lg font-semibold">No Invoices Found</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
            You don't have any billing invoices yet. Subscriptions and purchases will generate GST invoices here.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-secondary/40 text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Invoice #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Subtotal</th>
                  <th className="p-4">18% GST</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-secondary/20 transition-colors">
                    <td className="p-4 font-mono text-xs font-semibold">{inv.invoiceNumber}</td>
                    <td className="p-4">
                      <div className="font-medium text-xs">{inv.userName}</div>
                      <div className="text-[10px] text-muted-foreground">{inv.userEmail}</div>
                    </td>
                    <td className="p-4 font-semibold text-xs">{inv.planName}</td>
                    <td className="p-4 text-xs">₹{(inv.subtotalCents / 100).toLocaleString()}</td>
                    <td className="p-4 text-xs text-muted-foreground">
                      ₹{(inv.gstTaxCents / 100).toLocaleString()}
                    </td>
                    <td className="p-4 font-bold text-xs text-accent">
                      ₹{(inv.totalCents / 100).toLocaleString()}
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {new Date(inv.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                        <CheckCircle className="size-3 mr-1" /> Paid
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedInvoice(inv)}
                          className="text-xs"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDownloadInvoice(inv)}
                          className="gap-1 text-xs"
                        >
                          <Download className="size-3.5" /> PDF
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Invoice Detail Dialog */}
      {selectedInvoice && (
        <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle className="font-display text-xl flex items-center justify-between">
                <span>GST Tax Invoice</span>
                <span className="font-mono text-sm text-accent">{selectedInvoice.invoiceNumber}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 text-xs py-2">
              <div className="rounded-lg bg-secondary/50 p-4 grid grid-cols-2 gap-3 border">
                <div>
                  <span className="text-muted-foreground block">Customer Name:</span>
                  <span className="font-semibold text-sm">{selectedInvoice.userName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Customer Email:</span>
                  <span className="font-semibold text-sm">{selectedInvoice.userEmail}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Gateway:</span>
                  <span className="font-semibold uppercase">{selectedInvoice.gateway}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Transaction ID:</span>
                  <span className="font-mono text-[10px]">{selectedInvoice.transactionId}</span>
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-2">
                <div className="flex justify-between font-semibold border-b pb-2">
                  <span>Description</span>
                  <span>Amount</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>{selectedInvoice.planName} Subscription</span>
                  <span>₹{(selectedInvoice.subtotalCents / 100).toLocaleString()}</span>
                </div>
                {selectedInvoice.discountCents > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount Applied</span>
                    <span>- ₹{(selectedInvoice.discountCents / 100).toLocaleString()}</span>
                  </div>
                )}
                {selectedInvoice.gstTaxCents > 0 && (
                  <div className="flex justify-between text-muted-foreground">
                    <span>18% CGST + SGST Tax</span>
                    <span>+ ₹{(selectedInvoice.gstTaxCents / 100).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-accent border-t pt-2">
                  <span>Total Amount Paid</span>
                  <span>₹{(selectedInvoice.totalCents / 100).toLocaleString()}</span>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground text-center">
                SanatanTools Tax Invoice • GSTIN: 07AAAAA0000A1Z5 • 100% Tax Compliant
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(null)}>
                Close
              </Button>
              <Button size="sm" onClick={() => handleDownloadInvoice(selectedInvoice)}>
                <Printer className="size-3.5 mr-1.5" /> Print / Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
