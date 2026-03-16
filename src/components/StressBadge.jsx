import { tagBadgeClass, tagLabel } from '../utils/helpers'

export default function StressBadge({ tag }) {
  return (
    <span className={`badge ${tagBadgeClass(tag)}`}>
      {tagLabel(tag)}
    </span>
  )
}
