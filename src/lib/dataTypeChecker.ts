/* eslint-disable @typescript-eslint/restrict-template-expressions */
import dayjs from 'dayjs';


export default (value: unknown, dataType: string): boolean => {
  if (dataType === 'STRING') {
    if (typeof value === 'string') return true;
    return false;
  }

  if (dataType === 'INTEGER') {
    if (typeof value === 'number' && Number.isInteger(value)) return true;
    return false;
  }

  if (dataType === 'BOOLEAN') {
    if (typeof value === 'boolean') return true;
    return false;
  }

  if (dataType === 'DATE') {
    if (typeof value === 'string' && dayjs(value).isValid()) return true;
    return false;
  }

  if (dataType === 'FLOAT') {
    if (typeof value === 'number' && !Number.isInteger(value)) return true;
    return false;
  }

  if (dataType === 'ARRAY') {
    if (Array.isArray(value)) return true;
    return false;
  }

  if (dataType === 'JSON') {
    if (typeof value === 'string') {
      try {
        JSON.parse(value);
        return true;
      }catch (e) {
        return false;
      }
    }
    return false;
  }

  if (dataType === 'UUID') {
    if (typeof value === 'string' && value.match(/^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/g)) return true;
    return false;
  }

  return false;
}