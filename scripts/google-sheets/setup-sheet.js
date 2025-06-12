const fs = require('fs');
const path = require('path');

// Sheet structure definitions
const sheetStructures = {
  Users: {
    headers: ['UserID', 'Email', 'PasswordHash', 'Role', 'Name', 'Phone', 'Address', 'CreatedAt', 'UpdatedAt', 'JWTToken'],
    sampleData: [
      ['u1', 'john@example.com', 'hashed_password', 'customer', 'John Doe', '1234567890', '123 Main St', new Date().toISOString(), new Date().toISOString(), ''],
      ['u2', 'shop1@example.com', 'hashed_password', 'shop', 'Shop One', '2345678901', '456 Market St', new Date().toISOString(), new Date().toISOString(), ''],
      ['u3', 'agent1@example.com', 'hashed_password', 'delivery', 'Agent Smith', '3456789012', '789 Delivery St', new Date().toISOString(), new Date().toISOString(), '']
    ]
  },
  Products: {
    headers: ['ProductID', 'ShopID', 'Name', 'Description', 'Price', 'Stock', 'Category', 'CreatedAt', 'UpdatedAt'],
    sampleData: [
      ['p1', 'u2', 'Apple', 'Fresh Red Apple', 1.5, 100, 'Fruits', new Date().toISOString(), new Date().toISOString()],
      ['p2', 'u2', 'Banana', 'Yellow Banana', 0.5, 200, 'Fruits', new Date().toISOString(), new Date().toISOString()]
    ]
  },
  Orders: {
    headers: ['OrderID', 'CustomerID', 'ShopID', 'DeliveryAgentID', 'Products', 'TotalPrice', 'Status', 'PIN', 'CreatedAt', 'UpdatedAt', 'TrackingLocation'],
    sampleData: [
      ['o1', 'u1', 'u2', 'u3', '[{"p1": 5}]', 7.5, 'pending', '123456', new Date().toISOString(), new Date().toISOString(), '']
    ]
  },
  OrderHistory: {
    headers: ['OrderID', 'CustomerID', 'ShopID', 'DeliveryAgentID', 'Products', 'TotalPrice', 'Status', 'PIN', 'CreatedAt', 'CompletedAt', 'TrackingHistory'],
    sampleData: [
      ['o2', 'u1', 'u2', 'u3', '[{"p2": 10}]', 5.0, 'delivered', '654321', new Date().toISOString(), new Date().toISOString(), '[]']
    ]
  }
};

function generateCSV(headers, data) {
  const headerRow = headers.join(',');
  const dataRows = data.map(row => row.join(','));
  return [headerRow, ...dataRows].join('\n');
}

function createCSVFiles() {
  const outputDir = path.join(__dirname, 'data');
  
  // Create output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate CSV files for each sheet
  for (const [sheetName, structure] of Object.entries(sheetStructures)) {
    const csvContent = generateCSV(structure.headers, structure.sampleData);
    const filePath = path.join(outputDir, `${sheetName.toLowerCase()}.csv`);
    fs.writeFileSync(filePath, csvContent);
    console.log(`Created ${filePath}`);
  }

  // Create a README file with instructions
  const readmeContent = `# Rajdelver Data Files

These CSV files contain the initial data for the Rajdelver platform. To use them:

1. Create a new Google Sheet
2. Create separate sheets for each CSV file (Users, Products, Orders, OrderHistory)
3. Import each CSV file into its corresponding sheet
4. Share the sheet with your team members

Note: Make sure to keep these files secure as they contain sensitive information.
`;
  
  fs.writeFileSync(path.join(outputDir, 'README.txt'), readmeContent);
  console.log('Created README.txt with instructions');
}

// Run setup
createCSVFiles(); 