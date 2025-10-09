// دالة لطباعة الفاتورة مع البيانات
function printInvoice(orderData) {
  // إنشاء نافذة جديدة للطباعة
  const printWindow = window.open("", "_blank", "width=800,height=600");

  // HTML للفاتورة
  const invoiceHTML = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>فاتورة طلب - ناصر للتجارة والتوزيع</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800&display=swap" rel="stylesheet">
            <style>
                * {
                    font-family: 'Cairo', sans-serif;
                }
                
                @media print {
                    @page {
                        size: A4;
                        margin: 15mm;
                    }
                    
                    * {
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                        color-adjust: exact !important;
                    }
                    
                    body {
                        background: white !important;
                    }
                }
            </style>
        </head>
        <body class="bg-white p-8">
            <div class="max-w-5xl mx-auto">
                <!-- Header with Logo -->
                <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b-4 border-[#2C6D90] gap-6">
                    <div class="flex items-center gap-4">
                        <div class="w-20 h-20 bg-gradient-to-br from-[#2C6D90] to-[#4A90E2] rounded-2xl flex items-center justify-center shadow-xl">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                        </div>
                        <div>
                            <h1 class="text-3xl md:text-4xl font-bold text-[#2C6D90] mb-1">ناصر للتجارة والتوزيع</h1>
                            <p class="text-gray-600 text-lg">Nasr Trading & Distribution</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-sm text-gray-500 mb-1">رقم الطلب</div>
                        <div class="text-2xl md:text-3xl font-bold text-gray-800">#${
                          orderData.orderNumber || orderData.id || "غير محدد"
                        }</div>
                        <div class="text-sm text-gray-500 mt-2">${new Date(
                          orderData.createdAt ||
                            orderData.orderDate ||
                            new Date()
                        ).toLocaleDateString("ar-SA")}</div>
                    </div>
                </div>

                <!-- Customer Info -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 bg-gradient-to-br from-[#2C6D90]/10 to-[#4A90E2]/10 rounded-xl border-2 border-[#2C6D90]/20">
                    <div>
                        <div class="text-sm text-gray-600 mb-1 font-semibold">اسم العميل</div>
                        <div class="text-lg font-bold text-gray-800">${
                          orderData.customerName || "غير محدد"
                        }</div>
                    </div>
                    <div>
                        <div class="text-sm text-gray-600 mb-1 font-semibold">رقم الهاتف</div>
                        <div class="text-lg font-bold text-gray-800">${
                          orderData.customerPhone || "غير محدد"
                        }</div>
                    </div>
                </div>

                <!-- Items Table -->
                <div class="mb-8">
                    <h2 class="text-xl md:text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                        <div class="w-1.5 h-7 bg-[#2C6D90] rounded-full"></div>
                        تفاصيل الطلب
                    </h2>
                    <div class="overflow-x-auto rounded-xl border-2 border-gray-200 shadow-lg">
                        <table class="w-full min-w-[600px]">
                            <thead>
                                <tr class="bg-gradient-to-r from-[#2C6D90] to-[#4A90E2] text-white">
                                    <th class="text-right py-4 px-4 md:px-6 font-bold text-sm md:text-base">المنتج</th>
                                    <th class="text-center py-4 px-4 md:px-6 font-bold text-sm md:text-base">الكمية</th>
                                    <th class="text-center py-4 px-4 md:px-6 font-bold text-sm md:text-base">السعر</th>
                                    <th class="text-center py-4 px-4 md:px-6 font-bold text-sm md:text-base">المجموع</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white">
                                ${generateItemsRows(orderData.items || [])}
                            </tbody>
                        </table>
                    </div>
                </div>


                <!-- Footer -->
                <div class="pt-8 border-t-2 border-gray-200">
                    <div class="bg-gradient-to-r from-[#2C6D90]/10 to-[#4A90E2]/10 rounded-xl p-6 border-2 border-[#2C6D90]/20">
                        <div class="text-center">
                            <p class="text-[#2C6D90] font-bold text-lg md:text-xl mb-2">
                                شكراً لاختياركم ناصر للتجارة والتوزيع
                            </p>
                            <p class="text-gray-600 text-sm md:text-base mb-3">
                                نلتزم بتقديم أفضل المنتجات والخدمات
                            </p>
                            <div class="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-xs md:text-sm text-gray-600">
                                <span>📞 +964 XXX XXX XXXX</span>
                                <span class="hidden md:inline">•</span>
                                <span>📧 info@nasr-trading.com</span>
                                <span class="hidden md:inline">•</span>
                                <span>📍 البصرة، العراق</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Print Date -->
                <div class="mt-6 text-center text-xs md:text-sm text-gray-500">
                    <span>تاريخ الطباعة: ${new Date().toLocaleDateString(
                      "ar-SA"
                    )}</span>
                </div>
            </div>
        </body>
        </html>
    `;

  // كتابة HTML في النافذة الجديدة
  printWindow.document.write(invoiceHTML);
  printWindow.document.close();

  // طباعة النافذة
  printWindow.focus();
  printWindow.print();
  printWindow.close();
}

// دالة لإنشاء صفوف المنتجات
function generateItemsRows(items) {
  return items
    .map((item, index) => {
      const total = (item.price || 0) * (item.quantity || 0);
      return `
            <tr class="border-b border-gray-200 ${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            }">
                <td class="py-4 px-4 md:px-6">
                    <div class="font-bold text-gray-800 text-sm md:text-base mb-1">
                        ${
                          item.product?.name ||
                          item.name ||
                          `منتج #${item.productId?.slice(-6) || "غير محدد"}`
                        }
                    </div>
                    <div class="text-xs md:text-sm text-gray-500">
                        ${item.product?.brand?.name || item.brand || "غير محدد"}
                    </div>
                </td>
                <td class="text-center py-4 px-4 md:px-6">
                    <span class="inline-block bg-[#2C6D90]/10 text-[#2C6D90] font-bold px-3 md:px-4 py-1 rounded-lg text-sm md:text-base">
                        ${item.quantity || 0}
                    </span>
                </td>
                <td class="text-center py-4 px-4 md:px-6 font-semibold text-gray-700 text-sm md:text-base">
                    ${(item.price || 0).toLocaleString()} د.ع
                </td>
                <td class="text-center py-4 px-4 md:px-6 font-bold text-[#2C6D90] text-sm md:text-base">
                    ${total.toLocaleString()} د.ع
                </td>
            </tr>
        `;
    })
    .join("");
}

// دالة لحساب المجموع الفرعي
function calculateSubtotal(items) {
  return items.reduce((total, item) => {
    return total + (item.price || 0) * (item.quantity || 0);
  }, 0);
}

// تصدير الدوال للاستخدام في الملفات الأخرى
// eslint-disable-next-line no-undef
if (typeof module !== "undefined" && module.exports) {
  // eslint-disable-next-line no-undef
  module.exports = { printInvoice, generateItemsRows, calculateSubtotal };
}

// تصدير للاستخدام في المتصفح
if (typeof window !== "undefined") {
  window.printInvoice = printInvoice;
  window.generateItemsRows = generateItemsRows;
  window.calculateSubtotal = calculateSubtotal;
}
