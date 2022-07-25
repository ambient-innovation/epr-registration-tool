import { TFunction } from 'next-i18next'

/***
 * Transforms:
 *
 * {
 *   OPTION_1: 'common:path.to.option.1',
 *   OPTION_2: 'common:path.to.option.2',
 * }
 *
 * into:
 *
 * [
 *    {value: 'OPTION_1', label: 'Translated Option 1'},
 *    {value: 'OPTION_2', label: 'Translated Option 2'},
 * ]
 *
 * */
export const getTranslatedOptions = (
  transMap: Record<string, string>,
  t: TFunction
) =>
  Object.entries(transMap).map(([key, transKey]) => ({
    value: key,
    label: t(transKey),
  }))
