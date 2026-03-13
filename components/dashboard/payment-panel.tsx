// components/dashboard/payment-panel.tsx
'use client'

import { useState, useTransition } from 'react'
import {
  CreditCard,
  ExternalLink,
  Loader2,
  CheckCircle,
  Banknote,
  Copy,
  Check,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { createPaymentLinkAction, markBookingPaidAction } from '@/actions/payment-actions'
import { formatCurrency, getStatusColor } from '@/lib/utils'
import { toast } from 'sonner'

interface PaymentPanelProps {
  booking: {
    id: string
    guestName: string
    guestEmail: string
    totalAmount: number
    paymentStatus: string
    status: string
    currency?: string
    room: { name: string }
  }
  open: boolean
  onClose: () => void
}

export function PaymentPanel({ booking, open, onClose }: PaymentPanelProps) {
  const [isPending, startTransition] = useTransition()
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const alreadyPaid = booking.paymentStatus === 'PAID'

  function handleCopyLink() {
    if (!paymentUrl) return
    navigator.clipboard.writeText(paymentUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Payment link copied!')
  }

  function handleCreateStripeLink() {
    startTransition(async () => {
      try {
        const result = await createPaymentLinkAction(booking.id)
        if (result.success && result.url) {
          setPaymentUrl(result.url)
          toast.success('Payment link generated!')
        } else {
          toast.error(result.error || 'Failed to generate payment link')
        }
      } catch (e) {
        toast.error('Failed to connect to Stripe. Check your STRIPE_SECRET_KEY.')
      }
    })
  }

  function handleMarkManualPaid() {
    startTransition(async () => {
      const result = await markBookingPaidAction(booking.id, 'manual')
      if (result.success) {
        toast.success('Booking marked as paid and confirmed!')
        onClose()
      } else {
        toast.error(result.error || 'Failed to update payment')
      }
    })
  }

  function handleMarkBankTransfer() {
    startTransition(async () => {
      const result = await markBookingPaidAction(booking.id, 'bank_transfer')
      if (result.success) {
        toast.success('Booking marked as paid via bank transfer!')
        onClose()
      } else {
        toast.error(result.error || 'Failed to update payment')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Payment Management</DialogTitle>
          <DialogDescription>
            Manage payment for {booking.guestName}&apos;s booking
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Booking summary */}
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Guest</span>
              <span className="font-medium text-slate-900">{booking.guestName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Email</span>
              <span className="font-medium text-slate-700 text-xs">{booking.guestEmail}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Room</span>
              <span className="font-medium text-slate-900">{booking.room.name}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-slate-200 pt-2 mt-2">
              <span className="font-semibold text-slate-900">Total Amount</span>
              <span className="font-bold text-lg text-slate-900">
                {formatCurrency(booking.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Payment Status</span>
              <Badge className={`text-xs border ${getStatusColor(booking.paymentStatus)}`}>
                {booking.paymentStatus}
              </Badge>
            </div>
          </div>

          {alreadyPaid ? (
            /* Already paid */
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">Payment Received</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  This booking has been paid in full.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Option 1: Stripe payment link */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-violet-50 flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Online Payment via Stripe</p>
                    <p className="text-xs text-slate-500">Send guest a secure card payment link</p>
                  </div>
                </div>

                {paymentUrl ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 p-2">
                      <code className="flex-1 text-xs text-slate-600 truncate">{paymentUrl}</code>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 shrink-0"
                        onClick={handleCopyLink}
                      >
                        {copied ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1.5"
                        onClick={handleCopyLink}
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        {copied ? 'Copied!' : 'Copy link'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 gap-1.5"
                        onClick={() => window.open(paymentUrl, '_blank')}
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Open
                      </Button>
                    </div>
                    <p className="text-xs text-slate-400 text-center">
                      Share this link with your guest via email or WhatsApp
                    </p>
                  </div>
                ) : (
                  <Button
                    onClick={handleCreateStripeLink}
                    disabled={isPending}
                    className="w-full bg-violet-600 hover:bg-violet-700 text-white"
                    size="sm"
                  >
                    {isPending ? (
                      <><Loader2 className="h-3.5 w-3.5 animate-spin" />Generating...</>
                    ) : (
                      <><CreditCard className="h-3.5 w-3.5" />Generate Stripe payment link</>
                    )}
                  </Button>
                )}
              </div>

              {/* Option 2: Manual payment */}
              <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                    <Banknote className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Mark as Manually Paid</p>
                    <p className="text-xs text-slate-500">Cash, bank transfer, or other offline payment</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkManualPaid}
                    disabled={isPending}
                    className="text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                  >
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : '✓ Cash paid'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkBankTransfer}
                    disabled={isPending}
                    className="text-blue-700 border-blue-200 hover:bg-blue-50"
                  >
                    {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : '✓ Bank transfer'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
