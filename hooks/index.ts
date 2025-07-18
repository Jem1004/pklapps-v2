// Custom Hooks Exports
export { useAuth } from './useAuth';
export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export { useAbsensi } from './useAbsensi';
export { useWaktuAbsensi } from './useWaktuAbsensi';
export {
  default as useErrorHandling,
  useApiErrorHandling,
  useFormErrorHandling,
  useCriticalErrorHandling,
  type UseErrorHandlingOptions,
  type UseErrorHandlingReturn
} from './useErrorHandling';

// TODO: Add more custom hooks as needed
// export { useAbsensi } from './useAbsensi';
// export { useJurnal } from './useJurnal';