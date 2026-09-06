export type RemoteGeneratorSchema = {
  name: string;
  port?: number;
  title?: string;
  blurb?: string;
  /** Git clone URL for pull-remote (optional at scaffold time) */
  repo?: string;
  /** Production remoteEntry.js URL */
  prodEntry?: string;
};
