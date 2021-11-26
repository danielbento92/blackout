import initial from 'lodash/initial';
import type { Breadcrumb } from '../types';

/**
 * Agreggate all the url texts in breadcrumbs into strings separated by commas.
 *
 * @memberof module:contents/utils
 *
 * @example
 * const breadcrumbs = [{ text: 'Homepage' }, { text: 'About' }];
 * const categories = getCategories(breadcrumbs);
 * Result of categories = 'About';
 *
 * @param {object} breadcrumbs - All the bredcrumbs links.
 *
 * @returns {string} - Breadcrumbs url text divided by commas.
 */
const getCategories = (breadcrumbs: Breadcrumb[]): string | undefined => {
  // Remove the first entry of the array (E.g. Always Homepage).
  const breadcrumbsInitial = initial(breadcrumbs);

  if (!breadcrumbsInitial.length) {
    return undefined;
  }

  // Couldn´t use reduce because breadcrumbs will have just one item often.
  return breadcrumbsInitial.map(breadcrumb => breadcrumb.text).join();
};

export default getCategories;
