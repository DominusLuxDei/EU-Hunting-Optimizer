import Papa from 'papaparse';

export const loadCSV = async (filePath: string): Promise<any[]> => {
  const response = await fetch(filePath);
  const text = await response.text();
  const result = Papa.parse(text, { header: true });
  return result.data;
};