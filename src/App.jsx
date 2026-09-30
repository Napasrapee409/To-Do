import { useState, useRef } from 'react'
import { Plus } from 'lucide-react'
import TodoItem from './components/TodoItem.jsx'

const ORDER = ['low', 'medium', 'high']
const FILTERS = [
  ['all', 'ทั้งหมด'],
  ['active', 'ที่ยังไม่เสร็จ'],
  ['done', 'เสร็จแล้ว'],
]

export default function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'ทำรายงานวิชาโครงสร้างข้อมูล', done: false, priority: 'high' },
    { id: 2, text: 'อ่านหนังสือเตรียมสอบ', done: false, priority: 'medium' },
    { id: 3, text: 'ซื้อของเข้าบ้าน', done: true, priority: 'low' },
  ])
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [filter, setFilter] = useState('all')
  const nextId = useRef(4)

  const add = () => {
    const v = text.trim()
    if (!v) return
    setTodos((p) => [{ id: nextId.current++, text: v, done: false, priority }, ...p])
    setText('')
  }
  const toggle = (id) => setTodos((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)))
  const edit = (id, v) => setTodos((p) => p.map((t) => (t.id === id ? { ...t, text: v } : t)))
  const cyclePriority = (id) =>
    setTodos((p) =>
      p.map((t) =>
        t.id === id ? { ...t, priority: ORDER[(ORDER.indexOf(t.priority) + 1) % 3] } : t
      )
    )
  const remove = (id) => {
    setTodos((p) => p.map((t) => (t.id === id ? { ...t, removing: true } : t)))
    setTimeout(() => setTodos((p) => p.filter((t) => t.id !== id)), 250)
  }
  const clearCompleted = () => {
    const ids = todos.filter((t) => t.done).map((t) => t.id)
    setTodos((p) => p.map((t) => (t.done ? { ...t, removing: true } : t)))
    setTimeout(() => setTodos((p) => p.filter((t) => !ids.includes(t.id))), 250)
  }

  const remaining = todos.filter((t) => !t.done).length
  const doneCount = todos.length - remaining
  const shown = todos.filter((t) =>
    filter === 'all' ? true : filter === 'active' ? !t.done : t.done
  )

  return (
    <div className="min-h-screen px-4 py-8 sm:py-14">
      <div className="max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
          รายการสิ่งที่ต้องทำ
        </h1>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">
          ดับเบิลคลิกที่งานเพื่อแก้ไข · แตะป้ายเพื่อเปลี่ยนความสำคัญ
        </p>

        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-gray-100 dark:border-slate-700 p-3 mb-5">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && add()}
              placeholder="เพิ่มงานใหม่..."
              className="flex-1 rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-200"
            />
            <div className="flex gap-2">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="flex-1 sm:flex-none rounded-xl border border-gray-200 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 px-3 py-2.5 outline-none"
              >
                <option value="low">ต่ำ</option>
                <option value="medium">กลาง</option>
                <option value="high">สูง</option>
              </select>
              <button
                onClick={add}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-2.5 transition"
              >
                <Plus size={18} />
                เพิ่ม
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-1 p-1 bg-gray-200/70 dark:bg-slate-800 rounded-xl mb-4">
          {FILTERS.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={
                'flex-1 text-sm py-2 rounded-lg font-medium transition ' +
                (filter === key
                  ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 dark:text-indigo-300'
                  : 'text-gray-500 dark:text-slate-400')
              }
            >
              {label}
            </button>
          ))}
        </div>

        <ul className="list-none p-0 m-0">
          {shown.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              onToggle={toggle}
              onDelete={remove}
              onEdit={edit}
              onCyclePriority={cyclePriority}
            />
          ))}
        </ul>
        {shown.length === 0 && (
          <div className="text-center text-gray-400 dark:text-slate-500 py-10">ไม่มีรายการ</div>
        )}

        <div className="flex items-center justify-between mt-4 text-sm text-gray-500 dark:text-slate-400">
          <span>เหลืออีก {remaining} งาน</span>
          <button
            onClick={clearCompleted}
            disabled={doneCount === 0}
            className="px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-inherit transition"
          >
            ล้างงานที่เสร็จแล้ว ({doneCount})
          </button>
        </div>
      </div>
    </div>
  )
}
