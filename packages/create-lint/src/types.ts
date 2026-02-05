export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export type ReactFramework = 'next' | 'remix' | 'vite' | 'expo' | true | false;

export type ConfigTool =
  | 'eslint'
  | 'prettier'
  | 'stylelint'
  | 'commitlint'
  | 'remarklint'
  | 'semantic-release';

export interface ProjectInfo {
  existingConfigs: ConfigTool[];
  hasReact: boolean;
  hasTypeScript: boolean;
  name: string;
  packageManager: PackageManager;
  reactFramework: ReactFramework;
}

export interface CliOptions {
  commitlint?: boolean;
  eslint?: boolean;
  help?: boolean;
  install?: boolean;
  manual?: boolean;
  preset?: boolean;
  prettier?: boolean;
  react?: string;
  remarklint?: boolean;
  semanticRelease?: boolean;
  stylelint?: boolean;
  yes?: boolean;
}

export interface UserSelections {
  installDeps: boolean;
  reactFramework: ReactFramework;
  tools: ConfigTool[];
}

export interface GeneratorContext {
  cwd: string;
  projectInfo: ProjectInfo;
  selections: UserSelections;
}

export interface GeneratedFile {
  content: string;
  path: string;
}

export interface ConfigMeta {
  configFile: string;
  displayName: string;
  name: ConfigTool;
  package: string;
  peerDependencies: string[];
}
