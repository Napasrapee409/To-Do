import { useState, useRef, useEffect } from 'react'
import { Trash2, Check } from 'lucide-react'

export const PRIORITY = {
  low: {
    label: 'ต่ำ',
    cls: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  },
  medium: {
    label: 'กลาง',
    cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  },
  high: {
    label: 'สูง',
    cls: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  },
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit, onCyclePriority }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  const save = () => {
    const v = value.trim()
    if (v) onEdit(todo.id, v)
    else setValue(todo.text)
    setEditing(false)
  }

  return (
    <li className={'item mb-2 ' + (todo.removing ? 'out' : '')}>
      <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 px-3 py-3">
        <button
          onClick={() => onToggle(todo.id)}
          aria-label="เสร็จแล้ว"
          className={
            'shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition ' +
            (todo.done
              ? 'bg-indigo-500 border-indigo-500 text-white'
              : 'border-gray-300 dark:border-slate-500')
          }
        >
          {todo.done && <Check size={14} strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          {editing ? (
            <input
              ref={inputRef}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onBlur={save}
              onKeyDown={(e) => {
                if (e.key === 'Enter') save()
                if (e.key === 'Escape') {
                  setValue(todo.text)
                  setEditing(false)
                }
              }}
              className="w-full rounded-md border border-indigo-300 px-2 py-1 text-base outline-none focus:ring-2 focus:ring-indigo-200 dark:bg-slate-900 dark:text-slate-100 dark:border-slate-600"
            />
          ) : (
            <span
              onDoubleClick={() => {
                setValue(todo.text)
                setEditing(true)
              }}
              title="ดับเบิลคลิกเพื่อแก้ไข"
              className={
                'block break-words cursor-text select-none ' +
                (todo.done
                  ? 'line-through text-gray-400 dark:text-slate-500'
                  : 'text-gray-800 dark:text-slate-100')
              }
            >
              {todo.text}
            </span>
          )}
        </div>

        <button
          onClick={() => onCyclePriority(todo.id)}
          title="เปลี่ยนความสำคัญ"
          className={'shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ' + PRIORITY[todo.priority].cls}
        >
          {PRIORITY[todo.priority].label}
        </button>

        <button
          onClick={() => onDelete(todo.id)}
          aria-label="ลบ"
          className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  )
}
