export const gradeLabel = (g) => ['Fail', 'Pass', 'Merit', 'Distinction'][g] ?? 'â€”'
export const gradeColor = (g) => ['#ef4444','#f59e0b','#3b82f6','#22c55e'][g] ?? '#888'

export const stressLabel = (s) => ['Low', 'Medium', 'High'][s] ?? 'â€”'
export const stressColor = (s) => ['#22c55e', '#f59e0b', '#ef4444'][s] ?? '#888'
export const stressBadge = (s) => ['badge-low', 'badge-medium', 'badge-high'][s] ?? ''

export const stateLabel = (s) => ({
  optimal:       'Optimal',
  burnout_risk:  'Burnout Risk',
  academic_gap:  'Academic Gap',
  critical:      'Critical',
})[s] ?? s

export const stateColor = (s) => ({
  optimal:       '#22c55e',
  burnout_risk:  '#f59e0b',
  academic_gap:  '#3b82f6',
  critical:      '#ef4444',
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
  focus_more:  'ðŸ“š',
  take_break:  'ðŸ˜®â€ðŸ’¨',
  on_track:    'âœ…',
  seek_help:   'ðŸ™‹',
  keep_going:  'ðŸ’ª',
})[action] ?? 'ðŸ’¡'

export const actionColor = (action) => ({
  focus_more:  '#3b82f6',
  take_break:  '#f59e0b',
  on_track:    '#22c55e',
  seek_help:   '#a855f7',
  keep_going:  '#00d4aa',
})[action] ?? '#888'
