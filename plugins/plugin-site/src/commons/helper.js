import enStrings from 'react-timeago/es6/language-strings/en';
import buildFormatter from 'react-timeago/es6/formatters/buildFormatter';

export const formatter = buildFormatter(Object.assign(enStrings, {
    'week': 'a week',
    'weeks': '%d weeks',
}));

export const formatPercentage = (pct) => `${pct.toPrecision(pct < 1 ? 2 : 3) }%`;

/* FIXME:
  This isn't the best way to do this, but plugins currently have a lot
  of repetitive goop in their titles.
  plugins leading with 'Jenkins' is particularly bad because then sorting
  on the name lumps a bunch of plugins toggether incorrectly.
  but even 'plugin' at the end of the string is just junk.
  All of these are plugins.

  FIXME - 2019-12-14 - Replace with regex so we don't have to worry about case
  */
export function cleanTitle(title) {
    if (!title) {
        return title;
    }
    return title
        .replace('Jenkins ', '')
        .replace('jenkins ', '')
        .replace(' Plugin', '')
        .replace(' plugin', '')
        .replace(' Plug-in', '')
        .replace(' plug-in', '')
        .replace(' for Jenkins', '')
        .replace('Hudson ', '');
}

export const defaultPluginSiteTitle = 'Jenkins Plugins';
export const pluginSiteTitleSuffix = 'Jenkins plugin';
