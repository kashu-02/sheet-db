import dayjs from 'dayjs';

export default (value: unknown, dataType: string): string | number | boolean => {
  if (dataType === 'STRING') {
    return String(value) 
  }

  if (dataType === 'INTEGER' || dataType === 'FLOAT') {
    return Number(value)
  }
 
  if (dataType === 'BOOLEAN') {
    return value as boolean
  }

  if (dataType === 'DATE') {
    if(!value) return ""
    return dayjs(value as string).toISOString()
  }

  if (dataType === 'ARRAY') {
    return value as string
  }

  if (dataType === 'JSON') {
    return JSON.stringify(value) 
  }

  if (dataType === 'UUID') {
    return value as string
  }

  throw new Error('Invalid data type');
}