// jsonToCsv.js
import fs from 'fs';
import { parse } from 'json2csv';

/**
 * Convert JSON data to CSV and save it to a file.
 * @param {Array} jsonData - Array of objects containing the review data.
 * @param {Array} selectedFields - Fields from the JSON data to include in the CSV.
 * @param {string} outputFileName - The name of the CSV file to be saved.
 */
function jsonToCsv(jsonData, selectedFields, outputFileName) {
  // Filter data to only include selected fields
  const filteredData = jsonData.map(item => {
    return selectedFields.reduce((result, field) => {
      result[field] = item[field];
      return result;
    }, {});
  });

  // Convert filtered data to CSV
  const csv = parse(filteredData);

  // Save the CSV data to a file
  fs.writeFile(outputFileName, csv, (err) => {
    if (err) {
      console.error('Error writing CSV file:', err);
    } else {
      console.log(`CSV file saved successfully as ${outputFileName}!`);
    }
  });
}

// Export the function for use in other files
export { jsonToCsv };
