"use client"

import type { Invoice } from "@/lib/types"
import { CURRENCY_SYMBOLS } from "@/lib/default-data"
import Image from "next/image"

interface InvoicePreviewProps {
  invoice: Invoice
}

export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const { template } = invoice

  return (
    <div id="invoice-preview">
      {template === "professional" && <ProfessionalTemplate invoice={invoice} />}
      {template === "minimal" && <MinimalTemplate invoice={invoice} />}
      {template === "luxury" && <LuxuryTemplate invoice={invoice} />}
      {template === "creative" && <CreativeTemplate invoice={invoice} />}
      {(!template || template === "modern") && <ModernTemplate invoice={invoice} />}
    </div>
  )
}

function ModernTemplate({ invoice }: InvoicePreviewProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "48px",
        maxWidth: "896px",
        margin: "0 auto",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "48px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              position: "relative",
              height: "64px",
              width: "64px",
              borderRadius: "8px",
              overflow: "hidden",
              backgroundColor: "#f3f4f6",
            }}
          >
            <Image
              src={invoice.company?.logo || "/placeholder.svg"}
              alt={invoice.company?.name || "Company"}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#111827", margin: 0 }}>
              {invoice.company?.name || "Company Name"}
            </h1>
            <p style={{ fontSize: "14px", marginTop: "4px", color: "#4b5563" }}>{invoice.company?.address || ""}</p>
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px", color: "#2563eb" }}>INVOICE</div>
          <div style={{ fontSize: "14px", color: "#374151" }}>
            <p style={{ margin: "4px 0" }}>
              <span style={{ fontWeight: "500" }}>Invoice #:</span> {invoice.number}
            </p>
            <p style={{ margin: "4px 0" }}>
              <span style={{ fontWeight: "500" }}>Date:</span> {new Date(invoice.date).toLocaleDateString()}
            </p>
            <p style={{ margin: "4px 0" }}>
              <span style={{ fontWeight: "500" }}>Due Date:</span> {new Date(invoice.dueDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Bill To / From */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", marginBottom: "48px" }}>
        <div>
          <h3
            style={{
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              marginBottom: "12px",
              color: "#374151",
            }}
          >
            Bill To
          </h3>
          <div>
            <p style={{ fontWeight: "600", color: "#111827", margin: "4px 0" }}>
              {invoice.client?.name || "Client Name"}
            </p>
            <p style={{ fontSize: "14px", color: "#4b5563", margin: "4px 0" }}>{invoice.client?.company || ""}</p>
            <p style={{ fontSize: "14px", color: "#4b5563", margin: "4px 0" }}>{invoice.client?.address || ""}</p>
            <p style={{ fontSize: "14px", color: "#4b5563", margin: "4px 0" }}>{invoice.client?.email || ""}</p>
            <p style={{ fontSize: "14px", color: "#4b5563", margin: "4px 0" }}>{invoice.client?.phone || ""}</p>
          </div>
        </div>
        <div>
          <h3
            style={{
              fontSize: "12px",
              fontWeight: "600",
              textTransform: "uppercase",
              marginBottom: "12px",
              color: "#374151",
            }}
          >
            From
          </h3>
          <div>
            <p style={{ fontWeight: "600", color: "#111827", margin: "4px 0" }}>
              {invoice.company?.name || "Company Name"}
            </p>
            <p style={{ fontSize: "14px", color: "#4b5563", margin: "4px 0" }}>
              Tax ID: {invoice.company?.taxId || ""}
            </p>
            <p style={{ fontSize: "14px", color: "#4b5563", margin: "4px 0" }}>{invoice.company?.email || ""}</p>
            <p style={{ fontSize: "14px", color: "#4b5563", margin: "4px 0" }}>{invoice.company?.phone || ""}</p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div style={{ marginBottom: "48px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#1f2937", color: "#ffffff" }}>
              <th style={{ textAlign: "left", padding: "12px 16px", fontSize: "14px", fontWeight: "600" }}>
                Description
              </th>
              <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "14px", fontWeight: "600" }}>Qty</th>
              <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "14px", fontWeight: "600" }}>
                Unit Price
              </th>
              <th style={{ textAlign: "right", padding: "12px 16px", fontSize: "14px", fontWeight: "600" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "16px", fontSize: "14px", color: "#1f2937" }}>{item.description}</td>
                <td style={{ padding: "16px", fontSize: "14px", textAlign: "right", color: "#4b5563" }}>
                  {item.quantity}
                </td>
                <td style={{ padding: "16px", fontSize: "14px", textAlign: "right", color: "#4b5563" }}>
                  {CURRENCY_SYMBOLS[invoice.currency]}
                  {(item.unitPrice ?? 0).toFixed(2)}
                </td>
                <td
                  style={{ padding: "16px", fontSize: "14px", textAlign: "right", fontWeight: "500", color: "#111827" }}
                >
                  {CURRENCY_SYMBOLS[invoice.currency]}
                  {(item.amount ?? 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "48px" }}>
        <div style={{ width: "320px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "12px" }}>
            <span style={{ color: "#4b5563" }}>Subtotal</span>
            <span style={{ fontWeight: "500", color: "#111827" }}>
              {CURRENCY_SYMBOLS[invoice.currency]}
              {(invoice.subtotal ?? 0).toFixed(2)}
            </span>
          </div>
          {(invoice.discount ?? 0) > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "12px" }}>
              <span style={{ color: "#4b5563" }}>Discount ({invoice.discount}%)</span>
              <span style={{ fontWeight: "500", color: "#111827" }}>
                -{CURRENCY_SYMBOLS[invoice.currency]}
                {(((invoice.subtotal ?? 0) * (invoice.discount ?? 0)) / 100).toFixed(2)}
              </span>
            </div>
          )}
          {(invoice.tax ?? 0) > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "12px" }}>
              <span style={{ color: "#4b5563" }}>Tax ({invoice.tax}%)</span>
              <span style={{ fontWeight: "500", color: "#111827" }}>
                +{CURRENCY_SYMBOLS[invoice.currency]}
                {(
                  (((invoice.subtotal ?? 0) - ((invoice.subtotal ?? 0) * (invoice.discount ?? 0)) / 100) *
                    (invoice.tax ?? 0)) /
                  100
                ).toFixed(2)}
              </span>
            </div>
          )}
          <div style={{ borderTop: "2px solid #1f2937", paddingTop: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>Total</span>
              <span style={{ fontSize: "24px", fontWeight: "bold", color: "#2563eb" }}>
                {CURRENCY_SYMBOLS[invoice.currency]}
                {(invoice.totalAmount ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Info */}
      <div style={{ padding: "24px", borderRadius: "8px", backgroundColor: "#f9fafb", marginBottom: "24px" }}>
        <h3
          style={{
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase",
            marginBottom: "16px",
            color: "#1f2937",
          }}
        >
          Payment Information
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", fontSize: "14px" }}>
          <div>
            <h4 style={{ fontWeight: "600", marginBottom: "8px", color: "#374151" }}>Payment Terms</h4>
            <p style={{ color: "#4b5563" }}>{invoice.paymentInfo?.terms || ""}</p>
          </div>
          <div>
            <h4 style={{ fontWeight: "600", marginBottom: "8px", color: "#374151" }}>Bank Details</h4>
            <div style={{ color: "#4b5563" }}>
              <p style={{ margin: "4px 0" }}>Bank: {invoice.company?.bankDetails?.bankName || ""}</p>
              <p style={{ margin: "4px 0" }}>Branch: {invoice.company?.bankDetails?.branch || ""}</p>
              <p style={{ margin: "4px 0" }}>Account: {invoice.company?.bankDetails?.account || ""}</p>
              <p style={{ margin: "4px 0" }}>PIX: {invoice.company?.bankDetails?.pix || ""}</p>
            </div>
          </div>
        </div>
        {invoice.paymentInfo?.notes && (
          <div style={{ marginTop: "16px" }}>
            <h4 style={{ fontWeight: "600", marginBottom: "8px", color: "#374151" }}>Notes</h4>
            <p style={{ fontSize: "14px", color: "#4b5563" }}>{invoice.paymentInfo.notes}</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", paddingTop: "24px", borderTop: "1px solid #e5e7eb" }}>
        <p style={{ fontSize: "14px", color: "#4b5563" }}>Thank you for your business!</p>
        <p style={{ fontSize: "12px", marginTop: "8px", color: "#6b7280" }}>
          {invoice.company?.email || ""} | {invoice.company?.phone || ""}
        </p>
      </div>
    </div>
  )
}

function ProfessionalTemplate({ invoice }: InvoicePreviewProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "48px",
        maxWidth: "896px",
        margin: "0 auto",
        borderRadius: "8px",
        border: "2px solid #e5e7eb",
      }}
    >
      {/* Header with dark background */}
      <div style={{ backgroundColor: "#111827", color: "#ffffff", padding: "32px", margin: "-48px -48px 32px -48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <h1 style={{ fontSize: "36px", fontWeight: "bold", marginBottom: "8px" }}>
              {invoice.company?.name || "Company Name"}
            </h1>
            <p style={{ fontSize: "14px", opacity: 0.9 }}>{invoice.company?.address || ""}</p>
            <p style={{ fontSize: "14px", opacity: 0.9 }}>
              {invoice.company?.email || ""} | {invoice.company?.phone || ""}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "48px", fontWeight: "bold", marginBottom: "8px" }}>INVOICE</div>
            <div style={{ fontSize: "14px", opacity: 0.9 }}>
              <p>#{invoice.number}</p>
              <p>{new Date(invoice.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Client Info */}
      <div style={{ marginBottom: "32px" }}>
        <h3
          style={{
            fontSize: "12px",
            fontWeight: "600",
            textTransform: "uppercase",
            marginBottom: "12px",
            letterSpacing: "0.05em",
            color: "#374151",
          }}
        >
          Billed To
        </h3>
        <div style={{ padding: "24px", borderRadius: "8px", backgroundColor: "#f9fafb" }}>
          <p style={{ fontWeight: "bold", fontSize: "18px", marginBottom: "4px", color: "#111827" }}>
            {invoice.client?.name || "Client Name"}
          </p>
          <p style={{ fontSize: "14px", color: "#4b5563" }}>{invoice.client?.company || ""}</p>
          <p style={{ fontSize: "14px", color: "#4b5563" }}>{invoice.client?.address || ""}</p>
          <p style={{ fontSize: "14px", marginTop: "8px", color: "#4b5563" }}>{invoice.client?.email || ""}</p>
        </div>
      </div>

      {/* Items */}
      <div style={{ marginBottom: "32px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#1f2937", color: "#ffffff" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Description
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "12px 16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "12px 16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Rate
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "12px 16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item, index) => (
              <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff" }}>
                <td style={{ padding: "16px", fontSize: "14px", color: "#111827" }}>{item.description}</td>
                <td style={{ padding: "16px", fontSize: "14px", textAlign: "center", color: "#4b5563" }}>
                  {item.quantity}
                </td>
                <td style={{ padding: "16px", fontSize: "14px", textAlign: "right", color: "#4b5563" }}>
                  {CURRENCY_SYMBOLS[invoice.currency]}
                  {(item.unitPrice ?? 0).toFixed(2)}
                </td>
                <td
                  style={{ padding: "16px", fontSize: "14px", textAlign: "right", fontWeight: "600", color: "#111827" }}
                >
                  {CURRENCY_SYMBOLS[invoice.currency]}
                  {(item.amount ?? 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <div style={{ width: "384px", padding: "24px", borderRadius: "8px", backgroundColor: "#f9fafb" }}>
          <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
            <span style={{ color: "#4b5563" }}>Subtotal</span>
            <span style={{ fontWeight: "500", color: "#111827" }}>
              {CURRENCY_SYMBOLS[invoice.currency]}
              {(invoice.subtotal ?? 0).toFixed(2)}
            </span>
          </div>
          {(invoice.discount ?? 0) > 0 && (
            <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "#4b5563" }}>Discount</span>
              <span style={{ fontWeight: "500", color: "#111827" }}>
                -{CURRENCY_SYMBOLS[invoice.currency]}
                {(((invoice.subtotal ?? 0) * (invoice.discount ?? 0)) / 100).toFixed(2)}
              </span>
            </div>
          )}
          {(invoice.tax ?? 0) > 0 && (
            <div style={{ marginBottom: "12px", display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
              <span style={{ color: "#4b5563" }}>Tax</span>
              <span style={{ fontWeight: "500", color: "#111827" }}>
                +{CURRENCY_SYMBOLS[invoice.currency]}
                {(
                  (((invoice.subtotal ?? 0) - ((invoice.subtotal ?? 0) * (invoice.discount ?? 0)) / 100) *
                    (invoice.tax ?? 0)) /
                  100
                ).toFixed(2)}
              </span>
            </div>
          )}
          <div style={{ borderTop: "2px solid #1f2937", paddingTop: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "#111827" }}>Total Due</span>
              <span style={{ fontSize: "30px", fontWeight: "bold", color: "#2563eb" }}>
                {CURRENCY_SYMBOLS[invoice.currency]}
                {(invoice.totalAmount ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ marginTop: "48px", paddingTop: "32px", borderTop: "1px solid #e5e7eb" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", fontSize: "14px" }}>
          <div>
            <h4 style={{ fontWeight: "600", marginBottom: "8px", color: "#111827" }}>Payment Terms</h4>
            <p style={{ color: "#4b5563" }}>{invoice.paymentInfo?.terms || ""}</p>
            {invoice.paymentInfo?.notes && (
              <>
                <h4 style={{ fontWeight: "600", marginBottom: "8px", marginTop: "16px", color: "#111827" }}>Notes</h4>
                <p style={{ color: "#4b5563" }}>{invoice.paymentInfo.notes}</p>
              </>
            )}
          </div>
          <div>
            <h4 style={{ fontWeight: "600", marginBottom: "8px", color: "#111827" }}>Bank Details</h4>
            <div style={{ color: "#4b5563" }}>
              <p style={{ margin: "4px 0" }}>{invoice.company?.bankDetails?.bankName || ""}</p>
              <p style={{ margin: "4px 0" }}>Branch: {invoice.company?.bankDetails?.branch || ""}</p>
              <p style={{ margin: "4px 0" }}>Account: {invoice.company?.bankDetails?.account || ""}</p>
              <p style={{ margin: "4px 0" }}>PIX: {invoice.company?.bankDetails?.pix || ""}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MinimalTemplate({ invoice }: InvoicePreviewProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "64px",
        maxWidth: "896px",
        margin: "0 auto",
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "64px" }}>
        <h1 style={{ fontSize: "48px", fontWeight: "300", marginBottom: "32px", color: "#111827" }}>Invoice</h1>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px" }}>
          <div>
            <p style={{ color: "#4b5563", marginBottom: "4px" }}>Invoice Number</p>
            <p style={{ fontWeight: "500", color: "#111827" }}>{invoice.number}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#4b5563", marginBottom: "4px" }}>Date</p>
            <p style={{ fontWeight: "500", color: "#111827" }}>{new Date(invoice.date).toLocaleDateString()}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#4b5563", marginBottom: "4px" }}>Due Date</p>
            <p style={{ fontWeight: "500", color: "#111827" }}>{new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Parties */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "64px", marginBottom: "64px" }}>
        <div>
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
              color: "#4b5563",
            }}
          >
            From
          </p>
          <p style={{ fontWeight: "600", fontSize: "18px", marginBottom: "8px", color: "#111827" }}>
            {invoice.company?.name || "Company Name"}
          </p>
          <div style={{ fontSize: "14px", color: "#4b5563" }}>
            <p style={{ margin: "4px 0" }}>{invoice.company?.address || ""}</p>
            <p style={{ margin: "4px 0" }}>{invoice.company?.email || ""}</p>
          </div>
        </div>
        <div>
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "16px",
              color: "#4b5563",
            }}
          >
            To
          </p>
          <p style={{ fontWeight: "600", fontSize: "18px", marginBottom: "8px", color: "#111827" }}>
            {invoice.client?.name || "Client Name"}
          </p>
          <div style={{ fontSize: "14px", color: "#4b5563" }}>
            <p style={{ margin: "4px 0" }}>{invoice.client?.company || ""}</p>
            <p style={{ margin: "4px 0" }}>{invoice.client?.address || ""}</p>
            <p style={{ margin: "4px 0" }}>{invoice.client?.email || ""}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div style={{ marginBottom: "64px" }}>
        <div style={{ paddingBottom: "12px", marginBottom: "24px", borderBottom: "1px solid #111827" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "6fr 2fr 2fr 2fr",
              gap: "16px",
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: "#374151",
            }}
          >
            <div>Description</div>
            <div style={{ textAlign: "right" }}>Quantity</div>
            <div style={{ textAlign: "right" }}>Rate</div>
            <div style={{ textAlign: "right" }}>Amount</div>
          </div>
        </div>
        <div>
          {(invoice.items || []).map((item) => (
            <div
              key={item.id}
              style={{
                display: "grid",
                gridTemplateColumns: "6fr 2fr 2fr 2fr",
                gap: "16px",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              <div style={{ color: "#111827" }}>{item.description}</div>
              <div style={{ textAlign: "right", color: "#4b5563" }}>{item.quantity}</div>
              <div style={{ textAlign: "right", color: "#4b5563" }}>
                {CURRENCY_SYMBOLS[invoice.currency]}
                {(item.unitPrice ?? 0).toFixed(2)}
              </div>
              <div style={{ textAlign: "right", fontWeight: "500", color: "#111827" }}>
                {CURRENCY_SYMBOLS[invoice.currency]}
                {(item.amount ?? 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "64px" }}>
        <div style={{ width: "320px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "14px",
              paddingBottom: "16px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            <span style={{ color: "#4b5563" }}>Subtotal</span>
            <span style={{ color: "#111827" }}>
              {CURRENCY_SYMBOLS[invoice.currency]}
              {(invoice.subtotal ?? 0).toFixed(2)}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "24px",
              fontWeight: "300",
              paddingTop: "16px",
            }}
          >
            <span style={{ color: "#111827" }}>Total</span>
            <span style={{ color: "#111827" }}>
              {CURRENCY_SYMBOLS[invoice.currency]}
              {(invoice.totalAmount ?? 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      {invoice.paymentInfo?.notes && (
        <div style={{ fontSize: "14px", color: "#4b5563" }}>
          <p style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px" }}>
            Notes
          </p>
          <p>{invoice.paymentInfo.notes}</p>
        </div>
      )}
    </div>
  )
}

function LuxuryTemplate({ invoice }: InvoicePreviewProps) {
  return (
    <div
      style={{
        background: "linear-gradient(to bottom right, #ffffff, #f9fafb)",
        padding: "48px",
        maxWidth: "896px",
        margin: "0 auto",
        borderRadius: "8px",
        border: "2px solid #e5e7eb",
      }}
    >
      {/* Decorative Header */}
      <div
        style={{ textAlign: "center", marginBottom: "48px", paddingBottom: "32px", borderBottom: "2px solid #d1d5db" }}
      >
        <div style={{ display: "inline-block", marginBottom: "16px" }}>
          <div
            style={{
              position: "relative",
              height: "80px",
              width: "80px",
              borderRadius: "50%",
              overflow: "hidden",
              margin: "0 auto",
              border: "4px solid #d1d5db",
            }}
          >
            <Image
              src={invoice.company?.logo || "/placeholder.svg"}
              alt={invoice.company?.name || "Company"}
              fill
              className="object-cover"
            />
          </div>
        </div>
        <h1
          style={{ fontSize: "48px", fontFamily: "serif", fontWeight: "bold", marginBottom: "8px", color: "#111827" }}
        >
          {invoice.company?.name || "Company Name"}
        </h1>
        <p style={{ fontSize: "14px", fontStyle: "italic", color: "#4b5563" }}>{invoice.company?.address || ""}</p>
        <div
          style={{
            marginTop: "24px",
            display: "inline-block",
            padding: "12px 32px",
            borderRadius: "9999px",
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
          }}
        >
          <span style={{ fontSize: "30px", fontFamily: "serif", fontWeight: "bold", color: "#111827" }}>INVOICE</span>
        </div>
      </div>

      {/* Invoice Details */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "24px",
          marginBottom: "48px",
          textAlign: "center",
        }}
      >
        <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "8px",
              color: "#4b5563",
            }}
          >
            Invoice Number
          </p>
          <p style={{ fontWeight: "600", color: "#111827" }}>{invoice.number}</p>
        </div>
        <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "8px",
              color: "#4b5563",
            }}
          >
            Issue Date
          </p>
          <p style={{ fontWeight: "600", color: "#111827" }}>{new Date(invoice.date).toLocaleDateString()}</p>
        </div>
        <div style={{ padding: "16px", borderRadius: "8px", backgroundColor: "#f9fafb", border: "1px solid #e5e7eb" }}>
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "8px",
              color: "#4b5563",
            }}
          >
            Due Date
          </p>
          <p style={{ fontWeight: "600", color: "#111827" }}>{new Date(invoice.dueDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Client Info */}
      <div
        style={{
          marginBottom: "48px",
          padding: "32px",
          borderRadius: "8px",
          backgroundColor: "#f9fafb",
          border: "1px solid #e5e7eb",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: "16px",
            color: "#4b5563",
          }}
        >
          Billed To
        </p>
        <p style={{ fontSize: "24px", fontFamily: "serif", fontWeight: "bold", marginBottom: "8px", color: "#111827" }}>
          {invoice.client?.name || "Client Name"}
        </p>
        <p style={{ fontSize: "14px", marginBottom: "4px", color: "#4b5563" }}>{invoice.client?.company || ""}</p>
        <p style={{ fontSize: "14px", color: "#4b5563" }}>{invoice.client?.address || ""}</p>
      </div>

      {/* Items */}
      <div style={{ marginBottom: "48px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #d1d5db" }}>
              <th
                style={{
                  textAlign: "left",
                  padding: "16px 0",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#374151",
                }}
              >
                Description
              </th>
              <th
                style={{
                  textAlign: "center",
                  padding: "16px 0",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#374151",
                }}
              >
                Qty
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "16px 0",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#374151",
                }}
              >
                Rate
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "16px 0",
                  fontSize: "12px",
                  fontWeight: "600",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "#374151",
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {(invoice.items || []).map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "16px 0", fontSize: "14px", color: "#111827" }}>{item.description}</td>
                <td style={{ padding: "16px 0", fontSize: "14px", textAlign: "center", color: "#4b5563" }}>
                  {item.quantity}
                </td>
                <td style={{ padding: "16px 0", fontSize: "14px", textAlign: "right", color: "#4b5563" }}>
                  {CURRENCY_SYMBOLS[invoice.currency]}
                  {(item.unitPrice ?? 0).toFixed(2)}
                </td>
                <td
                  style={{
                    padding: "16px 0",
                    fontSize: "14px",
                    textAlign: "right",
                    fontWeight: "600",
                    color: "#111827",
                  }}
                >
                  {CURRENCY_SYMBOLS[invoice.currency]}
                  {(item.amount ?? 0).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "48px" }}>
        <div
          style={{
            width: "384px",
            padding: "32px",
            borderRadius: "8px",
            background: "linear-gradient(to bottom right, #f9fafb, #f3f4f6)",
            border: "2px solid #d1d5db",
          }}
        >
          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "12px" }}>
              <span style={{ color: "#4b5563" }}>Subtotal</span>
              <span style={{ fontWeight: "500", color: "#111827" }}>
                {CURRENCY_SYMBOLS[invoice.currency]}
                {(invoice.subtotal ?? 0).toFixed(2)}
              </span>
            </div>
            {(invoice.discount ?? 0) > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "12px" }}>
                <span style={{ color: "#4b5563" }}>Discount</span>
                <span style={{ fontWeight: "500", color: "#111827" }}>
                  -{CURRENCY_SYMBOLS[invoice.currency]}
                  {(((invoice.subtotal ?? 0) * (invoice.discount ?? 0)) / 100).toFixed(2)}
                </span>
              </div>
            )}
            {(invoice.tax ?? 0) > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "12px" }}>
                <span style={{ color: "#4b5563" }}>Tax</span>
                <span style={{ fontWeight: "500", color: "#111827" }}>
                  +{CURRENCY_SYMBOLS[invoice.currency]}
                  {(
                    (((invoice.subtotal ?? 0) - ((invoice.subtotal ?? 0) * (invoice.discount ?? 0)) / 100) *
                      (invoice.tax ?? 0)) /
                    100
                  ).toFixed(2)}
                </span>
              </div>
            )}
          </div>
          <div style={{ borderTop: "2px solid #9ca3af", paddingTop: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "20px", fontFamily: "serif", fontWeight: "bold", color: "#111827" }}>
                Total Amount
              </span>
              <span style={{ fontSize: "30px", fontFamily: "serif", fontWeight: "bold", color: "#111827" }}>
                {CURRENCY_SYMBOLS[invoice.currency]}
                {(invoice.totalAmount ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ paddingTop: "32px", textAlign: "center", borderTop: "2px solid #d1d5db" }}>
        <p style={{ fontSize: "14px", marginBottom: "16px", color: "#4b5563" }}>{invoice.paymentInfo?.terms || ""}</p>
        <div style={{ fontSize: "12px", color: "#4b5563" }}>
          <p>
            Bank: {invoice.company?.bankDetails?.bankName || ""} | Account:{" "}
            {invoice.company?.bankDetails?.account || ""}
          </p>
          <p style={{ marginTop: "8px" }}>Thank you for your business</p>
        </div>
      </div>
    </div>
  )
}

