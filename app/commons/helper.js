 /* FIXME:
  This isn't the best way to do this, but plugins currently have a lot
  of repetitive goop in their titles.
  plugins leading with 'Jenkins' is particularly bad because then sorting
  on the name lumps a bunch of plugins toggether incorrectly.
  but even 'plugin' at the end of the string is just junk.
  All of these are plugins.
  */
export function cleanTitle(title) {
  return title
    .replace('Jenkins ','')
    .replace(' Plugin','')
    .replace(' plugin','')
    .replace(' Plug-in','')
    .replace(' for Jenkins','')
    .replace('Hudson ','');
}

export const defaultPluginSiteTitle = 'Jenkins Plugins';
export const pluginSiteTitleSuffix = 'Jenkins plugin';
