import * as yaml from 'js-yaml';
import * as fs from 'fs';
import * as path from 'path';

type ConfigurationType = Record<string, unknown>;

const CONFIGURATION_FILE = 'configuration.yml';

/**
 * Чтение и загрузка настроек приложения из конфиг-файла
 */
export const loadConfig = (): ConfigurationType =>
  yaml.load(fs.readFileSync(path.join(process.cwd(), CONFIGURATION_FILE), 'utf8')) as ConfigurationType;
