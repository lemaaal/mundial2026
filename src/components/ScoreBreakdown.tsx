import type { MilestoneAward } from '../types/domain';
import { TeamPill } from './TeamPill';

interface ScoreBreakdownProps {
  awards: MilestoneAward[];
}

const SECTION_ORDER: MilestoneAward['key'][] = [
  'r16',
  'qf',
  'sf',
  'final',
  'champion',
  'third',
];

const SECTION_LABEL: Record<MilestoneAward['key'], string> = {
  r16: 'Octavos (+2 c/u)',
  qf: 'Cuartos (+3 c/u)',
  sf: 'Semis (+4 c/u)',
  final: 'Final (+5)',
  champion: 'Campeón (+6)',
  third: '3er puesto (+5)',
};

const STATUS_STYLE: Record<MilestoneAward['status'], string> = {
  confirmed: 'border-accent/40 bg-accent-tint text-accent',
  potential: 'border-primary/30 bg-primary-tint text-primary',
  lost: 'border-secondary/20 bg-secondary-tint/50 text-text-muted opacity-60',
};

const STATUS_LABEL: Record<MilestoneAward['status'], string> = {
  confirmed: '✓',
  potential: '~',
  lost: '×',
};

export function ScoreBreakdown({ awards }: ScoreBreakdownProps) {
  const grouped = SECTION_ORDER.map((key) => ({
    key,
    items: awards.filter((a) => a.key === key),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex flex-col gap-3">
      {grouped.map(({ key, items }) => (
        <div key={key}>
          <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
            {SECTION_LABEL[key]}
          </h4>
          <div className="flex flex-wrap gap-2">
            {items.map((award, idx) => (
              <div
                key={`${award.team}-${idx}`}
                className={`flex items-center gap-2 rounded-md border px-2 py-1 ${STATUS_STYLE[award.status]}`}
                title={`${STATUS_LABEL[award.status]} ${award.label}`}
              >
                <TeamPill code={award.team} size="sm" />
                <span className="text-xs font-semibold">
                  {STATUS_LABEL[award.status]}
                  {award.status === 'confirmed' ? ` +${award.points}` : ''}
                  {award.status === 'potential' ? ` +${award.points}?` : ''}
                  {award.status === 'lost' ? ` 0` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
