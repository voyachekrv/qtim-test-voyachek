import { loadConfig } from '../utils/config';

/**
 * Конфигурация пути к конфиг-файлу приложения
 */
export const configConfiguration = () => {
  return loadConfig();
};
