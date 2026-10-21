import { cssVar, Highlighter, SearchBar, Segmented, Select, Tag } from '@lobehub/ui';
import { ChevronRight, ExternalLink, Wrench } from 'lucide-react';
import { type CSSProperties, type ReactNode, useMemo, useState } from 'react';

import type { PrettierToolData, RuleEntry, RuleLevel, RuleToolData } from './types';

type LevelFilter = 'all' | RuleLevel;

const LEVEL_COLOR: Record<RuleLevel, string> = {
  error: cssVar.colorError,
  off: cssVar.colorTextQuaternary,
  warn: cssVar.colorWarning,
};

const LEVEL_TAG: Record<RuleLevel, string> = { error: 'error', off: 'gray', warn: 'warning' };

const styles = `
.lr-root { display: flex; flex-direction: column; gap: 16px; margin-block: 24px; }
.lr-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 10px; }
.lr-card {
  display: flex; flex-direction: column; gap: 2px;
  padding: 12px 14px;
  border: 1px solid ${cssVar.colorBorderSecondary};
  border-radius: 12px;
  background: ${cssVar.colorBgContainer};
}
.lr-card-value { display: flex; gap: 8px; align-items: center; font-size: 24px; font-weight: 600; line-height: 1.2; }
.lr-card-label { font-size: 13px; color: ${cssVar.colorTextSecondary}; }
.lr-panel {
  display: flex; flex-direction: column; gap: 12px;
  padding: 16px;
  border: 1px solid ${cssVar.colorBorderSecondary};
  border-radius: 12px;
  background: ${cssVar.colorBgContainer};
}
.lr-muted { font-size: 13px; color: ${cssVar.colorTextSecondary}; }
.lr-toolbar { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.lr-dot { display: inline-block; width: 8px; height: 8px; margin-inline-end: 6px; border-radius: 50%; }
.lr-bars { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 6px 16px; }
.lr-bar {
  cursor: pointer;
  display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 4px 8px; align-items: center;
  padding: 6px 8px;
  border: none; border-radius: 8px;
  background: transparent; color: inherit;
  font: inherit; font-size: 12px; text-align: start;
}
.lr-bar:hover, .lr-bar[data-active='true'] { background: ${cssVar.colorFillTertiary}; }
.lr-bar-name { overflow: hidden; font-family: ${cssVar.fontFamilyCode}; text-overflow: ellipsis; white-space: nowrap; }
.lr-bar-track { grid-column: 1 / -1; display: flex; overflow: hidden; height: 6px; border-radius: 3px; background: ${cssVar.colorFillQuaternary}; }
.lr-group { display: flex; flex-direction: column; }
.lr-group-title {
  display: flex; gap: 8px; align-items: baseline;
  padding: 12px 4px 6px;
  font-family: ${cssVar.fontFamilyCode}; font-size: 14px; font-weight: 600;
}
.lr-row { border-block-start: 1px solid ${cssVar.colorBorderSecondary}; }
.lr-row-head {
  cursor: pointer;
  display: grid; grid-template-columns: 20px minmax(0, 1fr) auto; gap: 8px; align-items: center;
  width: 100%; padding: 8px 4px;
  border: none; background: transparent; color: inherit;
  font: inherit; text-align: start;
}
.lr-row-head:hover { background: ${cssVar.colorFillQuaternary}; }
.lr-chevron { color: ${cssVar.colorTextTertiary}; transition: transform 0.15s; }
.lr-row[data-open='true'] .lr-chevron { transform: rotate(90deg); }
.lr-name { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
.lr-id { font-family: ${cssVar.fontFamilyCode}; font-size: 13px; overflow-wrap: anywhere; }
.lr-id a { color: inherit; text-decoration: none; }
.lr-id a:hover { color: ${cssVar.colorPrimary}; }
.lr-desc { font-size: 12px; color: ${cssVar.colorTextSecondary}; }
.lr-badges { display: flex; flex-wrap: wrap; gap: 4px; justify-content: flex-end; }
.lr-detail { display: flex; flex-direction: column; gap: 10px; padding: 4px 4px 14px 32px; font-size: 13px; }
.lr-detail-label { margin-block-end: 4px; font-size: 12px; font-weight: 600; color: ${cssVar.colorTextSecondary}; }
.lr-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.lr-code { padding: 1px 6px; border-radius: 4px; background: ${cssVar.colorFillTertiary}; font-family: ${cssVar.fontFamilyCode}; font-size: 12px; }
.lr-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.lr-table th, .lr-table td { padding: 8px; border-block-end: 1px solid ${cssVar.colorBorderSecondary}; text-align: start; vertical-align: top; }
.lr-table th { font-weight: 600; color: ${cssVar.colorTextSecondary}; }
.lr-empty { padding: 24px; text-align: center; color: ${cssVar.colorTextTertiary}; }
`;

