import Papa from 'papaparse';
import yaml from 'js-yaml';
import { SecurityData } from '../types';

export async function parseFile(file: File): Promise<SecurityData[]> {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      
      try {
        switch (fileType) {
          case 'csv':
            Papa.parse(content, {
              header: true,
              dynamicTyping: true,
              complete: (results) => resolve(results.data as SecurityData[]),
              error: (error) => reject(error)
            });
            break;
            
          case 'json':
            const jsonData = JSON.parse(content);
            resolve(Array.isArray(jsonData) ? jsonData : [jsonData]);
            break;
            
          case 'yaml':
          case 'yml':
            const yamlData = yaml.load(content) as SecurityData | SecurityData[];
            resolve(Array.isArray(yamlData) ? yamlData : [yamlData]);
            break;
            
          default:
            reject(new Error('Unsupported file format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    
    reader.readAsText(file);
  });
}