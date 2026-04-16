import { ActionTrackerWidget } from '../widgets/ActionTrackerWidget'

export function ActionsTab({ prefillAction, onPrefillConsumed }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-semibold text-gray-900 text-xl">Issue Tracker</h2>
        <p className="text-sm text-gray-400 font-body mt-0.5">
          Track and resolve issues surfaced from survey feedback
        </p>
      </div>
      <ActionTrackerWidget prefillAction={prefillAction} onPrefillConsumed={onPrefillConsumed} />
    </div>
  )
}
