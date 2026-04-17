export const gradeLabel = (g) => ['Fail', 'Pass', 'Merit', 'Distinction'][g] ?? '—'
export const gradeColor = (g) => ['#ef4444','#f59e0b','#3b82f6','#22c55e'][g] ?? '#888'

export const stressLabel = (s) => ['Low', 'Medium', 'High'][s] ?? '—'
export const stressColor = (s) => ['#22c55e', '#f59e0b', '#ef4444'][s] ?? '#888'
export const stressBadge = (s) => ['badge-low', 'badge-medium', 'badge-high'][s] ?? ''

export const stateLabel = (s) => ({
  optimal:          'Optimal',
  monitor:          'Monitor',
  burnout_risk:     'Burnout Risk',
  underperforming:  'Underperforming',
  at_risk:          'At Risk',
  critical:         'Critical',
  // Legacy fallbacks
  academic_gap:     'Academic Gap',
})[s] ?? s

export const stateColor = (s) => ({
  optimal:          '#22c55e',
  monitor:          '#3b82f6',
  burnout_risk:     '#f59e0b',
  underperforming:  '#8b5cf6',
  at_risk:          '#f97316',
  critical:         '#ef4444',
  academic_gap:     '#3b82f6',
})[s] ?? '#888'

export const tagBadgeClass = (tag) => ({
  high_stress:   'badge-high',
  medium_stress: 'badge-medium',
  low_stress:    'badge-low',
})[tag] ?? 'badge-info'

export const tagLabel = (tag) => ({
  high_stress:   'High Stress',
  medium_stress: 'Medium Stress',
  low_stress:    'Low Stress',
})[tag] ?? tag

export const actionIcon = (action) => ({
  focus_more:  '📚',
  take_break:  '🧘‍♂️',
  on_track:    '✅',
  seek_help:   '🙋',
  keep_going:  '💪',
})[action] ?? '💡'

export const actionColor = (action) => ({
  focus_more:  '#3b82f6',
  take_break:  '#f59e0b',
  on_track:    '#22c55e',
  seek_help:   '#a855f7',
  keep_going:  '#00d4aa',
})[action] ?? '#888'