const countLevels = (rules: RuleEntry[]) => {
  const counts = { error: 0, fixable: 0, off: 0, warn: 0 };
  for (const rule of rules) {
    counts[rule.level] += 1;
    if (rule.fixable) counts.fixable += 1;
  }
  return counts;
};

const LevelBar = ({ rules }: { rules: RuleEntry[] }) => {
  const counts = countLevels(rules);
  return (
    <span className="lr-bar-track">
      {(['error', 'warn', 'off'] as const).map((level) => (
        <span
          key={level}
          style={{
            background: LEVEL_COLOR[level],
            width: `${(counts[level] / rules.length) * 100}%`,
          }}
        />
      ))}
    </span>
  );
};

const StatCard = ({ color, label, value }: { color?: string; label: string; value: ReactNode }) => (
  <div className="lr-card">
    <span className="lr-card-value">
      {color && <span className="lr-dot" style={{ background: color }} />}
      {value}
    </span>
    <span className="lr-card-label">{label}</span>
  </div>
);

const Footer = ({ generatedAt }: { generatedAt: string }) => (
  <div className="lr-muted">
    Generated from the config packages on {generatedAt.slice(0, 10)} by{' '}
    <code>scripts/generate-rules-data.ts</code>.
  </div>
);

const RuleDetail = ({ kinds, rule }: { kinds?: Record<string, string>; rule: RuleEntry }) => {
  const files = [...new Set(rule.sources?.flatMap((source) => source.files ?? []) ?? [])];
  return (
    <div className="lr-detail">
      {rule.kinds && (
        <div>
          <div className="lr-detail-label">Level by file</div>
          <div className="lr-chips">
            {Object.entries(rule.kinds).map(([kind, level]) => (
              <Tag color={LEVEL_TAG[level]} key={kind} size="small" title={kinds?.[kind]}>
                {kind}: {level}
              </Tag>
            ))}
          </div>
        </div>
      )}
      {rule.sources && rule.sources.length > 0 && (
        <div>
          <div className="lr-detail-label">Set by</div>
          <div className="lr-chips">
            {rule.sources.map((source) => (
              <span
                className="lr-code"
                key={`${source.label}:${source.level}:${source.files?.join(',') ?? ''}`}
              >
                {source.label} → {source.level}
              </span>
            ))}
          </div>
        </div>
      )}
      {files.length > 0 && (
        <div>
          <div className="lr-detail-label">Files</div>
          <div className="lr-chips">
            {files.map((file) => (
              <span className="lr-code" key={file}>
                {file}
              </span>
            ))}
          </div>
        </div>
      )}
      {rule.options !== undefined && (
        <div>
          <div className="lr-detail-label">Options</div>
          <Highlighter copyable language="json" variant="filled">
            {JSON.stringify(rule.options, null, 2)}
          </Highlighter>
        </div>
      )}
      {rule.options === undefined && <div className="lr-muted">No options.</div>}
    </div>
  );
};

