import { Injectable } from '@angular/core';

export interface ExportData {
  exportDate: Date;
  appVersion: string;
  modules: {
    [key: string]: any;
  };
}

export interface ImportResult {
  success: boolean;
  message: string;
  modulesImported: string[];
  errors?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class DataExportImportService {
  private readonly APP_VERSION = '1.0.0';

  /**
   * Export all LocalStorage data to JSON file
   */
  exportAllData(moduleName: string): void {
    try {
      const allData = this.collectAllLocalStorageData();
      const exportData: ExportData = {
        exportDate: new Date(),
        appVersion: this.APP_VERSION,
        modules: allData
      };

      this.downloadJSON(exportData, `omnischolar-${moduleName}-backup-${this.getTimestamp()}.json`);
    } catch (error) {
      console.error('Export failed:', error);
      throw new Error('Failed to export data. Please try again.');
    }
  }

  /**
   * Export specific module data
   */
  exportModuleData(moduleName: string, data: any): void {
    try {
      const exportData: ExportData = {
        exportDate: new Date(),
        appVersion: this.APP_VERSION,
        modules: {
          [moduleName]: data
        }
      };

      this.downloadJSON(exportData, `omnischolar-${moduleName}-${this.getTimestamp()}.json`);
    } catch (error) {
      console.error('Module export failed:', error);
      throw new Error(`Failed to export ${moduleName} data. Please try again.`);
    }
  }

  /**
   * Import data from JSON file
   */
  async importData(file: File, options: { merge: boolean } = { merge: false }): Promise<ImportResult> {
    try {
      const jsonData = await this.readJSONFile(file);
      
      // Validate structure
      if (!this.isValidExportData(jsonData)) {
        return {
          success: false,
          message: 'Invalid file format. Please select a valid OmniScholar backup file.',
          modulesImported: []
        };
      }

      const exportData = jsonData as ExportData;
      const modulesImported: string[] = [];
      const errors: string[] = [];

      // Import each module's data
      for (const [moduleName, moduleData] of Object.entries(exportData.modules)) {
        try {
          if (options.merge) {
            // Merge with existing data
            this.mergeModuleData(moduleName, moduleData);
          } else {
            // Replace existing data
            this.replaceModuleData(moduleName, moduleData);
          }
          modulesImported.push(moduleName);
        } catch (error) {
          errors.push(`${moduleName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      return {
        success: modulesImported.length > 0,
        message: modulesImported.length > 0 
          ? `Successfully imported ${modulesImported.length} module(s)` 
          : 'No data was imported',
        modulesImported,
        errors: errors.length > 0 ? errors : undefined
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to import data',
        modulesImported: []
      };
    }
  }

  /**
   * Get all LocalStorage keys and their data
   */
  private collectAllLocalStorageData(): { [key: string]: any } {
    const data: { [key: string]: any } = {};
    
    // Collect data from all known modules
    const modules = [
      'paper-pilot',
      'omni-ai',
      'lab-sync',
      'citation-network',
      'library'
    ];

    modules.forEach(module => {
      const moduleData = this.getModuleDataFromStorage(module);
      if (moduleData) {
        data[module] = moduleData;
      }
    });

    return data;
  }

  /**
   * Get module data from LocalStorage
   */
  private getModuleDataFromStorage(moduleName: string): any {
    try {
      // Try different possible key patterns
      const possibleKeys = [
        `${moduleName}-data`,
        moduleName,
        `omnischolar-${moduleName}`,
        `omni_${moduleName}`
      ];

      const collectedData: any = {};

      possibleKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            collectedData[key] = JSON.parse(data);
          } catch {
            collectedData[key] = data;
          }
        }
      });

      // Also collect all keys that start with the module name
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.toLowerCase().includes(moduleName.toLowerCase())) {
          if (!collectedData[key]) {
            const data = localStorage.getItem(key);
            if (data) {
              try {
                collectedData[key] = JSON.parse(data);
              } catch {
                collectedData[key] = data;
              }
            }
          }
        }
      }

      return Object.keys(collectedData).length > 0 ? collectedData : null;
    } catch (error) {
      console.error(`Failed to get ${moduleName} data:`, error);
      return null;
    }
  }

  /**
   * Replace module data in LocalStorage
   */
  private replaceModuleData(moduleName: string, data: any): void {
    // Clear existing module data
    this.clearModuleData(moduleName);

    // Write new data
    for (const [key, value] of Object.entries(data)) {
      try {
        const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
        localStorage.setItem(key, jsonValue);
      } catch (error) {
        console.error(`Failed to restore ${key}:`, error);
      }
    }
  }

  /**
   * Merge module data with existing LocalStorage data
   */
  private mergeModuleData(moduleName: string, newData: any): void {
    for (const [key, value] of Object.entries(newData)) {
      try {
        const existing = localStorage.getItem(key);
        
        if (existing && typeof value === 'object' && !Array.isArray(value)) {
          // Merge objects
          const existingObj = JSON.parse(existing);
          const merged = { ...existingObj, ...value };
          localStorage.setItem(key, JSON.stringify(merged));
        } else if (existing && Array.isArray(value)) {
          // Merge arrays (concatenate and deduplicate by id if present)
          const existingArr = JSON.parse(existing);
          const merged = this.mergeArrays(existingArr, value);
          localStorage.setItem(key, JSON.stringify(merged));
        } else {
          // Just set the value
          const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
          localStorage.setItem(key, jsonValue);
        }
      } catch (error) {
        console.error(`Failed to merge ${key}:`, error);
      }
    }
  }

  /**
   * Merge two arrays, deduplicating by id if present
   */
  private mergeArrays(arr1: any[], arr2: any[]): any[] {
    const hasId = arr1.length > 0 && 'id' in arr1[0];
    
    if (hasId) {
      const map = new Map();
      [...arr1, ...arr2].forEach(item => {
        if (item.id) {
          map.set(item.id, item);
        }
      });
      return Array.from(map.values());
    }
    
    return [...arr1, ...arr2];
  }

  /**
   * Clear all data for a module
   */
  private clearModuleData(moduleName: string): void {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.toLowerCase().includes(moduleName.toLowerCase())) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  /**
   * Download data as JSON file
   */
  private downloadJSON(data: any, filename: string): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Read and parse JSON file
   */
  private readJSONFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!file.name.endsWith('.json')) {
        reject(new Error('Please select a JSON file'));
        return;
      }

      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          resolve(json);
        } catch (error) {
          reject(new Error('Invalid JSON file'));
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };

      reader.readAsText(file);
    });
  }

  /**
   * Validate export data structure
   */
  private isValidExportData(data: any): boolean {
    return (
      data &&
      typeof data === 'object' &&
      'exportDate' in data &&
      'appVersion' in data &&
      'modules' in data &&
      typeof data.modules === 'object'
    );
  }

  /**
   * Get timestamp for filename
   */
  private getTimestamp(): string {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  }

  /**
   * Clear all app data (use with caution)
   */
  clearAllData(): void {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone!')) {
      localStorage.clear();
      alert('All data has been cleared. Please refresh the page.');
    }
  }
}
