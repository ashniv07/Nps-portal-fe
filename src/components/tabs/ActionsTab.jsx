import { ActionTrackerWidget } from '../widgets/ActionTrackerWidget'

export function ActionsTab() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-semibold text-gray-900 text-xl">Action Tracker</h2>
        <p className="text-sm text-gray-400 font-body mt-0.5">
          Manage follow-up actions derived from survey insights
        </p>
      </div>
      <ActionTrackerWidget />
    </div>
  )
}
