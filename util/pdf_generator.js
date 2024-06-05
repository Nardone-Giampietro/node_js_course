const fs = require('fs');
const PDFDocument = require('pdfkit');

function generateHeader(doc) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("FlempyPUP", 110, 57)
        .fontSize(10)
        .text("FlempyPUP", 200, 50, { align: "right" })
        .text("Via Paolo VI, 7", 200, 65, { align: "right" })
        .text("Pisa, PI, 56124", 200, 80, { align: "right" })
        .moveDown();
}

function generateCustomerInformation(doc, invoice) {
    doc
        .fillColor("#444444")
        .fontSize(20)
        .text("Invoice", 50, 160);

    generateHr(doc, 185);

    const customerInformationTop = 200;

    doc
        .fontSize(10)
        .text("Invoice ID:", 50, customerInformationTop)
        .font("Helvetica-Bold")
        .text(invoice._id.toString(), 150, customerInformationTop)
        .font("Helvetica")
        .text("Invoice Date:", 50, customerInformationTop + 15)
        .text(formatDate(new Date()), 150, customerInformationTop + 15)
        .moveDown();

    generateHr(doc, 235);
}
function generateTableRow(
    doc,
    y,
    item,
    title,
    unitCost,
    quantity,
    lineTotal
) {
    doc
        .fontSize(10)
        .text(item, 50, y)
        .text(title, 150, y)
        .text(unitCost, 280, y, { width: 90, align: "right" })
        .text(quantity, 370, y, { width: 90, align: "right" })
        .text(lineTotal, 0, y, { align: "right" });
}

function generateInvoiceTable(doc, invoice) {
    let Total = 0;
    const invoiceTableTop = 330;

    doc.font("Helvetica-Bold");
    generateTableRow(
        doc,
        invoiceTableTop,
        "Item",
        "Description",
        "Unit Cost",
        "Quantity",
        "Line Total"
    );
    generateHr(doc, invoiceTableTop + 20);
    doc.font("Helvetica");

    invoice.products.forEach((item, index) => {
        const position = invoiceTableTop + (index + 1) * 30;
        const itemTotalPrice = item.productId.price * item.quantity;
        Total += itemTotalPrice;
        generateTableRow(
            doc,
            position,
            item.productId.title,
            item.productId.title,
            formatCurrency(item.productId.price),
            item.quantity,
            formatCurrency(itemTotalPrice)
        );

        generateHr(doc, position + 20);
    });

    const subtotalPosition = invoiceTableTop + (invoice.products.length + 1) * 30;
    generateTableRow(
        doc,
        subtotalPosition,
        "",
        "",
        "Subtotal",
        "",
        formatCurrency(Total)
    );
}

function formatCurrency(price) {
    return "$" + (price).toFixed(2);
}

function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return year + "/" + month + "/" + day;
}
function generateFooter(doc) {
    doc
        .fontSize(10)
        .text('Thank you for your business.', 50, 780, { align: 'center', width: 500 });
}

function generateHr(doc, y) {
    doc
        .strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(50, y)
        .lineTo(550, y)
        .stroke();
}

exports.generateInvoice = (invoice, path) => {
    let doc = new PDFDocument({ size: "A4", margin: 50 });

    generateHeader(doc);
    generateCustomerInformation(doc, invoice);
    generateInvoiceTable(doc, invoice);
    generateFooter(doc);

    doc.end();
    doc.pipe(fs.createWriteStream(path));
}