const RuleRow = ({
  kinds,
  onToggle,
  open,
  rule,
}: {
  kinds?: Record<string, string>;
  onToggle: () => void;
  open: boolean;
  rule: RuleEntry;
}) => (
  <div className="lr-row" data-open={open}>
    <button aria-expanded={open} className="lr-row-head" type="button" onClick={onToggle}>
      <ChevronRight className="lr-chevron" size={16} />
      <span className="lr-name">
        <span className="lr-id">
          {rule.url ? (
            <a
              href={rule.url}
              rel="noreferrer"
              target="_blank"
              title="Open the rule docs"
              onClick={(event) => event.stopPropagation()}
            >
              {rule.id} <ExternalLink size={11} />
            </a>
          ) : (
            rule.id
          )}
        </span>
        {rule.description && <span className="lr-desc">{rule.description}</span>}
      </span>
      <span className="lr-badges">
        {rule.deprecated && (
          <Tag color="gray" size="small">
            deprecated
          </Tag>
        )}
        {rule.fixable && (
          <Tag color="success" icon={<Wrench size={11} />} size="small" title="Auto-fixable">
            fix
          </Tag>
        )}
        {rule.kinds && (
          <Tag size="small" title="Level differs between files">
            per file
          </Tag>
        )}
        <Tag color={LEVEL_TAG[rule.level]} size="small">
          {rule.level}
        </Tag>
      </span>
    </button>
    {open && <RuleDetail kinds={kinds} rule={rule} />}
  </div>
);

