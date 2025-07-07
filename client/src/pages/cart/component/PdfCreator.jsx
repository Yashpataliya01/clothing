import React, { useState } from "react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";

const generatePDFContent = (
  cart,
  subtotal,
  discountAmount,
  applicableDiscount,
  userInfo
) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const margin = 10;
  const pageWidth = 210;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Your Company Name", margin, y);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  y += 5;
  doc.text("123 Business Street, City, Country", margin, y);
  y += 5;
  doc.text("Email: contact@company.com | Phone: +1234567890", margin, y);
  y += 10;

  // Invoice Details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text("Purchase Invoice", pageWidth - margin - 40, y, { align: "right" });
  y += 5;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const invoiceNumber = `INV-${Math.floor(100000 + Math.random() * 900000)}`;
  const invoiceDate = new Date().toLocaleDateString("en-GB");
  doc.text(`Invoice No: ${invoiceNumber}`, pageWidth - margin - 40, y, {
    align: "right",
  });
  y += 5;
  doc.text(`Date: ${invoiceDate}`, pageWidth - margin - 40, y, {
    align: "right",
  });
  y += 10;

  // Billing Info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Bill To:", margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Name: ${userInfo?.name || "N/A"}`, margin, y);
  y += 5;
  doc.text(`Email: ${userInfo?.email || "Not Available"}`, margin, y);
  y += 5;
  doc.text(`Phone: ${userInfo?.number || "Not Available"}`, margin, y);
  y += 10;

  // Cart Summary Table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Cart Summary", margin, y);
  y += 5;
  const colWidths = [10, 60, 30, 30, 30, 30];
  const tableX = margin;
  const headerY = y;
  doc.setFillColor(240, 240, 240);
  doc.rect(tableX, headerY, contentWidth, 8, "F");
  doc.setFontSize(10);
  doc.setTextColor(0);
  doc.text("S.No", tableX + 2, headerY + 6);
  doc.text("Item", tableX + colWidths[0] + 2, headerY + 6);
  doc.text("Qty", tableX + colWidths[0] + colWidths[1] + 2, headerY + 6);
  doc.text(
    "Price",
    tableX + colWidths[0] + colWidths[1] + colWidths[2] + 2,
    headerY + 6
  );
  doc.text(
    "Orig. Price",
    tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 2,
    headerY + 6
  );
  doc.text(
    "Total",
    tableX +
      colWidths[0] +
      colWidths[1] +
      colWidths[2] +
      colWidths[3] +
      colWidths[4] +
      2,
    headerY + 6
  );
  y += 8;

  // Table Rows
  doc.setFont("helvetica", "normal");
  cart?.products?.forEach((item, index) => {
    const quantity = item.quantity || 1;
    const price = item.product.discountedPrice || item.product.price;
    const itemTotal = price * quantity;
    const savings =
      item.product.price && item.product.discountedPrice
        ? (item.product.price - item.product.discountedPrice) * quantity
        : 0;
    y += 5;
    if (y > 260) {
      doc.addPage();
      y = margin;
    }
    if (index % 2 === 0) {
      doc.setFillColor(245, 245, 245);
      doc.rect(tableX, y, contentWidth, 10, "F");
    }
    doc.text(`${index + 1}`, tableX + 2, y + 6);
    doc.text(
      `${item.product.name} (${item.size})`,
      tableX + colWidths[0] + 2,
      y + 6,
      { maxWidth: colWidths[1] - 4 }
    );
    doc.text(`${quantity}`, tableX + colWidths[0] + colWidths[1] + 2, y + 6);
    doc.text(
      `₹${price.toLocaleString()}`,
      tableX + colWidths[0] + colWidths[1] + colWidths[2] + 2,
      y + 6
    );
    doc.text(
      savings > 0 ? `₹${item.product.price.toLocaleString()}` : "-",
      tableX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 2,
      y + 6
    );
    doc.text(
      `₹${itemTotal.toLocaleString()}`,
      tableX +
        colWidths[0] +
        colWidths[1] +
        colWidths[2] +
        colWidths[3] +
        colWidths[4] +
        2,
      y + 6
    );
    y += 10;
  });

  // Table Borders
  doc.setDrawColor(200);
  doc.setLineWidth(0.2);
  doc.rect(tableX, headerY, contentWidth, y - headerY);
  let x = tableX;
  colWidths.forEach((width) => {
    x += width;
    doc.line(x, headerY, x, y);
  });
  doc.line(tableX, headerY + 8, tableX + contentWidth, headerY + 8);

  // Order Summary
  y += 10;
  if (y > 260) {
    doc.addPage();
    y = margin;
  }
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Order Summary", margin, y);
  y += 5;
  const summaryColWidths = [120, 60];
  const summaryX = margin;
  doc.setFillColor(240, 240, 240);
  doc.rect(summaryX, y, contentWidth, 8, "F");
  doc.text("Description", summaryX + 2, y + 6);
  doc.text("Amount", summaryX + summaryColWidths[0] + 2, y + 6);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.text("Subtotal", summaryX + 2, y + 6);
  doc.text(
    `₹${(subtotal + discountAmount).toLocaleString()}`,
    summaryX + summaryColWidths[0] + 2,
    y + 6
  );
  y += 10;
  if (discountAmount > 0) {
    doc.setTextColor(0, 128, 0);
    doc.text(
      `Discount (${applicableDiscount?.name || "Discount"})`,
      summaryX + 2,
      y + 6
    );
    doc.text(
      `-₹${discountAmount.toLocaleString()}`,
      summaryX + summaryColWidths[0] + 2,
      y + 6
    );
    y += 10;
  }
  doc.setTextColor(0);
  doc.setFont("helvetica", "bold");
  doc.text("Total", summaryX + 2, y + 6);
  doc.text(
    `₹${subtotal.toLocaleString()}`,
    summaryX + summaryColWidths[0] + 2,
    y + 6
  );
  y += 10;
  doc.rect(summaryX, headerY + y - headerY - 38, contentWidth, 38);
  doc.line(
    summaryX + summaryColWidths[0],
    headerY + y - headerY - 38,
    summaryX + summaryColWidths[0],
    y
  );

  // Footer
  y += 10;
  if (y > 260) {
    doc.addPage();
    y = margin;
  }
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Thank you for your purchase!", margin, y);
  y += 5;
  doc.text("Contact us at support@company.com for any queries.", margin, y);

  return doc;
};

