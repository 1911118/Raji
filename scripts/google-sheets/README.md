# Rajdelver Data Management with Google Sheets

This integration allows you to use Google Sheets as a data management interface for the Rajdelver grocery delivery platform. It provides a way to view and manage data through a familiar spreadsheet interface.

## Features

- CSV export/import functionality
- Role-based data organization (Customers, Shop Owners, Delivery Agents)
- Simple data management through Google Sheets
- Secure data handling

## Setup Instructions

### 1. Generate CSV Files

Run the setup script to generate CSV files with the initial data structure:

```bash
npm run setup-sheets
```

This will create CSV files in the `scripts/google-sheets/data` directory:
- users.csv
- products.csv
- orders.csv
- orderhistory.csv

### 2. Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Create four sheets named:
   - Users
   - Products
   - Orders
   - OrderHistory
4. Import each CSV file into its corresponding sheet:
   - File > Import > Upload > Select CSV file
   - Choose "Replace current sheet"
   - Click "Import data"

### 3. Share the Sheet

1. Click the "Share" button
2. Add team members with appropriate access levels:
   - View only: For most team members
   - Edit: For administrators and data managers
3. Copy the sharing link for reference

### 4. Data Management

#### Viewing Data
- Open the Google Sheet to view all data
- Each sheet represents a different collection:
  - Users: Customer, shop owner, and delivery agent information
  - Products: Product catalog with prices and stock
  - Orders: Active orders with status
  - OrderHistory: Completed orders for analysis

#### Making Updates
1. Edit the Google Sheet directly
2. Export updated data as CSV when needed
3. Use the exported CSV to update the database

#### Exporting Data
1. Select the sheet you want to export
2. File > Download > Comma-separated values (.csv)
3. Save the file with an appropriate name

## Security Considerations

1. Keep the Google Sheet access restricted to authorized users
2. Don't share sensitive information in the sheet
3. Regularly audit access permissions
4. Export and backup data regularly

## Best Practices

1. **Data Organization**
   - Keep the sheet structure clean and organized
   - Use filters and sorting for better data management
   - Freeze header rows for easier navigation

2. **Data Validation**
   - Use Google Sheets data validation features
   - Create dropdown lists for status fields
   - Set up number formatting for prices and quantities

3. **Collaboration**
   - Use comments for important notes
   - Set up notification rules for changes
   - Create a changelog sheet for tracking modifications

4. **Backup**
   - Export data regularly
   - Keep multiple backup copies
   - Document any major changes

## Troubleshooting

### Common Issues

1. **Data Import Problems**
   - Check CSV file format
   - Verify column headers match
   - Ensure data types are correct

2. **Access Issues**
   - Verify sharing settings
   - Check user permissions
   - Contact sheet owner if needed

3. **Data Sync Issues**
   - Export fresh data from the database
   - Compare with sheet data
   - Update as needed

### Support

For issues and support:
1. Check the CSV files for data structure
2. Review sheet permissions
3. Contact the development team

## Maintenance

1. Regularly backup the Google Sheet
2. Clean up old data periodically
3. Update access permissions as needed
4. Review and update data validation rules

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 