const RulesPanel = ({ tool }: { tool: RuleToolData }) => {
  const [presetId, setPresetId] = useState(tool.presets[0]!.id);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<LevelFilter>('all');
  const [group, setGroup] = useState<string>('all');
  const [fixableOnly, setFixableOnly] = useState(false);
  const [open, setOpen] = useState<Set<string>>(() => new Set());

  const rules = useMemo(() => tool.rules[presetId] ?? [], [tool, presetId]);
  const preset = tool.presets.find((item) => item.id === presetId)!;
  const counts = countLevels(rules);

  const groups = useMemo(() => {
    const map = new Map<string, RuleEntry[]>();
    for (const rule of rules) map.set(rule.group, [...(map.get(rule.group) ?? []), rule]);
    return [...map.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [rules]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return rules.filter(
      (rule) =>
        (level === 'all' || rule.level === level) &&
        (group === 'all' || rule.group === group) &&
        (!fixableOnly || rule.fixable) &&
        (!needle ||
          rule.id.toLowerCase().includes(needle) ||
          rule.description?.toLowerCase().includes(needle)),
    );
  }, [rules, query, level, group, fixableOnly]);

  const visibleGroups = useMemo(() => {
    const map = new Map<string, RuleEntry[]>();
    for (const rule of filtered) map.set(rule.group, [...(map.get(rule.group) ?? []), rule]);
    return [...map.entries()];
  }, [filtered]);

  const toggle = (id: string) =>
    setOpen((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="lr-panel">
      <div className="lr-muted">
        <code>{tool.packageName}</code>
        {tool.version && ` · ${tool.title} ${tool.version}`} · {tool.description}
      </div>
      {tool.presets.length > 1 && (
        <div className="lr-toolbar">
          <Segmented
            options={tool.presets.map((item) => ({ label: item.label, value: item.id }))}
            value={presetId}
            onChange={(value) => {
              setPresetId(value);
              setGroup('all');
            }}
          />
          <span className="lr-muted">
            {preset.description}{' '}
            {preset.options && <code>defineConfig({JSON.stringify(preset.options)})</code>}
          </span>
        </div>
      )}
      <div className="lr-cards">
        <StatCard label="Rules" value={rules.length} />
        <StatCard color={LEVEL_COLOR.error} label="Error" value={counts.error} />
        <StatCard color={LEVEL_COLOR.warn} label="Warn" value={counts.warn} />
        <StatCard color={LEVEL_COLOR.off} label="Off" value={counts.off} />
        <StatCard label="Auto-fixable" value={counts.fixable} />
        <StatCard label={groups.length === 1 ? 'Group' : 'Groups'} value={groups.length} />
      </div>
      {groups.length > 1 && (
        <div className="lr-bars">
          {groups.map(([name, items]) => (
            <button
              className="lr-bar"
              data-active={group === name}
              key={name}
              title={`Show only ${name}`}
              type="button"
              onClick={() => setGroup(group === name ? 'all' : name)}
            >
              <span className="lr-bar-name">{name}</span>
              <span>{items.length}</span>
              <LevelBar rules={items} />
            </button>
          ))}
        </div>
      )}
      <div className="lr-toolbar">
        <SearchBar
          allowClear
          placeholder="Search rules"
          style={{ flex: '1 1 220px', maxWidth: 360 }}
          value={query}
          onInputChange={setQuery}
        />
        <Segmented
          value={level}
          options={[
            { label: 'All levels', value: 'all' },
            { label: 'Error', value: 'error' },
            { label: 'Warn', value: 'warn' },
            { label: 'Off', value: 'off' },
          ]}
          onChange={(value) => setLevel(value as LevelFilter)}
        />
        <Select
          style={{ minWidth: 200 }}
          value={group}
          options={[
            { label: 'All groups', value: 'all' },
            ...groups.map(([name, items]) => ({ label: `${name} (${items.length})`, value: name })),
          ]}
          onChange={(value) => setGroup((value as string) ?? 'all')}
        />
        <Segmented
          value={fixableOnly ? 'fixable' : 'any'}
          options={[
            { label: 'Any', value: 'any' },
            { label: 'Auto-fixable', value: 'fixable' },
          ]}
          onChange={(value) => setFixableOnly(value === 'fixable')}
        />
        <span className="lr-muted">{filtered.length} shown</span>
      </div>
      {visibleGroups.length === 0 && <div className="lr-empty">No rules match the filters.</div>}
      {visibleGroups.map(([name, items]) => (
        <div className="lr-group" key={name}>
          <div className="lr-group-title">
            {name} <span className="lr-muted">{items.length}</span>
          </div>
          {items.map((rule) => (
            <RuleRow
              key={rule.id}
              kinds={tool.kinds}
              open={open.has(rule.id)}
              rule={rule}
              onToggle={() => toggle(rule.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

const PrettierPanel = ({ data }: { data: PrettierToolData }) => {
  const { options, overrides, packageName, plugins, version } = data;
  return (
    <div className="lr-panel">
      <div className="lr-muted">
        <code>{packageName}</code>
        {version && ` · Prettier ${version}`} · Plugins:{' '}
        {plugins.map((plugin) => (
          <span className="lr-code" key={plugin} style={{ marginInlineEnd: 6 }}>
            {plugin}
          </span>
        ))}
      </div>
      <div className="lr-cards">
        <StatCard label="Options" value={options.length} />
        <StatCard
          label="Changed from default"
          value={
            options.filter(
              (option) => JSON.stringify(option.value) !== JSON.stringify(option.default),
            ).length
          }
        />
        <StatCard label="Plugins" value={plugins.length} />
        <StatCard label="Overrides" value={overrides.length} />
      </div>
      <table className="lr-table">
        <thead>
          <tr>
            <th>Option</th>
            <th>Value</th>
            <th>Prettier default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {options.map((option) => (
            <tr key={option.name}>
              <td>
                <span className="lr-id">{option.name}</span>{' '}
                {option.plugin && (
                  <Tag size="small" title={option.category}>
                    plugin
                  </Tag>
                )}
              </td>
              <td>
                <span className="lr-code">{JSON.stringify(option.value)}</span>
              </td>
              <td>
                {option.default === undefined ? (
                  '–'
                ) : (
                  <span className="lr-code">{JSON.stringify(option.default)}</span>
                )}
              </td>
              <td className="lr-desc">{option.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {overrides.length > 0 && (
        <div>
          <div className="lr-detail-label">Overrides</div>
          <Highlighter copyable language="json" variant="filled">
            {JSON.stringify(overrides, null, 2)}
          </Highlighter>
        </div>
      )}
    </div>
  );
};

/** Rule explorer for one tool; the page imports only that tool's generated JSON. */
export const RuleToolExplorer = ({
  data,
  style,
}: {
  data: RuleToolData;
  style?: CSSProperties;
}) => (
  <div className="lr-root" style={style}>
    <style>{styles}</style>
    <RulesPanel tool={data} />
    <Footer generatedAt={data.generatedAt} />
  </div>
);

/** Prettier options table; the page imports only the Prettier JSON. */
export const PrettierOptions = ({
  data,
  style,
}: {
  data: PrettierToolData;
  style?: CSSProperties;
}) => (
  <div className="lr-root" style={style}>
    <style>{styles}</style>
    <PrettierPanel data={data} />
    <Footer generatedAt={data.generatedAt} />
  </div>
);