const uploadToCloudinary = async (pdfBlob) => {
  const formData = new FormData();
  formData.append("file", pdfBlob, "cart_summary.pdf");
  formData.append("upload_preset", "bg8efuux");
  formData.append("cloud_name", "dlyq8wjky");
  formData.append("resource_type", "raw");

  try {
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dlyq8wjky/raw/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    if (data.secure_url) return data.secure_url;
    throw new Error("Failed to upload PDF to Cloudinary");
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

const CartPDFGenerator = ({
  cart,
  subtotal,
  discountAmount,
  applicableDiscount,
  userInfo,
  onError,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAndSend = async () => {
    setIsGenerating(true);
    try {
      if (!cart?.products?.length) throw new Error("Cart is empty");
      const doc = generatePDFContent(
        cart,
        subtotal,
        discountAmount,
        applicableDiscount,
        userInfo
      );
      const pdfBlob = doc.output("blob");
      const pdfUrl = await uploadToCloudinary(pdfBlob);
      const message = `New order invoice: ${pdfUrl}`;
      const phoneNumber = "7665059655";
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    } catch (error) {
      onError(error.message || "Failed to generate or send invoice");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.button
      className={`w-full py-3 rounded-md text-white transition-all ${
        isGenerating || !cart?.products?.length
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800"
      }`}
      onClick={handleGenerateAndSend}
      disabled={isGenerating || !cart?.products?.length}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label="Generate and send invoice"
    >
      {isGenerating ? "Generating Invoice..." : "Proceed to Checkout"}
    </motion.button>
  );
};

export default CartPDFGenerator;