function CreativeTemplate({ invoice }: InvoicePreviewProps) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        padding: "48px",
        maxWidth: "896px",
        margin: "0 auto",
        borderRadius: "8px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative Elements */}
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: "256px",
          height: "256px",
          borderRadius: "50%",
          backgroundColor: "#eff6ff",
          transform: "translate(128px, -128px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "192px",
          height: "192px",
          borderRadius: "50%",
          backgroundColor: "#faf5ff",
          transform: "translate(-96px, 96px)",
        }}
      />

      <div style={{ position: "relative", zIndex: 10 }}>
        {/* Header */}
        <div
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "48px" }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div
                style={{
                  height: "48px",
                  width: "48px",
                  borderRadius: "8px",
                  background: "linear-gradient(to bottom right, #2563eb, #9333ea)",
                }}
              />
              <h1 style={{ fontSize: "30px", fontWeight: "bold", color: "#111827" }}>
                {invoice.company?.name || "Company Name"}
              </h1>
            </div>
            <p style={{ fontSize: "14px", color: "#4b5563" }}>{invoice.company?.address || ""}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "inline-block",
                padding: "8px 24px",
                borderRadius: "9999px",
                marginBottom: "12px",
                background: "linear-gradient(to right, #2563eb, #9333ea)",
                color: "#ffffff",
              }}
            >
              <span style={{ fontSize: "24px", fontWeight: "bold" }}>INVOICE</span>
            </div>
            <div style={{ fontSize: "14px" }}>
              <p style={{ color: "#4b5563" }}>
                <span style={{ fontWeight: "500", color: "#111827" }}>#{invoice.number}</span>
              </p>
              <p style={{ color: "#4b5563" }}>{new Date(invoice.date).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Client Card */}
        <div
          style={{
            marginBottom: "48px",
            padding: "24px",
            borderRadius: "16px",
            background: "linear-gradient(to bottom right, #eff6ff, #faf5ff, transparent)",
            border: "1px solid #bfdbfe",
          }}
        >
          <p
            style={{
              fontSize: "12px",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: "12px",
              color: "#4b5563",
            }}
          >
            Bill To
          </p>
          <p style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "4px", color: "#111827" }}>
            {invoice.client?.name || "Client Name"}
          </p>
          <p style={{ fontSize: "14px", color: "#4b5563" }}>{invoice.client?.company || ""}</p>
          <p style={{ fontSize: "14px", color: "#4b5563" }}>{invoice.client?.address || ""}</p>
          <p style={{ fontSize: "14px", marginTop: "8px", color: "#4b5563" }}>{invoice.client?.email || ""}</p>
        </div>

        {/* Items */}
        <div style={{ marginBottom: "48px" }}>
          <div
            style={{
              borderRadius: "12px 12px 0 0",
              padding: "16px",
              background: "linear-gradient(to right, #dbeafe, #e9d5ff)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "6fr 2fr 2fr 2fr",
                gap: "16px",
                fontSize: "12px",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                color: "#111827",
              }}
            >
              <div>Description</div>
              <div style={{ textAlign: "center" }}>Qty</div>
              <div style={{ textAlign: "right" }}>Rate</div>
              <div style={{ textAlign: "right" }}>Amount</div>
            </div>
          </div>
          <div>
            {(invoice.items || []).map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "6fr 2fr 2fr 2fr",
                  gap: "16px",
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                }}
              >
                <div style={{ fontSize: "14px", color: "#111827" }}>{item.description}</div>
                <div style={{ fontSize: "14px", textAlign: "center", color: "#4b5563" }}>{item.quantity}</div>
                <div style={{ fontSize: "14px", textAlign: "right", color: "#4b5563" }}>
                  {CURRENCY_SYMBOLS[invoice.currency]}
                  {(item.unitPrice ?? 0).toFixed(2)}
                </div>
                <div style={{ fontSize: "14px", textAlign: "right", fontWeight: "600", color: "#111827" }}>
                  {CURRENCY_SYMBOLS[invoice.currency]}
                  {(item.amount ?? 0).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "48px" }}>
          <div
            style={{
              width: "384px",
              padding: "24px",
              borderRadius: "16px",
              background: "linear-gradient(to bottom right, #eff6ff, #faf5ff)",
              border: "1px solid #bfdbfe",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "12px" }}>
                <span style={{ color: "#4b5563" }}>Subtotal</span>
                <span style={{ fontWeight: "500", color: "#111827" }}>
                  {CURRENCY_SYMBOLS[invoice.currency]}
                  {(invoice.subtotal ?? 0).toFixed(2)}
                </span>
              </div>
              {(invoice.discount ?? 0) > 0 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "12px" }}
                >
                  <span style={{ color: "#4b5563" }}>Discount</span>
                  <span style={{ fontWeight: "500", color: "#111827" }}>
                    -{CURRENCY_SYMBOLS[invoice.currency]}
                    {(((invoice.subtotal ?? 0) * (invoice.discount ?? 0)) / 100).toFixed(2)}
                  </span>
                </div>
              )}
              {(invoice.tax ?? 0) > 0 && (
                <div
                  style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "12px" }}
                >
                  <span style={{ color: "#4b5563" }}>Tax</span>
                  <span style={{ fontWeight: "500", color: "#111827" }}>
                    +{CURRENCY_SYMBOLS[invoice.currency]}
                    {(
                      (((invoice.subtotal ?? 0) - ((invoice.subtotal ?? 0) * (invoice.discount ?? 0)) / 100) *
                        (invoice.tax ?? 0)) /
                      100
                    ).toFixed(2)}
                  </span>
                </div>
              )}
            </div>
            <div style={{ borderTop: "2px solid #93c5fd", paddingTop: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#111827" }}>Total</span>
                <span style={{ fontSize: "30px", fontWeight: "bold", color: "#2563eb" }}>
                  {CURRENCY_SYMBOLS[invoice.currency]}
                  {(invoice.totalAmount ?? 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px", fontSize: "14px" }}>
          <div style={{ padding: "24px", borderRadius: "12px", backgroundColor: "#f9fafb" }}>
            <h4 style={{ fontWeight: "600", marginBottom: "12px", color: "#111827" }}>Payment Information</h4>
            <p style={{ marginBottom: "8px", color: "#4b5563" }}>{invoice.paymentInfo?.terms || ""}</p>
            <div style={{ fontSize: "12px", color: "#4b5563" }}>
              <p style={{ margin: "4px 0" }}>Bank: {invoice.company?.bankDetails?.bankName || ""}</p>
              <p style={{ margin: "4px 0" }}>Account: {invoice.company?.bankDetails?.account || ""}</p>
              <p style={{ margin: "4px 0" }}>PIX: {invoice.company?.bankDetails?.pix || ""}</p>
            </div>
          </div>
          {invoice.paymentInfo?.notes && (
            <div style={{ padding: "24px", borderRadius: "12px", backgroundColor: "#f9fafb" }}>
              <h4 style={{ fontWeight: "600", marginBottom: "12px", color: "#111827" }}>Notes</h4>
              <p style={{ fontSize: "12px", color: "#4b5563" }}>{invoice.paymentInfo.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
