import React from 'react';
import { useAppState } from '../../hooks/useAppState';
import { translate } from '../../services/i18nService';
import { ClipboardList, User, CheckCircle, AlertOctagon, HelpCircle } from 'lucide-react';

export const VolunteerConsole: React.FC = () => {
  const { realtimeState, language, assignTask, completeTask, highContrast } = useAppState();
  const { tasks } = realtimeState;

  const getSeverityBadge = (severity: 'low' | 'medium' | 'high') => {
    if (highContrast) {
      switch (severity) {
        case 'high':
          return <span className="bg-black border-2 border-white text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold">High Severity</span>;
        case 'medium':
          return <span className="bg-black border-2 border-white text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase font-bold">Medium Priority</span>;
        default:
          return <span className="bg-black border border-white text-white text-[10px] font-mono px-2.5 py-0.5 rounded-full uppercase">Low Priority</span>;
      }
    }
    switch (severity) {
      case 'high':
        return <span className="bg-red-50 border border-red-200 text-red-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase">High Severity</span>;
      case 'medium':
        return <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase">Medium Priority</span>;
      default:
        return <span className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase">Low Priority</span>;
    }
  };

  return (
    <div className={`p-5 rounded-2xl border transition-all duration-300 font-sans ${
      highContrast 
        ? 'bg-black border-white text-white' 
        : 'bg-white border-slate-200 shadow-sm text-slate-900'
    }`} id="volunteer-console-card">
      <div className={`flex items-center space-x-2.5 mb-5 border-b pb-3 ${
        highContrast ? 'border-white' : 'border-slate-100'
      }`}>
        <div className={`p-2 rounded-xl ${
          highContrast ? 'bg-white text-black' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        }`}>
          <ClipboardList className="h-5 w-5" />
        </div>
        <div>
          <h3 className={`text-md font-bold tracking-tight ${highContrast ? 'text-white' : 'text-slate-900'}`}>
            {translate('volunteer.title', language)}
          </h3>
          <p className={`text-xs ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>GenAI-allocated response directives mapped dynamically to live incident telemetry</p>
        </div>
      </div>

      <div className="space-y-3.5">
        {tasks.filter(t => t.status !== 'completed').length === 0 ? (
          <div className={`p-6 text-center border border-dashed rounded-xl ${
            highContrast ? 'border-white bg-black' : 'border-slate-300 bg-slate-50'
          }`} id="no-tasks-alert">
            <CheckCircle className={`h-10 w-10 mx-auto mb-2 animate-bounce ${highContrast ? 'text-white' : 'text-emerald-500'}`} />
            <h4 className={`text-sm font-bold ${highContrast ? 'text-white' : 'text-slate-800'}`}>{translate('volunteer.noTasks', language)}</h4>
            <p className={`text-xs mt-1 ${highContrast ? 'text-slate-300' : 'text-slate-500'}`}>Standby in your designated concourse zone for next command briefing dispatch.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all duration-300 ${
                task.status === 'assigned'
                  ? (highContrast ? 'bg-black border-white border-2' : 'bg-emerald-50/50 border-emerald-200 shadow-xs')
                  : (highContrast ? 'bg-black border-slate-700 border-2' : 'bg-slate-50 border-slate-200')
              }`}
              id={`task-item-${task.id}`}
            >
              <div>
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <h4 className={`text-sm font-bold flex items-center space-x-1.5 ${
                    highContrast ? 'text-white' : 'text-slate-900'
                  }`}>
                    <span className={`h-2 w-2 rounded-full animate-pulse shrink-0 ${
                      highContrast ? 'bg-white' : 'bg-amber-500'
                    }`} />
                    <span>{task.title}</span>
                  </h4>
                  {getSeverityBadge(task.severity)}
                </div>
                <p className={`text-xs mt-2 leading-relaxed font-sans ${
                  highContrast ? 'text-slate-250' : 'text-slate-600'
                }`}>{task.description}</p>
                <div className={`mt-3 text-[11px] font-mono ${
                  highContrast ? 'text-slate-300' : 'text-slate-500'
                }`}>
                  📍 Location: <span className={`font-semibold ${
                    highContrast ? 'text-white' : 'text-slate-800'
                  }`}>{task.location}</span>
                </div>
              </div>

              {/* Task Controls */}
              <div className={`mt-4 border-t pt-3.5 flex items-center justify-between ${
                highContrast ? 'border-white' : 'border-slate-100'
              }`}>
                <div>
                  {task.status === 'assigned' ? (
                    <div className={`flex items-center space-x-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${
                      highContrast 
                        ? 'bg-black text-white border-white' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    }`}>
                      <User className="h-3.5 w-3.5" />
                      <span>Assigned: {task.assignedTo}</span>
                    </div>
                  ) : (
                    <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${
                      highContrast 
                        ? 'bg-black text-white border-white' 
                        : 'bg-slate-50 text-slate-500 border-slate-200'
                    }`}>Status: Pending Dispatch</span>
                  )}
                </div>

                <div className="flex space-x-2">
                  {task.status === 'pending' ? (
                    <button
                      onClick={() => assignTask(task.id, 'Volunteer Team #7')}
                      className={`text-xs font-semibold px-4 py-1.5 rounded-lg transition border ${
                        highContrast 
                          ? 'bg-white text-black border-white hover:bg-slate-100' 
                          : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                      }`}
                      id={`btn-claim-${task.id}`}
                    >
                      Claim Task
                    </button>
                  ) : (
                    <button
                      onClick={() => completeTask(task.id)}
                      className={`text-xs font-bold px-4 py-1.5 rounded-lg transition shadow-xs ${
                        highContrast 
                          ? 'bg-white text-black hover:bg-slate-100 border border-white' 
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                      id={`btn-complete-${task.id}`}
                    >
                      {translate('volunteer.complete', language)}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}

        {/* Historic Completed Tasks List */}
        {tasks.filter(t => t.status === 'completed').length > 0 && (
          <div className={`mt-6 border-t pt-4 ${
            highContrast ? 'border-white' : 'border-slate-100'
          }`} id="completed-tasks-list">
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-2.5 ${
              highContrast ? 'text-white' : 'text-slate-400'
            }`}>
              Resolved tasks (Shift Session)
            </h4>
            <div className="space-y-2">
              {tasks.filter(t => t.status === 'completed').map(task => (
                <div key={task.id} className={`p-3 rounded-lg flex justify-between items-center text-xs border ${
                  highContrast ? 'bg-black border-white text-white' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div>
                    <span className="font-bold line-through block text-slate-400">{task.title}</span>
                    <span className={`text-[10px] font-mono ${
                      highContrast ? 'text-slate-300' : 'text-slate-500'
                    }`}>📍 {task.location}</span>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase border ${
                    highContrast 
                      ? 'bg-black text-white border-white' 
                      : 'bg-emerald-50 border-emerald-100 text-emerald-800'
                  }`}>
                    {translate('volunteer.statusCompleted', language)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default VolunteerConsole;
